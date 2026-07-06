<template>
  <div class="app">
    <header class="app-header">
      <h1 class="app-title">
        <SvgIcon name="folder" :size="28" color="var(--primary)" />
        local-file-picker · 消费方 Demo
      </h1>
      <p class="subtitle">
        通过 <code>npm install local-file-picker</code> 引入最新版本，验证从包内加载的 <code>FilePickerModal</code> 组件
      </p>
      <p class="version">包版本: <strong>{{ pkgVersion }}</strong></p>
    </header>

    <!-- 可配置属性面板 -->
    <section class="config-panel">
      <h2 class="config-title">
        <SvgIcon name="list" :size="18" color="var(--text-dim)" />
        组件属性（点击即可修改）
      </h2>

      <div class="config-grid">
        <!-- mode -->
        <div class="config-item">
          <label class="config-label">mode</label>
          <div class="seg">
            <button
              v-for="opt in MODE_OPTS"
              :key="opt.value"
              :class="['seg-btn', { active: props.mode === opt.value }]"
              @click="props.mode = opt.value"
            >
              {{ opt.label }}
            </button>
          </div>
          <p class="config-hint">选择文件 / 选择文件夹</p>
        </div>

        <!-- theme -->
        <div class="config-item">
          <label class="config-label">theme</label>
          <div class="seg">
            <button
              v-for="opt in THEME_OPTS"
              :key="opt.value"
              :class="['seg-btn', { active: props.theme === opt.value }]"
              @click="props.theme = opt.value"
            >
              {{ opt.label }}
            </button>
          </div>
          <p class="config-hint">深色 / 浅色</p>
        </div>

        <!-- multiple -->
        <div class="config-item">
          <label class="config-label">multiple</label>
          <label class="switch">
            <input type="checkbox" v-model="props.multiple" />
            <span class="slider"></span>
            <span class="switch-text">{{ props.multiple ? 'true' : 'false' }}</span>
          </label>
          <p class="config-hint">允许多选（Ctrl/Cmd + 点击）</p>
        </div>

        <!-- visible (通过按钮触发,本身用 modalVisible 双向) -->
        <div class="config-item">
          <label class="config-label">visible</label>
          <div class="seg">
            <button
              :class="['seg-btn', { active: modalVisible }]"
              @click="modalVisible = true"
            >true (打开弹窗)</button>
            <button
              :class="['seg-btn', { active: !modalVisible }]"
              @click="modalVisible = false"
            >false (关闭)</button>
          </div>
          <p class="config-hint">受控显示</p>
        </div>

        <!-- apiBase -->
        <div class="config-item config-item-wide">
          <label class="config-label" for="apiBase">apiBase</label>
          <input
            id="apiBase"
            type="text"
            class="text-input"
            v-model="props.apiBase"
            spellcheck="false"
            placeholder="/api"
          />
          <p class="config-hint">
            后端 API 基础路径。同源用 <code>/api</code>（Vite 已代理到 :38741）；
            跨域请填完整 URL，如 <code>http://192.168.1.10:38741/api</code>
          </p>
        </div>

        <!-- locale -->
        <div class="config-item">
          <label class="config-label">locale</label>
          <div class="seg">
            <button
              v-for="opt in LOCALE_OPTS"
              :key="opt.value"
              :class="['seg-btn', { active: props.locale === opt.value }]"
              @click="props.locale = opt.value"
            >
              {{ opt.label }}
            </button>
          </div>
          <p class="config-hint">界面语言（需组件 ≥ 0.1.7）</p>
        </div>
      </div>

      <div class="config-actions">
        <button class="btn btn-primary" @click="openPicker">
          <SvgIcon name="folder" :size="16" /> 打开 {{ props.mode === 'file' ? '文件' : '文件夹' }} 选择器
        </button>
        <button class="btn btn-ghost" @click="resetProps">重置为默认值</button>
      </div>

      <!-- 当前 props 实时快照 -->
      <details class="snapshot">
        <summary>查看当前传给组件的 props (JSON)</summary>
        <pre>{{ JSON.stringify({
          visible: modalVisible,
          mode: props.mode,
          multiple: props.multiple,
          theme: props.theme,
          apiBase: props.apiBase,
          locale: props.locale,
        }, null, 2) }}</pre>
      </details>
    </section>

    <!-- 选择结果 -->
    <section v-if="results.length" class="results">
      <h2 class="results-title">
        <SvgIcon name="list" :size="18" color="var(--text-dim)" />
        选择结果（@confirm 回调）
      </h2>
      <div v-for="(result, idx) in results" :key="idx" class="result-item">
        <div class="result-header" @click="toggleExpand(idx)">
          <SvgIcon
            :name="result.expanded ? 'caretDown' : 'caretRight'"
            :size="14"
            color="var(--text-dim)"
            class="toggle-icon"
          />
          <span :class="['result-badge', result.mode]">
            {{ result.mode === 'file' ? '文件' : '文件夹' }}
          </span>
          <span class="result-title">{{ result.paths.length }} 项</span>
          <button class="btn-icon" @click.stop="removeResult(idx)" title="移除">
            <SvgIcon name="close" :size="14" />
          </button>
        </div>
        <div v-if="result.expanded" class="result-body">
          <div v-for="(p, i) in result.paths" :key="i" class="path-row">
            <SvgIcon
              :name="result.mode === 'file' ? 'file' : 'folder'"
              :size="16"
              :color="result.mode === 'file' ? 'var(--primary)' : 'var(--accent)'"
              class="path-icon"
            />
            <span class="path-text">{{ p }}</span>
          </div>
        </div>
      </div>
    </section>

    <FilePickerModal
      :visible="modalVisible"
      :mode="props.mode"
      :multiple="props.multiple"
      :theme="props.theme"
      :api-base="props.apiBase"
      :locale="props.locale"
      @close="modalVisible = false"
      @confirm="handleConfirm"
    />
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { FilePickerModal, SvgIcon } from 'local-file-picker/client';
import 'local-file-picker/dist/file-picker.css';

const MODE_OPTS = [
  { value: 'file', label: 'file (文件)' },
  { value: 'directory', label: 'directory (文件夹)' },
];
const THEME_OPTS = [
  { value: 'dark', label: 'dark' },
  { value: 'light', label: 'light' },
];
const LOCALE_OPTS = [
  { value: 'zh-CN', label: 'zh-CN 中文' },
  { value: 'en-US', label: 'en-US English' },
];

// 默认值与包内组件默认值保持一致
const props = reactive({
  mode: 'file',
  multiple: false,
  theme: 'dark',
  apiBase: '/api',
  locale: 'zh-CN',
});

function resetProps() {
  props.mode = 'file';
  props.multiple = false;
  props.theme = 'dark';
  props.apiBase = '/api';
  props.locale = 'zh-CN';
}

const modalVisible = ref(false);
const results = ref([]);

function openPicker() {
  modalVisible.value = true;
}

function handleConfirm(paths) {
  modalVisible.value = false;
  results.value.unshift({
    mode: props.mode,
    paths,
    expanded: true,
  });
}

function toggleExpand(idx) {
  results.value[idx].expanded = !results.value[idx].expanded;
}

function removeResult(idx) {
  results.value.splice(idx, 1);
}

const pkgVersion = ref('…');
onMounted(async () => {
  try {
    const r = await fetch('/api/health');
    const j = await r.json();
    pkgVersion.value = j.filePickerVersion || '?';
  } catch {
    pkgVersion.value = '?';
  }
});
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
  --accent-hover: #9676f5;
  --success: #34d399;
  --error: #f87171;
  --radius: 12px;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
}

.app {
  max-width: 980px;
  margin: 0 auto;
  padding: 40px 24px;
}

.app-header { text-align: center; margin-bottom: 32px; }
.app-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 8px;
}
.app-header .subtitle { color: var(--text-dim); font-size: 0.95rem; }
.app-header code {
  background: var(--surface);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.85em;
}
.version {
  margin-top: 8px;
  color: var(--text-dim);
  font-size: 0.85rem;
}
.version strong { color: var(--success); }

/* ---------- 配置面板 ---------- */
.config-panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
  margin-bottom: 32px;
}
.config-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.05rem;
  margin-bottom: 18px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}
.config-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-bottom: 20px;
}
.config-item { display: flex; flex-direction: column; gap: 6px; }
.config-item-wide { grid-column: 1 / -1; }
.config-label {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-dim);
  font-weight: 700;
}
.config-hint {
  font-size: 0.78rem;
  color: var(--text-dim);
  line-height: 1.4;
}
.config-hint code {
  background: var(--bg);
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 0.9em;
}

/* 分段按钮 */
.seg {
  display: inline-flex;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 3px;
  gap: 2px;
  width: fit-content;
}
.seg-btn {
  background: transparent;
  border: none;
  color: var(--text-dim);
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}
.seg-btn:hover { color: var(--text); }
.seg-btn.active {
  background: var(--primary);
  color: #fff;
  font-weight: 600;
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
.switch .slider {
  position: relative;
  width: 44px;
  height: 24px;
  background: var(--border);
  border-radius: 12px;
  transition: background 0.2s;
}
.switch .slider::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.2s;
}
.switch input:checked + .slider { background: var(--primary); }
.switch input:checked + .slider::after { transform: translateX(20px); }
.switch-text {
  font-family: 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
  font-size: 0.85rem;
  color: var(--text);
  min-width: 36px;
}

/* 文本输入 */
.text-input {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  padding: 9px 12px;
  font-size: 0.9rem;
  font-family: 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
  outline: none;
  transition: border-color 0.15s;
}
.text-input:focus { border-color: var(--primary); }

.config-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 12px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  color: #fff;
}
.btn-primary { background: var(--primary); }
.btn-primary:hover { background: var(--primary-hover); }
.btn-ghost {
  background: transparent;
  color: var(--text-dim);
  border: 1px solid var(--border);
}
.btn-ghost:hover { color: var(--text); border-color: var(--text-dim); }

/* props JSON 快照 */
.snapshot {
  border-top: 1px solid var(--border);
  padding-top: 12px;
}
.snapshot summary {
  cursor: pointer;
  color: var(--text-dim);
  font-size: 0.85rem;
  user-select: none;
}
.snapshot summary:hover { color: var(--text); }
.snapshot pre {
  margin-top: 10px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 12px;
  font-size: 0.8rem;
  color: var(--text);
  overflow-x: auto;
  font-family: 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
}

/* ---------- 结果区 ---------- */
.results { margin-top: 8px; }
.results-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}
.result-item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  margin-bottom: 14px;
  overflow: hidden;
}
.result-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
  background: var(--surface-hover);
  cursor: pointer;
  user-select: none;
}
.result-header:hover { background: #282d3e; }
.toggle-icon { flex-shrink: 0; }
.result-badge {
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}
.result-badge.file { background: rgba(108, 140, 255, 0.2); color: var(--primary); }
.result-badge.directory { background: rgba(167, 139, 250, 0.2); color: var(--accent); }
.result-title { flex: 1; font-weight: 600; font-size: 0.95rem; }
.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--text-dim);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}
.btn-icon:hover { color: var(--error); background: rgba(248, 113, 113, 0.1); }
.result-body {
  padding: 12px 18px;
  max-height: 400px;
  overflow-y: auto;
}
.path-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px solid rgba(45, 51, 72, 0.4);
  font-size: 0.88rem;
}
.path-row:last-child { border-bottom: none; }
.path-icon { flex-shrink: 0; }
.path-text {
  flex: 1;
  font-family: 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
  font-size: 0.84rem;
  color: #c0c5d8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .config-grid { grid-template-columns: 1fr; }
}
</style>
