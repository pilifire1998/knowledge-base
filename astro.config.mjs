import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

export default defineConfig({
  integrations: [
    mdx(),
    react(),
    tailwind(),
  ],
  site: 'https://your-project.vercel.app', // 替换为你的实际域名
  output: 'static',
  adapter: vercel({
    webAnalytics: { enabled: true }
  }),
});
