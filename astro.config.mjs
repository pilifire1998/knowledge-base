import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [
    mdx(),
    react(),
    tailwind(),
  ],
  site: 'https://your-project.vercel.app',
  output: 'static',
});
