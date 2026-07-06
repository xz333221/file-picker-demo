import { computed as C, openBlock as l, createElementBlock as n, normalizeClass as D, Fragment as N, renderList as Z, ref as d, watch as ne, createBlock as Se, Teleport as Ce, withModifiers as z, createElementVNode as s, createVNode as v, createTextVNode as p, toDisplayString as c, createCommentVNode as b, withDirectives as Me, withKeys as xe, vModelText as ze } from "vue";
const De = {
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
}, Pe = {
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
}, Te = "#8b91a8";
function Be(r) {
  return Pe[r] || Te;
}
const oe = (r, j) => {
  const i = r.__vccOpts || r;
  for (const [_, y] of j)
    i[_] = y;
  return i;
}, je = ["width", "height", "stroke"], _e = ["d"], He = {
  __name: "SvgIcon",
  props: {
    name: { type: String, required: !0 },
    size: { type: [Number, String], default: 18 },
    color: { type: String, default: "currentColor" },
    class: { type: String, default: "" }
  },
  setup(r) {
    const j = r, i = C(() => j.class), _ = C(() => {
      const y = De[j.name];
      return y ? Array.isArray(y) ? y : [y] : [];
    });
    return (y, V) => (l(), n("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: r.size,
      height: r.size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: r.color,
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      class: D(["svg-icon", i.value]),
      "aria-hidden": "true"
    }, [
      (l(!0), n(N, null, Z(_.value, (M, g) => (l(), n("path", {
        key: g,
        d: M
      }, null, 8, _e))), 128))
    ], 10, je));
  }
}, f = /* @__PURE__ */ oe(He, [["__scopeId", "data-v-5461fefd"]]), Fe = { class: "modal-header" }, Ve = { class: "modal-title" }, Ie = { class: "toolbar" }, Ae = ["disabled"], Ee = { class: "path-breadcrumb" }, Le = ["onClick"], Re = { class: "breadcrumb-text" }, Ue = {
  key: 0,
  class: "breadcrumb-sep"
}, Ne = { class: "search-bar" }, Ze = ["placeholder"], Ge = ["title"], qe = ["title"], Ke = { class: "status-text" }, Oe = { class: "modal-body" }, Xe = { class: "sidebar" }, Qe = { class: "sidebar-section" }, Ye = {
  key: 0,
  class: "sidebar-section"
}, Je = ["onClick"], We = {
  key: 0,
  class: "loading-state"
}, et = {
  key: 1,
  class: "error-state"
}, tt = {
  key: 2,
  class: "loading-state"
}, at = {
  key: 3,
  class: "empty-state"
}, st = {
  key: 4,
  class: "file-list"
}, lt = {
  key: 0,
  class: "search-results-info"
}, nt = {
  key: 0,
  class: "truncated-hint"
}, ot = { class: "elapsed-hint" }, it = { class: "file-path-hint" }, rt = ["onClick", "onDblclick"], ct = ["title"], ut = ["title"], dt = ["title"], vt = ["title"], ft = { class: "modal-footer" }, ht = { class: "selected-info" }, mt = {
  key: 0,
  class: "no-selection"
}, pt = ["title"], bt = {
  key: 2,
  class: "has-selection"
}, gt = { class: "footer-actions" }, kt = ["disabled"], yt = {
  __name: "FilePickerModal",
  props: {
    visible: { type: Boolean, default: !1 },
    mode: { type: String, default: "file" },
    // 'file' | 'directory'
    multiple: { type: Boolean, default: !1 },
    // 是否允许多选，默认单选
    theme: { type: String, default: "dark" },
    // 'dark' | 'light'
    apiBase: { type: String, default: "/api" }
    // API 服务基础路径，如 'http://localhost:8642/api'
  },
  emits: ["close", "confirm"],
  setup(r, { emit: j }) {
    const i = r, _ = j, y = C(() => i.mode === "file" ? i.theme === "light" ? "#3b82f6" : "#6c8cff" : "#a78bfa"), V = d(!1), M = d(""), g = d(""), I = d(null), O = d([]), h = d([]), u = d(""), A = d([]), w = d(""), k = d(!1), H = d(!1), $ = d([]), E = d(!1), L = d(0), G = d(""), m = d({ status: "idle", totalFiles: 0, indexedFiles: 0, currentDir: "", scannedRoots: [] });
    let P = null;
    const X = C(() => w.value ? w.value + "\\Desktop" : ""), Q = C(() => w.value ? w.value + "\\Documents" : ""), Y = C(() => w.value ? w.value + "\\Downloads" : ""), F = C(() => k.value && $.value.length > 0), J = C(() => {
      if (F.value) {
        let a = $.value;
        return i.mode === "directory" && (a = a.filter((o) => o.kind === "directory")), a;
      }
      let t = O.value;
      if (i.mode === "directory" && (t = t.filter((a) => a.kind === "directory")), !u.value) return t;
      const e = u.value.toLowerCase();
      return t.filter((a) => a.name.toLowerCase().includes(e));
    }), q = C(() => {
      if (!g.value) return [];
      const t = g.value.split(/[/\\]/).filter(Boolean);
      return t.map((e, a) => {
        let o;
        return a === 0 && /^[A-Za-z]:$/.test(e) ? o = e + "\\" : o = t.slice(0, a + 1).join("\\"), { label: e, path: o };
      });
    });
    async function ie() {
      try {
        const t = await fetch(`${i.apiBase}/fs/home`);
        if (!t.ok) throw new Error(`HTTP ${t.status}`);
        const e = await t.json();
        return w.value = e.home, e.home;
      } catch (t) {
        return console.warn("[fetchHome] 获取家目录失败:", t.message), "";
      }
    }
    async function re() {
      try {
        const t = await fetch(`${i.apiBase}/fs/drives`);
        if (!t.ok) throw new Error(`HTTP ${t.status}`);
        const e = await t.json();
        A.value = e.drives || [];
      } catch (t) {
        console.warn("[fetchDrives] 获取盘符失败:", t.message), A.value = [];
      }
    }
    async function W() {
      try {
        const t = await fetch(`${i.apiBase}/fs/index-status`);
        if (!t.ok) return;
        const e = await t.json();
        m.value = e;
      } catch {
      }
    }
    async function R(t) {
      V.value = !0, M.value = "";
      try {
        const e = new URLSearchParams();
        t && e.set("dir", t);
        const a = await fetch(`${i.apiBase}/fs/list?${e}`);
        if (!a.ok) {
          let S = `HTTP ${a.status}`;
          try {
            S = (await a.json()).error || S;
          } catch {
            S = "无法连接到后端服务，请确认后端已启动 (npm run dev)";
          }
          M.value = S;
          return;
        }
        const o = await a.json();
        g.value = o.currentPath, I.value = o.parentPath, O.value = o.items || [];
      } catch (e) {
        M.value = `网络错误: ${e.message}。请确认后端服务已启动。`;
      } finally {
        V.value = !1;
      }
    }
    function ce() {
      if (F.value) {
        B();
        return;
      }
      I.value && R(I.value);
    }
    function ee() {
      w.value && T(w.value);
    }
    function T(t) {
      u.value = "", B(), R(t);
    }
    function ue(t) {
      const e = q.value[t]?.path;
      e && e !== g.value && T(e);
    }
    function de() {
      F.value && u.value ? U(u.value) : R(g.value);
    }
    function te(t) {
      return h.value.includes(t);
    }
    function x(t) {
      if (!i.multiple) {
        h.value = h.value[0] === t ? [] : [t];
        return;
      }
      const e = h.value.indexOf(t);
      e >= 0 ? h.value.splice(e, 1) : h.value.push(t);
    }
    function ve() {
      h.value = [];
    }
    function ae(t, e) {
      t.kind === "directory" ? (i.mode, x(t.path)) : i.mode === "file" && x(t.path);
    }
    function se(t) {
      if (!i.multiple) {
        ae(t);
        return;
      }
      (t.kind === "directory" || i.mode === "file") && x(t.path);
    }
    function fe(t) {
      t.kind === "directory" && T(t.path);
    }
    function he() {
      h.value.length > 0 && _("confirm", [...h.value]);
    }
    function me() {
      k.value = !k.value, k.value ? u.value && U(u.value) : B();
    }
    function B() {
      P && (P.abort(), P = null), $.value = [], E.value = !1, L.value = 0, H.value = !1;
    }
    function pe() {
      u.value = "", k.value && B();
    }
    function be() {
      k.value && u.value.trim() && U(u.value.trim());
    }
    let K = null;
    ne(u, (t) => {
      if (k.value) {
        if (K && clearTimeout(K), !t.trim()) {
          B();
          return;
        }
        K = setTimeout(() => {
          U(t.trim());
        }, 500);
      }
    });
    async function U(t) {
      P && P.abort(), P = new AbortController(), H.value = !0, $.value = [], E.value = !1, L.value = 0;
      try {
        const e = new URLSearchParams({
          q: t,
          mode: i.mode === "directory" ? "directory" : i.mode === "file" ? "file" : "all",
          limit: "200"
        }), a = await fetch(`${i.apiBase}/fs/search?${e}`, {
          signal: P.signal
        });
        if (!a.ok) {
          let S = `HTTP ${a.status}`;
          try {
            S = (await a.json()).error || S;
          } catch {
            S = "搜索请求失败";
          }
          $.value = [], H.value = !1;
          return;
        }
        const o = await a.json();
        $.value = o.items || [], E.value = o.truncated || !1, L.value = o.elapsed || 0, G.value = o.engine || "";
      } catch (e) {
        if (e.name === "AbortError") return;
        console.warn("[globalSearch] 搜索失败:", e.message), $.value = [];
      } finally {
        H.value = !1;
      }
    }
    function ge(t) {
      if (!t) return "";
      const e = t.replace(/[/\\]/g, "/").split("/");
      return e.pop(), e.join("/");
    }
    async function ke() {
      try {
        await fetch(`${i.apiBase}/fs/reindex`, { method: "POST" }), m.value = { ...m.value, status: "indexing" };
        const t = setInterval(async () => {
          await W(), (m.value.status === "ready" || m.value.status === "error") && clearInterval(t);
        }, 2e3);
      } catch {
      }
    }
    function le(t) {
      if (!t || t === 0) return "0 B";
      const e = 1024, a = ["B", "KB", "MB", "GB"], o = Math.floor(Math.log(t) / Math.log(e));
      return `${parseFloat((t / Math.pow(e, o)).toFixed(2))} ${a[o]}`;
    }
    function ye(t) {
      if (!t) return "";
      const e = new Date(t);
      return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")} ${String(e.getHours()).padStart(2, "0")}:${String(e.getMinutes()).padStart(2, "0")}`;
    }
    function we(t) {
      if (t.kind === "directory") return "#a78bfa";
      const e = (t.ext || "").replace(".", "");
      return Be(e);
    }
    return ne(() => i.visible, async (t) => {
      if (t) {
        h.value = [], u.value = "", M.value = "", B();
        const e = await ie();
        await re(), await W(), await R(e || "");
      } else
        B();
    }), (t, e) => (l(), Se(Ce, { to: "body" }, [
      r.visible ? (l(), n("div", {
        key: 0,
        class: "modal-overlay",
        onClick: e[10] || (e[10] = z((a) => t.$emit("close"), ["self"]))
      }, [
        s("div", {
          class: D(["modal-container", { "modal-theme-light": r.theme === "light" }])
        }, [
          s("div", Fe, [
            s("h3", Ve, [
              v(f, {
                name: r.mode === "file" ? "file" : "folder",
                size: 18,
                color: y.value
              }, null, 8, ["name", "color"]),
              p(" " + c(r.mode === "file" ? "选择文件" : "选择文件夹"), 1)
            ]),
            s("button", {
              class: "close-btn",
              onClick: e[0] || (e[0] = (a) => t.$emit("close")),
              title: "关闭"
            }, [
              v(f, {
                name: "close",
                size: 16
              })
            ])
          ]),
          s("div", Ie, [
            s("button", {
              class: "tool-btn",
              onClick: ce,
              disabled: !I.value,
              title: "返回上一级"
            }, [
              v(f, {
                name: "arrowUp",
                size: 14
              }),
              e[11] || (e[11] = p(" 上级 ", -1))
            ], 8, Ae),
            s("button", {
              class: "tool-btn",
              onClick: ee,
              title: "家目录"
            }, [
              v(f, {
                name: "home",
                size: 14
              }),
              e[12] || (e[12] = p(" 家目录 ", -1))
            ]),
            s("button", {
              class: "tool-btn",
              onClick: de,
              title: "刷新"
            }, [
              v(f, {
                name: "refresh",
                size: 14
              })
            ]),
            s("div", Ee, [
              (l(!0), n(N, null, Z(q.value, (a, o) => (l(), n("span", {
                key: o,
                class: "breadcrumb-item",
                onClick: (S) => ue(o)
              }, [
                s("span", Re, c(a.label), 1),
                o < q.value.length - 1 ? (l(), n("span", Ue, "/")) : b("", !0)
              ], 8, Le))), 128))
            ])
          ]),
          s("div", Ne, [
            v(f, {
              name: "search",
              size: 16,
              color: "#8b91a8",
              class: "search-icon"
            }),
            Me(s("input", {
              "onUpdate:modelValue": e[1] || (e[1] = (a) => u.value = a),
              type: "text",
              class: "search-input",
              placeholder: k.value ? `全局搜索${r.mode === "file" ? "文件" : r.mode === "directory" ? "文件夹" : "文件和文件夹"}...` : "搜索当前目录...",
              onKeydown: xe(be, ["enter"])
            }, null, 40, Ze), [
              [ze, u.value]
            ]),
            u.value ? (l(), n("button", {
              key: 0,
              class: "clear-search",
              onClick: pe
            }, [
              v(f, {
                name: "close",
                size: 14
              })
            ])) : b("", !0),
            s("div", {
              class: "global-toggle",
              title: k.value ? "全局搜索：在整个磁盘范围内搜索" : "当前目录搜索：仅在当前目录中过滤"
            }, [
              e[14] || (e[14] = s("span", { class: "toggle-label" }, "全局", -1)),
              s("button", {
                class: D(["toggle-switch", { active: k.value }]),
                onClick: me
              }, [...e[13] || (e[13] = [
                s("span", { class: "toggle-knob" }, null, -1)
              ])], 2)
            ], 8, Ge),
            k.value ? (l(), n("div", {
              key: 1,
              class: D(["index-status", m.value.status]),
              title: m.value.status === "ready" ? `索引就绪，共 ${m.value.totalFiles} 项，已扫描: ${(m.value.scannedRoots || []).join(", ") || "unknown"}` : m.value.status === "indexing" ? `正在建索引... ${m.value.indexedFiles} 项，当前: ${m.value.currentDir || ""}` : "索引未就绪，使用实时搜索",
              onClick: e[2] || (e[2] = (a) => m.value.status !== "indexing" && ke())
            }, [
              e[15] || (e[15] = s("span", { class: "status-dot" }, null, -1)),
              s("span", Ke, c(m.value.status === "ready" ? "索引" : m.value.status === "indexing" ? "索引中" : "离线"), 1)
            ], 10, qe)) : b("", !0)
          ]),
          s("div", Oe, [
            s("div", Xe, [
              s("div", Qe, [
                e[20] || (e[20] = s("div", { class: "sidebar-title" }, "快捷访问", -1)),
                s("div", {
                  class: "sidebar-item",
                  onClick: ee
                }, [
                  v(f, {
                    name: "home",
                    size: 15
                  }),
                  e[16] || (e[16] = p(" 家目录 ", -1))
                ]),
                X.value ? (l(), n("div", {
                  key: 0,
                  class: "sidebar-item",
                  onClick: e[3] || (e[3] = (a) => T(X.value))
                }, [
                  v(f, {
                    name: "monitor",
                    size: 15
                  }),
                  e[17] || (e[17] = p(" 桌面 ", -1))
                ])) : b("", !0),
                Q.value ? (l(), n("div", {
                  key: 1,
                  class: "sidebar-item",
                  onClick: e[4] || (e[4] = (a) => T(Q.value))
                }, [
                  v(f, {
                    name: "file",
                    size: 15
                  }),
                  e[18] || (e[18] = p(" 文档 ", -1))
                ])) : b("", !0),
                Y.value ? (l(), n("div", {
                  key: 2,
                  class: "sidebar-item",
                  onClick: e[5] || (e[5] = (a) => T(Y.value))
                }, [
                  v(f, {
                    name: "download",
                    size: 15
                  }),
                  e[19] || (e[19] = p(" 下载 ", -1))
                ])) : b("", !0)
              ]),
              A.value.length ? (l(), n("div", Ye, [
                e[21] || (e[21] = s("div", { class: "sidebar-title" }, "磁盘", -1)),
                (l(!0), n(N, null, Z(A.value, (a) => (l(), n("div", {
                  key: a,
                  class: D(["sidebar-item", { active: g.value === a }]),
                  onClick: (o) => T(a)
                }, [
                  v(f, {
                    name: "hardDrive",
                    size: 15
                  }),
                  p(" " + c(a), 1)
                ], 10, Je))), 128))
              ])) : b("", !0)
            ]),
            s("div", {
              class: "file-list-container",
              onClick: z(ve, ["self"])
            }, [
              V.value ? (l(), n("div", We, [...e[22] || (e[22] = [
                s("span", { class: "spinner" }, null, -1),
                p(" 加载中... ", -1)
              ])])) : M.value ? (l(), n("div", et, [
                v(f, {
                  name: "circleX",
                  size: 18,
                  color: "currentColor"
                }),
                p(" " + c(M.value), 1)
              ])) : H.value ? (l(), n("div", tt, [...e[23] || (e[23] = [
                s("span", { class: "spinner" }, null, -1),
                p(" 全局搜索中... ", -1)
              ])])) : J.value.length === 0 ? (l(), n("div", at, c(u.value ? "没有匹配的结果" : "空目录"), 1)) : (l(), n("div", st, [
                $.value.length > 0 ? (l(), n("div", lt, [
                  v(f, {
                    name: "search",
                    size: 14,
                    color: "#8b91a8"
                  }),
                  s("span", null, [
                    e[24] || (e[24] = p("找到 ", -1)),
                    s("strong", null, c($.value.length), 1),
                    e[25] || (e[25] = p(" 个结果", -1))
                  ]),
                  E.value ? (l(), n("span", nt, "（已达上限，请缩小关键词）")) : b("", !0),
                  s("span", {
                    class: D(["engine-badge", G.value])
                  }, c(G.value === "index" ? "索引搜索" : "实时搜索"), 3),
                  s("span", ot, c(L.value) + "ms", 1)
                ])) : b("", !0),
                r.mode === "directory" && !F.value ? (l(), n("div", {
                  key: 1,
                  class: D(["file-row select-current-dir", { selected: te(g.value) }]),
                  onClick: [
                    e[6] || (e[6] = z((a) => x(g.value), ["exact"])),
                    e[7] || (e[7] = z((a) => x(g.value), ["ctrl"])),
                    e[8] || (e[8] = z((a) => x(g.value), ["meta"]))
                  ]
                }, [
                  v(f, {
                    name: "circleCheck",
                    size: 18,
                    color: "#a78bfa",
                    class: "file-icon"
                  }),
                  e[26] || (e[26] = s("span", { class: "file-name" }, "选择当前文件夹", -1)),
                  s("span", it, c(g.value), 1)
                ], 2)) : b("", !0),
                (l(!0), n(N, null, Z(J.value, (a) => (l(), n("div", {
                  key: a.path,
                  class: D(["file-row", {
                    selected: te(a.path),
                    "is-directory": a.kind === "directory"
                  }]),
                  onClick: [
                    z((o) => ae(a), ["exact"]),
                    z((o) => se(a), ["ctrl"]),
                    z((o) => se(a), ["meta"])
                  ],
                  onDblclick: (o) => fe(a)
                }, [
                  v(f, {
                    name: a.kind === "directory" ? "folder" : "file",
                    size: 18,
                    color: we(a),
                    class: "file-icon"
                  }, null, 8, ["name", "color"]),
                  s("span", {
                    class: "file-name",
                    title: a.name
                  }, c(a.name), 9, ct),
                  F.value ? (l(), n("span", {
                    key: 0,
                    class: "file-parent-path",
                    title: a.path
                  }, c(ge(a.path)), 9, ut)) : b("", !0),
                  a.kind === "file" ? (l(), n("span", {
                    key: 1,
                    class: "file-size",
                    title: le(a.size)
                  }, c(le(a.size)), 9, dt)) : b("", !0),
                  a.modified ? (l(), n("span", {
                    key: 2,
                    class: "file-modified",
                    title: a.modified
                  }, c(ye(a.modified)), 9, vt)) : b("", !0)
                ], 42, rt))), 128))
              ]))
            ])
          ]),
          s("div", ft, [
            s("div", ht, [
              h.value.length === 0 ? (l(), n("span", mt, " 未选择" + c(r.mode === "file" ? "文件" : "文件夹"), 1)) : r.multiple ? (l(), n("span", bt, [
                e[27] || (e[27] = p(" 已选择 ", -1)),
                s("strong", null, c(h.value.length), 1),
                e[28] || (e[28] = p(" 项 ", -1))
              ])) : (l(), n("span", {
                key: 1,
                class: "has-selection single-path",
                title: h.value[0]
              }, c(h.value[0]), 9, pt))
            ]),
            s("div", gt, [
              s("button", {
                class: "btn btn-cancel",
                onClick: e[9] || (e[9] = (a) => t.$emit("close"))
              }, "取消"),
              s("button", {
                class: "btn btn-confirm",
                disabled: h.value.length === 0,
                onClick: he
              }, " 确认选择 ", 8, kt)
            ])
          ])
        ], 2)
      ])) : b("", !0)
    ]));
  }
}, $t = /* @__PURE__ */ oe(yt, [["__scopeId", "data-v-b041e876"]]);
export {
  $t as FilePickerModal,
  f as SvgIcon,
  Be as getFileTypeColor,
  De as icons
};
