import { computed as S, openBlock as o, createElementBlock as r, normalizeClass as z, Fragment as O, renderList as V, ref as f, watch as ie, createBlock as $e, Teleport as De, withModifiers as D, createElementVNode as l, createVNode as h, createTextVNode as w, toDisplayString as n, createCommentVNode as g, withDirectives as ze, withKeys as Fe, vModelText as Ie } from "vue";
const Te = {
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
}, Le = {
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
}, He = "#8b91a8";
function Be(d) {
  return Le[d] || He;
}
const de = (d, L) => {
  const M = d.__vccOpts || d;
  for (const [c, x] of L)
    M[c] = x;
  return M;
}, Pe = ["width", "height", "stroke"], Re = ["d"], je = {
  __name: "SvgIcon",
  props: {
    name: { type: String, required: !0 },
    size: { type: [Number, String], default: 18 },
    color: { type: String, default: "currentColor" },
    class: { type: String, default: "" }
  },
  setup(d) {
    const L = d, M = S(() => L.class), c = S(() => {
      const x = Te[L.name];
      return x ? Array.isArray(x) ? x : [x] : [];
    });
    return (x, Q) => (o(), r("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: d.size,
      height: d.size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: d.color,
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      class: z(["svg-icon", M.value]),
      "aria-hidden": "true"
    }, [
      (o(!0), r(O, null, V(c.value, (s, U) => (o(), r("path", {
        key: U,
        d: s
      }, null, 8, Re))), 128))
    ], 10, Pe));
  }
}, v = /* @__PURE__ */ de(je, [["__scopeId", "data-v-5461fefd"]]), Ae = { class: "modal-header" }, Ge = { class: "modal-title" }, Ne = ["title"], Ee = { class: "toolbar" }, Oe = ["disabled", "title"], Ve = ["title"], Ue = ["title"], qe = { class: "path-breadcrumb" }, Ze = ["onClick"], Ke = { class: "breadcrumb-text" }, We = {
  key: 0,
  class: "breadcrumb-sep"
}, Qe = { class: "search-bar" }, Xe = ["placeholder"], Ye = ["title"], Je = { class: "toggle-label" }, et = ["title"], tt = { class: "status-text" }, at = { class: "modal-body" }, st = { class: "sidebar" }, lt = { class: "sidebar-section" }, ot = { class: "sidebar-title" }, nt = {
  key: 0,
  class: "sidebar-section"
}, rt = { class: "sidebar-title" }, it = ["onClick"], ct = {
  key: 0,
  class: "loading-state"
}, dt = {
  key: 1,
  class: "error-state"
}, ut = {
  key: 2,
  class: "loading-state"
}, ft = {
  key: 3,
  class: "empty-state"
}, ht = {
  key: 4,
  class: "file-list"
}, vt = {
  key: 0,
  class: "search-results-info"
}, mt = ["innerHTML"], pt = {
  key: 0,
  class: "truncated-hint"
}, gt = { class: "elapsed-hint" }, bt = { class: "file-name" }, yt = { class: "file-path-hint" }, kt = ["onClick", "onDblclick"], wt = ["title"], St = ["title"], xt = ["title"], _t = ["title"], Ct = { class: "modal-footer" }, Mt = { class: "selected-info" }, $t = {
  key: 0,
  class: "no-selection"
}, Dt = ["title"], zt = {
  key: 2,
  class: "has-selection"
}, Ft = ["innerHTML"], It = { class: "footer-actions" }, Tt = ["disabled"], ce = "zh-CN", Lt = {
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
    messages: { type: Object, default: null }
    // 外部完全覆盖字典（高级用法）
  },
  emits: ["close", "confirm"],
  setup(d, { emit: L }) {
    const M = {
      "zh-CN": {
        "modal.title.file": "选择文件",
        "modal.title.directory": "选择文件夹",
        "modal.close": "关闭",
        "modal.up": "上级",
        "modal.home": "家目录",
        "tooltip.back": "返回上一级",
        "tooltip.home": "家目录",
        "tooltip.refresh": "刷新",
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
        "error.searchFailed": "搜索请求失败"
      },
      "en-US": {
        "modal.title.file": "Select File",
        "modal.title.directory": "Select Folder",
        "modal.close": "Close",
        "modal.up": "Up",
        "modal.home": "Home",
        "tooltip.back": "Go to parent directory",
        "tooltip.home": "Home directory",
        "tooltip.refresh": "Refresh",
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
        "error.searchFailed": "Search request failed"
      }
    }, c = d, x = L, Q = S(() => ({ ...M[c.locale] || M[ce], ...c.messages || {} }));
    function s(e, t = {}) {
      let a = Q.value[e];
      return a == null && (a = M[ce][e] ?? e), a.replace(/\{(\w+)\}/g, (i, b) => t[b] ?? `{${b}}`);
    }
    const U = S(() => c.mode === "file" ? c.theme === "light" ? "#3b82f6" : "#6c8cff" : "#a78bfa"), q = f(!1), H = f(""), y = f(""), R = f(null), X = f([]), m = f([]), u = f(""), j = f([]), _ = f(""), k = f(!1), B = f(!1), C = f([]), A = f(!1), G = f(0), Z = f(""), p = f({ status: "idle", totalFiles: 0, indexedFiles: 0, currentDir: "", scannedRoots: [] });
    let F = null;
    const Y = S(() => _.value ? _.value + "\\Desktop" : ""), J = S(() => _.value ? _.value + "\\Documents" : ""), ee = S(() => _.value ? _.value + "\\Downloads" : ""), P = S(() => k.value && C.value.length > 0), te = S(() => {
      if (P.value) {
        let a = C.value;
        return c.mode === "directory" && (a = a.filter((i) => i.kind === "directory")), a;
      }
      let e = X.value;
      if (c.mode === "directory" && (e = e.filter((a) => a.kind === "directory")), !u.value) return e;
      const t = u.value.toLowerCase();
      return e.filter((a) => a.name.toLowerCase().includes(t));
    }), K = S(() => {
      if (!y.value) return [];
      const e = y.value.split(/[/\\]/).filter(Boolean);
      return e.map((t, a) => {
        let i;
        return a === 0 && /^[A-Za-z]:$/.test(t) ? i = t + "\\" : i = e.slice(0, a + 1).join("\\"), { label: t, path: i };
      });
    });
    async function ue() {
      try {
        const e = await fetch(`${c.apiBase}/fs/home`);
        if (!e.ok) throw new Error(`HTTP ${e.status}`);
        const t = await e.json();
        return _.value = t.home, t.home;
      } catch (e) {
        return console.warn("[fetchHome] 获取家目录失败:", e.message), "";
      }
    }
    async function fe() {
      try {
        const e = await fetch(`${c.apiBase}/fs/drives`);
        if (!e.ok) throw new Error(`HTTP ${e.status}`);
        const t = await e.json();
        j.value = t.drives || [];
      } catch (e) {
        console.warn("[fetchDrives] 获取盘符失败:", e.message), j.value = [];
      }
    }
    async function ae() {
      try {
        const e = await fetch(`${c.apiBase}/fs/index-status`);
        if (!e.ok) return;
        const t = await e.json();
        p.value = t;
      } catch {
      }
    }
    async function N(e) {
      q.value = !0, H.value = "";
      try {
        const t = new URLSearchParams();
        e && t.set("dir", e);
        const a = await fetch(`${c.apiBase}/fs/list?${t}`);
        if (!a.ok) {
          let b = `HTTP ${a.status}`;
          try {
            b = (await a.json()).error || b;
          } catch {
            b = s("error.cannotConnect");
          }
          H.value = b;
          return;
        }
        const i = await a.json();
        y.value = i.currentPath, R.value = i.parentPath, X.value = i.items || [];
      } catch (t) {
        H.value = s("error.network", { message: t.message });
      } finally {
        q.value = !1;
      }
    }
    function he() {
      if (P.value) {
        T();
        return;
      }
      R.value && N(R.value);
    }
    function se() {
      _.value && I(_.value);
    }
    function I(e) {
      u.value = "", T(), N(e);
    }
    function ve(e) {
      const t = K.value[e]?.path;
      t && t !== y.value && I(t);
    }
    function me() {
      P.value && u.value ? E(u.value) : N(y.value);
    }
    function le(e) {
      return m.value.includes(e);
    }
    function $(e) {
      if (!c.multiple) {
        m.value = m.value[0] === e ? [] : [e];
        return;
      }
      const t = m.value.indexOf(e);
      t >= 0 ? m.value.splice(t, 1) : m.value.push(e);
    }
    function pe() {
      m.value = [];
    }
    function oe(e, t) {
      e.kind === "directory" ? (c.mode, $(e.path)) : c.mode === "file" && $(e.path);
    }
    function ne(e) {
      if (!c.multiple) {
        oe(e);
        return;
      }
      (e.kind === "directory" || c.mode === "file") && $(e.path);
    }
    function ge(e) {
      e.kind === "directory" && I(e.path);
    }
    function be() {
      m.value.length > 0 && x("confirm", [...m.value]);
    }
    function ye() {
      k.value = !k.value, k.value ? u.value && E(u.value) : T();
    }
    function T() {
      F && (F.abort(), F = null), C.value = [], A.value = !1, G.value = 0, B.value = !1;
    }
    function ke() {
      u.value = "", k.value && T();
    }
    function we() {
      k.value && u.value.trim() && E(u.value.trim());
    }
    let W = null;
    ie(u, (e) => {
      if (k.value) {
        if (W && clearTimeout(W), !e.trim()) {
          T();
          return;
        }
        W = setTimeout(() => {
          E(e.trim());
        }, 500);
      }
    });
    async function E(e) {
      F && F.abort(), F = new AbortController(), B.value = !0, C.value = [], A.value = !1, G.value = 0;
      try {
        const t = new URLSearchParams({
          q: e,
          mode: c.mode === "directory" ? "directory" : c.mode === "file" ? "file" : "all",
          limit: "200"
        }), a = await fetch(`${c.apiBase}/fs/search?${t}`, {
          signal: F.signal
        });
        if (!a.ok) {
          let b = `HTTP ${a.status}`;
          try {
            b = (await a.json()).error || b;
          } catch {
            b = s("error.searchFailed");
          }
          C.value = [], B.value = !1;
          return;
        }
        const i = await a.json();
        C.value = i.items || [], A.value = i.truncated || !1, G.value = i.elapsed || 0, Z.value = i.engine || "";
      } catch (t) {
        if (t.name === "AbortError") return;
        console.warn("[globalSearch] 搜索失败:", t.message), C.value = [];
      } finally {
        B.value = !1;
      }
    }
    function Se(e) {
      if (!e) return "";
      const t = e.replace(/[/\\]/g, "/").split("/");
      return t.pop(), t.join("/");
    }
    async function xe() {
      try {
        await fetch(`${c.apiBase}/fs/reindex`, { method: "POST" }), p.value = { ...p.value, status: "indexing" };
        const e = setInterval(async () => {
          await ae(), (p.value.status === "ready" || p.value.status === "error") && clearInterval(e);
        }, 2e3);
      } catch {
      }
    }
    function re(e) {
      if (!e || e === 0) return "0 B";
      const t = 1024, a = ["B", "KB", "MB", "GB"], i = Math.floor(Math.log(e) / Math.log(t));
      return `${parseFloat((e / Math.pow(t, i)).toFixed(2))} ${a[i]}`;
    }
    function _e(e) {
      if (!e) return "";
      const t = new Date(e);
      return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")} ${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
    }
    function Ce(e) {
      if (e.kind === "directory") return "#a78bfa";
      const t = (e.ext || "").replace(".", "");
      return Be(t);
    }
    return ie(() => c.visible, async (e) => {
      if (e) {
        m.value = [], u.value = "", H.value = "", T();
        const t = await ue();
        await fe(), await ae(), await N(t || "");
      } else
        T();
    }), (e, t) => (o(), $e(De, { to: "body" }, [
      d.visible ? (o(), r("div", {
        key: 0,
        class: "modal-overlay",
        onClick: t[10] || (t[10] = D((a) => e.$emit("close"), ["self"]))
      }, [
        l("div", {
          class: z(["modal-container", { "modal-theme-light": d.theme === "light" }])
        }, [
          l("div", Ae, [
            l("h3", Ge, [
              h(v, {
                name: d.mode === "file" ? "file" : "folder",
                size: 18,
                color: U.value
              }, null, 8, ["name", "color"]),
              w(" " + n(s(d.mode === "file" ? "modal.title.file" : "modal.title.directory")), 1)
            ]),
            l("button", {
              class: "close-btn",
              onClick: t[0] || (t[0] = (a) => e.$emit("close")),
              title: s("modal.close")
            }, [
              h(v, {
                name: "close",
                size: 16
              })
            ], 8, Ne)
          ]),
          l("div", Ee, [
            l("button", {
              class: "tool-btn",
              onClick: he,
              disabled: !R.value,
              title: s("tooltip.back")
            }, [
              h(v, {
                name: "arrowUp",
                size: 14
              }),
              w(" " + n(s("modal.up")), 1)
            ], 8, Oe),
            l("button", {
              class: "tool-btn",
              onClick: se,
              title: s("tooltip.home")
            }, [
              h(v, {
                name: "home",
                size: 14
              }),
              w(" " + n(s("modal.home")), 1)
            ], 8, Ve),
            l("button", {
              class: "tool-btn",
              onClick: me,
              title: s("tooltip.refresh")
            }, [
              h(v, {
                name: "refresh",
                size: 14
              })
            ], 8, Ue),
            l("div", qe, [
              (o(!0), r(O, null, V(K.value, (a, i) => (o(), r("span", {
                key: i,
                class: "breadcrumb-item",
                onClick: (b) => ve(i)
              }, [
                l("span", Ke, n(a.label), 1),
                i < K.value.length - 1 ? (o(), r("span", We, "/")) : g("", !0)
              ], 8, Ze))), 128))
            ])
          ]),
          l("div", Qe, [
            h(v, {
              name: "search",
              size: 16,
              color: "#8b91a8",
              class: "search-icon"
            }),
            ze(l("input", {
              "onUpdate:modelValue": t[1] || (t[1] = (a) => u.value = a),
              type: "text",
              class: "search-input",
              placeholder: k.value ? s("search.placeholderGlobal", { type: s("search.type." + (d.mode === "file" ? "file" : d.mode === "directory" ? "directory" : "all")) }) : s("search.placeholderLocal"),
              onKeydown: Fe(we, ["enter"])
            }, null, 40, Xe), [
              [Ie, u.value]
            ]),
            u.value ? (o(), r("button", {
              key: 0,
              class: "clear-search",
              onClick: ke
            }, [
              h(v, {
                name: "close",
                size: 14
              })
            ])) : g("", !0),
            l("div", {
              class: "global-toggle",
              title: k.value ? s("tooltip.globalSearchOn") : s("tooltip.globalSearchOff")
            }, [
              l("span", Je, n(s("search.globalLabel")), 1),
              l("button", {
                class: z(["toggle-switch", { active: k.value }]),
                onClick: ye
              }, [...t[11] || (t[11] = [
                l("span", { class: "toggle-knob" }, null, -1)
              ])], 2)
            ], 8, Ye),
            k.value ? (o(), r("div", {
              key: 1,
              class: z(["index-status", p.value.status]),
              title: p.value.status === "ready" ? s("tooltip.indexReady", {
                totalFiles: p.value.totalFiles,
                scannedRoots: (p.value.scannedRoots || []).join(", ") || "unknown"
              }) : p.value.status === "indexing" ? s("tooltip.indexing", {
                indexedFiles: p.value.indexedFiles,
                currentDir: p.value.currentDir || ""
              }) : s("tooltip.indexIdle"),
              onClick: t[2] || (t[2] = (a) => p.value.status !== "indexing" && xe())
            }, [
              t[12] || (t[12] = l("span", { class: "status-dot" }, null, -1)),
              l("span", tt, n(p.value.status === "ready" ? s("status.indexReady") : p.value.status === "indexing" ? s("status.indexing") : s("status.indexIdle")), 1)
            ], 10, et)) : g("", !0)
          ]),
          l("div", at, [
            l("div", st, [
              l("div", lt, [
                l("div", ot, n(s("sidebar.quickAccess")), 1),
                l("div", {
                  class: "sidebar-item",
                  onClick: se
                }, [
                  h(v, {
                    name: "home",
                    size: 15
                  }),
                  w(" " + n(s("sidebar.home")), 1)
                ]),
                Y.value ? (o(), r("div", {
                  key: 0,
                  class: "sidebar-item",
                  onClick: t[3] || (t[3] = (a) => I(Y.value))
                }, [
                  h(v, {
                    name: "monitor",
                    size: 15
                  }),
                  w(" " + n(s("sidebar.desktop")), 1)
                ])) : g("", !0),
                J.value ? (o(), r("div", {
                  key: 1,
                  class: "sidebar-item",
                  onClick: t[4] || (t[4] = (a) => I(J.value))
                }, [
                  h(v, {
                    name: "file",
                    size: 15
                  }),
                  w(" " + n(s("sidebar.documents")), 1)
                ])) : g("", !0),
                ee.value ? (o(), r("div", {
                  key: 2,
                  class: "sidebar-item",
                  onClick: t[5] || (t[5] = (a) => I(ee.value))
                }, [
                  h(v, {
                    name: "download",
                    size: 15
                  }),
                  w(" " + n(s("sidebar.downloads")), 1)
                ])) : g("", !0)
              ]),
              j.value.length ? (o(), r("div", nt, [
                l("div", rt, n(s("sidebar.drives")), 1),
                (o(!0), r(O, null, V(j.value, (a) => (o(), r("div", {
                  key: a,
                  class: z(["sidebar-item", { active: y.value === a }]),
                  onClick: (i) => I(a)
                }, [
                  h(v, {
                    name: "hardDrive",
                    size: 15
                  }),
                  w(" " + n(a), 1)
                ], 10, it))), 128))
              ])) : g("", !0)
            ]),
            l("div", {
              class: "file-list-container",
              onClick: D(pe, ["self"])
            }, [
              q.value ? (o(), r("div", ct, [
                t[13] || (t[13] = l("span", { class: "spinner" }, null, -1)),
                w(" " + n(s("state.loading")), 1)
              ])) : H.value ? (o(), r("div", dt, [
                h(v, {
                  name: "circleX",
                  size: 18,
                  color: "currentColor"
                }),
                w(" " + n(H.value), 1)
              ])) : B.value ? (o(), r("div", ut, [
                t[14] || (t[14] = l("span", { class: "spinner" }, null, -1)),
                w(" " + n(s("state.globalSearching")), 1)
              ])) : te.value.length === 0 ? (o(), r("div", ft, n(u.value ? s("state.emptySearch") : s("state.emptyDir")), 1)) : (o(), r("div", ht, [
                C.value.length > 0 ? (o(), r("div", vt, [
                  h(v, {
                    name: "search",
                    size: 14,
                    color: "#8b91a8"
                  }),
                  l("span", {
                    innerHTML: s("results.found", { count: C.value.length })
                  }, null, 8, mt),
                  A.value ? (o(), r("span", pt, n(s("results.truncated")), 1)) : g("", !0),
                  l("span", {
                    class: z(["engine-badge", Z.value])
                  }, n(Z.value === "index" ? s("search.engineIndex") : s("search.engineWalk")), 3),
                  l("span", gt, n(G.value) + n(s("unit.ms")), 1)
                ])) : g("", !0),
                d.mode === "directory" && !P.value ? (o(), r("div", {
                  key: 1,
                  class: z(["file-row select-current-dir", { selected: le(y.value) }]),
                  onClick: [
                    t[6] || (t[6] = D((a) => $(y.value), ["exact"])),
                    t[7] || (t[7] = D((a) => $(y.value), ["ctrl"])),
                    t[8] || (t[8] = D((a) => $(y.value), ["meta"]))
                  ]
                }, [
                  h(v, {
                    name: "circleCheck",
                    size: 18,
                    color: "#a78bfa",
                    class: "file-icon"
                  }),
                  l("span", bt, n(s("fileRow.selectCurrent")), 1),
                  l("span", yt, n(y.value), 1)
                ], 2)) : g("", !0),
                (o(!0), r(O, null, V(te.value, (a) => (o(), r("div", {
                  key: a.path,
                  class: z(["file-row", {
                    selected: le(a.path),
                    "is-directory": a.kind === "directory"
                  }]),
                  onClick: [
                    D((i) => oe(a), ["exact"]),
                    D((i) => ne(a), ["ctrl"]),
                    D((i) => ne(a), ["meta"])
                  ],
                  onDblclick: (i) => ge(a)
                }, [
                  h(v, {
                    name: a.kind === "directory" ? "folder" : "file",
                    size: 18,
                    color: Ce(a),
                    class: "file-icon"
                  }, null, 8, ["name", "color"]),
                  l("span", {
                    class: "file-name",
                    title: a.name
                  }, n(a.name), 9, wt),
                  P.value ? (o(), r("span", {
                    key: 0,
                    class: "file-parent-path",
                    title: a.path
                  }, n(Se(a.path)), 9, St)) : g("", !0),
                  a.kind === "file" ? (o(), r("span", {
                    key: 1,
                    class: "file-size",
                    title: re(a.size)
                  }, n(re(a.size)), 9, xt)) : g("", !0),
                  a.modified ? (o(), r("span", {
                    key: 2,
                    class: "file-modified",
                    title: a.modified
                  }, n(_e(a.modified)), 9, _t)) : g("", !0)
                ], 42, kt))), 128))
              ]))
            ])
          ]),
          l("div", Ct, [
            l("div", Mt, [
              m.value.length === 0 ? (o(), r("span", $t, n(s(d.mode === "file" ? "footer.unselectedFile" : "footer.unselectedDir")), 1)) : d.multiple ? (o(), r("span", zt, [
                l("span", {
                  innerHTML: s("footer.selected", { count: m.value.length })
                }, null, 8, Ft)
              ])) : (o(), r("span", {
                key: 1,
                class: "has-selection single-path",
                title: m.value[0]
              }, n(m.value[0]), 9, Dt))
            ]),
            l("div", It, [
              l("button", {
                class: "btn btn-cancel",
                onClick: t[9] || (t[9] = (a) => e.$emit("close"))
              }, n(s("footer.cancel")), 1),
              l("button", {
                class: "btn btn-confirm",
                disabled: m.value.length === 0,
                onClick: be
              }, n(s("footer.confirm")), 9, Tt)
            ])
          ])
        ], 2)
      ])) : g("", !0)
    ]));
  }
}, Bt = /* @__PURE__ */ de(Lt, [["__scopeId", "data-v-6e4a8b86"]]);
export {
  Bt as FilePickerModal,
  v as SvgIcon,
  Be as getFileTypeColor,
  Te as icons
};
