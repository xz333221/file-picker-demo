import { computed as x, openBlock as n, createElementBlock as r, normalizeClass as M, Fragment as X, renderList as Q, ref as u, watch as ke, createBlock as Oe, Teleport as Re, withModifiers as F, createElementVNode as s, createVNode as v, createTextVNode as g, toDisplayString as o, createCommentVNode as m, withDirectives as ge, withKeys as W, vModelText as ye, nextTick as Ee } from "vue";
const Ge = {
  // 导航/操作
  arrowUp: ["M12 19V5m-7 7 7-7 7 7"],
  chevronUp: ["m18 15-6-6-6 6"],
  chevronDown: ["m6 9 6 6 6-6"],
  chevronRight: ["m9 18 6-6-6-6"],
  close: ["M18 6 6 18M6 6l12 12"],
  refresh: [
    "M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
    "M3 3v5h5",
    "M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16",
    "M21 21v-5h-5"
  ],
  search: ["m21 21-4.35-4.35", "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"],
  home: ["m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "M9 22V12h6v10"],
  // 文件/文件夹
  folder: [
    "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.7-.9l-.8-1.2A2 2 0 0 0 7.9 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h16Z"
  ],
  folderPlus: [
    "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.7-.9l-.8-1.2A2 2 0 0 0 7.9 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h16Z",
    "M12 10v6m-3-3h6"
  ],
  file: [
    "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
    "M14 2v4a2 2 0 0 0 2 2h4"
  ],
  check: ["M20 6 9 17l-5-5"],
  // 位置/设备
  monitor: ["M9.5 2H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-5.5", "M12 14v4", "M8 18h8"],
  download: ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M7 10l5 5 5-5", "M12 15V3"],
  hardDrive: [
    "M22 12H2",
    "M5.2 5.2 3 12v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6l-2.2-6.8A2 2 0 0 0 17 4H7a2 2 0 0 0-1.8 1.2Z",
    "M6 16h.01M10 16h.01"
  ],
  // 状态
  circleX: ["m14.5 9.5-5 5m0-5 5 5", "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"],
  circleCheck: ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "M22 4 12 14.01l-3-3"],
  // 展开/收起
  caretDown: ["m6 9 6 6 6-6"],
  caretRight: ["m9 18 6-6-6-6"]
}, Ve = {
  // 代码
  js: "#f0db4f",
  jsx: "#61dafb",
  ts: "#3178c6",
  tsx: "#3178c6",
  vue: "#42b883",
  html: "#e34c26",
  css: "#264de4",
  scss: "#cf649a",
  py: "#3776ab",
  java: "#ed8b00",
  go: "#00add8",
  rs: "#dea584",
  c: "#a8b9cc",
  cpp: "#00599c",
  // 数据/配置
  json: "#a78bfa",
  yml: "#cb171e",
  yaml: "#cb171e",
  toml: "#9c4121",
  csv: "#217346",
  // 文档
  md: "#8b91a8",
  txt: "#8b91a8",
  pdf: "#e74c3c",
  doc: "#2b579a",
  docx: "#2b579a",
  xls: "#217346",
  xlsx: "#217346",
  // 图片
  png: "#9b59b6",
  jpg: "#9b59b6",
  jpeg: "#9b59b6",
  gif: "#9b59b6",
  svg: "#ffb13b",
  webp: "#9b59b6",
  // 媒体
  mp4: "#e74c3c",
  mp3: "#1db954",
  wav: "#1db954",
  // 压缩
  zip: "#f59e0b",
  rar: "#f59e0b",
  "7z": "#f59e0b",
  gz: "#f59e0b",
  tar: "#f59e0b"
}, Ue = "#8b91a8";
function qe(d) {
  return Ve[d] || Ue;
}
const _e = (d, j) => {
  const z = d.__vccOpts || d;
  for (const [i, S] of j)
    z[i] = S;
  return z;
}, Ze = ["width", "height", "stroke"], Ke = ["d"], We = {
  __name: "SvgIcon",
  props: {
    name: { type: String, required: !0 },
    size: { type: [Number, String], default: 18 },
    color: { type: String, default: "currentColor" },
    class: { type: String, default: "" }
  },
  setup(d) {
    const j = d, z = x(() => j.class), i = x(() => {
      const S = Ge[j.name];
      return S ? Array.isArray(S) ? S : [S] : [];
    });
    return (S, oe) => (n(), r("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: d.size,
      height: d.size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: d.color,
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      class: M(["svg-icon", z.value]),
      "aria-hidden": "true"
    }, [
      (n(!0), r(X, null, Q(i.value, (l, J) => (n(), r("path", {
        key: J,
        d: l
      }, null, 8, Ke))), 128))
    ], 10, Ze));
  }
}, h = /* @__PURE__ */ _e(We, [["__scopeId", "data-v-5461fefd"]]), Xe = { class: "modal-header" }, Qe = { class: "modal-title" }, Je = ["title"], Ye = { class: "toolbar" }, et = ["disabled", "title"], tt = ["title"], at = ["title"], lt = ["title"], st = { class: "path-breadcrumb" }, ot = ["onClick"], nt = { class: "breadcrumb-text" }, rt = {
  key: 0,
  class: "breadcrumb-sep"
}, it = { class: "search-bar" }, ct = ["placeholder"], dt = ["title"], ut = { class: "toggle-label" }, vt = ["title"], ht = { class: "status-text" }, ft = { class: "modal-body" }, mt = { class: "sidebar" }, pt = { class: "sidebar-section" }, bt = { class: "sidebar-title" }, kt = {
  key: 0,
  class: "sidebar-section"
}, gt = { class: "sidebar-title" }, yt = ["onClick"], wt = {
  key: 0,
  class: "loading-state"
}, _t = {
  key: 1,
  class: "error-state"
}, xt = {
  key: 2,
  class: "loading-state"
}, St = {
  key: 3,
  class: "empty-state"
}, Ct = {
  key: 4,
  class: "file-list"
}, Mt = {
  key: 0,
  class: "search-results-info"
}, $t = ["innerHTML"], Dt = {
  key: 0,
  class: "truncated-hint"
}, Ft = { class: "elapsed-hint" }, zt = { class: "file-name" }, Lt = { class: "file-path-hint" }, Tt = ["onClick", "onDblclick"], Pt = ["title"], It = ["title"], Ht = ["title"], Bt = ["title"], jt = { class: "modal-footer" }, At = { class: "selected-info" }, Nt = {
  key: 0,
  class: "no-selection"
}, Ot = ["title"], Rt = {
  key: 2,
  class: "has-selection"
}, Et = ["innerHTML"], Gt = { class: "footer-actions" }, Vt = ["disabled"], Ut = { class: "mkdir-header" }, qt = { class: "mkdir-title" }, Zt = { class: "mkdir-body" }, Kt = { class: "mkdir-label" }, Wt = ["title"], Xt = {
  class: "mkdir-label",
  for: "mkdir-name-input"
}, Qt = ["placeholder"], Jt = {
  key: 0,
  class: "mkdir-error"
}, Yt = {
  key: 1,
  class: "mkdir-hint"
}, ea = { class: "mkdir-footer" }, ta = ["disabled"], aa = ["disabled"], la = {
  key: 0,
  class: "spinner",
  style: { width: "12px", height: "12px", "border-width": "2px", "margin-right": "6px" }
}, we = "zh-CN", sa = {
  __name: "FilePickerModal",
  props: {
    visible: { type: Boolean, default: !1 },
    mode: { type: String, default: "file" },
    // 'file' | 'directory'
    multiple: { type: Boolean, default: !1 },
    // 是否允许多选，默认单选
    theme: { type: String, default: "dark" },
    // 'dark' | 'light'
    apiBase: { type: String, default: "/api" },
    // API 服务基础路径，如 'http://localhost:8642/api'
    locale: { type: String, default: "zh-CN" },
    // 'zh-CN' | 'en-US'
    messages: { type: Object, default: null },
    // 外部完全覆盖字典（高级用法）
    enableMkdir: { type: Boolean, default: !0 },
    // 是否显示"新建文件夹"按钮（自 v0.1.5 起由中间件内置，无需后端额外配置）
    autoSelectOnMkdir: { type: Boolean, default: !0 }
    // 创建成功后是否自动选中新文件夹
  },
  emits: ["close", "confirm", "created"],
  setup(d, { emit: j }) {
    const z = {
      "zh-CN": {
        "modal.title.file": "选择文件",
        "modal.title.directory": "选择文件夹",
        "modal.close": "关闭",
        "modal.up": "上级",
        "modal.home": "家目录",
        "modal.newFolder": "新建文件夹",
        "tooltip.back": "返回上一级",
        "tooltip.home": "家目录",
        "tooltip.refresh": "刷新",
        "tooltip.newFolder": "在当前目录下新建文件夹",
        "tooltip.globalSearchOn": "全局搜索：在整个磁盘范围内搜索",
        "tooltip.globalSearchOff": "当前目录搜索：仅在当前目录中过滤",
        "tooltip.indexReady": "索引就绪，共 {totalFiles} 项，已扫描: {scannedRoots}",
        "tooltip.indexing": "正在建索引... {indexedFiles} 项，当前: {currentDir}",
        "tooltip.indexIdle": "索引未就绪，使用实时搜索",
        "search.placeholderGlobal": "全局搜索{type}...",
        "search.placeholderLocal": "搜索当前目录...",
        "search.type.file": "文件",
        "search.type.directory": "文件夹",
        "search.type.all": "文件和文件夹",
        "search.globalLabel": "全局",
        "search.engineIndex": "索引搜索",
        "search.engineWalk": "实时搜索",
        "status.indexReady": "索引",
        "status.indexing": "索引中",
        "status.indexIdle": "离线",
        "sidebar.quickAccess": "快捷访问",
        "sidebar.home": "家目录",
        "sidebar.desktop": "桌面",
        "sidebar.documents": "文档",
        "sidebar.downloads": "下载",
        "sidebar.drives": "磁盘",
        "state.loading": "加载中...",
        "state.globalSearching": "全局搜索中...",
        "state.emptySearch": "没有匹配的结果",
        "state.emptyDir": "空目录",
        "results.found": "找到 <strong>{count}</strong> 个结果",
        "results.truncated": "（已达上限，请缩小关键词）",
        "unit.ms": "ms",
        "fileRow.selectCurrent": "选择当前文件夹",
        "footer.unselectedFile": "未选择文件",
        "footer.unselectedDir": "未选择文件夹",
        "footer.selected": "已选择 <strong>{count}</strong> 项",
        "footer.cancel": "取消",
        "footer.confirm": "确认选择",
        "error.cannotConnect": "无法连接到后端服务，请确认后端已启动 (npm run dev)",
        "error.network": "网络错误: {message}。请确认后端服务已启动。",
        "error.searchFailed": "搜索请求失败",
        "mkdir.title": "新建文件夹",
        "mkdir.parentLabel": "位置",
        "mkdir.nameLabel": "文件夹名",
        "mkdir.namePlaceholder": "请输入文件夹名",
        "mkdir.hintExists": "已存在同名项目",
        "mkdir.hintOk": "可用",
        "mkdir.cancel": "取消",
        "mkdir.confirm": "创建",
        "mkdir.success": "已创建: {name}",
        "mkdir.createdToast": "已创建文件夹"
      },
      "en-US": {
        "modal.title.file": "Select File",
        "modal.title.directory": "Select Folder",
        "modal.close": "Close",
        "modal.up": "Up",
        "modal.home": "Home",
        "modal.newFolder": "New Folder",
        "tooltip.back": "Go to parent directory",
        "tooltip.home": "Home directory",
        "tooltip.refresh": "Refresh",
        "tooltip.newFolder": "Create a new folder in the current directory",
        "tooltip.globalSearchOn": "Global search: search across the entire disk",
        "tooltip.globalSearchOff": "Current folder search: filter within current folder only",
        "tooltip.indexReady": "Index ready, {totalFiles} items total, scanned: {scannedRoots}",
        "tooltip.indexing": "Building index... {indexedFiles} items, current: {currentDir}",
        "tooltip.indexIdle": "Index not ready, using live search",
        "search.placeholderGlobal": "Global search {type}...",
        "search.placeholderLocal": "Search current folder...",
        "search.type.file": "files",
        "search.type.directory": "folders",
        "search.type.all": "files and folders",
        "search.globalLabel": "Global",
        "search.engineIndex": "Index search",
        "search.engineWalk": "Live search",
        "status.indexReady": "Index",
        "status.indexing": "Indexing",
        "status.indexIdle": "Offline",
        "sidebar.quickAccess": "Quick Access",
        "sidebar.home": "Home",
        "sidebar.desktop": "Desktop",
        "sidebar.documents": "Documents",
        "sidebar.downloads": "Downloads",
        "sidebar.drives": "Drives",
        "state.loading": "Loading...",
        "state.globalSearching": "Global searching...",
        "state.emptySearch": "No matching results",
        "state.emptyDir": "Empty folder",
        "results.found": "Found <strong>{count}</strong> results",
        "results.truncated": "(limit reached, please narrow keywords)",
        "unit.ms": "ms",
        "fileRow.selectCurrent": "Select current folder",
        "footer.unselectedFile": "No file selected",
        "footer.unselectedDir": "No folder selected",
        "footer.selected": "<strong>{count}</strong> item(s) selected",
        "footer.cancel": "Cancel",
        "footer.confirm": "Confirm Selection",
        "error.cannotConnect": "Cannot connect to backend service, please make sure it is started (npm run dev)",
        "error.network": "Network error: {message}. Please make sure the backend service is running.",
        "error.searchFailed": "Search request failed",
        "mkdir.title": "New Folder",
        "mkdir.parentLabel": "Location",
        "mkdir.nameLabel": "Folder name",
        "mkdir.namePlaceholder": "Enter a folder name",
        "mkdir.hintExists": "A folder with this name already exists",
        "mkdir.hintOk": "Available",
        "mkdir.cancel": "Cancel",
        "mkdir.confirm": "Create",
        "mkdir.success": "Created: {name}",
        "mkdir.createdToast": "Folder created"
      }
    }, i = d, S = j, oe = x(() => ({ ...z[i.locale] || z[we], ...i.messages || {} }));
    function l(t, e = {}) {
      let a = oe.value[t];
      return a == null && (a = z[we][t] ?? t), a.replace(/\{(\w+)\}/g, (c, w) => e[w] ?? `{${w}}`);
    }
    const J = x(() => i.mode === "file" ? i.theme === "light" ? "#3b82f6" : "#6c8cff" : "#a78bfa"), Y = u(!1), A = u(""), p = u(""), E = u(null), ee = u([]), f = u([]), b = u(""), G = u([]), $ = u(""), _ = u(!1), O = u(!1), D = u([]), V = u(!1), U = u(0), te = u(""), k = u({ status: "idle", totalFiles: 0, indexedFiles: 0, currentDir: "", scannedRoots: [] });
    let T = null;
    const N = u(!1), C = u(""), y = u(""), ae = u(""), P = u(!1), q = u(null), ne = x(() => $.value ? $.value + "\\Desktop" : ""), re = x(() => $.value ? $.value + "\\Documents" : ""), ie = x(() => $.value ? $.value + "\\Downloads" : ""), I = x(() => _.value && D.value.length > 0), ce = x(() => {
      if (!C.value.trim() || y.value) return "";
      const t = ee.value.some((e) => e.name.toLowerCase() === C.value.trim().toLowerCase());
      return l(t ? "mkdir.hintExists" : "mkdir.hintOk");
    }), de = x(() => {
      if (I.value) {
        let a = D.value;
        return i.mode === "directory" && (a = a.filter((c) => c.kind === "directory")), a;
      }
      let t = ee.value;
      if (i.mode === "directory" && (t = t.filter((a) => a.kind === "directory")), !b.value) return t;
      const e = b.value.toLowerCase();
      return t.filter((a) => a.name.toLowerCase().includes(e));
    }), le = x(() => {
      if (!p.value) return [];
      const t = p.value.split(/[/\\]/).filter(Boolean);
      return t.map((e, a) => {
        let c;
        return a === 0 && /^[A-Za-z]:$/.test(e) ? c = e + "\\" : c = t.slice(0, a + 1).join("\\"), { label: e, path: c };
      });
    });
    async function xe() {
      try {
        const t = await fetch(`${i.apiBase}/fs/home`);
        if (!t.ok) throw new Error(`HTTP ${t.status}`);
        const e = await t.json();
        return $.value = e.home, e.home;
      } catch (t) {
        return console.warn("[fetchHome] 获取家目录失败:", t.message), "";
      }
    }
    async function Se() {
      try {
        const t = await fetch(`${i.apiBase}/fs/drives`);
        if (!t.ok) throw new Error(`HTTP ${t.status}`);
        const e = await t.json();
        G.value = e.drives || [];
      } catch (t) {
        console.warn("[fetchDrives] 获取盘符失败:", t.message), G.value = [];
      }
    }
    async function ue() {
      try {
        const t = await fetch(`${i.apiBase}/fs/index-status`);
        if (!t.ok) return;
        const e = await t.json();
        k.value = e;
      } catch {
      }
    }
    async function R(t) {
      Y.value = !0, A.value = "";
      try {
        const e = new URLSearchParams();
        t && e.set("dir", t);
        const a = await fetch(`${i.apiBase}/fs/list?${e}`);
        if (!a.ok) {
          let w = `HTTP ${a.status}`;
          try {
            w = (await a.json()).error || w;
          } catch {
            w = l("error.cannotConnect");
          }
          A.value = w;
          return;
        }
        const c = await a.json();
        p.value = c.currentPath, E.value = c.parentPath, ee.value = c.items || [];
      } catch (e) {
        A.value = l("error.network", { message: e.message });
      } finally {
        Y.value = !1;
      }
    }
    function Ce() {
      if (I.value) {
        B();
        return;
      }
      E.value && R(E.value);
    }
    function ve() {
      $.value && H($.value);
    }
    function H(t) {
      b.value = "", B(), R(t);
    }
    function Me(t) {
      const e = le.value[t]?.path;
      e && e !== p.value && H(e);
    }
    function $e() {
      I.value && b.value ? Z(b.value) : R(p.value);
    }
    function he(t) {
      return f.value.includes(t);
    }
    function L(t) {
      if (!i.multiple) {
        f.value = f.value[0] === t ? [] : [t];
        return;
      }
      const e = f.value.indexOf(t);
      e >= 0 ? f.value.splice(e, 1) : f.value.push(t);
    }
    function De() {
      f.value = [];
    }
    function fe(t, e) {
      t.kind === "directory" ? (i.mode, L(t.path)) : i.mode === "file" && L(t.path);
    }
    function me(t) {
      if (!i.multiple) {
        fe(t);
        return;
      }
      (t.kind === "directory" || i.mode === "file") && L(t.path);
    }
    function Fe(t) {
      t.kind === "directory" && H(t.path);
    }
    function ze() {
      f.value.length > 0 && S("confirm", [...f.value]);
    }
    function Le() {
      _.value = !_.value, _.value ? b.value && Z(b.value) : B();
    }
    function B() {
      T && (T.abort(), T = null), D.value = [], V.value = !1, U.value = 0, O.value = !1;
    }
    function Te() {
      b.value = "", _.value && B();
    }
    function Pe() {
      _.value && b.value.trim() && Z(b.value.trim());
    }
    let se = null;
    ke(b, (t) => {
      if (_.value) {
        if (se && clearTimeout(se), !t.trim()) {
          B();
          return;
        }
        se = setTimeout(() => {
          Z(t.trim());
        }, 500);
      }
    });
    async function Z(t) {
      T && T.abort(), T = new AbortController(), O.value = !0, D.value = [], V.value = !1, U.value = 0;
      try {
        const e = new URLSearchParams({
          q: t,
          mode: i.mode === "directory" ? "directory" : i.mode === "file" ? "file" : "all",
          limit: "200"
        }), a = await fetch(`${i.apiBase}/fs/search?${e}`, {
          signal: T.signal
        });
        if (!a.ok) {
          let w = `HTTP ${a.status}`;
          try {
            w = (await a.json()).error || w;
          } catch {
            w = l("error.searchFailed");
          }
          D.value = [], O.value = !1;
          return;
        }
        const c = await a.json();
        D.value = c.items || [], V.value = c.truncated || !1, U.value = c.elapsed || 0, te.value = c.engine || "";
      } catch (e) {
        if (e.name === "AbortError") return;
        console.warn("[globalSearch] 搜索失败:", e.message), D.value = [];
      } finally {
        O.value = !1;
      }
    }
    function Ie(t) {
      if (!t) return "";
      const e = t.replace(/[/\\]/g, "/").split("/");
      return e.pop(), e.join("/");
    }
    async function He() {
      try {
        await fetch(`${i.apiBase}/fs/reindex`, { method: "POST" }), k.value = { ...k.value, status: "indexing" };
        const t = setInterval(async () => {
          await ue(), (k.value.status === "ready" || k.value.status === "error") && clearInterval(t);
        }, 2e3);
      } catch {
      }
    }
    function Be() {
      I.value || p.value && (N.value = !0, C.value = "", y.value = "", ae.value = p.value, Ee(() => {
        q.value && typeof q.value.focus == "function" && q.value.focus();
      }));
    }
    function K() {
      P.value || (N.value = !1, C.value = "", y.value = "");
    }
    async function pe() {
      const t = C.value.trim();
      if (!t) {
        y.value = l("error.invalidName") || "名称不能为空";
        return;
      }
      if (!P.value) {
        P.value = !0, y.value = "";
        try {
          const e = await fetch(`${i.apiBase}/fs/mkdir`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ parent: p.value, name: t })
          }), a = await e.json().catch(() => ({}));
          if (!e.ok) {
            y.value = a.error || `HTTP ${e.status}`;
            return;
          }
          N.value = !1, C.value = "", y.value = "", S("created", { path: a.path, name: a.name, parent: p.value }), await R(p.value), i.autoSelectOnMkdir && a.path && (i.multiple ? f.value.includes(a.path) || f.value.push(a.path) : f.value = [a.path]);
        } catch (e) {
          y.value = l("error.network", { message: e.message });
        } finally {
          P.value = !1;
        }
      }
    }
    function be(t) {
      if (!t || t === 0) return "0 B";
      const e = 1024, a = ["B", "KB", "MB", "GB"], c = Math.floor(Math.log(t) / Math.log(e));
      return `${parseFloat((t / Math.pow(e, c)).toFixed(2))} ${a[c]}`;
    }
    function je(t) {
      if (!t) return "";
      const e = new Date(t);
      return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")} ${String(e.getHours()).padStart(2, "0")}:${String(e.getMinutes()).padStart(2, "0")}`;
    }
    function Ae(t) {
      if (t.kind === "directory") return "#a78bfa";
      const e = (t.ext || "").replace(".", "");
      return qe(e);
    }
    return ke(() => i.visible, async (t) => {
      if (t) {
        f.value = [], b.value = "", A.value = "", N.value = !1, C.value = "", y.value = "", B();
        const e = await xe();
        await Se(), await ue(), await R(e || "");
      } else
        B(), N.value = !1;
    }), (t, e) => (n(), Oe(Re, { to: "body" }, [
      d.visible ? (n(), r("div", {
        key: 0,
        class: "modal-overlay",
        onClick: e[11] || (e[11] = F((a) => t.$emit("close"), ["self"]))
      }, [
        s("div", {
          class: M(["modal-container", { "modal-theme-light": d.theme === "light" }])
        }, [
          s("div", Xe, [
            s("h3", Qe, [
              v(h, {
                name: d.mode === "file" ? "file" : "folder",
                size: 18,
                color: J.value
              }, null, 8, ["name", "color"]),
              g(" " + o(l(d.mode === "file" ? "modal.title.file" : "modal.title.directory")), 1)
            ]),
            s("button", {
              class: "close-btn",
              onClick: e[0] || (e[0] = (a) => t.$emit("close")),
              title: l("modal.close")
            }, [
              v(h, {
                name: "close",
                size: 16
              })
            ], 8, Je)
          ]),
          s("div", Ye, [
            s("button", {
              class: "tool-btn",
              onClick: Ce,
              disabled: !E.value,
              title: l("tooltip.back")
            }, [
              v(h, {
                name: "arrowUp",
                size: 14
              }),
              g(" " + o(l("modal.up")), 1)
            ], 8, et),
            s("button", {
              class: "tool-btn",
              onClick: ve,
              title: l("tooltip.home")
            }, [
              v(h, {
                name: "home",
                size: 14
              }),
              g(" " + o(l("modal.home")), 1)
            ], 8, tt),
            s("button", {
              class: "tool-btn",
              onClick: $e,
              title: l("tooltip.refresh")
            }, [
              v(h, {
                name: "refresh",
                size: 14
              })
            ], 8, at),
            d.enableMkdir && !I.value ? (n(), r("button", {
              key: 0,
              class: "tool-btn",
              onClick: Be,
              title: l("tooltip.newFolder")
            }, [
              v(h, {
                name: "folderPlus",
                size: 14
              }),
              g(" " + o(l("modal.newFolder")), 1)
            ], 8, lt)) : m("", !0),
            s("div", st, [
              (n(!0), r(X, null, Q(le.value, (a, c) => (n(), r("span", {
                key: c,
                class: "breadcrumb-item",
                onClick: (w) => Me(c)
              }, [
                s("span", nt, o(a.label), 1),
                c < le.value.length - 1 ? (n(), r("span", rt, "/")) : m("", !0)
              ], 8, ot))), 128))
            ])
          ]),
          s("div", it, [
            v(h, {
              name: "search",
              size: 16,
              color: "#8b91a8",
              class: "search-icon"
            }),
            ge(s("input", {
              "onUpdate:modelValue": e[1] || (e[1] = (a) => b.value = a),
              type: "text",
              class: "search-input",
              placeholder: _.value ? l("search.placeholderGlobal", { type: l("search.type." + (d.mode === "file" ? "file" : d.mode === "directory" ? "directory" : "all")) }) : l("search.placeholderLocal"),
              onKeydown: W(Pe, ["enter"])
            }, null, 40, ct), [
              [ye, b.value]
            ]),
            b.value ? (n(), r("button", {
              key: 0,
              class: "clear-search",
              onClick: Te
            }, [
              v(h, {
                name: "close",
                size: 14
              })
            ])) : m("", !0),
            s("div", {
              class: "global-toggle",
              title: _.value ? l("tooltip.globalSearchOn") : l("tooltip.globalSearchOff")
            }, [
              s("span", ut, o(l("search.globalLabel")), 1),
              s("button", {
                class: M(["toggle-switch", { active: _.value }]),
                onClick: Le
              }, [...e[12] || (e[12] = [
                s("span", { class: "toggle-knob" }, null, -1)
              ])], 2)
            ], 8, dt),
            _.value ? (n(), r("div", {
              key: 1,
              class: M(["index-status", k.value.status]),
              title: k.value.status === "ready" ? l("tooltip.indexReady", {
                totalFiles: k.value.totalFiles,
                scannedRoots: (k.value.scannedRoots || []).join(", ") || "unknown"
              }) : k.value.status === "indexing" ? l("tooltip.indexing", {
                indexedFiles: k.value.indexedFiles,
                currentDir: k.value.currentDir || ""
              }) : l("tooltip.indexIdle"),
              onClick: e[2] || (e[2] = (a) => k.value.status !== "indexing" && He())
            }, [
              e[13] || (e[13] = s("span", { class: "status-dot" }, null, -1)),
              s("span", ht, o(k.value.status === "ready" ? l("status.indexReady") : k.value.status === "indexing" ? l("status.indexing") : l("status.indexIdle")), 1)
            ], 10, vt)) : m("", !0)
          ]),
          s("div", ft, [
            s("div", mt, [
              s("div", pt, [
                s("div", bt, o(l("sidebar.quickAccess")), 1),
                s("div", {
                  class: "sidebar-item",
                  onClick: ve
                }, [
                  v(h, {
                    name: "home",
                    size: 15
                  }),
                  g(" " + o(l("sidebar.home")), 1)
                ]),
                ne.value ? (n(), r("div", {
                  key: 0,
                  class: "sidebar-item",
                  onClick: e[3] || (e[3] = (a) => H(ne.value))
                }, [
                  v(h, {
                    name: "monitor",
                    size: 15
                  }),
                  g(" " + o(l("sidebar.desktop")), 1)
                ])) : m("", !0),
                re.value ? (n(), r("div", {
                  key: 1,
                  class: "sidebar-item",
                  onClick: e[4] || (e[4] = (a) => H(re.value))
                }, [
                  v(h, {
                    name: "file",
                    size: 15
                  }),
                  g(" " + o(l("sidebar.documents")), 1)
                ])) : m("", !0),
                ie.value ? (n(), r("div", {
                  key: 2,
                  class: "sidebar-item",
                  onClick: e[5] || (e[5] = (a) => H(ie.value))
                }, [
                  v(h, {
                    name: "download",
                    size: 15
                  }),
                  g(" " + o(l("sidebar.downloads")), 1)
                ])) : m("", !0)
              ]),
              G.value.length ? (n(), r("div", kt, [
                s("div", gt, o(l("sidebar.drives")), 1),
                (n(!0), r(X, null, Q(G.value, (a) => (n(), r("div", {
                  key: a,
                  class: M(["sidebar-item", { active: p.value === a }]),
                  onClick: (c) => H(a)
                }, [
                  v(h, {
                    name: "hardDrive",
                    size: 15
                  }),
                  g(" " + o(a), 1)
                ], 10, yt))), 128))
              ])) : m("", !0)
            ]),
            s("div", {
              class: "file-list-container",
              onClick: F(De, ["self"])
            }, [
              Y.value ? (n(), r("div", wt, [
                e[14] || (e[14] = s("span", { class: "spinner" }, null, -1)),
                g(" " + o(l("state.loading")), 1)
              ])) : A.value ? (n(), r("div", _t, [
                v(h, {
                  name: "circleX",
                  size: 18,
                  color: "currentColor"
                }),
                g(" " + o(A.value), 1)
              ])) : O.value ? (n(), r("div", xt, [
                e[15] || (e[15] = s("span", { class: "spinner" }, null, -1)),
                g(" " + o(l("state.globalSearching")), 1)
              ])) : de.value.length === 0 ? (n(), r("div", St, o(b.value ? l("state.emptySearch") : l("state.emptyDir")), 1)) : (n(), r("div", Ct, [
                D.value.length > 0 ? (n(), r("div", Mt, [
                  v(h, {
                    name: "search",
                    size: 14,
                    color: "#8b91a8"
                  }),
                  s("span", {
                    innerHTML: l("results.found", { count: D.value.length })
                  }, null, 8, $t),
                  V.value ? (n(), r("span", Dt, o(l("results.truncated")), 1)) : m("", !0),
                  s("span", {
                    class: M(["engine-badge", te.value])
                  }, o(te.value === "index" ? l("search.engineIndex") : l("search.engineWalk")), 3),
                  s("span", Ft, o(U.value) + o(l("unit.ms")), 1)
                ])) : m("", !0),
                d.mode === "directory" && !I.value ? (n(), r("div", {
                  key: 1,
                  class: M(["file-row select-current-dir", { selected: he(p.value) }]),
                  onClick: [
                    e[6] || (e[6] = F((a) => L(p.value), ["exact"])),
                    e[7] || (e[7] = F((a) => L(p.value), ["ctrl"])),
                    e[8] || (e[8] = F((a) => L(p.value), ["meta"]))
                  ]
                }, [
                  v(h, {
                    name: "circleCheck",
                    size: 18,
                    color: "#a78bfa",
                    class: "file-icon"
                  }),
                  s("span", zt, o(l("fileRow.selectCurrent")), 1),
                  s("span", Lt, o(p.value), 1)
                ], 2)) : m("", !0),
                (n(!0), r(X, null, Q(de.value, (a) => (n(), r("div", {
                  key: a.path,
                  class: M(["file-row", {
                    selected: he(a.path),
                    "is-directory": a.kind === "directory"
                  }]),
                  onClick: [
                    F((c) => fe(a), ["exact"]),
                    F((c) => me(a), ["ctrl"]),
                    F((c) => me(a), ["meta"])
                  ],
                  onDblclick: (c) => Fe(a)
                }, [
                  v(h, {
                    name: a.kind === "directory" ? "folder" : "file",
                    size: 18,
                    color: Ae(a),
                    class: "file-icon"
                  }, null, 8, ["name", "color"]),
                  s("span", {
                    class: "file-name",
                    title: a.name
                  }, o(a.name), 9, Pt),
                  I.value ? (n(), r("span", {
                    key: 0,
                    class: "file-parent-path",
                    title: a.path
                  }, o(Ie(a.path)), 9, It)) : m("", !0),
                  a.kind === "file" ? (n(), r("span", {
                    key: 1,
                    class: "file-size",
                    title: be(a.size)
                  }, o(be(a.size)), 9, Ht)) : m("", !0),
                  a.modified ? (n(), r("span", {
                    key: 2,
                    class: "file-modified",
                    title: a.modified
                  }, o(je(a.modified)), 9, Bt)) : m("", !0)
                ], 42, Tt))), 128))
              ]))
            ])
          ]),
          s("div", jt, [
            s("div", At, [
              f.value.length === 0 ? (n(), r("span", Nt, o(l(d.mode === "file" ? "footer.unselectedFile" : "footer.unselectedDir")), 1)) : d.multiple ? (n(), r("span", Rt, [
                s("span", {
                  innerHTML: l("footer.selected", { count: f.value.length })
                }, null, 8, Et)
              ])) : (n(), r("span", {
                key: 1,
                class: "has-selection single-path",
                title: f.value[0]
              }, o(f.value[0]), 9, Ot))
            ]),
            s("div", Gt, [
              s("button", {
                class: "btn btn-cancel",
                onClick: e[9] || (e[9] = (a) => t.$emit("close"))
              }, o(l("footer.cancel")), 1),
              s("button", {
                class: "btn btn-confirm",
                disabled: f.value.length === 0,
                onClick: ze
              }, o(l("footer.confirm")), 9, Vt)
            ])
          ]),
          N.value ? (n(), r("div", {
            key: 0,
            class: "mkdir-overlay",
            onClick: F(K, ["self"]),
            onKeydown: W(K, ["esc"])
          }, [
            s("div", {
              class: M(["mkdir-dialog", { "modal-theme-light": d.theme === "light" }])
            }, [
              s("div", Ut, [
                v(h, {
                  name: "folderPlus",
                  size: 18,
                  color: "#a78bfa"
                }),
                s("span", qt, o(l("mkdir.title")), 1)
              ]),
              s("div", Zt, [
                s("label", Kt, o(l("mkdir.parentLabel")), 1),
                s("div", {
                  class: "mkdir-parent-path",
                  title: ae.value
                }, o(ae.value), 9, Wt),
                s("label", Xt, o(l("mkdir.nameLabel")), 1),
                ge(s("input", {
                  id: "mkdir-name-input",
                  ref_key: "mkdirNameInput",
                  ref: q,
                  "onUpdate:modelValue": e[10] || (e[10] = (a) => C.value = a),
                  type: "text",
                  class: M(["mkdir-input", { "has-error": y.value }]),
                  placeholder: l("mkdir.namePlaceholder"),
                  onKeydown: [
                    W(pe, ["enter"]),
                    W(K, ["esc"])
                  ],
                  maxlength: "255"
                }, null, 42, Qt), [
                  [ye, C.value]
                ]),
                y.value ? (n(), r("div", Jt, [
                  v(h, {
                    name: "circleX",
                    size: 14,
                    color: "currentColor"
                  }),
                  s("span", null, o(y.value), 1)
                ])) : ce.value ? (n(), r("div", Yt, o(ce.value), 1)) : m("", !0)
              ]),
              s("div", ea, [
                s("button", {
                  class: "btn btn-cancel",
                  onClick: K,
                  disabled: P.value
                }, o(l("mkdir.cancel")), 9, ta),
                s("button", {
                  class: "btn btn-confirm",
                  disabled: !C.value.trim() || P.value,
                  onClick: pe
                }, [
                  P.value ? (n(), r("span", la)) : m("", !0),
                  g(" " + o(l("mkdir.confirm")), 1)
                ], 8, aa)
              ])
            ], 2)
          ], 32)) : m("", !0)
        ], 2)
      ])) : m("", !0)
    ]));
  }
}, na = /* @__PURE__ */ _e(sa, [["__scopeId", "data-v-6b779d4c"]]);
export {
  na as FilePickerModal,
  h as SvgIcon,
  qe as getFileTypeColor,
  Ge as icons
};
