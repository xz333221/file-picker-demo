---
name: file-picker-demo
description: "This skill should be used when the user wants to create a file/directory picker web application with a custom modal dialog, backend filesystem API, and optional global file search. It scaffolds a Vue 3 + Vite frontend with an Express backend that can read absolute file paths from the local filesystem. Triggers include requests to build a file picker, file manager, folder selector, or any project needing backend file system access from a web UI."
agent_created: true
---

# File Picker Demo

## Overview

Scaffold a full-stack file/directory picker application using Vue 3 (frontend) and
Express (backend). The backend reads the local filesystem and returns absolute paths,
while the frontend renders a custom modal dialog with breadcrumb navigation, quick
access sidebar, multi-selection, and global file search powered by a SQLite index.

## When to Use

- Building a file picker, folder selector, or file manager web UI
- Needing absolute file paths from the server (not browser sandboxed paths)
- Wanting a global file search similar to Listary/Everything within a web app
- Creating a desktop-like file browsing experience in the browser

## Tech Stack

| Layer | Technology | Port |
|-------|-----------|------|
| Frontend | Vue 3.5 + Vite 7 | 7891 |
| Backend | Express 5 + CORS | 8642 |
| Database | Node.js built-in `node:sqlite` | — |
| Indexing | Worker Threads | — |

## Workflow

### Step 1: Scaffold the project

Create a new project directory and copy all files from `assets/` into it.
The `assets/` directory contains the complete project structure:

```
project-root/
├── package.json          # Root package with concurrently dev script
├── client/
│   ├── package.json      # Vue 3 + Vite dependencies
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── main.js
│       ├── App.vue
│       ├── components/
│       │   └── FilePickerModal.vue
│       └── icons/
│           ├── SvgIcon.vue
│           └── index.js
└── server/
    ├── package.json      # Express + CORS dependencies
    ├── index.js          # Main Express server with filesystem API
    └── indexer/
        └── worker.js     # Background SQLite index builder
```

### Step 2: Install dependencies

Run npm install in three locations:

1. Root directory (installs `concurrently` for unified dev start)
2. `client/` directory (installs Vue 3, Vite, `@vitejs/plugin-vue`)
3. `server/` directory (installs `express`, `cors`)

### Step 3: Start development servers

From the root directory, run:

```bash
npm run dev
```

This starts both servers concurrently:
- Backend: `http://localhost:8642`
- Frontend: `http://localhost:7891` (with Vite proxy to backend)

### Step 4: Verify the API

After the backend starts, it automatically begins building a SQLite file index.
The following API endpoints are available:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check + index status |
| GET | `/api/fs/home` | User home directory |
| GET | `/api/fs/drives` | List drives (Windows) or `/` |
| GET | `/api/fs/list?dir=xxx` | List directory contents |
| GET | `/api/fs/search?q=xxx&mode=all` | Global file search |
| GET | `/api/fs/index-status` | Index build progress |
| POST | `/api/fs/reindex` | Force rebuild index |

## Key Features

### Custom File Picker Modal
- Self-implemented modal dialog (no browser native picker)
- Supports both `file` and `directory` selection modes
- Breadcrumb navigation and "go up" button
- Quick access sidebar (Home, Desktop, Documents, Downloads, Drives)
- Multi-selection with Ctrl+Click
- Dark theme UI with SVG icons (Lucide-style, no emoji)

### Backend Filesystem API
- Reads actual absolute paths from the server filesystem
- Path sanitization prevents directory traversal
- Graceful handling of permission errors
- Windows drive enumeration via `wmic` with fallback

### Global File Search
- SQLite-based index stored at `~/.file-picker-demo-index.db`
- Worker thread builds index asynchronously (does not block server)
- Indexes common directories: Desktop, Documents, Downloads, workspace, and drives D:/E:/F:
- Falls back to real-time filesystem walk if index is not ready
- Auto-search with debounce (500ms) in global mode
- Toggle between "current directory filter" and "global search"

## Customization Guide

### Changing ports
Edit `server/index.js` (backend port) and `client/vite.config.js` (frontend port + proxy target).

### Adjusting indexed directories
Edit `getIndexRoots()` in `server/indexer/worker.js` to add or remove root paths.

### Adding file type colors
Edit `fileTypeColors` in `client/src/icons/index.js` to map more extensions to colors.

### Changing the UI theme
Modify CSS custom properties in `client/src/App.vue` (`:root` block) and the scoped styles in `FilePickerModal.vue`.

## Architecture Notes

- **No external SQLite dependency**: Uses Node.js 24+ built-in `node:sqlite` module.
- **Zero-config indexing**: Index builds automatically on first start; force rebuild with `FORCE_REINDEX=1` env var.
- **Watch for changes**: The server sets up `fs.watch` on home directory subfolders for incremental index updates.
- **Platform aware**: Windows paths (`C:\`) and Unix paths (`/`) are handled correctly throughout.

## Resources

### assets/
Complete project template containing all source files needed to create the file picker application. Copy the entire `assets/` directory contents into a new project folder and install dependencies.
