import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' — どのサブパスに置いてもオフラインPWAとして動くように相対パスでビルドする
export default defineConfig({
  base: './',
  plugins: [react()],
});
