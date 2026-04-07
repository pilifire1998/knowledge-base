/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        muted: 'var(--color-muted)',
        surface: 'var(--color-surface)',
        border: 'var(--color-border)',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'display': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '900' }],
        'h1': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '900' }],
        'h2': ['1.75rem', { lineHeight: '1.3', fontWeight: '800' }],
        'h3': ['1.25rem', { lineHeight: '1.4', fontWeight: '700' }],
        'body': ['1.05rem', { lineHeight: '1.75', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.05em', fontWeight: '600' }],
      },
      transitionTimingFunction: {
        'out': 'cubic-bezier(0, 0, 0.2, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
