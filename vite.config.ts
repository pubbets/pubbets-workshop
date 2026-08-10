import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  publicDir: false,
  server: {
    port: 8000,
    strictPort: true,
    watch: {
      ignored: [
        '**/assets/canva-converted/**',
        '**/.codex-remote-attachments/**',
        '**/.claude/**'
      ]
    }
  },
  preview: { port: 8000, strictPort: true },
  test: { environment: 'jsdom' }
});
