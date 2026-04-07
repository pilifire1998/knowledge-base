# 前端知识库网站设计文档

> 创建日期：2026-04-06
> 状态：待审查

## 1. 项目概述

### 1.1 目标

构建一个兼具**个人知识整理**和**对外技术展示**双重目的的前端知识库网站。

### 1.2 核心需求

- 收录技术文档、项目案例、学习笔记、代码片段、工具推荐等内容
- 支持快速查找和浏览
- 视觉风格：杂志编辑风（大胆排版、强烈对比、艺术感）
- 人性化的交互体验

### 1.3 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 框架 | Astro | 4.x |
| UI 层 | React | 18+ |
| 类型 | TypeScript | 5.x |
| 样式 | Tailwind CSS | 3.x |
| 内容 | MDX | - |
| 搜索 | Pagefind | - |
| 部署 | Vercel | - |

## 2. 系统架构

### 2.1 整体架构

```
用户浏览器
    │
    ├── 访问 https://your-domain.vercel.app
    │
    ▼
Vercel Edge Network (全球 CDN)
    │
    ▼
Astro 构建输出
    ├── 静态 HTML (SSG)
    ├── CSS (优化、压缩)
    └── React 岛屿 (搜索、主题切换、目录导航)
    │
    ▼
内容层
    ├── Markdown/MDX 文件
    ├── Frontmatter 元数据
    └── 静态资源
```

### 2.2 页面类型

| 页面 | 路由 | 类型 | 说明 |
|------|------|------|------|
| 首页 | `/` | 静态 | 杂志风大胆展示 |
| 文章列表 | `/articles` | 静态 | 按标签/时间筛选 |
| 文章详情 | `/articles/[slug]` | 静态 + 岛屿 | 沉浸阅读 + 交互功能 |
| 标签页 | `/tags/[tag]` | 静态 | 标签筛选 |
| 搜索页 | `/search` | 客户端 | 实时搜索结果 |
| 关于页 | `/about` | 静态 | 个人介绍 |

### 2.3 目录结构

```
knowledge-base/
├── src/
│   ├── components/           # UI 组件
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── ArticleCard.astro
│   │   ├── TagBadge.astro
│   │   ├── SearchModal.tsx   # React 岛屿
│   │   ├── ThemeToggle.tsx   # React 岛屿
│   │   ├── TableOfContents.tsx
│   │   └── ReadingProgress.tsx
│   │
│   ├── layouts/              # 页面布局
│   │   ├── BaseLayout.astro
│   │   ├── ArticleLayout.astro
│   │   └── ListLayout.astro
│   │
│   ├── pages/                # 页面路由
│   │   ├── index.astro
│   │   ├── articles/
│   │   │   ├── index.astro
│   │   │   └── [...slug].astro
│   │   ├── tags/
│   │   │   ├── index.astro
│   │   │   └── [tag].astro
│   │   ├── search.astro
│   │   └── about.astro
│   │
│   ├── styles/               # 样式
│   │   ├── global.css
│   │   ├── typography.css
│   │   └── themes.css
│   │
│   └── utils/                # 工具函数
│       ├── formatDate.ts
│       ├── readingTime.ts
│       └── sortByDate.ts
│
├── src/content/              # 内容集合
│   ├── articles/             # 文章目录
│   │   └── *.mdx
│   └── config.ts
│
├── public/                   # 静态资源
│   ├── images/
│   ├── fonts/
│   └── favicon.ico
│
├── scripts/                  # 脚本
│   └── new-article.js
│
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

## 3. 组件设计

### 3.1 布局组件

#### Header（导航栏）

```
┌─────────────────────────────────────────────────────────────┐
│  DEV.JOURNAL        文章  项目  关于           🌙 [搜索...]  │
└─────────────────────────────────────────────────────────────┘
```

- Logo：粗体 900，字间距 -0.02em
- 导航链接：字重 600
- 搜索入口：固定在导航栏，支持 Cmd+K 快捷键
- 主题切换：月亮/太阳图标

#### ArticleCard（文章卡片）

```
┌─────────────────────────────────────────────────────────────┐
│ [MONOREPO] [工程化]                                         │
│                                                             │
│ 深入理解 Monorepo 架构设计                                   │
│                                                             │
│ 从零开始构建现代化 monorepo 项目，涵盖 pnpm workspace...    │
│                                                             │
│ 2024.04.06 · 8 分钟阅读                                     │
└─────────────────────────────────────────────────────────────┘
```

- 左侧粗边框（4px #000）
- 标签字重 600，大写，字间距 0.05em
- 标题字重 900
- 悬停效果：translateY(-4px)

#### TableOfContents（目录导航）

- React 岛屿组件
- 固定在文章右侧
- 跟随滚动高亮当前章节
- 底部显示阅读进度条

### 3.2 交互组件（React 岛屿）

#### SearchModal

- 全局搜索，Cmd+K 唤起
- Pagefind API 实时搜索
- 支持键盘导航（↑↓ Enter Esc）
- 搜索标题、内容、标签

#### ThemeToggle

- 深色/浅色主题切换
- localStorage 持久化
- 平滑过渡动画（300ms）

#### ReadingProgress

- IntersectionObserver 监听滚动
- 顶部进度条显示
- 0-100% 实时更新

### 3.3 内容组件

#### Prose（文章排版）

- 最大宽度 65ch
- 行高 1.75
- 字号 1.05rem
- 标题、段落、代码块、引用块样式

## 4. 内容结构

### 4.1 Frontmatter 元数据

```yaml
---
title: "深入理解 Monorepo 架构设计"
description: "从零开始构建现代化 monorepo 项目"
pubDate: 2024-04-06
updatedDate: 2024-04-08
heroImage: "/images/monorepo-cover.jpg"
tags: ["monorepo", "工程化", "pnpm"]
category: "工程化"
series: "现代前端工程化"
seriesOrder: 1
featured: true
draft: false
---
```

### 4.2 标签分类

**按技术栈：**
- React, TypeScript, Node.js
- Monorepo, CSS, 性能优化

**按内容类型：**
- 教程, 实战案例, 学习笔记
- 代码片段, 工具推荐

**按系列：**
- 现代前端工程化
- React 进阶
- TypeScript 深入

### 4.3 内容集合配置

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()),
    category: z.string(),
    series: z.string().optional(),
    seriesOrder: z.number().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
```

## 5. 主题系统

### 5.1 色彩系统

#### 浅色主题（默认）

| 名称 | 色值 | 用途 |
|------|------|------|
| Primary | #000000 | 主要文字、边框 |
| Secondary | #666666 | 次要文字 |
| Muted | #999999 | 辅助文字 |
| Background | #F5F5F5 | 页面背景 |
| Surface | #FFFFFF | 卡片背景 |

#### 深色主题

| 名称 | 色值 | 用途 |
|------|------|------|
| Primary | #FFFFFF | 主要文字 |
| Secondary | #999999 | 次要文字 |
| Muted | #666666 | 辅助文字 |
| Background | #0A0A0A | 页面背景 |
| Surface | #141414 | 卡片背景 |

### 5.2 字体排版系统

| 级别 | 字号 | 字重 | 字间距 | 用途 |
|------|------|------|--------|------|
| Display | 4rem | 900 | -0.03em | 首页英雄标题 |
| H1 | 2.5rem | 900 | -0.02em | 页面主标题 |
| H2 | 1.75rem | 800 | - | 章节标题 |
| H3 | 1.25rem | 700 | - | 小节标题 |
| Body | 1.05rem | 400 | - | 正文内容 |
| Caption | 0.75rem | 600 | 0.05em | 标签、说明 |

### 5.3 CSS 变量

```css
:root {
  --color-primary: #000;
  --color-secondary: #666;
  --color-muted: #999;
  --color-bg: #f5f5f5;
  --color-surface: #fff;
  --color-border: #000;

  --font-display: 900;
  --font-heading: 700;
  --font-body: 400;

  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease: cubic-bezier(0.25, 0.1, 0.25, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}

[data-theme="dark"] {
  --color-primary: #fff;
  --color-secondary: #999;
  --color-muted: #666;
  --color-bg: #0a0a0a;
  --color-surface: #141414;
  --color-border: #fff;
}
```

## 6. 动效设计

### 6.1 动效类型

| 类型 | 触发 | 效果 | 时长 |
|------|------|------|------|
| 文字揭示 | 滚动进入视口 | opacity 0→1, translateY 20px→0 | 600ms ease-out |
| 卡片悬停 | 鼠标悬停 | translateY -4px, 加深边框 | 200ms ease |
| 主题切换 | 点击按钮 | 整体颜色过渡 | 300ms ease-in-out |

### 6.2 性能原则

- 仅使用 `transform` 和 `opacity` 动画
- 避免使用 `will-change`，除非必要
- 使用 IntersectionObserver 懒加载动画
- 支持 `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 7. 搜索功能

### 7.1 Pagefind 集成

- 构建时自动生成搜索索引
- 索引文件大小：约 200KB（gzip）
- 按需加载分片，懒加载优化
- 响应时间 <50ms

### 7.2 搜索流程

```
用户输入 → Pagefind API → 匹配结果 → React 渲染
```

### 7.3 搜索范围

- 文章标题
- 文章内容
- 标签
- 描述

## 8. 部署策略

### 8.1 部署流程

```
编辑 Markdown → Git Push → GitHub → Vercel 构建 → 全球发布
```

### 8.2 构建时间预估

| 文章数量 | 构建时间 |
|----------|----------|
| 50 篇 | ~30s |
| 100 篇 | ~60s |
| 搜索索引 | +10s |

### 8.3 开发命令

```bash
# 启动开发服务器
pnpm dev

# 新建文章
pnpm new:article "文章标题"

# 本地预览
pnpm preview

# 构建生产版本
pnpm build
```

## 9. 性能目标

| 指标 | 目标值 |
|------|--------|
| Lighthouse 性能 | 95+ |
| 首屏 JS | <50KB (gzip) |
| LCP | <1s |
| CLS | 0 |
| FCP | <1.5s |

## 10. 扩展性

### 10.1 可选功能

- 评论系统
- 分析工具
- RSS 订阅
- 多语言支持

### 10.2 内容扩展

- 项目案例库
- 代码片段集合
- 工具推荐列表

## 11. 设计原则总结

1. **大胆的字重对比**：900 vs 400，强烈的视觉层次
2. **黑白经典配色**：纯色系统，无渐变干扰
3. **性能优先**：静态优先，零 JS 默认
4. **类型安全**：TypeScript 全覆盖
5. **无障碍**：支持 prefers-reduced-motion
6. **易于维护**：清晰的目录结构

---

**下一步**：使用 writing-plans 技能创建详细的实现计划
