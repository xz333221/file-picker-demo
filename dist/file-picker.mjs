import { computed as S, openBlock as r, createElementBlock as n, normalizeClass as x, Fragment as he, renderList as me, ref as d, watch as ue, createBlock as tt, Teleport as at, withModifiers as I, createElementVNode as s, createVNode as v, createTextVNode as $, toDisplayString as o, createCommentVNode as k, withDirectives as fe, withKeys as U, vModelText as ve, nextTick as Fe } from "vue";
const lt = {
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
}, st = {
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
}, ot = "#8b91a8";
function rt(u) {
  return st[u] || ot;
}
const Ie = (u, V) => {
  const B = u.__vccOpts || u;
  for (const [i, C] of V)
    B[i] = C;
  return B;
}, nt = ["width", "height", "stroke"], it = ["d"], ct = {
  __name: "SvgIcon",
  props: {
    name: { type: String, required: !0 },
    size: { type: [Number, String], default: 18 },
    color: { type: String, default: "currentColor" },
    class: { type: String, default: "" }
  },
  setup(u) {
    const V = u, B = S(() => V.class), i = S(() => {
      const C = lt[V.name];
      return C ? Array.isArray(C) ? C : [C] : [];
    });
    return (C, pe) => (r(), n("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: u.size,
      height: u.size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: u.color,
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      class: x(["svg-icon", B.value]),
      "aria-hidden": "true"
    }, [
      (r(!0), n(he, null, me(i.value, (l, se) => (r(), n("path", {
        key: se,
        d: l
      }, null, 8, it))), 128))
    ], 10, nt));
  }
}, h = /* @__PURE__ */ Ie(ct, [["__scopeId", "data-v-5461fefd"]]), dt = { class: "modal-header" }, ut = { class: "modal-title" }, ft = ["title"], vt = { class: "toolbar" }, ht = ["disabled", "title"], mt = ["title"], pt = ["title"], kt = ["title"], bt = ["placeholder", "title"], gt = ["title"], yt = { class: "search-bar" }, wt = ["placeholder"], _t = ["title"], xt = { class: "toggle-label" }, St = ["title"], Ct = { class: "status-text" }, Mt = { class: "modal-body" }, $t = { class: "sidebar" }, zt = { class: "sidebar-section" }, Dt = { class: "sidebar-title" }, Ft = {
  key: 0,
  class: "sidebar-section"
}, Pt = { class: "sidebar-title" }, It = ["onClick"], Bt = {
  key: 0,
  class: "loading-state"
}, Tt = {
  key: 1,
  class: "error-state"
}, At = {
  key: 2,
  class: "loading-state"
}, Lt = {
  key: 3,
  class: "empty-state"
}, Et = {
  key: 4,
  class: "file-list"
}, Ht = {
  key: 0,
  class: "search-results-info"
}, Rt = ["innerHTML"], jt = {
  key: 0,
  class: "truncated-hint"
}, Nt = { class: "elapsed-hint" }, Ot = { class: "file-name" }, Vt = { class: "file-path-hint" }, Gt = ["onClick", "onDblclick"], Ut = ["title"], Zt = ["title"], Wt = ["title"], qt = ["title"], Kt = { class: "modal-footer" }, Xt = { class: "selected-info" }, Qt = {
  key: 0,
  class: "no-selection"
}, Jt = ["title"], Yt = {
  key: 2,
  class: "has-selection"
}, ea = ["innerHTML"], ta = { class: "footer-actions" }, aa = ["disabled"], la = { class: "mkdir-header" }, sa = { class: "mkdir-title" }, oa = { class: "mkdir-body" }, ra = { class: "mkdir-label" }, na = ["title"], ia = {
  class: "mkdir-label",
  for: "mkdir-name-input"
}, ca = ["placeholder"], da = {
  key: 0,
  class: "mkdir-error"
}, ua = {
  key: 1,
  class: "mkdir-hint"
}, fa = { class: "mkdir-footer" }, va = ["disabled"], ha = ["disabled"], ma = {
  key: 0,
  class: "spinner",
  style: { width: "12px", height: "12px", "border-width": "2px", "margin-right": "6px" }
}, Pe = "zh-CN", pa = {
  __name: "FilePickerModal",
  props: {
    visible: { type: Boolean, default: !1 },
    mode: { type: String, default: "file" },
    // 'file' | 'directory'
    multiple: { type: Boolean, default: !1 },
    // 是否允许多选，默认单选
    theme: { type: String, default: "dark" },
    // 'dark' | 'light'
    defaultPath: { type: String, default: "" },
    // 打开弹窗时的默认目录，空则使用客户端用户目录
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
  setup(u, { emit: V }) {
    const B = {
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
        "address.title": "输入目录路径后按回车跳转（支持相对路径，如 ..\\foo）",
        "address.placeholder": "输入目录路径后按回车跳转…",
        "address.errorEmpty": "请输入路径",
        "address.errorInvalid": "无法访问该目录: {path}",
        "address.errorInvalidDefault": "defaultPath 指定的目录无效或不可访问，已回落到用户目录",
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
        "address.title": "Type a directory path and press Enter to navigate (relative paths like ..\\foo are supported)",
        "address.placeholder": "Type a directory path and press Enter…",
        "address.errorEmpty": "Please enter a path",
        "address.errorInvalid": "Cannot access directory: {path}",
        "address.errorInvalidDefault": "The defaultPath directory is invalid or inaccessible, fell back to user home",
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
    }, i = u, C = V, pe = S(() => ({ ...B[i.locale] || B[Pe], ...i.messages || {} }));
    function l(a, e = {}) {
      let t = pe.value[a];
      return t == null && (t = B[Pe][a] ?? a), t.replace(/\{(\w+)\}/g, (c, f) => e[f] ?? `{${f}}`);
    }
    const se = S(() => i.mode === "file" ? i.theme === "light" ? "#3b82f6" : "#6c8cff" : "#a78bfa"), oe = d(!1), z = d(""), m = d(""), K = d(null), re = d([]), p = d([]), b = d(""), X = d([]), D = d(""), _ = d(!1), Z = d(!1), F = d([]), Q = d(!1), J = d(0), ne = d(""), g = d({ status: "idle", totalFiles: 0, indexedFiles: 0, currentDir: "", scannedRoots: [] });
    let L = null;
    const G = d(!1), M = d(""), w = d(""), ie = d(""), E = d(!1), Y = d(null), T = d(""), y = d(""), H = d(null);
    let ce = !1;
    const ke = S(() => D.value ? D.value + "\\Desktop" : ""), be = S(() => D.value ? D.value + "\\Documents" : ""), ge = S(() => D.value ? D.value + "\\Downloads" : ""), R = S(() => _.value && F.value.length > 0), ye = S(() => {
      if (!M.value.trim() || w.value) return "";
      const a = re.value.some((e) => e.name.toLowerCase() === M.value.trim().toLowerCase());
      return l(a ? "mkdir.hintExists" : "mkdir.hintOk");
    }), we = S(() => {
      if (R.value) {
        let t = F.value;
        return i.mode === "directory" && (t = t.filter((c) => c.kind === "directory")), t;
      }
      let a = re.value;
      if (i.mode === "directory" && (a = a.filter((t) => t.kind === "directory")), !b.value) return a;
      const e = b.value.toLowerCase();
      return a.filter((t) => t.name.toLowerCase().includes(e));
    });
    S(() => {
      if (!m.value) return [];
      const a = m.value.split(/[/\\]/).filter(Boolean);
      return a.map((e, t) => {
        let c;
        return t === 0 && /^[A-Za-z]:$/.test(e) ? c = e + "\\" : c = a.slice(0, t + 1).join("\\"), { label: e, path: c };
      });
    });
    async function Be() {
      try {
        const a = await fetch(`${i.apiBase}/fs/home`);
        if (!a.ok) throw new Error(`HTTP ${a.status}`);
        const e = await a.json();
        return D.value = e.home, e.home;
      } catch (a) {
        return console.warn("[fetchHome] 获取家目录失败:", a.message), "";
      }
    }
    async function Te() {
      try {
        const a = await fetch(`${i.apiBase}/fs/drives`);
        if (!a.ok) throw new Error(`HTTP ${a.status}`);
        const e = await a.json();
        X.value = e.drives || [];
      } catch (a) {
        console.warn("[fetchDrives] 获取盘符失败:", a.message), X.value = [];
      }
    }
    async function _e() {
      try {
        const a = await fetch(`${i.apiBase}/fs/index-status`);
        if (!a.ok) return;
        const e = await a.json();
        g.value = e;
      } catch {
      }
    }
    async function W(a) {
      oe.value = !0, z.value = "";
      try {
        const e = new URLSearchParams();
        a && e.set("dir", a);
        const t = await fetch(`${i.apiBase}/fs/list?${e}`);
        if (!t.ok) {
          let f = `HTTP ${t.status}`;
          try {
            f = (await t.json()).error || f;
          } catch {
            f = l("error.cannotConnect");
          }
          z.value = f;
          return;
        }
        const c = await t.json();
        m.value = c.currentPath, K.value = c.parentPath, re.value = c.items || [];
      } catch (e) {
        z.value = l("error.network", { message: e.message });
      } finally {
        oe.value = !1;
      }
    }
    function Ae() {
      if (R.value) {
        N();
        return;
      }
      K.value && W(K.value);
    }
    function xe() {
      D.value && j(D.value);
    }
    function j(a) {
      b.value = "", N(), W(a);
    }
    function Se(a, e) {
      if (!a) return e || "";
      let t = String(a).trim();
      if (!t) return e || "";
      if ((e || "").includes("\\") || /^[A-Za-z]:[\\\/]/.test(e || "") || /^[A-Za-z]:[\\\/]/.test(t) || t.startsWith("\\\\") || typeof navigator < "u" && /Win/i.test(navigator.platform || "")) {
        if (/^[A-Za-z]:/.test(t)) {
          let P = t.replace(/\//g, "\\");
          return /^[A-Za-z]:\\?$/.test(P) && (P = P.replace(/\\?$/, "\\")), P;
        }
        if (t.startsWith("\\\\")) return t.replace(/\//g, "\\");
        if (t === "\\" && /^[A-Za-z]:/.test(e || ""))
          return (e || "").split("\\")[0] + "\\";
        if (!e) return t;
        const O = e.split("\\"), et = t.split(/[\\\/]/).filter(Boolean), le = [...O];
        for (const P of et)
          !P || P === "." || (P === ".." ? le.length > 1 && le.pop() : le.push(P));
        return le.join("\\");
      }
      if (t.startsWith("/"))
        return t.replace(/\\/g, "/").replace(/\/+/g, "/");
      if (!e) return t;
      const f = e.split("/").filter(Boolean), q = t.split(/[\\\/]/).filter(Boolean), ae = [...f];
      for (const O of q)
        !O || O === "." || (O === ".." ? ae.length > 0 && ae.pop() : ae.push(O));
      return "/" + ae.join("/");
    }
    async function Le() {
      const a = T.value.trim();
      if (!a) {
        y.value = l("address.errorEmpty");
        return;
      }
      const e = Se(a, m.value);
      z.value = "", y.value = "";
      try {
        const t = await fetch(
          `${i.apiBase}/fs/list?dir=${encodeURIComponent(e)}`
        );
        if (!t.ok) {
          let c = "";
          try {
            const f = await t.json();
            c = f && f.error ? f.error : "";
          } catch {
          }
          y.value = c || l("address.errorInvalid", { path: e });
          return;
        }
        T.value = e, await j(e);
      } catch (t) {
        y.value = l("error.network", { message: t.message });
      }
    }
    function Ee() {
      Le();
    }
    function He() {
      T.value = m.value || "", y.value = "", H.value && typeof H.value.blur == "function" && H.value.blur();
    }
    function Re() {
      ce = !0, Fe(() => {
        H.value && typeof H.value.select == "function" && H.value.select();
      });
    }
    function je() {
      ce = !1, y.value || (T.value = m.value || "");
    }
    function Ne() {
      y.value = "";
    }
    ue(m, (a) => {
      ce || (T.value = a || ""), y.value && (y.value = "");
    });
    function Oe() {
      R.value && b.value ? ee(b.value) : W(m.value);
    }
    function Ce(a) {
      return p.value.includes(a);
    }
    function A(a) {
      if (!i.multiple) {
        p.value = p.value[0] === a ? [] : [a];
        return;
      }
      const e = p.value.indexOf(a);
      e >= 0 ? p.value.splice(e, 1) : p.value.push(a);
    }
    function Ve() {
      p.value = [];
    }
    function Me(a, e) {
      a.kind === "directory" ? (i.mode, A(a.path)) : i.mode === "file" && A(a.path);
    }
    function $e(a) {
      if (!i.multiple) {
        Me(a);
        return;
      }
      (a.kind === "directory" || i.mode === "file") && A(a.path);
    }
    function Ge(a) {
      a.kind === "directory" && j(a.path);
    }
    function Ue() {
      p.value.length > 0 && C("confirm", [...p.value]);
    }
    function Ze() {
      _.value = !_.value, _.value ? b.value && ee(b.value) : N();
    }
    function N() {
      L && (L.abort(), L = null), F.value = [], Q.value = !1, J.value = 0, Z.value = !1;
    }
    function We() {
      b.value = "", _.value && N();
    }
    function qe() {
      _.value && b.value.trim() && ee(b.value.trim());
    }
    let de = null;
    ue(b, (a) => {
      if (_.value) {
        if (de && clearTimeout(de), !a.trim()) {
          N();
          return;
        }
        de = setTimeout(() => {
          ee(a.trim());
        }, 500);
      }
    });
    async function ee(a) {
      L && L.abort(), L = new AbortController(), Z.value = !0, F.value = [], Q.value = !1, J.value = 0;
      try {
        const e = new URLSearchParams({
          q: a,
          mode: i.mode === "directory" ? "directory" : i.mode === "file" ? "file" : "all",
          limit: "200"
        }), t = await fetch(`${i.apiBase}/fs/search?${e}`, {
          signal: L.signal
        });
        if (!t.ok) {
          let f = `HTTP ${t.status}`;
          try {
            f = (await t.json()).error || f;
          } catch {
            f = l("error.searchFailed");
          }
          F.value = [], Z.value = !1;
          return;
        }
        const c = await t.json();
        F.value = c.items || [], Q.value = c.truncated || !1, J.value = c.elapsed || 0, ne.value = c.engine || "";
      } catch (e) {
        if (e.name === "AbortError") return;
        console.warn("[globalSearch] 搜索失败:", e.message), F.value = [];
      } finally {
        Z.value = !1;
      }
    }
    function Ke(a) {
      if (!a) return "";
      const e = a.replace(/[/\\]/g, "/").split("/");
      return e.pop(), e.join("/");
    }
    async function Xe() {
      try {
        await fetch(`${i.apiBase}/fs/reindex`, { method: "POST" }), g.value = { ...g.value, status: "indexing" };
        const a = setInterval(async () => {
          await _e(), (g.value.status === "ready" || g.value.status === "error") && clearInterval(a);
        }, 2e3);
      } catch {
      }
    }
    function Qe() {
      R.value || m.value && (G.value = !0, M.value = "", w.value = "", ie.value = m.value, Fe(() => {
        Y.value && typeof Y.value.focus == "function" && Y.value.focus();
      }));
    }
    function te() {
      E.value || (G.value = !1, M.value = "", w.value = "");
    }
    async function ze() {
      const a = M.value.trim();
      if (!a) {
        w.value = l("error.invalidName") || "名称不能为空";
        return;
      }
      if (!E.value) {
        E.value = !0, w.value = "";
        try {
          const e = await fetch(`${i.apiBase}/fs/mkdir`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ parent: m.value, name: a })
          }), t = await e.json().catch(() => ({}));
          if (!e.ok) {
            w.value = t.error || `HTTP ${e.status}`;
            return;
          }
          G.value = !1, M.value = "", w.value = "", C("created", { path: t.path, name: t.name, parent: m.value }), await W(m.value), i.autoSelectOnMkdir && t.path && (i.multiple ? p.value.includes(t.path) || p.value.push(t.path) : p.value = [t.path]);
        } catch (e) {
          w.value = l("error.network", { message: e.message });
        } finally {
          E.value = !1;
        }
      }
    }
    function De(a) {
      if (!a || a === 0) return "0 B";
      const e = 1024, t = ["B", "KB", "MB", "GB"], c = Math.floor(Math.log(a) / Math.log(e));
      return `${parseFloat((a / Math.pow(e, c)).toFixed(2))} ${t[c]}`;
    }
    function Je(a) {
      if (!a) return "";
      const e = new Date(a);
      return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")} ${String(e.getHours()).padStart(2, "0")}:${String(e.getMinutes()).padStart(2, "0")}`;
    }
    function Ye(a) {
      if (a.kind === "directory") return "#a78bfa";
      const e = (a.ext || "").replace(".", "");
      return rt(e);
    }
    return ue(() => i.visible, async (a) => {
      if (a) {
        p.value = [], b.value = "", z.value = "", G.value = !1, M.value = "", w.value = "", N();
        const e = await Be();
        await Te(), await _e();
        let t = "";
        const c = (i.defaultPath || "").trim();
        if (c) {
          const f = Se(c, e || "");
          try {
            (await fetch(
              `${i.apiBase}/fs/list?dir=${encodeURIComponent(f)}`
            )).ok ? t = f : z.value = l("address.errorInvalidDefault");
          } catch {
            z.value = l("address.errorInvalidDefault");
          }
        }
        t || (t = e || ""), T.value = t, await W(t);
      } else
        N(), G.value = !1;
    }), (a, e) => (r(), tt(at, { to: "body" }, [
      u.visible ? (r(), n("div", {
        key: 0,
        class: "modal-overlay",
        onClick: e[12] || (e[12] = I((t) => a.$emit("close"), ["self"]))
      }, [
        s("div", {
          class: x(["modal-container", { "modal-theme-light": u.theme === "light" }])
        }, [
          s("div", dt, [
            s("h3", ut, [
              v(h, {
                name: u.mode === "file" ? "file" : "folder",
                size: 18,
                color: se.value
              }, null, 8, ["name", "color"]),
              $(" " + o(l(u.mode === "file" ? "modal.title.file" : "modal.title.directory")), 1)
            ]),
            s("button", {
              class: "close-btn",
              onClick: e[0] || (e[0] = (t) => a.$emit("close")),
              title: l("modal.close")
            }, [
              v(h, {
                name: "close",
                size: 16
              })
            ], 8, ft)
          ]),
          s("div", vt, [
            s("button", {
              class: "tool-btn tool-btn-icon",
              onClick: Ae,
              disabled: !K.value,
              title: l("tooltip.back")
            }, [
              v(h, {
                name: "arrowUp",
                size: 14
              })
            ], 8, ht),
            s("button", {
              class: "tool-btn tool-btn-icon",
              onClick: xe,
              title: l("tooltip.home")
            }, [
              v(h, {
                name: "home",
                size: 14
              })
            ], 8, mt),
            s("button", {
              class: "tool-btn tool-btn-icon",
              onClick: Oe,
              title: l("tooltip.refresh")
            }, [
              v(h, {
                name: "refresh",
                size: 14
              })
            ], 8, pt),
            u.enableMkdir && !R.value ? (r(), n("button", {
              key: 0,
              class: "tool-btn tool-btn-icon",
              onClick: Qe,
              title: l("tooltip.newFolder")
            }, [
              v(h, {
                name: "folderPlus",
                size: 14
              })
            ], 8, kt)) : k("", !0),
            s("div", {
              class: x(["address-bar", { "has-error": y.value }])
            }, [
              v(h, {
                name: "folder",
                size: 13,
                color: y.value ? "#f87171" : "#8b91a8",
                class: "address-bar-icon"
              }, null, 8, ["color"]),
              fe(s("input", {
                ref_key: "addressInputRef",
                ref: H,
                "onUpdate:modelValue": e[1] || (e[1] = (t) => T.value = t),
                type: "text",
                class: "address-bar-input",
                placeholder: l("address.placeholder"),
                title: y.value || l("address.title"),
                spellcheck: "false",
                autocomplete: "off",
                autocorrect: "off",
                autocapitalize: "off",
                onKeydown: [
                  U(Ee, ["enter"]),
                  U(He, ["esc"])
                ],
                onFocus: Re,
                onBlur: je
              }, null, 40, bt), [
                [ve, T.value]
              ]),
              y.value ? (r(), n("button", {
                key: 0,
                class: "address-bar-clear",
                title: y.value,
                onClick: Ne
              }, [
                v(h, {
                  name: "circleX",
                  size: 14,
                  color: "#f87171"
                })
              ], 8, gt)) : k("", !0)
            ], 2)
          ]),
          s("div", yt, [
            v(h, {
              name: "search",
              size: 16,
              color: "#8b91a8",
              class: "search-icon"
            }),
            fe(s("input", {
              "onUpdate:modelValue": e[2] || (e[2] = (t) => b.value = t),
              type: "text",
              class: "search-input",
              placeholder: _.value ? l("search.placeholderGlobal", { type: l("search.type." + (u.mode === "file" ? "file" : u.mode === "directory" ? "directory" : "all")) }) : l("search.placeholderLocal"),
              onKeydown: U(qe, ["enter"])
            }, null, 40, wt), [
              [ve, b.value]
            ]),
            b.value ? (r(), n("button", {
              key: 0,
              class: "clear-search",
              onClick: We
            }, [
              v(h, {
                name: "close",
                size: 14
              })
            ])) : k("", !0),
            s("div", {
              class: "global-toggle",
              title: _.value ? l("tooltip.globalSearchOn") : l("tooltip.globalSearchOff")
            }, [
              s("span", xt, o(l("search.globalLabel")), 1),
              s("button", {
                class: x(["toggle-switch", { active: _.value }]),
                onClick: Ze
              }, [...e[13] || (e[13] = [
                s("span", { class: "toggle-knob" }, null, -1)
              ])], 2)
            ], 8, _t),
            _.value ? (r(), n("div", {
              key: 1,
              class: x(["index-status", g.value.status]),
              title: g.value.status === "ready" ? l("tooltip.indexReady", {
                totalFiles: g.value.totalFiles,
                scannedRoots: (g.value.scannedRoots || []).join(", ") || "unknown"
              }) : g.value.status === "indexing" ? l("tooltip.indexing", {
                indexedFiles: g.value.indexedFiles,
                currentDir: g.value.currentDir || ""
              }) : l("tooltip.indexIdle"),
              onClick: e[3] || (e[3] = (t) => g.value.status !== "indexing" && Xe())
            }, [
              e[14] || (e[14] = s("span", { class: "status-dot" }, null, -1)),
              s("span", Ct, o(g.value.status === "ready" ? l("status.indexReady") : g.value.status === "indexing" ? l("status.indexing") : l("status.indexIdle")), 1)
            ], 10, St)) : k("", !0)
          ]),
          s("div", Mt, [
            s("div", $t, [
              s("div", zt, [
                s("div", Dt, o(l("sidebar.quickAccess")), 1),
                s("div", {
                  class: "sidebar-item",
                  onClick: xe
                }, [
                  v(h, {
                    name: "home",
                    size: 15
                  }),
                  $(" " + o(l("sidebar.home")), 1)
                ]),
                ke.value ? (r(), n("div", {
                  key: 0,
                  class: "sidebar-item",
                  onClick: e[4] || (e[4] = (t) => j(ke.value))
                }, [
                  v(h, {
                    name: "monitor",
                    size: 15
                  }),
                  $(" " + o(l("sidebar.desktop")), 1)
                ])) : k("", !0),
                be.value ? (r(), n("div", {
                  key: 1,
                  class: "sidebar-item",
                  onClick: e[5] || (e[5] = (t) => j(be.value))
                }, [
                  v(h, {
                    name: "file",
                    size: 15
                  }),
                  $(" " + o(l("sidebar.documents")), 1)
                ])) : k("", !0),
                ge.value ? (r(), n("div", {
                  key: 2,
                  class: "sidebar-item",
                  onClick: e[6] || (e[6] = (t) => j(ge.value))
                }, [
                  v(h, {
                    name: "download",
                    size: 15
                  }),
                  $(" " + o(l("sidebar.downloads")), 1)
                ])) : k("", !0)
              ]),
              X.value.length ? (r(), n("div", Ft, [
                s("div", Pt, o(l("sidebar.drives")), 1),
                (r(!0), n(he, null, me(X.value, (t) => (r(), n("div", {
                  key: t,
                  class: x(["sidebar-item", { active: m.value === t }]),
                  onClick: (c) => j(t)
                }, [
                  v(h, {
                    name: "hardDrive",
                    size: 15
                  }),
                  $(" " + o(t), 1)
                ], 10, It))), 128))
              ])) : k("", !0)
            ]),
            s("div", {
              class: "file-list-container",
              onClick: I(Ve, ["self"])
            }, [
              oe.value ? (r(), n("div", Bt, [
                e[15] || (e[15] = s("span", { class: "spinner" }, null, -1)),
                $(" " + o(l("state.loading")), 1)
              ])) : z.value ? (r(), n("div", Tt, [
                v(h, {
                  name: "circleX",
                  size: 18,
                  color: "currentColor"
                }),
                $(" " + o(z.value), 1)
              ])) : Z.value ? (r(), n("div", At, [
                e[16] || (e[16] = s("span", { class: "spinner" }, null, -1)),
                $(" " + o(l("state.globalSearching")), 1)
              ])) : we.value.length === 0 ? (r(), n("div", Lt, o(b.value ? l("state.emptySearch") : l("state.emptyDir")), 1)) : (r(), n("div", Et, [
                F.value.length > 0 ? (r(), n("div", Ht, [
                  v(h, {
                    name: "search",
                    size: 14,
                    color: "#8b91a8"
                  }),
                  s("span", {
                    innerHTML: l("results.found", { count: F.value.length })
                  }, null, 8, Rt),
                  Q.value ? (r(), n("span", jt, o(l("results.truncated")), 1)) : k("", !0),
                  s("span", {
                    class: x(["engine-badge", ne.value])
                  }, o(ne.value === "index" ? l("search.engineIndex") : l("search.engineWalk")), 3),
                  s("span", Nt, o(J.value) + o(l("unit.ms")), 1)
                ])) : k("", !0),
                u.mode === "directory" && !R.value ? (r(), n("div", {
                  key: 1,
                  class: x(["file-row select-current-dir", { selected: Ce(m.value) }]),
                  onClick: [
                    e[7] || (e[7] = I((t) => A(m.value), ["exact"])),
                    e[8] || (e[8] = I((t) => A(m.value), ["ctrl"])),
                    e[9] || (e[9] = I((t) => A(m.value), ["meta"]))
                  ]
                }, [
                  v(h, {
                    name: "circleCheck",
                    size: 18,
                    color: "#a78bfa",
                    class: "file-icon"
                  }),
                  s("span", Ot, o(l("fileRow.selectCurrent")), 1),
                  s("span", Vt, o(m.value), 1)
                ], 2)) : k("", !0),
                (r(!0), n(he, null, me(we.value, (t) => (r(), n("div", {
                  key: t.path,
                  class: x(["file-row", {
                    selected: Ce(t.path),
                    "is-directory": t.kind === "directory"
                  }]),
                  onClick: [
                    I((c) => Me(t), ["exact"]),
                    I((c) => $e(t), ["ctrl"]),
                    I((c) => $e(t), ["meta"])
                  ],
                  onDblclick: (c) => Ge(t)
                }, [
                  v(h, {
                    name: t.kind === "directory" ? "folder" : "file",
                    size: 18,
                    color: Ye(t),
                    class: "file-icon"
                  }, null, 8, ["name", "color"]),
                  s("span", {
                    class: "file-name",
                    title: t.name
                  }, o(t.name), 9, Ut),
                  R.value ? (r(), n("span", {
                    key: 0,
                    class: "file-parent-path",
                    title: t.path
                  }, o(Ke(t.path)), 9, Zt)) : k("", !0),
                  t.kind === "file" ? (r(), n("span", {
                    key: 1,
                    class: "file-size",
                    title: De(t.size)
                  }, o(De(t.size)), 9, Wt)) : k("", !0),
                  t.modified ? (r(), n("span", {
                    key: 2,
                    class: "file-modified",
                    title: t.modified
                  }, o(Je(t.modified)), 9, qt)) : k("", !0)
                ], 42, Gt))), 128))
              ]))
            ])
          ]),
          s("div", Kt, [
            s("div", Xt, [
              p.value.length === 0 ? (r(), n("span", Qt, o(l(u.mode === "file" ? "footer.unselectedFile" : "footer.unselectedDir")), 1)) : u.multiple ? (r(), n("span", Yt, [
                s("span", {
                  innerHTML: l("footer.selected", { count: p.value.length })
                }, null, 8, ea)
              ])) : (r(), n("span", {
                key: 1,
                class: "has-selection single-path",
                title: p.value[0]
              }, o(p.value[0]), 9, Jt))
            ]),
            s("div", ta, [
              s("button", {
                class: "btn btn-cancel",
                onClick: e[10] || (e[10] = (t) => a.$emit("close"))
              }, o(l("footer.cancel")), 1),
              s("button", {
                class: "btn btn-confirm",
                disabled: p.value.length === 0,
                onClick: Ue
              }, o(l("footer.confirm")), 9, aa)
            ])
          ]),
          G.value ? (r(), n("div", {
            key: 0,
            class: "mkdir-overlay",
            onClick: I(te, ["self"]),
            onKeydown: U(te, ["esc"])
          }, [
            s("div", {
              class: x(["mkdir-dialog", { "modal-theme-light": u.theme === "light" }])
            }, [
              s("div", la, [
                v(h, {
                  name: "folderPlus",
                  size: 18,
                  color: "#a78bfa"
                }),
                s("span", sa, o(l("mkdir.title")), 1)
              ]),
              s("div", oa, [
                s("label", ra, o(l("mkdir.parentLabel")), 1),
                s("div", {
                  class: "mkdir-parent-path",
                  title: ie.value
                }, o(ie.value), 9, na),
                s("label", ia, o(l("mkdir.nameLabel")), 1),
                fe(s("input", {
                  id: "mkdir-name-input",
                  ref_key: "mkdirNameInput",
                  ref: Y,
                  "onUpdate:modelValue": e[11] || (e[11] = (t) => M.value = t),
                  type: "text",
                  class: x(["mkdir-input", { "has-error": w.value }]),
                  placeholder: l("mkdir.namePlaceholder"),
                  onKeydown: [
                    U(ze, ["enter"]),
                    U(te, ["esc"])
                  ],
                  maxlength: "255"
                }, null, 42, ca), [
                  [ve, M.value]
                ]),
                w.value ? (r(), n("div", da, [
                  v(h, {
                    name: "circleX",
                    size: 14,
                    color: "currentColor"
                  }),
                  s("span", null, o(w.value), 1)
                ])) : ye.value ? (r(), n("div", ua, o(ye.value), 1)) : k("", !0)
              ]),
              s("div", fa, [
                s("button", {
                  class: "btn btn-cancel",
                  onClick: te,
                  disabled: E.value
                }, o(l("mkdir.cancel")), 9, va),
                s("button", {
                  class: "btn btn-confirm",
                  disabled: !M.value.trim() || E.value,
                  onClick: ze
                }, [
                  E.value ? (r(), n("span", ma)) : k("", !0),
                  $(" " + o(l("mkdir.confirm")), 1)
                ], 8, ha)
              ])
            ], 2)
          ], 32)) : k("", !0)
        ], 2)
      ])) : k("", !0)
    ]));
  }
}, ba = /* @__PURE__ */ Ie(pa, [["__scopeId", "data-v-861d86a8"]]);
export {
  ba as FilePickerModal,
  h as SvgIcon,
  rt as getFileTypeColor,
  lt as icons
};
