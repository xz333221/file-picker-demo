<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-container">
        <!-- 头部 -->
        <div class="modal-header">
          <h3 class="modal-title">
            <SvgIcon :name="mode === 'file' ? 'file' : 'folder'" :size="18" :color="mode === 'file' ? 'var(--primary)' : 'var(--accent)'" />
            {{ mode === 'file' ? '选择文件' : '选择文件夹' }}
          </h3>
          <button class="close-btn" @click="$emit('close')" title="关闭">
            <SvgIcon name="close" :size="16" />
          </button>
        </div>

        <!-- 工具栏 -->
        <div class="toolbar">
          <button class="tool-btn" @click="goUp" :disabled="!parentPath" title="返回上一级">
            <SvgIcon name="arrowUp" :size="14" /> 上级
          </button>
          <button class="tool-btn" @click="goHome" title="家目录">
            <SvgIcon name="home" :size="14" /> 家目录
          </button>
          <button class="tool-btn" @click="refresh" title="刷新">
            <SvgIcon name="refresh" :size="14" />
          </button>
          <div class="path-breadcrumb">
            <span
              v-for="(segment, i) in pathSegments"
              :key="i"
              class="breadcrumb-item"
              @click="navigateToSegment(i)"
            >
              <span class="breadcrumb-text">{{ segment.label }}</span>
              <span v-if="i < pathSegments.length - 1" class="breadcrumb-sep">/</span>
            </span>
          </div>
        </div>

        <!-- 搜索栏 -->
        <div class="search-bar">
          <SvgIcon name="search" :size="16" color="var(--text-dim)" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            :placeholder="globalSearch ? `全局搜索${mode === 'file' ? '文件' : mode === 'directory' ? '文件夹' : '文件和文件夹'}...` : `搜索当前目录...`"
            @keydown.enter="onSearchEnter"
          />
          <button v-if="searchQuery" class="clear-search" @click="clearSearch">
            <SvgIcon name="close" :size="14" />
          </button>
          <div class="global-toggle" :title="globalSearch ? '全局搜索：在整个磁盘范围内搜索' : '当前目录搜索：仅在当前目录中过滤'">
            <span class="toggle-label">全局</span>
            <button
              class="toggle-switch"
              :class="{ active: globalSearch }"
              @click="toggleGlobalSearch"
            >
              <span class="toggle-knob"></span>
            </button>
          </div>
          <!-- 索引状态指示 -->
          <div
            v-if="globalSearch"
            class="index-status"
            :class="indexStatus.status"
            :title="indexStatus.status === 'ready'
              ? `索引就绪，共 ${indexStatus.totalFiles} 项，已扫描: ${(indexStatus.scannedRoots || []).join(', ') || 'unknown'}`
              : indexStatus.status === 'indexing'
              ? `正在建索引... ${indexStatus.indexedFiles} 项，当前: ${indexStatus.currentDir || ''}`
              : '索引未就绪，使用实时搜索'"
            @click="indexStatus.status !== 'indexing' && reindex()"
          >
            <span class="status-dot"></span>
            <span class="status-text">
              {{ indexStatus.status === 'ready' ? '索引' : indexStatus.status === 'indexing' ? '索引中' : '离线' }}
            </span>
          </div>
        </div>

        <!-- 主内容区 -->
        <div class="modal-body">
          <!-- 左侧快捷栏 -->
          <div class="sidebar">
            <div class="sidebar-section">
              <div class="sidebar-title">快捷访问</div>
              <div class="sidebar-item" @click="goHome">
                <SvgIcon name="home" :size="15" /> 家目录
              </div>
              <div class="sidebar-item" @click="navigateTo(desktopPath)" v-if="desktopPath">
                <SvgIcon name="monitor" :size="15" /> 桌面
              </div>
              <div class="sidebar-item" @click="navigateTo(docsPath)" v-if="docsPath">
                <SvgIcon name="file" :size="15" /> 文档
              </div>
              <div class="sidebar-item" @click="navigateTo(downloadsPath)" v-if="downloadsPath">
                <SvgIcon name="download" :size="15" /> 下载
              </div>
            </div>
            <div class="sidebar-section" v-if="drives.length">
              <div class="sidebar-title">磁盘</div>
              <div
                v-for="drive in drives"
                :key="drive"
                class="sidebar-item"
                :class="{ active: currentPath === drive }"
                @click="navigateTo(drive)"
              >
                <SvgIcon name="hardDrive" :size="15" /> {{ drive }}
              </div>
            </div>
          </div>

          <!-- 文件列表 -->
          <div class="file-list-container" @click.self="clearSelection">
            <div v-if="loading" class="loading-state">
              <span class="spinner"></span> 加载中...
            </div>
            <div v-else-if="error" class="error-state">
              <SvgIcon name="circleX" :size="18" color="currentColor" /> {{ error }}
            </div>
            <div v-else-if="globalSearching" class="loading-state">
              <span class="spinner"></span> 全局搜索中...
            </div>
            <div v-else-if="filteredItems.length === 0" class="empty-state">
              {{ searchQuery ? '没有匹配的结果' : '空目录' }}
            </div>
            <div v-else class="file-list">
              <!-- 全局搜索结果提示 -->
              <div v-if="globalSearchResults.length > 0" class="search-results-info">
                <SvgIcon name="search" :size="14" color="var(--text-dim)" />
                <span>找到 <strong>{{ globalSearchResults.length }}</strong> 个结果</span>
                <span v-if="globalSearchTruncated" class="truncated-hint">（已达上限，请缩小关键词）</span>
                <span class="engine-badge" :class="globalSearchEngine">
                  {{ globalSearchEngine === 'index' ? '索引搜索' : '实时搜索' }}
                </span>
                <span class="elapsed-hint">{{ globalSearchElapsed }}ms</span>
              </div>

              <!-- 文件夹模式：选中当前目录的选项（仅非全局搜索时显示） -->
              <div
                v-if="mode === 'directory' && !isGlobalSearchActive"
                class="file-row select-current-dir"
                :class="{ selected: isSelected(currentPath) }"
                @click.exact="toggleSelect(currentPath)"
                @click.ctrl="toggleSelect(currentPath)"
                @click.meta="toggleSelect(currentPath)"
              >
                <SvgIcon name="circleCheck" :size="18" color="var(--accent)" class="file-icon" />
                <span class="file-name">选择当前文件夹</span>
                <span class="file-path-hint">{{ currentPath }}</span>
              </div>

              <!-- 列表项 -->
              <div
                v-for="item in filteredItems"
                :key="item.path"
                class="file-row"
                :class="{
                  selected: isSelected(item.path),
                  'is-directory': item.kind === 'directory',
                }"
                @click.exact="handleClick(item, $event)"
                @click.ctrl="handleCtrlClick(item)"
                @click.meta="handleCtrlClick(item)"
                @dblclick="handleDblClick(item)"
              >
                <SvgIcon
                  :name="item.kind === 'directory' ? 'folder' : 'file'"
                  :size="18"
                  :color="getItemColor(item)"
                  class="file-icon"
                />
                <span class="file-name" :title="item.name">{{ item.name }}</span>
                <!-- 全局搜索时显示父目录路径 -->
                <span
                  v-if="isGlobalSearchActive"
                  class="file-parent-path"
                  :title="item.path"
                >
                  {{ getParentDir(item.path) }}
                </span>
                <span class="file-size" v-if="item.kind === 'file'" :title="formatSize(item.size)">{{ formatSize(item.size) }}</span>
                <span class="file-modified" v-if="item.modified" :title="item.modified">{{ formatDate(item.modified) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部 -->
        <div class="modal-footer">
          <div class="selected-info">
            <span v-if="selectedPaths.length === 0" class="no-selection">
              未选择{{ mode === 'file' ? '文件' : '文件夹' }}
            </span>
            <span v-else class="has-selection">
              已选择 <strong>{{ selectedPaths.length }}</strong> 项
            </span>
          </div>
          <div class="footer-actions">
            <button class="btn btn-cancel" @click="$emit('close')">取消</button>
            <button
              class="btn btn-confirm"
              :disabled="selectedPaths.length === 0"
              @click="confirmSelection"
            >
              确认选择
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import SvgIcon from '../icons/SvgIcon.vue';
import { getFileTypeColor } from '../icons/index.js';

const props = defineProps({
  visible: { type: Boolean, default: false },
  mode: { type: String, default: 'file' }, // 'file' | 'directory'
  apiBase: { type: String, default: '/api' }, // API 服务基础路径，如 'http://localhost:8642/api'
});

const emit = defineEmits(['close', 'confirm']);

const loading = ref(false);
const error = ref('');
const currentPath = ref('');
const parentPath = ref(null);
const items = ref([]);
const selectedPaths = ref([]);
const searchQuery = ref('');
const drives = ref([]);
const homePath = ref('');

// 全局搜索状态
const globalSearch = ref(false);
const globalSearching = ref(false);
const globalSearchResults = ref([]);
const globalSearchTruncated = ref(false);
const globalSearchElapsed = ref(0);
const globalSearchEngine = ref(''); // 'index' | 'walk' | ''
const indexStatus = ref({ status: 'idle', totalFiles: 0, indexedFiles: 0, currentDir: '', scannedRoots: [] });
let searchAbortController = null;

// 快捷路径
const desktopPath = computed(() => homePath.value ? homePath.value + '\\Desktop' : '');
const docsPath = computed(() => homePath.value ? homePath.value + '\\Documents' : '');
const downloadsPath = computed(() => homePath.value ? homePath.value + '\\Downloads' : '');

// 是否处于全局搜索激活状态（有结果或正在搜索）
const isGlobalSearchActive = computed(() => globalSearch.value && globalSearchResults.value.length > 0);

// 搜索过滤
const filteredItems = computed(() => {
  // 全局搜索模式：直接返回搜索结果
  if (isGlobalSearchActive.value) {
    let list = globalSearchResults.value;
    // 文件夹模式下只显示目录（搜索结果可能已经按 mode 过滤了，但做保险）
    if (props.mode === 'directory') {
      list = list.filter((item) => item.kind === 'directory');
    }
    return list;
  }

  // 本地过滤模式
  let list = items.value;

  // 文件夹模式下只显示目录
  if (props.mode === 'directory') {
    list = list.filter((item) => item.kind === 'directory');
  }

  if (!searchQuery.value) return list;
  const q = searchQuery.value.toLowerCase();
  return list.filter((item) => item.name.toLowerCase().includes(q));
});

// 面包屑
const pathSegments = computed(() => {
  if (!currentPath.value) return [];
  const parts = currentPath.value.split(/[/\\]/).filter(Boolean);
  return parts.map((label, i) => {
    let partialPath;
    if (i === 0 && /^[A-Za-z]:$/.test(label)) {
      partialPath = label + '\\';
    } else {
      partialPath = parts.slice(0, i + 1).join('\\');
    }
    return { label, path: partialPath };
  });
});

// ===== API 调用 =====

async function fetchHome() {
  try {
    const resp = await fetch(`${props.apiBase}/fs/home`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    homePath.value = data.home;
    return data.home;
  } catch (err) {
    console.warn('[fetchHome] 获取家目录失败:', err.message);
    return '';
  }
}

async function fetchDrives() {
  try {
    const resp = await fetch(`${props.apiBase}/fs/drives`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    drives.value = data.drives || [];
  } catch (err) {
    console.warn('[fetchDrives] 获取盘符失败:', err.message);
    drives.value = [];
  }
}

async function fetchIndexStatus() {
  try {
    const resp = await fetch(`${props.apiBase}/fs/index-status`);
    if (!resp.ok) return;
    const data = await resp.json();
    indexStatus.value = data;
  } catch {
    // 忽略
  }
}

async function fetchDirectory(dir) {
  loading.value = true;
  error.value = '';
  try {
    const params = new URLSearchParams();
    if (dir) params.set('dir', dir);
    const resp = await fetch(`${props.apiBase}/fs/list?${params}`);
    if (!resp.ok) {
      let errMsg = `HTTP ${resp.status}`;
      try {
        const errData = await resp.json();
        errMsg = errData.error || errMsg;
      } catch {
        errMsg = '无法连接到后端服务，请确认后端已启动 (npm run dev)';
      }
      error.value = errMsg;
      return;
    }
    const data = await resp.json();
    currentPath.value = data.currentPath;
    parentPath.value = data.parentPath;
    items.value = data.items || [];
  } catch (err) {
    error.value = `网络错误: ${err.message}。请确认后端服务已启动。`;
  } finally {
    loading.value = false;
  }
}

// ===== 导航 =====

function goUp() {
  if (isGlobalSearchActive.value) {
    // 全局搜索模式下返回普通浏览
    exitGlobalSearch();
    return;
  }
  if (parentPath.value) {
    fetchDirectory(parentPath.value);
  }
}

function goHome() {
  if (homePath.value) {
    navigateTo(homePath.value);
  }
}

function navigateTo(dir) {
  searchQuery.value = '';
  exitGlobalSearch();
  fetchDirectory(dir);
}

function navigateToSegment(index) {
  const targetPath = pathSegments.value[index]?.path;
  if (targetPath && targetPath !== currentPath.value) {
    navigateTo(targetPath);
  }
}

function refresh() {
  if (isGlobalSearchActive.value && searchQuery.value) {
    doGlobalSearch(searchQuery.value);
  } else {
    fetchDirectory(currentPath.value);
  }
}

// ===== 选择逻辑 =====

function isSelected(path) {
  return selectedPaths.value.includes(path);
}

function toggleSelect(path) {
  const idx = selectedPaths.value.indexOf(path);
  if (idx >= 0) {
    selectedPaths.value.splice(idx, 1);
  } else {
    selectedPaths.value.push(path);
  }
}

function clearSelection() {
  selectedPaths.value = [];
}

function handleClick(item, event) {
  if (item.kind === 'directory') {
    if (props.mode === 'directory') {
      toggleSelect(item.path);
    } else {
      toggleSelect(item.path);
    }
  } else {
    if (props.mode === 'file') {
      toggleSelect(item.path);
    }
  }
}

function handleCtrlClick(item) {
  if (item.kind === 'directory') {
    toggleSelect(item.path);
  } else if (props.mode === 'file') {
    toggleSelect(item.path);
  }
}

function handleDblClick(item) {
  if (item.kind === 'directory') {
    navigateTo(item.path);
  }
}

function confirmSelection() {
  if (selectedPaths.value.length > 0) {
    emit('confirm', [...selectedPaths.value]);
  }
}

// ===== 全局搜索 =====

function toggleGlobalSearch() {
  globalSearch.value = !globalSearch.value;
  if (!globalSearch.value) {
    // 关闭全局搜索，回到当前目录
    exitGlobalSearch();
  } else if (searchQuery.value) {
    // 打开且有搜索词，立即搜索
    doGlobalSearch(searchQuery.value);
  }
}

function exitGlobalSearch() {
  // 取消进行中的搜索
  if (searchAbortController) {
    searchAbortController.abort();
    searchAbortController = null;
  }
  globalSearchResults.value = [];
  globalSearchTruncated.value = false;
  globalSearchElapsed.value = 0;
  globalSearching.value = false;
}

function clearSearch() {
  searchQuery.value = '';
  if (globalSearch.value) {
    exitGlobalSearch();
  }
}

function onSearchEnter() {
  if (globalSearch.value && searchQuery.value.trim()) {
    doGlobalSearch(searchQuery.value.trim());
  }
}

let searchDebounceTimer = null;

// 监听搜索词变化，全局模式下自动搜索（防抖）
watch(searchQuery, (val) => {
  if (!globalSearch.value) return;
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
  if (!val.trim()) {
    exitGlobalSearch();
    return;
  }
  searchDebounceTimer = setTimeout(() => {
    doGlobalSearch(val.trim());
  }, 500);
});

async function doGlobalSearch(query) {
  // 取消上一次搜索
  if (searchAbortController) {
    searchAbortController.abort();
  }
  searchAbortController = new AbortController();

  globalSearching.value = true;
  globalSearchResults.value = [];
  globalSearchTruncated.value = false;
  globalSearchElapsed.value = 0;

  try {
    const params = new URLSearchParams({
      q: query,
      mode: props.mode === 'directory' ? 'directory' : props.mode === 'file' ? 'file' : 'all',
      limit: '200',
    });
    const resp = await fetch(`${props.apiBase}/fs/search?${params}`, {
      signal: searchAbortController.signal,
    });
    if (!resp.ok) {
      let errMsg = `HTTP ${resp.status}`;
      try {
        const errData = await resp.json();
        errMsg = errData.error || errMsg;
      } catch {
        errMsg = '搜索请求失败';
      }
      globalSearchResults.value = [];
      globalSearching.value = false;
      return;
    }
    const data = await resp.json();
    globalSearchResults.value = data.items || [];
    globalSearchTruncated.value = data.truncated || false;
    globalSearchElapsed.value = data.elapsed || 0;
    globalSearchEngine.value = data.engine || '';
  } catch (err) {
    if (err.name === 'AbortError') return; // 被新搜索取消，不处理
    console.warn('[globalSearch] 搜索失败:', err.message);
    globalSearchResults.value = [];
  } finally {
    globalSearching.value = false;
  }
}

function getParentDir(filePath) {
  if (!filePath) return '';
  const parts = filePath.replace(/[/\\]/g, '/').split('/');
  parts.pop(); // 去掉文件名
  return parts.join('/');
}

async function reindex() {
  try {
    await fetch(`${props.apiBase}/fs/reindex`, { method: 'POST' });
    indexStatus.value = { ...indexStatus.value, status: 'indexing' };
    const poll = setInterval(async () => {
      await fetchIndexStatus();
      if (indexStatus.value.status === 'ready' || indexStatus.value.status === 'error') {
        clearInterval(poll);
      }
    }, 2000);
  } catch {
    // 忽略
  }
}

// ===== 工具 =====

function formatSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function getItemColor(item) {
  if (item.kind === 'directory') return 'var(--accent)';
  const ext = (item.ext || '').replace('.', '');
  return getFileTypeColor(ext);
}

// ===== 生命周期 =====

watch(() => props.visible, async (val) => {
  if (val) {
    selectedPaths.value = [];
    searchQuery.value = '';
    error.value = '';
    exitGlobalSearch();
    const home = await fetchHome();
    await fetchDrives();
    await fetchIndexStatus();
    await fetchDirectory(home || '');
  } else {
    exitGlobalSearch();
  }
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.modal-container {
  width: 860px;
  max-width: 95vw;
  height: 600px;
  max-height: 85vh;
  background: #1a1d27;
  border: 1px solid #2d3348;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

/* 头部 */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid #2d3348;
  background: #222633;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: #e4e7ef;
  margin: 0;
}

.close-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #8b91a8;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.15s;
}
.close-btn:hover {
  color: #f87171;
  background: rgba(248, 113, 113, 0.1);
}

/* 工具栏 */
.toolbar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-bottom: 1px solid #2d3348;
  background: #1e2230;
}

.tool-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #2d3348;
  border: 1px solid #3a4160;
  color: #e4e7ef;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.tool-btn:hover:not(:disabled) {
  background: #3a4160;
}
.tool-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.path-breadcrumb {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0;
  overflow-x: auto;
  margin-left: 8px;
  font-size: 0.84rem;
  color: #8b91a8;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  white-space: nowrap;
}
.breadcrumb-text {
  padding: 2px 4px;
  border-radius: 3px;
  transition: all 0.15s;
}
.breadcrumb-item:hover .breadcrumb-text {
  background: rgba(108, 140, 255, 0.15);
  color: #6c8cff;
}
.breadcrumb-sep {
  margin: 0 2px;
  color: #4a5178;
}

/* 搜索栏 */
.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-bottom: 1px solid #2d3348;
  background: #1e2230;
}

.search-icon {
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  background: #2d3348;
  border: 1px solid #3a4160;
  color: #e4e7ef;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.85rem;
  outline: none;
  transition: border-color 0.2s;
}
.search-input::placeholder {
  color: #5a6180;
}
.search-input:focus {
  border-color: #6c8cff;
}

.clear-search {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #8b91a8;
  cursor: pointer;
  padding: 4px;
}
.clear-search:hover {
  color: #f87171;
}

/* 全局搜索开关 */
.global-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  margin-left: 4px;
}
.toggle-label {
  font-size: 0.78rem;
  color: #5a6180;
  user-select: none;
  white-space: nowrap;
}
.toggle-switch {
  position: relative;
  width: 34px;
  height: 18px;
  background: #2d3348;
  border: 1px solid #3a4160;
  border-radius: 9px;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s;
  flex-shrink: 0;
}
.toggle-switch.active {
  background: #6c8cff;
  border-color: #6c8cff;
}
.toggle-knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 12px;
  height: 12px;
  background: #8b91a8;
  border-radius: 50%;
  transition: all 0.2s;
}
.toggle-switch.active .toggle-knob {
  left: 18px;
  background: #fff;
}

/* 索引状态指示器 */
.index-status {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: all 0.15s;
}
.index-status:hover {
  background: rgba(255, 255, 255, 0.05);
}
.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.index-status.ready .status-dot {
  background: #34d399;
  box-shadow: 0 0 4px #34d399;
}
.index-status.indexing .status-dot {
  background: #f59e0b;
  animation: pulse 1s ease-in-out infinite;
}
.index-status.idle .status-dot,
.index-status.error .status-dot {
  background: #6b7280;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.status-text {
  font-size: 0.72rem;
  color: #5a6180;
  white-space: nowrap;
}

/* 搜索引擎标识 */
.engine-badge {
  font-size: 0.72rem;
  padding: 1px 6px;
  border-radius: 3px;
  white-space: nowrap;
}
.engine-badge.index {
  background: rgba(52, 211, 153, 0.15);
  color: #34d399;
}
.engine-badge.walk {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

/* 主内容区 */
.modal-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* 左侧栏 */
.sidebar {
  width: 160px;
  border-right: 1px solid #2d3348;
  background: #1e2230;
  overflow-y: auto;
  flex-shrink: 0;
}

.sidebar-section {
  padding: 10px 0;
  border-bottom: 1px solid #2d3348;
}

.sidebar-title {
  font-size: 0.72rem;
  font-weight: 600;
  color: #5a6180;
  text-transform: uppercase;
  padding: 0 14px 6px;
  letter-spacing: 0.5px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  font-size: 0.82rem;
  color: #c0c5d8;
  cursor: pointer;
  transition: all 0.15s;
}
.sidebar-item:hover {
  background: rgba(108, 140, 255, 0.08);
  color: #6c8cff;
}
.sidebar-item.active {
  background: rgba(108, 140, 255, 0.15);
  color: #6c8cff;
}

/* 文件列表 */
.file-list-container {
  flex: 1;
  overflow-y: auto;
  padding: 4px 0;
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 200px;
  color: #8b91a8;
  font-size: 0.9rem;
}

.error-state {
  color: #f87171;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #2d3348;
  border-top-color: #6c8cff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-right: 8px;
  vertical-align: middle;
}
@keyframes spin { to { transform: rotate(360deg); } }

.file-list {
  padding: 0;
}

.search-results-info {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 0.8rem;
  color: #8b91a8;
  border-bottom: 1px solid #2d3348;
  background: rgba(108, 140, 255, 0.04);
}
.search-results-info strong {
  color: #6c8cff;
}
.truncated-hint {
  color: #f59e0b;
  font-size: 0.76rem;
}
.elapsed-hint {
  margin-left: auto;
  font-size: 0.74rem;
  color: #5a6180;
}

.file-parent-path {
  font-size: 0.76rem;
  color: #5a6180;
  font-family: 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
  flex-shrink: 0;
}

.select-current-dir {
  background: rgba(167, 139, 250, 0.08);
  border-bottom: 1px solid rgba(167, 139, 250, 0.15);
}
.select-current-dir:hover {
  background: rgba(167, 139, 250, 0.15);
}
.select-current-dir.selected {
  background: rgba(167, 139, 250, 0.25);
}

.file-path-hint {
  font-size: 0.78rem;
  color: #8b91a8;
  font-family: 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 16px;
  cursor: pointer;
  transition: background 0.1s;
  border-bottom: 1px solid rgba(45, 51, 72, 0.3);
  user-select: none;
}
.file-row:hover {
  background: rgba(108, 140, 255, 0.06);
}
.file-row.selected {
  background: rgba(108, 140, 255, 0.15);
  border-color: rgba(108, 140, 255, 0.2);
}
.file-row.is-directory .file-name {
  font-weight: 500;
}

.file-icon {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
}

.file-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.88rem;
}

.file-size {
  color: #8b91a8;
  font-size: 0.78rem;
  white-space: nowrap;
  width: 70px;
  text-align: right;
  flex-shrink: 0;
}

.file-modified {
  color: #5a6180;
  font-size: 0.76rem;
  white-space: nowrap;
  width: 120px;
  text-align: right;
  flex-shrink: 0;
}

/* 底部 */
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-top: 1px solid #2d3348;
  background: #222633;
}

.selected-info {
  font-size: 0.85rem;
}
.no-selection {
  color: #5a6180;
}
.has-selection {
  color: #6c8cff;
}

.footer-actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 20px;
  border: none;
  border-radius: 6px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}
.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-cancel {
  background: #2d3348;
  color: #c0c5d8;
}
.btn-cancel:hover {
  background: #3a4160;
}

.btn-confirm {
  background: #6c8cff;
  color: #fff;
}
.btn-confirm:hover:not(:disabled) {
  background: #5a7af0;
}
</style>
