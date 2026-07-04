import path from 'node:path';
import { fileURLToPath } from 'node:url';

// content はカレントディレクトリ基準で解決されるため、
// どこから起動してもよいように設定ファイル基準の絶対パスにする。
// globパターンとして解釈されるので、Windowsでも区切りは必ずスラッシュにする
const dirname = path.dirname(fileURLToPath(import.meta.url)).replace(/\\/g, '/');

/** @type {import('tailwindcss').Config} */
export default {
  content: [`${dirname}/index.html`, `${dirname}/src/**/*.{ts,tsx}`],
  theme: {
    extend: {
      colors: {
        sbux: {
          DEFAULT: '#00704A',
          dark: '#1E3932',
          light: '#D4E9E2',
          cream: '#F2F0EB',
        },
      },
    },
  },
  plugins: [],
};
