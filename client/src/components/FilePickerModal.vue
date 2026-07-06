<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-container" :class="{ 'modal-theme-light': theme === 'light' }">
        <!-- 头部 -->
        <div class="modal-header">
          <h3 class="modal-title">
            <SvgIcon :name="mode === 'file' ? 'file' : 'folder'" :size="18" :color="titleIconColor" />
            {{ t(mode === 'file' ? 'modal.title.file' : 'modal.title.directory') }}
          </h3>
          <button class="close-btn" @click="$emit('close')" :title="t('modal.close')">
            <SvgIcon name="close" :size="16" />
          </button>
        </div>

        <!-- 工具栏 -->
        <div class="toolbar">
          <button class="tool-btn tool-btn-icon" @click="goUp" :disabled="!parentPath" :title="t('tooltip.back')">
            <SvgIcon name="arrowUp" :size="14" />
          </button>
          <button class="tool-btn tool-btn-icon" @click="goHome" :title="t('tooltip.home')">
            <SvgIcon name="home" :size="14" />
          </button>
          <button class="tool-btn tool-btn-icon" @click="refresh" :title="t('tooltip.refresh')">
            <SvgIcon name="refresh" :size="14" />
          </button>
        <button
          v-if="enableMkdir && !isGlobalSearchActive"
          class="tool-btn tool-btn-icon"
          @click="openMkdirDialog"
          :title="t('tooltip.newFolder')"
        >
          <SvgIcon name="folderPlus" :size="14" />
        </button>
        <div class="address-bar" :class="{ 'has-error': addressBarError }">
          <SvgIcon name="folder" :size="13" :color="addressBarError ? '#f87171' : '#8b91a8'" class="address-bar-icon" />
          <input
            ref="addressInputRef"
            v-model="addressBarValue"
            type="text"
            class="address-bar-input"
            :placeholder="t('address.placeholder')"
            :title="addressBarError || t('address.title')"
            spellcheck="false"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            @keydown.enter="onAddressEnter"
            @keydown.esc="onAddressEscape"
            @focus="onAddressFocus"
            @blur="onAddressBlur"
          />
          <button
            v-if="addressBarError"
            class="address-bar-clear"
            :title="addressBarError"
            @click="clearAddressError"
          >
            <SvgIcon name="circleX" :size="14" color="#f87171" />
          </button>
      </div>
        </div>

        <!-- 搜索栏 -->
        <div class="search-bar">
          <SvgIcon name="search" :size="16" color="#8b91a8" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            :placeholder="globalSearch
              ? t('search.placeholderGlobal', { type: t('search.type.' + (mode === 'file' ? 'file' : mode === 'directory' ? 'directory' : 'all')) })
              : t('search.placeholderLocal')"
            @keydown.enter="onSearchEnter"
          />
          <button v-if="searchQuery" class="clear-search" @click="clearSearch">
            <SvgIcon name="close" :size="14" />
          </button>
          <div class="global-toggle" :title="globalSearch ? t('tooltip.globalSearchOn') : t('tooltip.globalSearchOff')">
            <span class="toggle-label">{{ t('search.globalLabel') }}</span>
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
              ? t('tooltip.indexReady', {
                  totalFiles: indexStatus.totalFiles,
                  scannedRoots: (indexStatus.scannedRoots || []).join(', ') || 'unknown',
                })
              : indexStatus.status === 'indexing'
              ? t('tooltip.indexing', {
                  indexedFiles: indexStatus.indexedFiles,
                  currentDir: indexStatus.currentDir || '',
                })
              : t('tooltip.indexIdle')"
            @click="indexStatus.status !== 'indexing' && reindex()"
          >
            <span class="status-dot"></span>
            <span class="status-text">
              {{ indexStatus.status === 'ready'
                ? t('status.indexReady')
                : indexStatus.status === 'indexing'
                ? t('status.indexing')
                : t('status.indexIdle') }}
            </span>
          </div>
        </div>

        <!-- 主内容区 -->
        <div class="modal-body">
          <!-- 左侧快捷栏 -->
          <div class="sidebar">
            <div class="sidebar-section">
              <div class="sidebar-title">{{ t('sidebar.quickAccess') }}</div>
              <div class="sidebar-item" @click="goHome">
                <SvgIcon name="home" :size="15" /> {{ t('sidebar.home') }}
              </div>
              <div class="sidebar-item" @click="navigateTo(desktopPath)" v-if="desktopPath">
                <SvgIcon name="monitor" :size="15" /> {{ t('sidebar.desktop') }}
              </div>
              <div class="sidebar-item" @click="navigateTo(docsPath)" v-if="docsPath">
                <SvgIcon name="file" :size="15" /> {{ t('sidebar.documents') }}
              </div>
              <div class="sidebar-item" @click="navigateTo(downloadsPath)" v-if="downloadsPath">
                <SvgIcon name="download" :size="15" /> {{ t('sidebar.downloads') }}
              </div>
            </div>
            <div class="sidebar-section" v-if="drives.length">
              <div class="sidebar-title">{{ t('sidebar.drives') }}</div>
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
              <span class="spinner"></span> {{ t('state.loading') }}
            </div>
            <div v-else-if="error" class="error-state">
              <SvgIcon name="circleX" :size="18" color="currentColor" /> {{ error }}
            </div>
            <div v-else-if="globalSearching" class="loading-state">
              <span class="spinner"></span> {{ t('state.globalSearching') }}
            </div>
            <div v-else-if="filteredItems.length === 0" class="empty-state">
              {{ searchQuery ? t('state.emptySearch') : t('state.emptyDir') }}
            </div>
            <div v-else class="file-list">
              <!-- 全局搜索结果提示 -->
              <div v-if="globalSearchResults.length > 0" class="search-results-info">
                <SvgIcon name="search" :size="14" color="#8b91a8" />
                <span v-html="t('results.found', { count: globalSearchResults.length })"></span>
                <span v-if="globalSearchTruncated" class="truncated-hint">{{ t('results.truncated') }}</span>
                <span class="engine-badge" :class="globalSearchEngine">
                  {{ globalSearchEngine === 'index' ? t('search.engineIndex') : t('search.engineWalk') }}
                </span>
                <span class="elapsed-hint">{{ globalSearchElapsed }}{{ t('unit.ms') }}</span>
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
              {{ t(mode === 'file' ? 'footer.unselectedFile' : 'footer.unselectedDir') }}
            </span>
            <span v-else-if="!multiple" class="has-selection single-path" :title="selectedPaths[0]">
              {{ selectedPaths[0] }}
            </span>
            <span v-else class="has-selection">
              <span v-html="t('footer.selected', { count: selectedPaths.length })"></span>
            </span>
          </div>
          <div class="footer-actions">
            <button class="btn btn-cancel" @click="$emit('close')">{{ t('footer.cancel') }}</button>
            <button
              class="btn btn-confirm"
              :disabled="selectedPaths.length === 0"
              @click="confirmSelection"
            >
              {{ t('footer.confirm') }}
            </button>
          </div>
        </div>

        <!-- 新建文件夹对话框 -->
        <div
          v-if="mkdirDialogOpen"
          class="mkdir-overlay"
          @click.self="closeMkdirDialog"
          @keydown.esc="closeMkdirDialog"
        >
          <div class="mkdir-dialog" :class="{ 'modal-theme-light': theme === 'light' }">
            <div class="mkdir-header">
              <SvgIcon name="folderPlus" :size="18" color="#a78bfa" />
              <span class="mkdir-title">{{ t('mkdir.title') }}</span>
            </div>
            <div class="mkdir-body">
              <label class="mkdir-label">{{ t('mkdir.parentLabel') }}</label>
              <div class="mkdir-parent-path" :title="mkdirParent">{{ mkdirParent }}</div>

              <label class="mkdir-label" for="mkdir-name-input">{{ t('mkdir.nameLabel') }}</label>
              <input
                id="mkdir-name-input"
                ref="mkdirNameInput"
                v-model="mkdirName"
                type="text"
                class="mkdir-input"
                :placeholder="t('mkdir.namePlaceholder')"
                :class="{ 'has-error': mkdirError }"
                @keydown.enter="submitMkdir"
                @keydown.esc="closeMkdirDialog"
                maxlength="255"
              />
              <div v-if="mkdirError" class="mkdir-error">
                <SvgIcon name="circleX" :size="14" color="currentColor" />
                <span>{{ mkdirError }}</span>
              </div>
              <div v-else-if="mkdirHint" class="mkdir-hint">{{ mkdirHint }}</div>
            </div>
            <div class="mkdir-footer">
              <button class="btn btn-cancel" @click="closeMkdirDialog" :disabled="mkdirSubmitting">
                {{ t('mkdir.cancel') }}
              </button>
              <button
                class="btn btn-confirm"
                :disabled="!mkdirName.trim() || mkdirSubmitting"
                @click="submitMkdir"
              >
                <span v-if="mkdirSubmitting" class="spinner" style="width:12px;height:12px;border-width:2px;margin-right:6px;"></span>
                {{ t('mkdir.confirm') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import SvgIcon from '../icons/SvgIcon.vue';
import { getFileTypeColor } from '../icons/index.js';

// ===== i18n =====
const MESSAGES = {
  'zh-CN': {
    'modal.title.file': '选择文件',
    'modal.title.directory': '选择文件夹',
    'modal.close': '关闭',
    'modal.up': '上级',
    'modal.home': '家目录',
    'modal.newFolder': '新建文件夹',
    'tooltip.back': '返回上一级',
    'tooltip.home': '家目录',
    'tooltip.refresh': '刷新',
    'tooltip.newFolder': '在当前目录下新建文件夹',
    'tooltip.globalSearchOn': '全局搜索：在整个磁盘范围内搜索',
    'tooltip.globalSearchOff': '当前目录搜索：仅在当前目录中过滤',
    'tooltip.indexReady': '索引就绪，共 {totalFiles} 项，已扫描: {scannedRoots}',
    'tooltip.indexing': '正在建索引... {indexedFiles} 项，当前: {currentDir}',
    'tooltip.indexIdle': '索引未就绪，使用实时搜索',
    'search.placeholderGlobal': '全局搜索{type}...',
    'search.placeholderLocal': '搜索当前目录...',
    'search.type.file': '文件',
    'search.type.directory': '文件夹',
    'search.type.all': '文件和文件夹',
    'search.globalLabel': '全局',
    'search.engineIndex': '索引搜索',
    'search.engineWalk': '实时搜索',
    'status.indexReady': '索引',
    'status.indexing': '索引中',
    'status.indexIdle': '离线',
    'sidebar.quickAccess': '快捷访问',
    'sidebar.home': '家目录',
    'sidebar.desktop': '桌面',
    'sidebar.documents': '文档',
    'sidebar.downloads': '下载',
    'sidebar.drives': '磁盘',
    'state.loading': '加载中...',
    'state.globalSearching': '全局搜索中...',
    'state.emptySearch': '没有匹配的结果',
    'state.emptyDir': '空目录',
    'results.found': '找到 <strong>{count}</strong> 个结果',
    'results.truncated': '（已达上限，请缩小关键词）',
    'unit.ms': 'ms',
    'fileRow.selectCurrent': '选择当前文件夹',
    'footer.unselectedFile': '未选择文件',
    'footer.unselectedDir': '未选择文件夹',
    'footer.selected': '已选择 <strong>{count}</strong> 项',
    'footer.cancel': '取消',
    'footer.confirm': '确认选择',
    'error.cannotConnect': '无法连接到后端服务，请确认后端已启动 (npm run dev)',
    'error.network': '网络错误: {message}。请确认后端服务已启动。',
    'error.searchFailed': '搜索请求失败',
    'address.title': '输入目录路径后按回车跳转（支持相对路径，如 ..\\foo）',
    'address.placeholder': '输入目录路径后按回车跳转…',
    'address.errorEmpty': '请输入路径',
    'address.errorInvalid': '无法访问该目录: {path}',
    'address.errorInvalidDefault': 'defaultPath 指定的目录无效或不可访问，已回落到用户目录',
    'mkdir.title': '新建文件夹',
    'mkdir.parentLabel': '位置',
    'mkdir.nameLabel': '文件夹名',
    'mkdir.namePlaceholder': '请输入文件夹名',
    'mkdir.hintExists': '已存在同名项目',
    'mkdir.hintOk': '可用',
    'mkdir.cancel': '取消',
    'mkdir.confirm': '创建',
    'mkdir.success': '已创建: {name}',
    'mkdir.createdToast': '已创建文件夹',
  },
  'en-US': {
    'modal.title.file': 'Select File',
    'modal.title.directory': 'Select Folder',
    'modal.close': 'Close',
    'modal.up': 'Up',
    'modal.home': 'Home',
    'modal.newFolder': 'New Folder',
    'tooltip.back': 'Go to parent directory',
    'tooltip.home': 'Home directory',
    'tooltip.refresh': 'Refresh',
    'tooltip.newFolder': 'Create a new folder in the current directory',
    'tooltip.globalSearchOn': 'Global search: search across the entire disk',
    'tooltip.globalSearchOff': 'Current folder search: filter within current folder only',
    'tooltip.indexReady': 'Index ready, {totalFiles} items total, scanned: {scannedRoots}',
    'tooltip.indexing': 'Building index... {indexedFiles} items, current: {currentDir}',
    'tooltip.indexIdle': 'Index not ready, using live search',
    'search.placeholderGlobal': 'Global search {type}...',
    'search.placeholderLocal': 'Search current folder...',
    'search.type.file': 'files',
    'search.type.directory': 'folders',
    'search.type.all': 'files and folders',
    'search.globalLabel': 'Global',
    'search.engineIndex': 'Index search',
    'search.engineWalk': 'Live search',
    'status.indexReady': 'Index',
    'status.indexing': 'Indexing',
    'status.indexIdle': 'Offline',
    'sidebar.quickAccess': 'Quick Access',
    'sidebar.home': 'Home',
    'sidebar.desktop': 'Desktop',
    'sidebar.documents': 'Documents',
    'sidebar.downloads': 'Downloads',
    'sidebar.drives': 'Drives',
    'state.loading': 'Loading...',
    'state.globalSearching': 'Global searching...',
    'state.emptySearch': 'No matching results',
    'state.emptyDir': 'Empty folder',
    'results.found': 'Found <strong>{count}</strong> results',
    'results.truncated': '(limit reached, please narrow keywords)',
    'unit.ms': 'ms',
    'fileRow.selectCurrent': 'Select current folder',
    'footer.unselectedFile': 'No file selected',
    'footer.unselectedDir': 'No folder selected',
    'footer.selected': '<strong>{count}</strong> item(s) selected',
    'footer.cancel': 'Cancel',
    'footer.confirm': 'Confirm Selection',
    'error.cannotConnect': 'Cannot connect to backend service, please make sure it is started (npm run dev)',
    'error.network': 'Network error: {message}. Please make sure the backend service is running.',
    'error.searchFailed': 'Search request failed',
    'address.title': 'Type a directory path and press Enter to navigate (relative paths like ..\\foo are supported)',
    'address.placeholder': 'Type a directory path and press Enter…',
    'address.errorEmpty': 'Please enter a path',
    'address.errorInvalid': 'Cannot access directory: {path}',
    'address.errorInvalidDefault': 'The defaultPath directory is invalid or inaccessible, fell back to user home',
    'mkdir.title': 'New Folder',
    'mkdir.parentLabel': 'Location',
    'mkdir.nameLabel': 'Folder name',
    'mkdir.namePlaceholder': 'Enter a folder name',
    'mkdir.hintExists': 'A folder with this name already exists',
    'mkdir.hintOk': 'Available',
    'mkdir.cancel': 'Cancel',
    'mkdir.confirm': 'Create',
    'mkdir.success': 'Created: {name}',
    'mkdir.createdToast': 'Folder created',
  },
};
const FALLBACK_LOCALE = 'zh-CN';

const props = defineProps({
  visible: { type: Boolean, default: false },
  mode: { type: String, default: 'file' }, // 'file' | 'directory'
  multiple: { type: Boolean, default: false }, // 是否允许多选，默认单选
  theme: { type: String, default: 'dark' }, // 'dark' | 'light'
  defaultPath: { type: String, default: '' }, // 打开弹窗时的默认目录，空则使用客户端用户目录
  apiBase: { type: String, default: '/api' }, // API 服务基础路径，如 'http://localhost:8642/api'
  locale: { type: String, default: 'zh-CN' }, // 'zh-CN' | 'en-US'
  messages: { type: Object, default: null }, // 外部完全覆盖字典（高级用法）
  enableMkdir: { type: Boolean, default: true }, // 是否显示"新建文件夹"按钮（自 v0.1.5 起由中间件内置，无需后端额外配置）
  autoSelectOnMkdir: { type: Boolean, default: true }, // 创建成功后是否自动选中新文件夹
});

const emit = defineEmits(['close', 'confirm', 'created']);

// 合并: 内置 → 外部覆盖 → 回退到内置
const mergedMessages = computed(() => {
  const base = MESSAGES[props.locale] || MESSAGES[FALLBACK_LOCALE];
  return { ...base, ...(props.messages || {}) };
});

// t(key, params) 支持 {varName} 插值; HTML 内容（带 <strong>）安全传递
function t(key, params = {}) {
  let str = mergedMessages.value[key];
  if (str == null) str = MESSAGES[FALLBACK_LOCALE][key] ?? key;
  return str.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? `{${k}}`);
}

const titleIconColor = computed(() => {
  if (props.mode === 'file') return props.theme === 'light' ? '#3b82f6' : '#6c8cff';
  return '#a78bfa';
});

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

// 新建文件夹对话框状态
const mkdirDialogOpen = ref(false);
const mkdirName = ref('');
const mkdirError = ref('');
const mkdirParent = ref('');
const mkdirSubmitting = ref(false);
const mkdirNameInput = ref(null);

// ===== Address bar (path input) =====
const addressBarValue = ref('');
const addressBarError = ref('');
const addressInputRef = ref(null);
let addressBarEditing = false;

// 快捷路径
const desktopPath = computed(() => homePath.value ? homePath.value + '\\Desktop' : '');
const docsPath = computed(() => homePath.value ? homePath.value + '\\Documents' : '');
const downloadsPath = computed(() => homePath.value ? homePath.value + '\\Downloads' : '');

// 是否处于全局搜索激活状态（有结果或正在搜索）
const isGlobalSearchActive = computed(() => globalSearch.value && globalSearchResults.value.length > 0);

// 文件夹名是否与当前列表中的项目重名（用于实时提示）
const mkdirHint = computed(() => {
  if (!mkdirName.value.trim()) return '';
  if (mkdirError.value) return '';
  const conflict = items.value.some((it) => it.name.toLowerCase() === mkdirName.value.trim().toLowerCase());
  return conflict ? t('mkdir.hintExists') : t('mkdir.hintOk');
});

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
        errMsg = t('error.cannotConnect');
      }
      error.value = errMsg;
      return;
    }
    const data = await resp.json();
    currentPath.value = data.currentPath;
    parentPath.value = data.parentPath;
    items.value = data.items || [];
  } catch (err) {
    error.value = t('error.network', { message: err.message });
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

// ===== Address bar handlers =====
// 把用户输入解析成绝对路径（Windows / POSIX）
function resolveAddressPath(input, base) {
  if (!input) return base || '';
  let trimmed = String(input).trim();
  if (!trimmed) return base || '';

  // 推断平台：以当前路径的格式为准；都没有就按浏览器平台回退
  const looksWindows =
    (base || '').includes('\\') ||
    /^[A-Za-z]:[\\\/]/.test(base || '') ||
    /^[A-Za-z]:[\\\/]/.test(trimmed) ||
    trimmed.startsWith('\\\\') ||
    (typeof navigator !== 'undefined' && /Win/i.test(navigator.platform || ''));

  if (looksWindows) {
    // 绝对路径：盘符开头
    if (/^[A-Za-z]:/.test(trimmed)) {
      let normalized = trimmed.replace(/\//g, '\\');
      // 形如 "C:" 补成 "C:\"
      if (/^[A-Za-z]:\\?$/.test(normalized)) normalized = normalized.replace(/\\?$/, '\\');
      return normalized;
    }
    // UNC 路径原样保留
    if (trimmed.startsWith('\\\\')) return trimmed.replace(/\//g, '\\');
    // 当前盘根
    if (trimmed === '\\' && /^[A-Za-z]:/.test(base || '')) {
      return (base || '').split('\\')[0] + '\\';
    }
    // 相对路径：基于 base 解析
    if (!base) return trimmed;
    const baseParts = base.split('\\');
    const inputParts = trimmed.split(/[\\\/]/).filter(Boolean);
    const result = [...baseParts];
    for (const part of inputParts) {
      if (!part || part === '.') continue;
      if (part === '..') {
        if (result.length > 1) result.pop(); // 保留盘符
      } else {
        result.push(part);
      }
    }
    return result.join('\\');
  }

  // POSIX
  if (trimmed.startsWith('/')) {
    let normalized = trimmed.replace(/\\/g, '/');
    // 把连续的 / 折叠
    return normalized.replace(/\/+/g, '/');
  }
  if (!base) return trimmed;
  const baseParts = base.split('/').filter(Boolean);
  const inputParts = trimmed.split(/[\\\/]/).filter(Boolean);
  const result = [...baseParts];
  for (const part of inputParts) {
    if (!part || part === '.') continue;
    if (part === '..') {
      if (result.length > 0) result.pop();
    } else {
      result.push(part);
    }
  }
  return '/' + result.join('/');
}

async function navigateByAddress() {
  const raw = addressBarValue.value.trim();
  if (!raw) {
    addressBarError.value = t('address.errorEmpty');
    return;
  }
  const resolved = resolveAddressPath(raw, currentPath.value);
  error.value = '';
  addressBarError.value = '';
  try {
    const resp = await fetch(
      `${props.apiBase}/fs/list?dir=${encodeURIComponent(resolved)}`,
    );
    if (!resp.ok) {
      let detail = '';
      try {
        const data = await resp.json();
        detail = data && data.error ? data.error : '';
      } catch (_) { /* ignore */ }
      addressBarError.value = detail || t('address.errorInvalid', { path: resolved });
      return;
    }
    addressBarValue.value = resolved;
    await navigateTo(resolved);
  } catch (err) {
    addressBarError.value = t('error.network', { message: err.message });
  }
}

function onAddressEnter() {
  navigateByAddress();
}

function onAddressEscape() {
  addressBarValue.value = currentPath.value || '';
  addressBarError.value = '';
  if (addressInputRef.value && typeof addressInputRef.value.blur === 'function') {
    addressInputRef.value.blur();
  }
}

function onAddressFocus() {
  addressBarEditing = true;
  nextTick(() => {
    if (addressInputRef.value && typeof addressInputRef.value.select === 'function') {
      addressInputRef.value.select();
    }
  });
}

function onAddressBlur() {
  addressBarEditing = false;
  if (!addressBarError.value) {
    addressBarValue.value = currentPath.value || '';
  }
}

function clearAddressError() {
  addressBarError.value = '';
}

watch(currentPath, (val) => {
  if (!addressBarEditing) {
    addressBarValue.value = val || '';
  }
  // 路径变更后清掉错误
  if (addressBarError.value) addressBarError.value = '';
  // 文件夹模式：切换目录时默认选中当前文件夹，使确认按钮始终可点
  if (props.mode === 'directory' && val && !isGlobalSearchActive.value) {
    selectedPaths.value = [val];
  }
});

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
  if (!props.multiple) {
    // 单选模式：点击已选中的则取消，否则替换
    selectedPaths.value = selectedPaths.value[0] === path ? [] : [path];
    return;
  }
  const idx = selectedPaths.value.indexOf(path);
  if (idx >= 0) {
    selectedPaths.value.splice(idx, 1);
  } else {
    selectedPaths.value.push(path);
  }
}

function clearSelection() {
  // 文件夹模式下点击空白区域时重置为默认选中当前文件夹，而非完全清空
  if (props.mode === 'directory' && currentPath.value && !isGlobalSearchActive.value) {
    selectedPaths.value = [currentPath.value];
  } else {
    selectedPaths.value = [];
  }
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
  if (!props.multiple) {
    // 单选模式下 ctrl+click 与普通 click 相同
    handleClick(item, {});
    return;
  }
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
        errMsg = t('error.searchFailed');
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

// ===== 新建文件夹 =====

function openMkdirDialog() {
  // 全局搜索激活时不允许创建（无明确 parent）
  if (isGlobalSearchActive.value) return;
  if (!currentPath.value) return;
  mkdirDialogOpen.value = true;
  mkdirName.value = '';
  mkdirError.value = '';
  mkdirParent.value = currentPath.value;
  // 等 DOM 渲染完成后聚焦输入框
  nextTick(() => {
    if (mkdirNameInput.value && typeof mkdirNameInput.value.focus === 'function') {
      mkdirNameInput.value.focus();
    }
  });
}

function closeMkdirDialog() {
  if (mkdirSubmitting.value) return;
  mkdirDialogOpen.value = false;
  mkdirName.value = '';
  mkdirError.value = '';
}

async function submitMkdir() {
  const name = mkdirName.value.trim();
  if (!name) {
    mkdirError.value = t('error.invalidName') || '名称不能为空';
    return;
  }
  if (mkdirSubmitting.value) return;
  mkdirSubmitting.value = true;
  mkdirError.value = '';
  try {
    const resp = await fetch(`${props.apiBase}/fs/mkdir`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parent: currentPath.value, name }),
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      mkdirError.value = data.error || `HTTP ${resp.status}`;
      return;
    }
    // 成功：关闭对话框、刷新当前目录、自动选中新文件夹
    mkdirDialogOpen.value = false;
    mkdirName.value = '';
    mkdirError.value = '';
    emit('created', { path: data.path, name: data.name, parent: currentPath.value });
    // 刷新列表
    await fetchDirectory(currentPath.value);
    if (props.autoSelectOnMkdir && data.path) {
      // 列表已包含新文件夹，选中它
      if (props.multiple) {
        if (!selectedPaths.value.includes(data.path)) selectedPaths.value.push(data.path);
      } else {
        selectedPaths.value = [data.path];
      }
    }
  } catch (err) {
    mkdirError.value = t('error.network', { message: err.message });
  } finally {
    mkdirSubmitting.value = false;
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
  if (item.kind === 'directory') return '#a78bfa';
  const ext = (item.ext || '').replace('.', '');
  return getFileTypeColor(ext);
}

// ===== 生命周期 =====

watch(() => props.visible, async (val) => {
  if (val) {
    selectedPaths.value = [];
    searchQuery.value = '';
    error.value = '';
    mkdirDialogOpen.value = false;
    mkdirName.value = '';
    mkdirError.value = '';
    exitGlobalSearch();
    const home = await fetchHome();
    await fetchDrives();
    await fetchIndexStatus();
    // 优先使用 defaultPath；如果不可访问则回落 home 并提示
    let initial = '';
    const requested = (props.defaultPath || '').trim();
    if (requested) {
      const resolved = resolveAddressPath(requested, home || '');
      try {
        const resp = await fetch(
          `${props.apiBase}/fs/list?dir=${encodeURIComponent(resolved)}`,
        );
        if (resp.ok) {
          initial = resolved;
        } else {
          error.value = t('address.errorInvalidDefault');
        }
      } catch (_) {
        error.value = t('address.errorInvalidDefault');
      }
    }
    if (!initial) initial = home || '';
    addressBarValue.value = initial;
    await fetchDirectory(initial);
  } else {
    exitGlobalSearch();
    mkdirDialogOpen.value = false;
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
.tool-btn-icon {
  padding: 5px 8px;
  gap: 0;
  justify-content: center;
}


/* Address bar (editable path input) */
.address-bar {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: 8px;
  background: #2d3348;
  border: 1px solid #3a4160;
  border-radius: 6px;
  padding: 2px 8px;
  transition: border-color 0.15s;
}
.address-bar:focus-within {
  border-color: #6c8cff;
}
.address-bar.has-error {
  border-color: #f87171;
}
.address-bar-icon {
  flex-shrink: 0;
}
.address-bar-input {
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  outline: none;
  color: #e4e7ef;
  font-size: 0.84rem;
  font-family: 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
  padding: 4px 0;
  line-height: 1.3;
}
.address-bar-input::placeholder {
  color: #5a6180;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
.address-bar-clear {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #f87171;
  cursor: pointer;
  padding: 2px;
  border-radius: 3px;
}
.address-bar-clear:hover {
  background: rgba(248, 113, 113, 0.12);
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
.single-path {
  font-family: 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
  font-size: 0.82rem;
  max-width: 420px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-cancel {
  background: #2d3348;
  color: #c0c5d8;
}
.btn-cancel:hover:not(:disabled) {
  background: #3a4160;
}

.btn-confirm {
  background: #6c8cff;
  color: #fff;
}
.btn-confirm:hover:not(:disabled) {
  background: #5a7af0;
}

/* ===== 新建文件夹对话框 ===== */
.mkdir-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.mkdir-dialog {
  width: 420px;
  max-width: 90%;
  background: #1e2230;
  border: 1px solid #3a4160;
  border-radius: 10px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.mkdir-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 18px;
  border-bottom: 1px solid #2d3348;
  background: #222633;
}

.mkdir-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #e4e7ef;
}

.mkdir-body {
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mkdir-label {
  font-size: 0.78rem;
  color: #8b91a8;
  margin-top: 4px;
}

.mkdir-parent-path {
  font-family: 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
  font-size: 0.82rem;
  color: #c0c5d8;
  background: #2d3348;
  border: 1px solid #3a4160;
  padding: 6px 10px;
  border-radius: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  direction: rtl; /* 让长路径从右侧开始截断 */
  text-align: left;
}

.mkdir-input {
  background: #2d3348;
  border: 1px solid #3a4160;
  color: #e4e7ef;
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.15s;
}
.mkdir-input::placeholder {
  color: #5a6180;
}
.mkdir-input:focus {
  border-color: #a78bfa;
}
.mkdir-input.has-error {
  border-color: #f87171;
}

.mkdir-error {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.78rem;
  color: #f87171;
  margin-top: 4px;
}

.mkdir-hint {
  font-size: 0.76rem;
  color: #5a6180;
  margin-top: 4px;
}

.mkdir-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 12px 18px;
  border-top: 1px solid #2d3348;
  background: #1a1d27;
}

/* ===== Light theme overrides ===== */
.modal-theme-light {
  background: #ffffff;
  border-color: #e2e8f0;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}
.modal-theme-light .modal-header {
  background: #f8fafc;
  border-color: #e2e8f0;
}
.modal-theme-light .modal-title {
  color: #1e293b;
}
.modal-theme-light .close-btn {
  color: #64748b;
}
.modal-theme-light .close-btn:hover {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.08);
}
.modal-theme-light .toolbar {
  background: #f1f5f9;
  border-color: #e2e8f0;
}
.modal-theme-light .tool-btn {
  background: #e2e8f0;
  border-color: #cbd5e1;
  color: #1e293b;
}
.modal-theme-light .tool-btn:hover:not(:disabled) {
  background: #cbd5e1;
}
.modal-theme-light .address-bar {
  background: #ffffff;
  border-color: #cbd5e1;
}
.modal-theme-light .address-bar:focus-within {
  border-color: #3b82f6;
}
.modal-theme-light .address-bar.has-error {
  border-color: #ef4444;
}
.modal-theme-light .address-bar-input {
  color: #1e293b;
}
.modal-theme-light .address-bar-input::placeholder {
  color: #94a3b8;
}
.modal-theme-light .address-bar-clear {
  color: #ef4444;
}
.modal-theme-light .address-bar-clear:hover {
  background: rgba(239, 68, 68, 0.08);
}
.modal-theme-light .search-bar {
  background: #f1f5f9;
  border-color: #e2e8f0;
}
.modal-theme-light .search-input {
  background: #ffffff;
  border-color: #cbd5e1;
  color: #1e293b;
}
.modal-theme-light .search-input::placeholder {
  color: #94a3b8;
}
.modal-theme-light .search-input:focus {
  border-color: #3b82f6;
}
.modal-theme-light .toggle-label {
  color: #94a3b8;
}
.modal-theme-light .toggle-switch {
  background: #e2e8f0;
  border-color: #cbd5e1;
}
.modal-theme-light .toggle-switch.active {
  background: #3b82f6;
  border-color: #3b82f6;
}
.modal-theme-light .toggle-knob {
  background: #94a3b8;
}
.modal-theme-light .sidebar {
  background: #f8fafc;
  border-color: #e2e8f0;
}
.modal-theme-light .sidebar-section {
  border-color: #e2e8f0;
}
.modal-theme-light .sidebar-title {
  color: #94a3b8;
}
.modal-theme-light .sidebar-item {
  color: #475569;
}
.modal-theme-light .sidebar-item:hover {
  background: rgba(59, 130, 246, 0.06);
  color: #3b82f6;
}
.modal-theme-light .sidebar-item.active {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}
.modal-theme-light .file-list-container {
  background: #ffffff;
}
.modal-theme-light .file-row {
  border-color: rgba(226, 232, 240, 0.6);
  color: #1e293b;
}
.modal-theme-light .file-row:hover {
  background: rgba(59, 130, 246, 0.05);
}
.modal-theme-light .file-row.selected {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.2);
}
.modal-theme-light .file-row.is-directory .file-name {
  color: #0f172a;
}
.modal-theme-light .file-size {
  color: #64748b;
}
.modal-theme-light .file-modified {
  color: #94a3b8;
}
.modal-theme-light .file-path-hint {
  color: #64748b;
}
.modal-theme-light .file-parent-path {
  color: #94a3b8;
}
.modal-theme-light .select-current-dir {
  background: rgba(139, 92, 246, 0.05);
  border-color: rgba(139, 92, 246, 0.1);
}
.modal-theme-light .select-current-dir:hover {
  background: rgba(139, 92, 246, 0.1);
}
.modal-theme-light .select-current-dir.selected {
  background: rgba(139, 92, 246, 0.15);
}
.modal-theme-light .search-results-info {
  color: #64748b;
  background: rgba(59, 130, 246, 0.03);
  border-color: #e2e8f0;
}
.modal-theme-light .loading-state,
.modal-theme-light .empty-state {
  color: #64748b;
}
.modal-theme-light .error-state {
  color: #ef4444;
}
.modal-theme-light .modal-footer {
  background: #f8fafc;
  border-color: #e2e8f0;
}
.modal-theme-light .no-selection {
  color: #94a3b8;
}
.modal-theme-light .has-selection {
  color: #3b82f6;
}
.modal-theme-light .btn-cancel {
  background: #e2e8f0;
  color: #475569;
}
.modal-theme-light .btn-cancel:hover:not(:disabled) {
  background: #cbd5e1;
}
.modal-theme-light .btn-confirm {
  background: #3b82f6;
}
.modal-theme-light .btn-confirm:hover:not(:disabled) {
  background: #2563eb;
}

/* light theme - mkdir dialog */
.modal-theme-light.mkdir-dialog,
.mkdir-dialog.modal-theme-light {
  background: #ffffff;
  border-color: #cbd5e1;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
}
.modal-theme-light .mkdir-header {
  background: #f8fafc;
  border-color: #e2e8f0;
}
.modal-theme-light .mkdir-title {
  color: #1e293b;
}
.modal-theme-light .mkdir-label {
  color: #64748b;
}
.modal-theme-light .mkdir-parent-path {
  background: #f1f5f9;
  border-color: #cbd5e1;
  color: #1e293b;
}
.modal-theme-light .mkdir-input {
  background: #ffffff;
  border-color: #cbd5e1;
  color: #1e293b;
}
.modal-theme-light .mkdir-input:focus {
  border-color: #8b5cf6;
}
.modal-theme-light .mkdir-footer {
  background: #f8fafc;
  border-color: #e2e8f0;
}
</style>
