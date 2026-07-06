import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [vue()],
  server: {
    port: 38742,
    strictPort: true,
    proxy: {
      '/api': 'http://localhost:38741',
    },
  },
});
