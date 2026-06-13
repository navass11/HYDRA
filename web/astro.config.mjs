import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

const isGHPages = process.env.DEPLOY_TARGET === 'gh-pages';

// In local dev (npm run dev), proxy /api/* to the FastAPI server on port 8000.
// In Docker / production this is handled by nginx.
const API_DEV_TARGET = process.env.API_DEV_URL ?? 'http://localhost:8000';

export default defineConfig({
  site:   isGHPages ? 'https://navass11.github.io' : 'http://localhost',
  base:   isGHPages ? '/HYDRA' : '/',
  integrations: [tailwind()],
  vite: {
    server: {
      proxy: {
        '/api': {
          target: API_DEV_TARGET,
          changeOrigin: true,
        },
      },
    },
  },
});
