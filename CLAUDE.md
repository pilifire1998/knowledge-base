# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

任何回答都说中文

## Project Overview

A frontend knowledge base website built with Astro 5.0, featuring MDX articles, full-text search, dark mode, and interactive components. Content is primarily in Chinese.

## Commands

```bash
pnpm dev              # Start development server (localhost:4321)
pnpm build            # Build for production + generate Pagefind search index
pnpm preview          # Preview production build
pnpm new:article "标题"  # Create new article from template
```

## Architecture

### Tech Stack
- **Astro 5.0** - Static site generator with content collections
- **React 18** - Interactive components (client:load hydration)
- **Tailwind CSS** - Utility classes with CSS custom properties for theming
- **MDX** - Article authoring with component support
- **Pagefind** - Static full-text search (generated post-build)
- **Mermaid** - Diagram rendering at build time

### Content System
Articles live in `src/content/articles/` as `.mdx` files. Schema defined in `src/content/config.ts`:
- Required frontmatter: `title`, `description`, `pubDate`, `tags`, `category`
- Optional: `heroImage`, `updatedDate`, `series`, `seriesOrder`, `featured`, `draft`

### Layouts
- `BaseLayout.astro` - Page shell with Header/Footer
- `ArticleLayout.astro` - Article page with TOC sidebar and reading progress
- `ListLayout.astro` - Paginated list pages

### Styling
Theme uses CSS custom properties defined in `src/styles/themes.css`:
- Light/dark mode via `[data-theme="dark"]` attribute or `prefers-color-scheme`
- Color tokens: `--color-primary`, `--color-secondary`, `--color-muted`, `--color-bg`, `--color-surface`, `--color-border`
- Tailwind references these via `primary`, `secondary`, `muted`, `surface`, `border` color names

### Search
- `SearchModal.tsx` loads Pagefind from `/pagefind/pagefind.js`
- Build generates search index via `postbuild` script
- Dev mode shows fallback limited search

### Interactive Components (React)
- `ThemeToggle.tsx` - Dark/light mode toggle
- `ReadingProgress.tsx` - Scroll progress bar
- `TableOfContents.tsx` - Article TOC navigation
- `TagFilter.tsx` - Tag filtering on list pages
- `SearchModal.tsx` - Full-text search UI

### Special Components
- `Mermaid.astro` - Server-rendered Mermaid diagrams (use in MDX)
- `MindMap.astro` - Tree-structure mind maps (use in MDX)

## Development Notes

### Path Aliases
`@/*` maps to `src/*` (configured in tsconfig.json)

### Adding New Articles
Use `pnpm new:article "标题"` to create from template, or manually create in `src/content/articles/` with required frontmatter.

### Search in Development
Full-text search only works after `pnpm build && pnpm preview`. Dev server shows fallback with limited results.

### MDX Components
Import and use Mermaid/MindMap in articles:
```mdx
import Mermaid from '../../components/Mermaid.astro';
import MindMap from '../../components/MindMap.astro';

<Mermaid code={`graph TD; A-->B;`} title="Diagram Title" />
<MindMap data={{text: "Root", children: [{text: "Child"}]}} />
```
