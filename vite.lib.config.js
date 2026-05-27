import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/index.js'),
      name: 'FilePicker',
      fileName: (format) => `file-picker.${format === 'es' ? 'mjs' : 'umd.cjs'}`,
    },
    rollupOptions: {
      // vue 不打入包内，由用户项目提供
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' },
        // 确保 CSS 被提取为独立文件
        assetFileNames: 'file-picker.[ext]',
      },
    },
    outDir: 'dist',
  },
});
