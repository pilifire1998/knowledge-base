/**
 * Generate search index for dev mode and fallback search
 * Run: node scripts/generate-search-index.mjs
 */
import { readdir, readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(__dirname, '../src/content/articles');
const OUTPUT_FILE = join(__dirname, '../public/search-index.json');

async function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { frontmatter: {}, body: content };

  const frontmatterStr = match[1];
  const body = content.slice(match[0].length).trim();

  // Simple YAML-like parser
  const frontmatter = {};
  const lines = frontmatterStr.split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // Handle inline arrays like ["item1", "item2"]
    if (value.startsWith('[') && value.endsWith(']')) {
      const arrayContent = value.slice(1, -1);
      frontmatter[key] = arrayContent
        .split(',')
        .map(v => v.trim().replace(/^['"]|['"]$/g, ''));
    }
    // Handle quoted strings
    else if ((value.startsWith('"') && value.endsWith('"')) ||
             (value.startsWith("'") && value.endsWith("'"))) {
      frontmatter[key] = value.slice(1, -1);
    }
    // Handle booleans
    else if (value === 'true') {
      frontmatter[key] = true;
    } else if (value === 'false') {
      frontmatter[key] = false;
    }
    // Handle numbers
    else if (!isNaN(value) && value !== '') {
      frontmatter[key] = Number(value);
    }
    // Plain string
    else {
      frontmatter[key] = value;
    }
  }

  return { frontmatter, body };
}

function stripMdx(content) {
  if (!content) return '';

  // Remove import statements
  content = content.replace(/^import\s+.*$/gm, '');
  // Remove MDX components usage
  content = content.replace(/<[A-Z][a-zA-Z]*[^>]*\/>/g, '');
  content = content.replace(/<[A-Z][a-zA-Z]*[^>]*>[\s\S]*?<\/[A-Z][a-zA-Z]*>/g, '');
  // Remove code blocks (but keep their content for search)
  content = content.replace(/```[\s\S]*?```/g, (m) => {
    return m.replace(/```\w*\n?/, '').replace(/```$/, '');
  });
  // Remove markdown syntax
  content = content.replace(/[#*_`~\[\]()]/g, '');
  // Normalize whitespace
  content = content.replace(/\s+/g, ' ').trim();

  return content;
}

async function generateIndex() {
  console.log('Generating search index...');

  const files = await readdir(CONTENT_DIR);
  const articles = [];

  for (const file of files) {
    if (!file.endsWith('.mdx') && !file.endsWith('.md')) continue;

    const slug = file.replace(/\.(mdx|md)$/, '');
    const filePath = join(CONTENT_DIR, file);
    const content = await readFile(filePath, 'utf-8');

    const { frontmatter, body } = await extractFrontmatter(content);
    const plainText = stripMdx(body);

    // Skip drafts
    if (frontmatter.draft === true) continue;

    articles.push({
      url: `/articles/${slug}/`,
      title: frontmatter.title || '',
      description: frontmatter.description || '',
      tags: frontmatter.tags || [],
      category: frontmatter.category || '',
      content: plainText.slice(0, 5000),
    });
  }

  await writeFile(OUTPUT_FILE, JSON.stringify({ articles }, null, 2));
  console.log(`Generated index with ${articles.length} articles`);
  console.log(`Output: ${OUTPUT_FILE}`);
}

generateIndex().catch(console.error);
