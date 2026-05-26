/**
 * 文件索引 Worker
 * 在独立线程中运行，避免阻塞主进程
 */
import { parentPort, workerData } from 'node:worker_threads';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { execSync } from 'child_process';
import { DatabaseSync } from 'node:sqlite';

const DB_PATH = workerData?.dbPath || path.join(os.homedir(), '.file-picker-demo-index.db');

// 需要跳过的目录名（小写）
const SKIP_DIRS = new Set([
  'windows', 'system32', 'syswow64', 'programdata',
  '$recycle.bin', 'system volume information',
  '.git', '__pycache__', '.cache', '.vscode',
  'pagefile.sys', 'hiberfil.sys', 'swapfile.sys',
  'node_modules', '.nuget', '.cargo', '.rustup',
  'conan', 'vcpkg', 'miniconda3', 'anaconda3',
]);

let db = null;
let indexedCount = 0;
let isRunning = false;

function safeMtime(filePath) {
  try {
    return fs.statSync(filePath).mtime.toISOString();
  } catch {
    return null;
  }
}

/**
 * 获取需要索引的根目录列表
 * 策略：只索引用户常用的工作目录，不索引系统目录
 */
function getIndexRoots() {
  const roots = [];
  const home = os.homedir();

  // 1. 家目录下的常用文件夹
  if (home) {
    for (const sub of ['Desktop', 'Documents', 'Downloads', 'workspace', 'Projects', 'Code']) {
      const p = path.join(home, sub);
      try {
        fs.accessSync(p, fs.constants.R_OK);
        roots.push(p);
      } catch { /* skip */ }
    }
    // 如果以上都没有，退而索引整个家目录
    if (roots.length === 0) roots.push(home);
  }

  // 2. 常见工作盘符下的 workspace 目录（Windows）
  if (process.platform === 'win32') {
    for (const drive of ['D:', 'E:', 'F:']) {
      const drivePath = drive + '\\';
      try {
        fs.accessSync(drivePath, fs.constants.R_OK);
        roots.push(drivePath);
      } catch { /* skip */ }
    }
  }

  return roots;
}

function startIndexing() {
  if (isRunning) return;
  isRunning = true;
  indexedCount = 0;

  const startTime = Date.now();
  const forceReindex = workerData?.forceReindex === true;

  console.log('[Worker] 开始建立索引，forceReindex:', forceReindex);

  // 初始化数据库
  db = new DatabaseSync(DB_PATH);

  // 如果是强制重建，先清空旧数据
  if (forceReindex) {
    try {
      db.exec('DELETE FROM file_index');
      console.log('[Worker] 已清空旧索引数据');
    } catch (err) {
      console.warn('[Worker] 清空旧数据失败:', err.message);
    }
  }
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

  // 清空旧索引
  db.exec('DELETE FROM file_index');

  const insertStmt = db.prepare(
    'INSERT OR REPLACE INTO file_index (name, name_lower, ext, kind, path, parent_dir, size, modified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );

  let batchCount = 0;
  const BATCH_SIZE = 500;

  function commitBatch() {
    if (batchCount > 0) {
      db.exec('COMMIT');
      db.exec('BEGIN TRANSACTION');
      batchCount = 0;
    }
  }

  db.exec('BEGIN TRANSACTION');

  let currentDir = '';

  function indexDir(dirPath, depth) {
    if (depth > 20) return;

    let entries;
    try {
      entries = fs.readdirSync(dirPath, { withFileTypes: true });
    } catch {
      return;
    }

    currentDir = dirPath;

    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue;

      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        if (SKIP_DIRS.has(entry.name.toLowerCase())) continue;

        try {
          insertStmt.run(
            entry.name,
            entry.name.toLowerCase(),
            '',
            'directory',
            fullPath,
            dirPath,
            0,
            safeMtime(fullPath)
          );
          indexedCount++;
          batchCount++;
          if (batchCount >= BATCH_SIZE) {
            commitBatch();
            // 每 BATCH_SIZE 条发送一次进度
            parentPort.postMessage({
              type: 'progress',
              indexedFiles: indexedCount,
              currentDir,
            });
          }
        } catch { /* 路径太长，跳过 */ }

        indexDir(fullPath, depth + 1);
      } else if (entry.isFile()) {
        let size = 0;
        try { size = fs.statSync(fullPath).size; } catch { /* skip */ }
        const ext = path.extname(entry.name).toLowerCase();

        try {
          insertStmt.run(
            entry.name,
            entry.name.toLowerCase(),
            ext,
            'file',
            fullPath,
            dirPath,
            size,
            safeMtime(fullPath)
          );
          indexedCount++;
          batchCount++;
          if (batchCount >= BATCH_SIZE) {
            commitBatch();
            parentPort.postMessage({
              type: 'progress',
              indexedFiles: indexedCount,
              currentDir,
            });
          }
        } catch { /* 路径太长，跳过 */ }
      }
    }
  }

  const roots = getIndexRoots();
  console.log('[Worker] 索引根目录:', roots.join(', '));

  try {
    for (const root of roots) {
      indexDir(root, 0);
    }
    commitBatch();

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    parentPort.postMessage({
      type: 'done',
      totalFiles: indexedCount,
      elapsed,
      scannedRoots: roots,
    });
  } catch (err) {
    try { db.exec('ROLLBACK'); } catch { /* ignore */ }
    parentPort.postMessage({
      type: 'error',
      error: err.message,
    });
  } finally {
    if (db) {
      try { db.close(); } catch { /* ignore */ }
      db = null;
    }
    isRunning = false;
  }
}

// 监听主进程消息
parentPort.on('message', (msg) => {
  if (msg.action === 'start') {
    startIndexing();
  }
});
