import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],

  base: command === 'build'
    ? '/static/frontend/build/'
    : '/',

  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
  },

  build: {
    outDir: '../backend/static/frontend/build',
    emptyOutDir: true,
    manifest: true,
  }
}))
