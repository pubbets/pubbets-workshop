import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  publicDir: 'assets',
  server: { port: 8000, strictPort: true },
  preview: { port: 8000, strictPort: true },
  test: { environment: 'jsdom' }
});
