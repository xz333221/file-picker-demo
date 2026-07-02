<template>
  <div class="demo">
    <header class="demo-header">
      <div class="header-row">
        <div class="badge">v{{ pkg.version }} · {{ pkg.name }}</div>
        <a class="npm-link" :href="pkg.npmUrl" target="_blank" rel="noopener noreferrer" title="在 npm 上查看">
          <svg viewBox="0 0 256 256" width="14" height="14" aria-hidden="true">
            <path fill="#cb3837" d="M0 256V0h256v256z"/>
            <path fill="#fff" d="M48 48h160v160H48z"/>
            <path fill="#cb3837" d="M64 64h128v32H96v64H64z"/>
          </svg>
          npmjs.com/{{ pkg.name }}
        </a>
      </div>
      <h1>npm 包用法 Demo</h1>
      <p class="subtitle">
        从 <code>node_modules/local-file-picker</code> 引入 <code>FilePickerModal</code> 与样式，
        下方可实时切换各 prop 并查看说明。
      </p>
    </header>

    <!-- 属性控制面板 -->
    <section class="panel">
      <h2 class="panel-title">Props 控制台</h2>
      <p class="panel-hint">修改后点击「打开弹窗」查看效果</p>

      <div class="controls">
        <!-- mode -->
        <div class="control">
          <label class="control-label">
            <span class="prop-name">mode</span>
            <span class="prop-type">String</span>
          </label>
          <div class="seg">
            <button
              v-for="opt in modeOptions"
              :key="opt"
              :class="['seg-btn', { active: props.mode === opt }]"
              @click="props.mode = opt"
            >{{ modeLabel(opt) }}</button>
          </div>
          <div class="prop-desc">选择模式：<code>'file'</code> 选文件 / <code>'directory'</code> 选文件夹</div>
        </div>

        <!-- multiple -->
        <div class="control">
          <label class="control-label">
            <span class="prop-name">multiple</span>
            <span class="prop-type">Boolean</span>
          </label>
          <label class="switch">
            <input type="checkbox" v-model="props.multiple" />
            <span class="track"></span>
            <span class="switch-text">{{ props.multiple ? '允许多选' : '单选' }}</span>
          </label>
          <div class="prop-desc">是否允许多选（Ctrl/Cmd + 点击），默认 <code>false</code></div>
        </div>

        <!-- theme -->
        <div class="control">
          <label class="control-label">
            <span class="prop-name">theme</span>
            <span class="prop-type">String</span>
          </label>
          <div class="seg">
            <button
              v-for="opt in themeOptions"
              :key="opt"
              :class="['seg-btn', { active: props.theme === opt }]"
              @click="props.theme = opt"
            >{{ themeLabel(opt) }}</button>
          </div>
          <div class="prop-desc">主题：<code>'dark'</code> / <code>'light'</code></div>
        </div>

        <!-- locale -->
        <div class="control">
          <label class="control-label">
            <span class="prop-name">locale</span>
            <span class="prop-type">String</span>
          </label>
          <div class="seg">
            <button
              v-for="opt in localeOptions"
              :key="opt"
              :class="['seg-btn', { active: props.locale === opt }]"
              @click="props.locale = opt"
            >{{ localeLabel(opt) }}</button>
          </div>
          <div class="prop-desc">语言：<code>'zh-CN'</code> / <code>'en-US'</code></div>
        </div>

        <!-- enableMkdir -->
        <div class="control">
          <label class="control-label">
            <span class="prop-name">enableMkdir</span>
            <span class="prop-type">Boolean</span>
          </label>
          <label class="switch">
            <input type="checkbox" v-model="props.enableMkdir" />
            <span class="track"></span>
            <span class="switch-text">{{ props.enableMkdir ? '启用新建文件夹' : '关闭' }}</span>
          </label>
          <div class="prop-desc">是否显示「新建文件夹」按钮（v0.1.5+ 中间件内置），默认 <code>true</code></div>
        </div>

        <!-- autoSelectOnMkdir -->
        <div class="control">
          <label class="control-label">
            <span class="prop-name">autoSelectOnMkdir</span>
            <span class="prop-type">Boolean</span>
          </label>
          <label class="switch">
            <input type="checkbox" v-model="props.autoSelectOnMkdir" />
            <span class="track"></span>
            <span class="switch-text">{{ props.autoSelectOnMkdir ? '创建后自动选中' : '不自动选中' }}</span>
          </label>
          <div class="prop-desc">新建文件夹成功后是否自动选中新文件夹，默认 <code>true</code></div>
        </div>

        <!-- apiBase -->
        <div class="control">
          <label class="control-label">
            <span class="prop-name">apiBase</span>
            <span class="prop-type">String</span>
          </label>
          <input
            type="text"
            class="text-input"
            v-model="props.apiBase"
            placeholder="/api"
          />
          <div class="prop-desc">后端 API 基础路径，跨域时填完整 URL 如 <code>http://localhost:8642/api</code>，默认 <code>'/api'</code></div>
        </div>

        <!-- messages (advanced) -->
        <div class="control wide">
          <label class="control-label">
            <span class="prop-name">messages</span>
            <span class="prop-type">Object</span>
            <span class="prop-tag">高级</span>
          </label>
          <textarea
            class="text-area"
            v-model="messagesRaw"
            rows="3"
            placeholder='外部完全覆盖字典：{ "modal.title.file": "选择文件" }'
          ></textarea>
          <div class="prop-desc">外部 i18n 字典覆盖，键名见组件源码，留空表示使用内置 <code>{{ props.locale }}</code> 字典</div>
        </div>
      </div>

      <div class="open-bar">
        <button class="btn btn-primary" @click="modalVisible = true">
          打开弹窗（:visible.sync = true）
        </button>
        <button class="btn btn-ghost" @click="resetProps">重置默认</button>
      </div>
    </section>

    <!-- 选择结果 -->
    <section v-if="results.length || createdFolders.length" class="results">
      <h2>选择结果</h2>

      <div v-if="createdFolders.length" class="created-list">
        <div class="created-title">最近创建的文件夹（@created）</div>
        <div v-for="(c, i) in createdFolders" :key="i" class="created-item">
          <span class="created-name">{{ c.name }}</span>
          <span class="created-path" :title="c.path">{{ c.path }}</span>
          <button class="btn-icon" @click="createdFolders.splice(i, 1)">×</button>
        </div>
      </div>

      <div v-for="(r, idx) in results" :key="idx" class="result-item">
        <div class="result-header" @click="r.expanded = !r.expanded">
          <span :class="['badge', r.mode]">{{ r.mode === 'file' ? '文件' : '文件夹' }}</span>
          <span class="result-title">@confirm · {{ r.paths.length }} 项</span>
          <button class="btn-icon" @click.stop="results.splice(idx, 1)">×</button>
        </div>
        <div v-if="r.expanded" class="result-body">
          <div v-for="(p, i) in r.paths" :key="i" class="path-row">
            <span class="path-text">{{ p }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 弹窗 -->
    <FilePickerModal
      v-bind="activeProps"
      @close="modalVisible = false"
      @confirm="handleConfirm"
      @created="handleCreated"
    />

    <!-- 完整 Props 参考表 -->
    <section class="panel">
      <h2 class="panel-title">Props / Events 完整参考</h2>

      <h3 class="sub-title">Props</h3>
      <table class="ref-table">
        <thead>
          <tr><th>Prop</th><th>类型</th><th>默认</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td><code>visible</code></td><td>Boolean</td><td><code>false</code></td><td>是否显示弹窗（必填，配合 <code>v-model</code> 也可）</td></tr>
          <tr><td><code>mode</code></td><td>String</td><td><code>'file'</code></td><td><code>'file'</code> 选文件 / <code>'directory'</code> 选文件夹</td></tr>
          <tr><td><code>multiple</code></td><td>Boolean</td><td><code>false</code></td><td>是否允许多选（Ctrl/Cmd + 点击）</td></tr>
          <tr><td><code>theme</code></td><td>String</td><td><code>'dark'</code></td><td><code>'dark'</code> / <code>'light'</code></td></tr>
          <tr><td><code>apiBase</code></td><td>String</td><td><code>'/api'</code></td><td>后端 API 基础路径，跨域填完整 URL</td></tr>
          <tr><td><code>locale</code></td><td>String</td><td><code>'zh-CN'</code></td><td><code>'zh-CN'</code> / <code>'en-US'</code></td></tr>
          <tr><td><code>messages</code></td><td>Object</td><td><code>null</code></td><td>外部完全覆盖 i18n 字典（高级用法）</td></tr>
          <tr><td><code>enableMkdir</code></td><td>Boolean</td><td><code>true</code></td><td>显示「新建文件夹」按钮（v0.1.5+ 中间件内置）</td></tr>
          <tr><td><code>autoSelectOnMkdir</code></td><td>Boolean</td><td><code>true</code></td><td>新建文件夹后自动选中新文件夹</td></tr>
        </tbody>
      </table>

      <h3 class="sub-title">Events</h3>
      <table class="ref-table">
        <thead>
          <tr><th>Event</th><th>参数</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td><code>close</code></td><td>—</td><td>弹窗关闭（取消、点击背景或 ×）</td></tr>
          <tr><td><code>confirm</code></td><td><code>paths: string[]</code></td><td>点击确认，携带选中路径数组</td></tr>
          <tr><td><code>created</code></td><td><code>{ path, name, parent }</code></td><td>新建文件夹成功，携带新文件夹信息</td></tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { FilePickerModal } from 'local-file-picker/client';
import pkgJson from '../../node_modules/local-file-picker/package.json';

const pkg = ref({
  name: pkgJson.name,
  version: pkgJson.version,
  npmUrl: `https://www.npmjs.com/package/${pkgJson.name}`,
});

const props = reactive({
  visible: false,
  mode: 'file',
  multiple: false,
  theme: 'dark',
  apiBase: '/api',
  locale: 'zh-CN',
  enableMkdir: true,
  autoSelectOnMkdir: true,
});

const messagesRaw = ref('');

const modeOptions = ['file', 'directory'];
const themeOptions = ['dark', 'light'];
const localeOptions = ['zh-CN', 'en-US'];

const modalVisible = ref(false);
const results = ref([]);
const createdFolders = ref([]);

function modeLabel(v) { return v === 'file' ? '选文件' : '选文件夹'; }
function themeLabel(v) { return v === 'dark' ? '暗色' : '亮色'; }
function localeLabel(v) { return v === 'zh-CN' ? '中文' : 'English'; }

const activeProps = computed(() => {
  const out = {
    visible: modalVisible.value,
    mode: props.mode,
    multiple: props.multiple,
    theme: props.theme,
    apiBase: props.apiBase,
    locale: props.locale,
    enableMkdir: props.enableMkdir,
    autoSelectOnMkdir: props.autoSelectOnMkdir,
  };
  // 解析 messages JSON
  const trimmed = messagesRaw.value.trim();
  if (trimmed) {
    try { out.messages = JSON.parse(trimmed); } catch { /* 留空时忽略 */ }
  }
  return out;
});

function resetProps() {
  props.mode = 'file';
  props.multiple = false;
  props.theme = 'dark';
  props.apiBase = '/api';
  props.locale = 'zh-CN';
  props.enableMkdir = true;
  props.autoSelectOnMkdir = true;
  messagesRaw.value = '';
}

function handleConfirm(paths) {
  modalVisible.value = false;
  results.value.unshift({ mode: props.mode, paths, expanded: true });
}

function handleCreated(info) {
  createdFolders.value.unshift(info);
  if (createdFolders.value.length > 10) createdFolders.value.pop();
}
</script>

<style>
:root {
  --bg: #0f1117;
  --surface: #1a1d27;
  --surface-hover: #222633;
  --border: #2d3348;
  --text: #e4e7ef;
  --text-dim: #8b91a8;
  --primary: #6c8cff;
  --primary-hover: #5a7af0;
  --accent: #a78bfa;
  --success: #34d399;
  --radius: 12px;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
}

.demo { max-width: 980px; margin: 0 auto; padding: 40px 24px 80px; }

.demo-header { text-align: center; margin-bottom: 32px; }
.header-row {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}
.badge {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(108, 140, 255, 0.15);
  color: var(--primary);
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
}
.npm-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 20px;
  color: var(--text-dim);
  text-decoration: none;
  font-size: 0.75rem;
  font-family: 'Cascadia Code', 'Consolas', monospace;
  transition: all 0.15s;
}
.npm-link:hover {
  color: #fff;
  border-color: #cb3837;
  background: rgba(203, 56, 55, 0.12);
}
.npm-link svg { flex-shrink: 0; }
.demo-header h1 { font-size: 1.8rem; margin-bottom: 10px; }
.subtitle { color: var(--text-dim); font-size: 0.92rem; line-height: 1.6; }
.subtitle code, .prop-desc code {
  background: var(--surface);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.85em;
  color: var(--primary);
}

.panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
  margin-bottom: 24px;
}
.panel-title {
  font-size: 1.1rem;
  margin-bottom: 4px;
}
.panel-hint {
  font-size: 0.85rem;
  color: var(--text-dim);
  margin-bottom: 20px;
}

.controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-bottom: 22px;
}
.control.wide { grid-column: 1 / -1; }
@media (max-width: 720px) { .controls { grid-template-columns: 1fr; } }

.control-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.prop-name {
  font-family: 'Cascadia Code', 'Consolas', monospace;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text);
}
.prop-type {
  font-size: 0.72rem;
  padding: 2px 8px;
  background: rgba(167, 139, 250, 0.15);
  color: var(--accent);
  border-radius: 4px;
}
.prop-tag {
  font-size: 0.7rem;
  padding: 2px 6px;
  background: rgba(248, 113, 113, 0.15);
  color: #f87171;
  border-radius: 4px;
}
.prop-desc {
  font-size: 0.78rem;
  color: var(--text-dim);
  line-height: 1.5;
  margin-top: 6px;
}

/* 分段控件 */
.seg {
  display: inline-flex;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}
.seg-btn {
  background: transparent;
  border: none;
  color: var(--text-dim);
  padding: 8px 14px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.15s;
}
.seg-btn:hover { color: var(--text); }
.seg-btn.active {
  background: var(--primary);
  color: #fff;
}

/* 开关 */
.switch {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}
.switch input { display: none; }
.switch .track {
  width: 40px;
  height: 22px;
  background: var(--border);
  border-radius: 12px;
  position: relative;
  transition: background 0.2s;
}
.switch .track::after {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  background: #fff;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: left 0.2s;
}
.switch input:checked + .track { background: var(--primary); }
.switch input:checked + .track::after { left: 20px; }
.switch-text { font-size: 0.85rem; color: var(--text-dim); }

/* 文本输入 */
.text-input, .text-area {
  width: 100%;
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.88rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s;
}
.text-input:focus, .text-area:focus { border-color: var(--primary); }
.text-area {
  font-family: 'Cascadia Code', 'Consolas', monospace;
  font-size: 0.82rem;
  resize: vertical;
}

.open-bar {
  display: flex;
  gap: 12px;
  padding-top: 18px;
  border-top: 1px solid var(--border);
}

.btn {
  display: inline-flex;
  align-items: center;
  padding: 10px 22px;
  border: none;
  border-radius: 8px;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  color: #fff;
  transition: all 0.2s;
}
.btn-primary { background: var(--primary); }
.btn-primary:hover { background: var(--primary-hover); }
.btn-ghost {
  background: transparent;
  color: var(--text-dim);
  border: 1px solid var(--border);
}
.btn-ghost:hover { color: var(--text); border-color: var(--text-dim); }

/* 结果区 */
.results { margin-bottom: 24px; }
.results h2 {
  font-size: 1.1rem;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}
.created-list, .result-item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  margin-bottom: 12px;
  overflow: hidden;
}
.created-title {
  padding: 10px 14px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--accent);
  background: var(--surface-hover);
  border-bottom: 1px solid var(--border);
}
.created-item, .path-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  font-size: 0.88rem;
  border-bottom: 1px solid rgba(45, 51, 72, 0.4);
}
.created-item:last-child, .path-row:last-child { border-bottom: none; }
.created-name { font-weight: 500; }
.created-path, .path-text {
  flex: 1;
  font-family: 'Cascadia Code', 'Consolas', monospace;
  font-size: 0.82rem;
  color: var(--text-dim);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  direction: rtl;
  text-align: left;
}
.result-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: var(--surface-hover);
  cursor: pointer;
  user-select: none;
}
.badge {
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}
.badge.file { background: rgba(108, 140, 255, 0.2); color: var(--primary); }
.badge.directory { background: rgba(167, 139, 250, 0.2); color: var(--accent); }
.result-title { flex: 1; font-weight: 600; }
.btn-icon {
  background: none;
  border: none;
  color: var(--text-dim);
  cursor: pointer;
  font-size: 1rem;
  padding: 2px 6px;
}
.btn-icon:hover { color: #f87171; }

/* 参考表 */
.sub-title {
  font-size: 0.95rem;
  margin: 18px 0 10px;
  color: var(--text);
}
.ref-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}
.ref-table th, .ref-table td {
  text-align: left;
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
  vertical-align: top;
}
.ref-table th {
  font-weight: 600;
  color: var(--text-dim);
  background: var(--surface-hover);
}
.ref-table code {
  background: var(--bg);
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 0.82em;
  color: var(--primary);
}
</style>