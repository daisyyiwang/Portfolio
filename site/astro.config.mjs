// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://daisywang.design',
  integrations: [mdx()],
  build: { format: 'directory' },
});
