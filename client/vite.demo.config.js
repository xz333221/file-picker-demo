import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [vue()],
  root: '.',
  server: {
    port: 7892,
    open: '/demo.html',
    proxy: {
      '/api': {
        target: 'http://localhost:8642',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        demo: resolve(__dirname, 'demo.html'),
      },
    },
  },
});