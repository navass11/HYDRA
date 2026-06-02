import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

const isGHPages = process.env.DEPLOY_TARGET === 'gh-pages';

export default defineConfig({
  site:   isGHPages ? 'https://navass11.github.io' : 'http://localhost',
  base:   isGHPages ? '/HYDRA' : '/',
  integrations: [tailwind()],
});
