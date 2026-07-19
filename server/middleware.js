/**
 * file-picker Express 中间件
 *
 * 用法：
 *   import { createFilePickerMiddleware } from 'file-picker/server'
 *   app.use('/api', createFilePickerMiddleware())
 *
 * 路由将挂载在 /fs/* 下，即完整路径为 /api/fs/*
 */
import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { execSync } from 'child_process';
import { Worker } from 'node:worker_threads';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DEFAULT_SKIP_DIRS = new Set([
  'windows', 'system32', 'syswow64', 'programdata',
  '$recycle.bin', 'system volume information',
  '.git', '__pycache__', '.cache', '.vscode',
  'pagefile.sys', 'hiberfil.sys', 'swapfile.sys',
  'node_modules', '.nuget', '.cargo', '.rustup',
  'conan', 'vcpkg', 'miniconda3', 'anaconda3',
]);

/**
 * 创建文件选择中间件
 *
 * @param {object} options
 * @param {string}  [options.dbPath]       - SQLite 索引数据库路径，默认 ~/.file-picker-index.db
 * @param {Set}     [options.skipDirs]     - 需要跳过的目录集合，默认 DEFAULT_SKIP_DIRS
 * @param {boolean} [options.forceReindex] - 是否强制重建索引，默认 false
 * @returns {import('express').Router}
 */
export function createFilePickerMiddleware(options = {}) {
  const {
    dbPath = path.join(os.homedir(), '.file-picker-index.db'),
    skipDirs = DEFAULT_SKIP_DIRS,
    forceReindex = process.env.FORCE_REINDEX === '1',
  } = options;

  const SKIP_DIRS = skipDirs instanceof Set ? skipDirs : new Set(skipDirs);

  // ========== 状态变量（每个中间件实例独立） ==========

  let db = null;
  let indexerWorker = null;
  const watchers = new Map();

  const indexState = {
    status: 'idle',
    totalFiles: 0,
    indexedFiles: 0,
    currentDir: '',
    scannedRoots: [],
    startTime: null,
    lastError: null,
  };

  // ========== 数据库 ==========

  function initDatabase() {
    db = new DatabaseSync(dbPath);
    // WAL 模式减少写锁冲突，busy_timeout 避免多实例启动时 "database is locked"
    db.exec('PRAGMA journal_mode = WAL;');
    db.exec('PRAGMA busy_timeout = 5000;');
    db.exec(`
      CREATE TABLE IF NOT EXISTS file_index (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        name_lower TEXT NOT NULL,
        ext TEXT DEFAULT '',
        kind TEXT NOT NULL DEFAULT 'file',
        path TEXT NOT NULL UNIQUE,
        parent_dir TEXT NOT NULL,
        size INTEGER DEFAULT 0,
        modified TEXT,
        indexed_at TEXT DEFAULT (datetime('now'))
      );
      CREATE INDEX IF NOT EXISTS idx_name_lower ON file_index(name_lower);
      CREATE INDEX IF NOT EXISTS idx_ext ON file_index(ext);
      CREATE INDEX IF NOT EXISTS idx_kind ON file_index(kind);
      CREATE INDEX IF NOT EXISTS idx_parent_dir ON file_index(parent_dir);
      CREATE INDEX IF NOT EXISTS idx_path ON file_index(path);
    `);
    try {
      const row = db.prepare('SELECT COUNT(*) as cnt FROM file_index').get();
      indexState.totalFiles = row.cnt;
      indexState.indexedFiles = row.cnt;
      if (row.cnt > 0 && !forceReindex) {
        indexState.status = 'ready';
      }
    } catch { /* 数据库为空 */ }
  }

  // ========== 索引 Worker ==========

  function startIndexing() {
    if (indexState.status === 'indexing' && indexerWorker) return;

    indexState.status = 'indexing';
    indexState.indexedFiles = 0;
    indexState.startTime = Date.now();

    console.log('[file-picker] 启动 Worker 线程建立文件索引...');

    indexerWorker = new Worker(path.join(__dirname, 'indexer', 'worker.js'), {
      workerData: { dbPath, forceReindex },
    });

    indexerWorker.on('message', (msg) => {
      if (msg.type === 'progress') {
        indexState.indexedFiles = msg.indexedFiles;
        indexState.currentDir = msg.currentDir;
      } else if (msg.type === 'done') {
        indexState.status = 'ready';
        indexState.totalFiles = msg.totalFiles;
        indexState.indexedFiles = msg.totalFiles;
        indexState.scannedRoots = msg.scannedRoots || [];
        console.log(`[file-picker] 索引完成，共 ${msg.totalFiles} 项，耗时 ${msg.elapsed}s`);
        try { db.close(); } catch { /* ignore */ }
        initDatabase();
      } else if (msg.type === 'error') {
        indexState.status = 'error';
        indexState.lastError = msg.error;
        console.error('[file-picker] 索引失败:', msg.error);
      }
    });

    indexerWorker.on('error', (err) => {
      indexState.status = 'error';
      indexState.lastError = err.message;
    });

    indexerWorker.on('exit', (code) => {
      if (code !== 0) console.warn(`[file-picker] Worker 退出，code=${code}`);
      indexerWorker = null;
    });

    indexerWorker.postMessage({ action: 'start' });
  }

  // ========== 文件监听（增量更新） ==========

  // 单实例 watcher 上限：Linux 的 inotify 配额（fs.inotify.max_user_watches，常见默认 65536）
  // 是整用户会话共享的，超限后停止新增并降级为"仅索引搜索"，绝不拖垮整个会话
  const MAX_WATCHERS = 20000;
  let watcherQuotaWarned = false;

  function onWatcherQuotaExceeded() {
    if (watcherQuotaWarned) return;
    watcherQuotaWarned = true;
    console.warn('[file-picker] 系统文件监听配额已耗尽（ENOSPC），文件变更实时同步已停用；索引搜索与 /fs/reindex 不受影响。可通过 sudo sysctl fs.inotify.max_user_watches=524288 提高上限后重启服务恢复');
  }

  // 与 indexer/worker.js 的索引根目录策略保持一致：只监听已被索引覆盖的范围
  function getWatchRoots() {
    const roots = [];
    const home = os.homedir();
    if (home) {
      for (const sub of ['Desktop', 'Documents', 'Downloads', 'workspace', 'Projects', 'Code']) {
        const p = path.join(home, sub);
        try { fs.accessSync(p, fs.constants.R_OK); roots.push(p); } catch { /* skip */ }
      }
      if (roots.length === 0) roots.push(home);
    }
    if (process.platform === 'win32') {
      for (const drive of ['D:', 'E:', 'F:']) {
        const drivePath = drive + '\\';
        try { fs.accessSync(drivePath, fs.constants.R_OK); roots.push(drivePath); } catch { /* skip */ }
      }
    }
    return roots;
  }

  function isSkippedName(name) {
    return name.startsWith('.') || SKIP_DIRS.has(name.toLowerCase());
  }

  function attachWatcher(dir) {
    if (watchers.has(dir)) return;
    if (watchers.size >= MAX_WATCHERS) { onWatcherQuotaExceeded(); return; }
    let watcher;
    try {
      watcher = fs.watch(dir, (eventType, filename) => {
        if (!filename || filename.startsWith('.')) return;
        const fullPath = path.join(dir, filename);
        handleFsChange(fullPath);
        // 非递归 watch 不覆盖新建子目录，检测到新目录时补挂监听
        if (eventType === 'rename' && !isSkippedName(filename)) {
          try {
            if (fs.statSync(fullPath).isDirectory()) watchTree(fullPath).catch(() => { /* ignore */ });
          } catch { /* 已删除，忽略 */ }
        }
      });
    } catch (err) {
      if (err && err.code === 'ENOSPC') onWatcherQuotaExceeded();
      return;
    }
    // fs.watch 的失败（目录被删、inotify 耗尽）大多以异步 error 事件抛出，
    // 不挂监听就是 uncaughtException，必须逐个兜底
    watcher.on('error', (err) => {
      watchers.delete(dir);
      try { watcher.close(); } catch { /* ignore */ }
      if (err && err.code === 'ENOSPC') onWatcherQuotaExceeded();
    });
    watchers.set(dir, watcher);
  }

  // 手动递归挂 watch：跳过点目录与 SKIP_DIRS（node_modules / .cache 等），
  // 避免 fs.watch recursive:true 在 Linux 上对海量无关子目录逐个注册 inotify 导致 ENOSPC
  async function watchTree(rootDir) {
    const queue = [rootDir];
    for (let i = 0; i < queue.length; i++) {
      const dir = queue[i];
      attachWatcher(dir);
      let entries;
      try { entries = await fs.promises.readdir(dir, { withFileTypes: true }); } catch { continue; }
      for (const entry of entries) {
        if (entry.isDirectory() && !isSkippedName(entry.name)) queue.push(path.join(dir, entry.name));
      }
    }
  }

  function startWatching() {
    for (const root of getWatchRoots()) {
      if (process.platform === 'win32') {
        // Windows 原生支持递归 watch，单句柄即可，无需逐目录注册
        try {
          const watcher = fs.watch(root, { recursive: true }, (eventType, filename) => {
            if (!filename) return;
            if (filename.split(/[\\/]/).some(isSkippedName)) return;
            handleFsChange(path.join(root, filename));
          });
          watcher.on('error', () => { try { watcher.close(); } catch { /* ignore */ } });
          watchers.set(root, watcher);
        } catch { /* recursive watch 不可用，忽略 */ }
      } else {
        watchTree(root).catch(() => { /* 单根失败不影响其他根 */ });
      }
    }
  }

  function handleFsChange(filePath) {
    if (!db || indexState.status !== 'ready') return;
    try {
      const stat = fs.statSync(filePath);
      const name = path.basename(filePath);
      const ext = path.extname(name).toLowerCase();
      const parentDir = path.dirname(filePath);
      db.prepare(
        'INSERT OR REPLACE INTO file_index (name, name_lower, ext, kind, path, parent_dir, size, modified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      ).run(name, name.toLowerCase(), stat.isDirectory() ? '' : ext,
        stat.isDirectory() ? 'directory' : 'file',
        filePath, parentDir, stat.size, stat.mtime.toISOString());
    } catch {
      try { db.prepare('DELETE FROM file_index WHERE path = ?').run(filePath); } catch { /* ignore */ }
    }
  }

  // ========== 工具函数 ==========

  function sanitizePath(inputPath) {
    if (!inputPath) return null;
    const resolved = path.resolve(inputPath);
    if (process.platform === 'win32') {
      if (!/^[A-Za-z]:\\/.test(resolved)) return null;
    } else {
      if (!resolved.startsWith('/')) return null;
    }
    return resolved;
  }

  function getParentPath(dirPath) {
    const parent = path.dirname(dirPath);
    if (parent === dirPath) return null;
    return parent;
  }

  function safeMtime(filePath) {
    try { return fs.statSync(filePath).mtime.toISOString(); } catch { return null; }
  }

  // ========== 搜索 ==========

  function searchWithIndex(query, mode, maxResults, searchDirParam, res) {
    const startTime = Date.now();
    const q = query.toLowerCase();
    let sql = 'SELECT name, ext, kind, path, size, modified FROM file_index WHERE name_lower LIKE ?';
    const params = [`%${q}%`];
    if (mode === 'file') { sql += ' AND kind = ?'; params.push('file'); }
    else if (mode === 'directory') { sql += ' AND kind = ?'; params.push('directory'); }
    if (searchDirParam) {
      const safe = sanitizePath(searchDirParam);
      if (safe) { sql += ' AND (path = ? OR path LIKE ?)'; params.push(safe, safe + '%'); }
    }
    sql += ' ORDER BY kind ASC, name ASC LIMIT ?';
    params.push(maxResults + 1);
    let rows;
    try { rows = db.prepare(sql).all(...params); } catch (err) {
      console.error('[file-picker] 索引搜索失败:', err.message);
      return searchWithWalk(query, mode, maxResults, searchDirParam, res);
    }
    const truncated = rows.length > maxResults;
    if (truncated) rows.pop();
    res.json({
      query, truncated, engine: 'index',
      totalIndexed: indexState.totalFiles,
      elapsed: Date.now() - startTime,
      items: rows.map((row) => ({
        name: row.name, kind: row.kind, path: row.path,
        size: row.size || 0, ext: row.ext || '', modified: row.modified,
      })),
    });
  }

  function searchWithWalk(query, mode, maxResults, searchDirParam, res) {
    const q = query.toLowerCase();
    const results = [];
    let truncated = false;
    let searchRoots = [];
    if (searchDirParam) {
      const safe = sanitizePath(searchDirParam);
      if (safe) searchRoots = [safe];
    }
    if (searchRoots.length === 0) {
      if (process.platform === 'win32') {
        try {
          const output = execSync('wmic logicaldisk get caption', { encoding: 'utf-8', timeout: 5000 });
          searchRoots = output.split(/\r?\n/).slice(1).map((l) => l.trim()).filter((l) => /^[A-Z]:$/.test(l)).map((d) => d + '\\');
        } catch {
          for (let code = 65; code <= 90; code++) {
            const letter = String.fromCharCode(code);
            try { fs.accessSync(`${letter}:\\`, fs.constants.R_OK); searchRoots.push(`${letter}:\\`); } catch { /* skip */ }
          }
        }
      } else { searchRoots = ['/']; }
    }
    const startTime = Date.now();
    const TIMEOUT_MS = 30000;
    function walkDir(dirPath, depth) {
      if (truncated || Date.now() - startTime > TIMEOUT_MS) { truncated = true; return; }
      if (depth > 15) return;
      let entries;
      try { entries = fs.readdirSync(dirPath, { withFileTypes: true }); } catch { return; }
      for (const entry of entries) {
        if (truncated || Date.now() - startTime > TIMEOUT_MS) { truncated = true; return; }
        if (entry.name.startsWith('.')) continue;
        if (entry.isDirectory() && SKIP_DIRS.has(entry.name.toLowerCase())) continue;
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
          if (entry.name.toLowerCase().includes(q) && (mode === 'directory' || mode === 'all')) {
            results.push({ name: entry.name, kind: 'directory', path: fullPath, modified: safeMtime(fullPath) });
            if (results.length >= maxResults) { truncated = true; return; }
          }
          walkDir(fullPath, depth + 1);
        } else if (entry.isFile()) {
          if (entry.name.toLowerCase().includes(q) && (mode === 'file' || mode === 'all')) {
            let size = 0;
            try { size = fs.statSync(fullPath).size; } catch { /* skip */ }
            results.push({ name: entry.name, kind: 'file', path: fullPath, size, ext: path.extname(entry.name).toLowerCase(), modified: safeMtime(fullPath) });
            if (results.length >= maxResults) { truncated = true; return; }
          }
        }
      }
    }
    for (const root of searchRoots) {
      if (truncated) break;
      walkDir(root, 0);
    }
    res.json({ query, items: results, truncated, engine: 'walk', elapsed: Date.now() - startTime });
  }

  // ========== 路由 ==========

  const router = Router();

  router.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      index: {
        status: indexState.status,
        totalFiles: indexState.totalFiles,
        indexedFiles: indexState.indexedFiles,
        currentDir: indexState.currentDir,
        scannedRoots: indexState.scannedRoots,
      },
    });
  });

  router.get('/fs/index-status', (_req, res) => {
    res.json({
      status: indexState.status,
      totalFiles: indexState.totalFiles,
      indexedFiles: indexState.indexedFiles,
      currentDir: indexState.currentDir,
      scannedRoots: indexState.scannedRoots,
      elapsed: indexState.startTime ? Date.now() - indexState.startTime : 0,
      lastError: indexState.lastError,
    });
  });

  router.post('/fs/reindex', (_req, res) => {
    startIndexing();
    res.json({ message: '索引任务已启动' });
  });

  router.get('/fs/home', (_req, res) => {
    res.json({ home: os.homedir() });
  });

  router.get('/fs/drives', (_req, res) => {
    if (process.platform !== 'win32') {
      return res.json({ drives: ['/'] });
    }
    try {
      const output = execSync('wmic logicaldisk get caption', { encoding: 'utf-8', timeout: 5000 });
      const drives = output.split(/\r?\n/).slice(1)
        .map((line) => line.trim())
        .filter((line) => /^[A-Z]:$/.test(line))
        .map((d) => d + '\\');
      res.json({ drives });
    } catch {
      const drives = [];
      for (let code = 65; code <= 90; code++) {
        const letter = String.fromCharCode(code);
        try { fs.accessSync(`${letter}:\\`, fs.constants.R_OK); drives.push(`${letter}:\\`); } catch { /* skip */ }
      }
      res.json({ drives });
    }
  });

  router.get('/fs/list', (req, res) => {
    const rawDir = req.query.dir || '';
    const dir = sanitizePath(rawDir) || os.homedir();
    let stat;
    try { stat = fs.statSync(dir); } catch {
      return res.status(404).json({ error: `路径不存在: ${dir}`, code: 'NOT_FOUND' });
    }
    if (!stat.isDirectory()) {
      return res.status(400).json({ error: `不是目录: ${dir}`, code: 'NOT_DIRECTORY' });
    }
    try { fs.accessSync(dir, fs.constants.R_OK); } catch {
      return res.status(403).json({ error: `无读取权限: ${dir}`, code: 'NO_PERMISSION' });
    }
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (err) {
      return res.status(500).json({ error: `读取目录失败: ${err.message}`, code: 'READ_ERROR' });
    }
    const directories = [];
    const files = [];
    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        directories.push({ name: entry.name, kind: 'directory', path: fullPath, modified: safeMtime(fullPath) });
      } else if (entry.isFile()) {
        let size = 0;
        try { size = fs.statSync(fullPath).size; } catch { /* skip */ }
        files.push({ name: entry.name, kind: 'file', path: fullPath, size, ext: path.extname(entry.name).toLowerCase(), modified: safeMtime(fullPath) });
      }
    }
    directories.sort((a, b) => a.name.localeCompare(b.name));
    files.sort((a, b) => a.name.localeCompare(b.name));
    res.json({ currentPath: dir, parentPath: getParentPath(dir), items: [...directories, ...files] });
  });

  router.get('/fs/search', (req, res) => {
      const query = (req.query.q || '').trim();
      const mode = req.query.mode || 'all';
      const maxResults = Math.min(parseInt(req.query.limit, 10) || 200, 500);
      const searchDirParam = req.query.dir || null;
      if (!query || query.length < 1) {
        return res.json({ query, items: [], truncated: false, engine: 'none', elapsed: 0 });
      }
      if (indexState.status === 'ready' && db) {
        return searchWithIndex(query, mode, maxResults, searchDirParam, res);
      }
      return searchWithWalk(query, mode, maxResults, searchDirParam, res);
    });

    // 校验文件夹名（不允许路径分隔符、保留字符、相对路径符号、首尾空格）
          function validateDirName(name) {
            if (typeof name !== 'string') return '文件夹名必须为字符串';
            if (!name.trim()) return '文件夹名不能为空';
            if (name.length > 255) return '文件夹名过长（最长 255 字符）';
            if (/[\\/:*?"<>|]/.test(name)) return '文件夹名包含非法字符 \\ / : * ? " < > |';
            if (name === '.' || name === '..') return '不允许使用 "." 或 ".."';
            if (name !== name.trim()) return '文件夹名首尾不能有空格';
            if (/[\x00-\x1f]/.test(name)) return '文件夹名包含不可见字符';
            return null;
          }

    router.post('/fs/mkdir', (req, res) => {
      const { parent: parentRaw, name: nameRaw } = req.body || {};
      const parent = sanitizePath(parentRaw);
      if (!parent) {
        return res.status(400).json({ error: '缺少 parent 参数或路径无效', code: 'MISSING_PARENT' });
      }
      let parentStat;
      try { parentStat = fs.statSync(parent); } catch {
        return res.status(404).json({ error: `父目录不存在: ${parent}`, code: 'PARENT_NOT_FOUND' });
      }
      if (!parentStat.isDirectory()) {
        return res.status(400).json({ error: `父路径不是目录: ${parent}`, code: 'PARENT_NOT_DIRECTORY' });
      }
      const nameError = validateDirName(nameRaw);
      if (nameError) {
        return res.status(400).json({ error: nameError, code: 'INVALID_NAME' });
      }
      const name = nameRaw.trim();
      const targetPath = path.join(parent, name);
      // 防御性检查：resolved 后仍应在 parent 之内（防 path.join 的极端边界）
      const resolvedTarget = path.resolve(targetPath);
      const resolvedParent = path.resolve(parent);
      if (!resolvedTarget.startsWith(resolvedParent + path.sep) && resolvedTarget !== resolvedParent) {
        return res.status(400).json({ error: '非法目标路径', code: 'INVALID_PATH' });
      }
      if (fs.existsSync(targetPath)) {
        return res.status(409).json({ error: `已存在同名文件或文件夹: ${name}`, code: 'ALREADY_EXISTS', path: targetPath });
      }
      try {
        fs.mkdirSync(targetPath, { recursive: false });
      } catch (err) {
        return res.status(500).json({ error: `创建失败: ${err.message}`, code: 'MKDIR_ERROR' });
      }
      // 写入索引（如就绪）
      try {
        if (db && indexState.status === 'ready') {
          db.prepare(
            'INSERT OR REPLACE INTO file_index (name, name_lower, ext, kind, path, parent_dir, size, modified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
          ).run(name, name.toLowerCase(), '', 'directory', targetPath, parent, 0, new Date().toISOString());
        }
      } catch { /* 索引写入失败不影响创建成功 */ }
      res.json({ message: '文件夹创建成功', path: targetPath, name });
    });

    // ========== 初始化 ==========

    initDatabase();
  if (indexState.totalFiles === 0 || forceReindex) {
    startIndexing();
  } else {
    console.log(`[file-picker] 已有索引，共 ${indexState.totalFiles} 项`);
  }
  startWatching();

  // 优雅关闭
  const shutdown = () => {
    for (const [, watcher] of watchers) { try { watcher.close(); } catch { /* ignore */ } }
    if (indexerWorker) { try { indexerWorker.terminate(); } catch { /* ignore */ } }
    if (db) { try { db.close(); } catch { /* ignore */ } }
  };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);

  return router;
}
