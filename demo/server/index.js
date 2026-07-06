import express from 'express';
import cors from 'cors';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { createFilePickerMiddleware } from 'local-file-picker';

const here = dirname(fileURLToPath(import.meta.url));
const pkgPath = resolve(here, '../node_modules/local-file-picker/package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({
  ok: true,
  ts: Date.now(),
  filePickerVersion: pkg.version,
}));

app.use('/api', createFilePickerMiddleware({
  skipDirs: ['node_modules', '.git', 'dist'],
  enableIndexer: true,
}));

const PORT = process.env.PORT || 38741;
app.listen(PORT, () => {
  console.log(`[demo-server] http://localhost:${PORT}`);
  console.log(`[demo-server] file picker routes mounted at /api/fs/*`);
  console.log(`[demo-server] local-file-picker version: ${pkg.version}`);
});
