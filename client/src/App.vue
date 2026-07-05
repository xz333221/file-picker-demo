<template>
  <div class="app">
    <header class="app-header">
      <h1 class="app-title">
        <SvgIcon name="folder" :size="28" color="var(--primary)" />
        文件 / 目录选择 Demo
      </h1>
      <p class="subtitle">纯后端读取文件系统 + 自建文件选择弹窗 — 可获取绝对路径</p>
    </header>

    <main class="actions">
      <div class="action-card">
        <div class="action-icon">
          <SvgIcon name="file" :size="40" color="var(--primary)" />
        </div>
        <h2>选择文件</h2>
        <p>打开文件选择弹窗，可多选，返回文件的绝对路径</p>
        <button class="btn btn-primary" @click="openPicker('file')">
          选择文件
        </button>
      </div>

      <div class="action-card">
        <div class="action-icon">
          <SvgIcon name="folder" :size="40" color="var(--accent)" />
        </div>
        <h2>选择文件夹</h2>
        <p>打开文件夹选择弹窗，支持新建文件夹、多选，返回绝对路径</p>
        <button class="btn btn-accent" @click="openPicker('directory')">
          选择文件夹
        </button>
      </div>
    </main>

    <!-- 选择结果 -->
    <section v-if="results.length || createdFolders.length" class="results">
      <h2 class="results-title">
        <SvgIcon name="list" :size="18" color="var(--text-dim)" />
        选择结果
      </h2>

      <!-- 最近创建的文件夹 -->
      <div v-if="createdFolders.length" class="created-list">
        <div class="created-title">
          <SvgIcon name="folderPlus" :size="14" color="var(--accent)" />
          最近创建的文件夹
        </div>
        <div v-for="(c, i) in createdFolders" :key="i" class="created-item">
          <SvgIcon name="folder" :size="14" color="var(--accent)" />
          <span class="created-name">{{ c.name }}</span>
          <span class="created-path" :title="c.path">{{ c.path }}</span>
          <button class="btn-icon" @click="removeCreated(i)" title="移除">
            <SvgIcon name="close" :size="14" />
          </button>
        </div>
      </div>

      <div v-for="(result, idx) in results" :key="idx" class="result-item">
        <div class="result-header" @click="toggleExpand(idx)">
          <SvgIcon
            :name="result.expanded ? 'caretDown' : 'caretRight'"
            :size="14"
            color="var(--text-dim)"
            class="toggle-icon"
          />
          <span :class="['result-badge', result.mode]">{{ result.mode === 'file' ? '文件' : '文件夹' }}</span>
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

    <!-- 弹窗 -->
    <section class="panel">
      <h3 class="panel-title">defaultPath 演示</h3>
      <p class="panel-hint">输入一个目录路径（绝对路径或相对于用户主目录），打开弹窗时会自动跳转到该目录。弹窗顶部的地址栏支持直接输入路径后回车跳转。</p>
      <div class="default-path-row">
        <input
          v-model="defaultPath"
          type="text"
          class="default-path-input"
          placeholder="例如 C:\Users\xuze\Documents 或留空使用主目录"
        />
        <button class="btn btn-primary" @click="openPicker(modalMode)">使用该路径打开</button>
        <button class="btn btn-ghost" @click="defaultPath = ''">清空</button>
      </div>
    </section>

    <FilePickerModal
      :visible="modalVisible"
      :mode="modalMode"
      :enable-mkdir="true"
      :default-path="defaultPath"
      @close="modalVisible = false"
      @confirm="handleConfirm"
      @created="handleCreated"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SvgIcon from './icons/SvgIcon.vue';
import FilePickerModal from './components/FilePickerModal.vue';

const modalVisible = ref(false);
const modalMode = ref('file');
const defaultPath = ref('');
const results = ref([]);
const createdFolders = ref([]);

function openPicker(mode) {
  modalMode.value = mode;
  modalVisible.value = true;
}

function handleConfirm(paths) {
  modalVisible.value = false;
  results.value.unshift({
    mode: modalMode.value,
    paths,
    expanded: true,
  });
}

function handleCreated(info) {
  // info: { path, name, parent }
  createdFolders.value.unshift(info);
  if (createdFolders.value.length > 10) createdFolders.value.pop();
}

function toggleExpand(idx) {
  results.value[idx].expanded = !results.value[idx].expanded;
}

function removeResult(idx) {
  results.value.splice(idx, 1);
}

function removeCreated(idx) {
  createdFolders.value.splice(idx, 1);
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
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 24px;
}

.app-header { text-align: center; margin-bottom: 40px; }
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

.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 32px;
}
@media (max-width: 600px) { .actions { grid-template-columns: 1fr; } }

.action-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 28px 24px;
  text-align: center;
  transition: border-color 0.2s;
}
.action-card:hover { border-color: var(--primary); }
.action-icon { display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
.action-card h2 { font-size: 1.15rem; margin-bottom: 8px; }
.action-card p { color: var(--text-dim); font-size: 0.88rem; margin-bottom: 20px; line-height: 1.5; }

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 22px;
  border: none;
  border-radius: 8px;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  color: #fff;
}
.btn-primary { background: var(--primary); }
.btn-primary:hover { background: var(--primary-hover); }
.btn-accent { background: var(--accent); }
.btn-accent:hover { background: var(--accent-hover); }

.results { margin-top: 32px; }
.results-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}

/* 最近创建的文件夹 */
.created-list {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  margin-bottom: 14px;
  overflow: hidden;
}
.created-title {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--accent);
  background: var(--surface-hover);
  border-bottom: 1px solid var(--border);
}
.created-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-bottom: 1px solid rgba(45, 51, 72, 0.4);
  font-size: 0.88rem;
}
.created-item:last-child { border-bottom: none; }
.created-name {
  font-weight: 500;
  color: var(--text);
  flex-shrink: 0;
}
.created-path {
  flex: 1;
  font-family: 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
  font-size: 0.82rem;
  color: var(--text-dim);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  direction: rtl;
  text-align: left;
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

.toggle-icon {
  flex-shrink: 0;
}

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

.panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 18px 20px;
  margin-bottom: 24px;
}
.panel-title {
  font-size: 1rem;
  margin-bottom: 4px;
  color: var(--text);
}
.panel-hint {
  font-size: 0.85rem;
  color: var(--text-dim);
  margin-bottom: 14px;
  line-height: 1.6;
}
.default-path-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}
.default-path-input {
  flex: 1;
  min-width: 240px;
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 9px 12px;
  border-radius: 6px;
  font-size: 0.88rem;
  font-family: 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
  outline: none;
  transition: border-color 0.15s;
}
.default-path-input:focus {
  border-color: var(--primary);
}
.btn-ghost {
  background: transparent;
  color: var(--text-dim);
  border: 1px solid var(--border);
}
.btn-ghost:hover {
  color: var(--text);
  border-color: var(--text-dim);
}
</style>