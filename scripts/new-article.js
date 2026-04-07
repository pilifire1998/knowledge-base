#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const title = process.argv[2];

if (!title) {
  console.error('请提供文章标题');
  console.error('用法: pnpm new:article "文章标题"');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/\s+/g, '-')
  .replace(/[^a-z0-9\u4e00-\u9fa5-]/g, '');

const date = new Date().toISOString().split('T')[0];
const filePath = path.join(__dirname, '..', 'src', 'content', 'articles', `${slug}.mdx`);

const template = `---
title: "${title}"
description: ""
pubDate: ${date}
tags: []
category: ""
---

## ${title}

开始编写你的文章内容...
`;

if (fs.existsSync(filePath)) {
  console.error(`文件已存在: ${filePath}`);
  process.exit(1);
}

fs.writeFileSync(filePath, template);
console.log(`创建文章: ${filePath}`);
