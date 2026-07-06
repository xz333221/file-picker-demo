# local-file-picker · 消费方 Demo

一个最小可运行的演示项目,用于验证从 **npm 公共仓库** 安装 `local-file-picker` 最新版本后,前后端集成是否正常。

## 项目结构

```
demo/
├── client/                 # Vue 3 + Vite 前端
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── main.js
│       └── App.vue         # 从 local-file-picker/client 导入组件
├── server/
│   └── index.js            # Express + createFilePickerMiddleware
└── package.json            # 依赖 local-file-picker@latest
```

## 安装

```bash
cd demo
npm install
```

`local-file-picker` 字段为 `"latest"`,运行 `npm install` 时会拉取当前最新发布版本(目前为 `0.1.6`)。

## 启动

```bash
npm run dev          # 同时启动后端 (38741) 和前端 (38742)
# 或拆开:
npm run dev:server   # http://localhost:38741
npm run dev:client   # http://localhost:38742
```

打开 http://localhost:38742,点击 **选择文件** / **选择文件夹** 按钮即可弹出文件选择器。

## 验证项

- ✅ 客户端组件 `FilePickerModal` / `SvgIcon` 从 `local-file-picker/client` 子路径导入
- ✅ 样式 `local-file-picker/dist/file-picker.css` 正常加载
- ✅ 后端中间件 `createFilePickerMiddleware` 从包根导入
- ✅ 顶部会显示当前加载的包版本号(从包的 `package.json` 读取)
- ✅ Vite dev 代理 `/api → http://localhost:38741`,避免跨域

## 与主项目区别

| | 主项目 (`client/`, `server/`) | 本 demo |
|---|---|---|
| 组件来源 | 本地源码 (`./components/...`) | npm 包 (`local-file-picker/client`) |
| 中间件来源 | 本地源码 (`./middleware.js`) | npm 包 (`local-file-picker`) |
| 用途 | 库自身开发 | 模拟真实第三方消费方 |

## 升级到新版本

```bash
cd demo
npm update local-file-picker
# 或锁定到特定版本:
npm install local-file-picker@0.2.0
```

页面顶部会自动显示新版本号。
