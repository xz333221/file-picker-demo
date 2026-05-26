import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { execSync } from 'child_process';
import { Worker } from 'node:worker_threads';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 8642;

// 中间件
app.use(cors());
app.use(express.json());

// ========== SQLite 文件索引管理 ==========

const DB_PATH = path.join(os.homedir(), '.file-picker-demo-index.db');
let db = null;
let indexerWorker = null;

// 索引状态
const indexState = {
  status: 'idle',      // idle | indexing | ready | error
  totalFiles: 0,
  indexedFiles: 0,
  currentDir: '',
  scannedRoots: [],
  startTime: null,
  lastError: null,
};

// 需要跳过的目录名（实时遍历降级时用）
const SKIP_DIRS = new Set([
  'windows', 'system32', 'syswow64', 'programdata',
  '$recycle.bin', 'system volume information',
  '.git', '__pycache__', '.cache', '.vscode',
  'pagefile.sys', 'hiberfil.sys', 'swapfile.sys',
  'node_modules', '.nuget', '.cargo', '.rustup',
  'conan', 'vcpkg', 'miniconda3', 'anaconda3',
]);

/**
 * 初始化主进程的 SQLite 连接（用于查询）
 */
function initDatabase() {
  db = new DatabaseSync(DB_PATH);

  // 确保表存在
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

  // 统计已有索引（强制重建时不设为 ready）
  try {
    const row = db.prepare('SELECT COUNT(*) as cnt FROM file_index').get();
    indexState.totalFiles = row.cnt;
    indexState.indexedFiles = row.cnt;
    if (row.cnt > 0 && process.env.FORCE_REINDEX !== '1') {
      indexState.status = 'ready';
    }
  } catch { /* 数据库为空 */ }
}

/**
 * 启动 Worker 线程建立索引
 */
function startIndexing() {
  if (indexState.status === 'indexing' && indexerWorker) return;

  indexState.status = 'indexing';
  indexState.indexedFiles = 0;
  indexState.startTime = Date.now();

  console.log('[Indexer] 启动 Worker 线程建立文件索引...');

  indexerWorker = new Worker(path.join(__dirname, 'indexer', 'worker.js'), {
    workerData: { dbPath: DB_PATH, forceReindex: process.env.FORCE_REINDEX === '1' },
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
      console.log(`[Indexer] 索引完成！共 ${msg.totalFiles} 项，耗时 ${msg.elapsed}s，已扫描: ${msg.scannedRoots?.join(', ') || 'unknown'}`);

      // 重新打开数据库连接以读取新数据
      try { db.close(); } catch { /* ignore */ }
      initDatabase();
    } else if (msg.type === 'error') {
      indexState.status = 'error';
      indexState.lastError = msg.error;
      console.error('[Indexer] 索引失败:', msg.error);
    }
  });

  indexerWorker.on('error', (err) => {
    indexState.status = 'error';
    indexState.lastError = err.message;
    console.error('[Indexer] Worker 错误:', err.message);
  });

  indexerWorker.on('exit', (code) => {
    if (code !== 0) {
      console.warn(`[Indexer] Worker 退出，code=${code}`);
    }
    indexerWorker = null;
  });

  // 发送启动命令
  indexerWorker.postMessage({ action: 'start' });
}

/**
 * 增量更新：监听文件变化
 */
const watchers = new Map();

function startWatching() {
  const watchDirs = [os.homedir()];
  for (const d of ['Desktop', 'Documents', 'Downloads', 'Projects', 'workspace']) {
    const p = path.join(os.homedir(), d);
    try {
      fs.accessSync(p, fs.constants.R_OK);
      watchDirs.push(p);
    } catch { /* skip */ }
  }

  for (const dir of watchDirs) {
    try {
      const watcher = fs.watch(dir, { recursive: true }, (eventType, filename) => {
        if (!filename || filename.startsWith('.')) return;
        handleFsChange(eventType, path.join(dir, filename));
      });
      watchers.set(dir, watcher);
    } catch {
      // recursive watch 不支持，忽略
    }
  }
}

function handleFsChange(eventType, filePath) {
  if (!db || indexState.status !== 'ready') return;
  try {
    const stat = fs.statSync(filePath);
    const name = path.basename(filePath);
    const ext = path.extname(name).toLowerCase();
    const parentDir = path.dirname(filePath);

    db.prepare(
      'INSERT OR REPLACE INTO file_index (name, name_lower, ext, kind, path, parent_dir, size, modified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(
      name, name.toLowerCase(), stat.isDirectory() ? '' : ext,
      stat.isDirectory() ? 'directory' : 'file',
      filePath, parentDir, stat.size, stat.mtime.toISOString()
    );
  } catch {
    try {
      db.prepare('DELETE FROM file_index WHERE path = ?').run(filePath);
    } catch { /* ignore */ }
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
  try {
    return fs.statSync(filePath).mtime.toISOString();
  } catch {
    return null;
  }
}

// ========== API ==========

app.get('/api/health', (_req, res) => {
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

app.get('/api/fs/index-status', (_req, res) => {
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

app.post('/api/fs/reindex', (_req, res) => {
  startIndexing();
  res.json({ message: '索引任务已启动' });
});

app.get('/api/fs/home', (_req, res) => {
  res.json({ home: os.homedir() });
});

app.get('/api/fs/drives', (_req, res) => {
  if (process.platform !== 'win32') {
    return res.json({ drives: ['/'] });
  }
  try {
    const output = execSync('wmic logicaldisk get caption', { encoding: 'utf-8', timeout: 5000 });
    const drives = output
      .split(/\r?\n/).slice(1)
      .map((line) => line.trim())
      .filter((line) => /^[A-Z]:$/.test(line))
      .map((d) => d + '\\');
    res.json({ drives });
  } catch {
    const drives = [];
    for (let code = 65; code <= 90; code++) {
      const letter = String.fromCharCode(code);
      const drivePath = `${letter}:\\`;
      try { fs.accessSync(drivePath, fs.constants.R_OK); drives.push(drivePath); } catch { /* skip */ }
    }
    res.json({ drives });
  }
});

app.get('/api/fs/list', (req, res) => {
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

// 全局搜索（优先索引，降级遍历）
app.get('/api/fs/search', (req, res) => {
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

function searchWithIndex(query, mode, maxResults, searchDirParam, res) {
  const startTime = Date.now();
  const q = query.toLowerCase();

  let sql = 'SELECT name, ext, kind, path, size, modified FROM file_index WHERE name_lower LIKE ?';
  const params = [`%${q}%`];

  if (mode === 'file') {
    sql += ' AND kind = ?';
    params.push('file');
  } else if (mode === 'directory') {
    sql += ' AND kind = ?';
    params.push('directory');
  }

  if (searchDirParam) {
    const safe = sanitizePath(searchDirParam);
    if (safe) {
      sql += ' AND (path = ? OR path LIKE ?)';
      params.push(safe, safe + '%');
    }
  }

  sql += ' ORDER BY kind ASC, name ASC LIMIT ?';
  params.push(maxResults + 1);

  let rows;
  try {
    rows = db.prepare(sql).all(...params);
  } catch (err) {
    console.error('[Search] 索引搜索失败:', err.message);
    return searchWithWalk(query, mode, maxResults, searchDirParam, res);
  }

  const truncated = rows.length > maxResults;
  if (truncated) rows.pop();

  const items = rows.map((row) => ({
    name: row.name, kind: row.kind, path: row.path,
    size: row.size || 0, ext: row.ext || '', modified: row.modified,
  }));

  res.json({
    query, items, truncated,
    engine: 'index',
    totalIndexed: indexState.totalFiles,
    elapsed: Date.now() - startTime,
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

// ========== 启动 ==========

initDatabase();

app.listen(PORT, () => {
  console.log(`[Server] 后端服务运行在 http://localhost:${PORT}`);
  console.log(`[Server] API 端点:`);
  console.log(`  GET  /api/health          - 健康检查`);
  console.log(`  GET  /api/fs/home         - 获取家目录`);
  console.log(`  GET  /api/fs/drives       - 获取盘符列表`);
  console.log(`  GET  /api/fs/list         - 列出目录内容 (?dir=xxx)`);
  console.log(`  GET  /api/fs/search       - 全局搜索 (?q=xxx&mode=file|directory|all)`);
  console.log(`  GET  /api/fs/index-status - 索引状态`);
  console.log(`  POST /api/fs/reindex      - 重建索引`);

  // 如果索引为空或强制重建，自动开始建索引
  const forceReindex = process.env.FORCE_REINDEX === '1';
  if (indexState.totalFiles === 0 || forceReindex) {
    if (forceReindex) {
      console.log(`[Server] 强制重建索引模式`);
      // 强制重建时，重置状态为 indexing，关闭数据库连接让 Worker 独占
      indexState.status = 'indexing';
      indexState.totalFiles = 0;
      indexState.indexedFiles = 0;
      if (db) {
        try { db.close(); } catch { /* ignore */ }
        db = null;
      }
    }
    console.log(`[Server] 开始建立文件索引...`);
    startIndexing();
  } else {
    console.log(`[Server] 已有索引，共 ${indexState.totalFiles} 项`);
  }

  startWatching();
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n[Server] 正在关闭...');
  for (const [, watcher] of watchers) { watcher.close(); }
  if (indexerWorker) { indexerWorker.terminate(); }
  if (db) { try { db.close(); } catch { /* ignore */ } }
  process.exit(0);
});
