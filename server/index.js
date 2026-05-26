import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { execSync } from 'child_process';

const app = express();
const PORT = 8642;

// 中间件
app.use(cors());
app.use(express.json());

// ========== 工具函数 ==========

function formatSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * 安全校验路径：resolve 后确保没有路径穿越
 * 返回 resolve 后的安全路径，如果非法返回 null
 */
function sanitizePath(inputPath) {
  if (!inputPath) return null;
  const resolved = path.resolve(inputPath);

  // Windows: 确保路径以盘符开头 (如 C:\)
  if (process.platform === 'win32') {
    if (!/^[A-Za-z]:\\/.test(resolved)) return null;
  } else {
    // Unix: 确保以 / 开头
    if (!resolved.startsWith('/')) return null;
  }

  return resolved;
}

/**
 * 获取父目录路径
 */
function getParentPath(dirPath) {
  const parent = path.dirname(dirPath);
  // 如果已经是根目录，返回 null
  if (parent === dirPath) return null;
  return parent;
}

// ========== API ==========

// 健康检查
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 获取用户家目录
app.get('/api/fs/home', (_req, res) => {
  const homeDir = os.homedir();
  res.json({ home: homeDir });
});

// 获取可用盘符（Windows）
app.get('/api/fs/drives', (_req, res) => {
  if (process.platform !== 'win32') {
    return res.json({ drives: ['/'] });
  }

  try {
    // 使用 wmic 获取可用盘符
    const output = execSync('wmic logicaldisk get caption', {
      encoding: 'utf-8',
      timeout: 5000,
    });
    const drives = output
      .split('\n')
      .slice(1)
      .map((line) => line.trim())
      .filter((line) => /^[A-Z]:\\?$/.test(line))
      .map((d) => d.endsWith('\\') ? d : d + '\\');
    res.json({ drives });
  } catch {
    // fallback: 尝试常见盘符
    const drives = [];
    for (let code = 65; code <= 90; code++) {
      const letter = String.fromCharCode(code);
      const drivePath = `${letter}:\\`;
      try {
        fs.accessSync(drivePath, fs.constants.R_OK);
        drives.push(drivePath);
      } catch {
        // 盘符不存在
      }
    }
    res.json({ drives });
  }
});

// 列出目录内容
app.get('/api/fs/list', (req, res) => {
  const rawDir = req.query.dir || '';
  const dir = sanitizePath(rawDir) || os.homedir();

  // 检查路径是否存在且是目录
  let stat;
  try {
    stat = fs.statSync(dir);
  } catch (err) {
    return res.status(404).json({ error: `路径不存在: ${dir}`, code: 'NOT_FOUND' });
  }

  if (!stat.isDirectory()) {
    return res.status(400).json({ error: `不是目录: ${dir}`, code: 'NOT_DIRECTORY' });
  }

  // 检查读取权限
  try {
    fs.accessSync(dir, fs.constants.R_OK);
  } catch {
    return res.status(403).json({ error: `无读取权限: ${dir}`, code: 'NO_PERMISSION' });
  }

  // 读取目录内容
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    return res.status(500).json({ error: `读取目录失败: ${err.message}`, code: 'READ_ERROR' });
  }

  const directories = [];
  const files = [];

  for (const entry of entries) {
    // 跳过隐藏文件/目录（以 . 开头）
    if (entry.name.startsWith('.')) continue;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      directories.push({
        name: entry.name,
        kind: 'directory',
        path: fullPath,
        modified: safeMtime(fullPath),
      });
    } else if (entry.isFile()) {
      let size = 0;
      try {
        size = fs.statSync(fullPath).size;
      } catch {
        // 跳过无法读取的文件
      }
      const ext = path.extname(entry.name).toLowerCase();
      files.push({
        name: entry.name,
        kind: 'file',
        path: fullPath,
        size,
        ext,
        modified: safeMtime(fullPath),
      });
    }
  }

  // 排序：各自按名称排序
  directories.sort((a, b) => a.name.localeCompare(b.name));
  files.sort((a, b) => a.name.localeCompare(b.name));

  const parentPath = getParentPath(dir);

  res.json({
    currentPath: dir,
    parentPath,
    items: [...directories, ...files],
  });
});

// 全局搜索文件/文件夹
app.get('/api/fs/search', (req, res) => {
  const query = (req.query.q || '').trim();
  const mode = req.query.mode || 'all'; // 'file' | 'directory' | 'all'
  const maxResults = Math.min(parseInt(req.query.limit, 10) || 200, 500);
  const searchDirParam = req.query.dir || null; // 可选：限定搜索范围

  if (!query || query.length < 1) {
    return res.json({ query, items: [], truncated: false, searchedPaths: [] });
  }

  const q = query.toLowerCase();
  const results = [];
  let truncated = false;
  const searchedPaths = [];

  // 确定搜索根目录
  let searchRoots = [];
  if (searchDirParam) {
    const safe = sanitizePath(searchDirParam);
    if (safe) searchRoots = [safe];
  }

  if (searchRoots.length === 0) {
    if (process.platform === 'win32') {
      // 获取所有盘符
      try {
        const output = execSync('wmic logicaldisk get caption', {
          encoding: 'utf-8',
          timeout: 5000,
        });
        searchRoots = output
          .split('\n')
          .slice(1)
          .map((line) => line.trim())
          .filter((line) => /^[A-Z]:\\?$/.test(line))
          .map((d) => d.endsWith('\\') ? d : d + '\\');
      } catch {
        // fallback
        for (let code = 65; code <= 90; code++) {
          const letter = String.fromCharCode(code);
          const drivePath = `${letter}:\\`;
          try {
            fs.accessSync(drivePath, fs.constants.R_OK);
            searchRoots.push(drivePath);
          } catch { /* skip */ }
        }
      }
    } else {
      searchRoots = ['/'];
    }
  }

  // 递归搜索（同步，设超时保护）
  const startTime = Date.now();
  const TIMEOUT_MS = 30000; // 最多搜索 30 秒

  function searchDir(dirPath, depth) {
    // 超时或结果已满则停止
    if (truncated || Date.now() - startTime > TIMEOUT_MS) {
      truncated = true;
      return;
    }
    // 限制递归深度，避免进入太深的系统目录
    if (depth > 15) return;

    let entries;
    try {
      entries = fs.readdirSync(dirPath, { withFileTypes: true });
    } catch {
      return; // 无权限或读取失败，跳过
    }

    // 记录已搜索路径
    if (depth === 0) {
      searchedPaths.push(dirPath);
    }

    for (const entry of entries) {
      if (truncated || Date.now() - startTime > TIMEOUT_MS) {
        truncated = true;
        return;
      }

      // 跳过隐藏文件/目录
      if (entry.name.startsWith('.')) continue;

      // 跳过 Windows 系统目录和常见大目录，避免搜索太慢
      if (entry.isDirectory()) {
        const lowerName = entry.name.toLowerCase();
        const skipDirs = new Set([
          'windows', 'system32', 'syswow64', 'programdata',
          '$recycle.bin', 'system volume information',
          'node_modules', '.git', '__pycache__',
          'pagefile.sys', 'hiberfil.sys', 'swapfile.sys',
        ]);
        if (skipDirs.has(lowerName)) continue;
      }

      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        // 检查目录名是否匹配
        if (entry.name.toLowerCase().includes(q) && (mode === 'directory' || mode === 'all')) {
          results.push({
            name: entry.name,
            kind: 'directory',
            path: fullPath,
            modified: safeMtime(fullPath),
          });
          if (results.length >= maxResults) {
            truncated = true;
            return;
          }
        }
        // 继续递归
        searchDir(fullPath, depth + 1);
      } else if (entry.isFile()) {
        // 检查文件名是否匹配
        if (entry.name.toLowerCase().includes(q) && (mode === 'file' || mode === 'all')) {
          let size = 0;
          try { size = fs.statSync(fullPath).size; } catch { /* skip */ }
          const ext = path.extname(entry.name).toLowerCase();
          results.push({
            name: entry.name,
            kind: 'file',
            path: fullPath,
            size,
            ext,
            modified: safeMtime(fullPath),
          });
          if (results.length >= maxResults) {
            truncated = true;
            return;
          }
        }
      }
    }
  }

  for (const root of searchRoots) {
    if (truncated) break;
    searchDir(root, 0);
  }

  res.json({
    query,
    items: results,
    truncated,
    searchedPaths,
    elapsed: Date.now() - startTime,
  });
});

/**
 * 安全获取文件修改时间
 */
function safeMtime(filePath) {
  try {
    return fs.statSync(filePath).mtime.toISOString();
  } catch {
    return null;
  }
}

// ========== 启动 ==========

app.listen(PORT, () => {
  console.log(`[Server] 后端服务运行在 http://localhost:${PORT}`);
  console.log(`[Server] API 端点:`);
  console.log(`  GET  /api/health   - 健康检查`);
  console.log(`  GET  /api/fs/home  - 获取家目录`);
  console.log(`  GET  /api/fs/drives - 获取盘符列表`);
  console.log(`  GET  /api/fs/list  - 列出目录内容 (?dir=xxx)`);
  console.log(`  GET  /api/fs/search - 全局搜索 (?q=xxx&mode=file|directory|all&limit=200)`);
});
