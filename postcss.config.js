import path from 'node:path';
import { fileURLToPath } from 'node:url';

// tailwind.config.js はカレントディレクトリ基準で探索されるため、
// どこから起動しても見つかるように絶対パスで明示する
const dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  plugins: {
    tailwindcss: { config: path.join(dirname, 'tailwind.config.js') },
    autoprefixer: {},
  },
};
