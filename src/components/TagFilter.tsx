import { useState, useMemo, useCallback } from 'react';

interface Article {
  slug: string;
  title: string;
  description: string;
  pubDate: Date;
  tags: string[];
  category: string;
}

interface TagFilterProps {
  articles: Article[];
}

// 标签分类配置
const TAG_CATEGORIES: Record<string, string[]> = {
  '工程化': ['monorepo', 'pnpm', 'turborepo', 'webpack', 'vite', '工程化', 'CI/CD'],
  '移动开发': ['react-native', 'flutter', 'ios', 'android', '移动开发', '跨平台'],
  'Web框架': ['react', 'vue', 'nextjs', 'astro'],
  '语言': ['typescript', 'javascript', 'rust', 'go', 'python'],
  '难度': ['入门', '进阶', '精通', '教程'],
};

export default function TagFilter({ articles }: TagFilterProps) {
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 获取所有标签及其数量
  const tagStats = useMemo(() => {
    const stats: Record<string, number> = {};
    articles.forEach((article) => {
      article.tags.forEach((tag) => {
        stats[tag] = (stats[tag] || 0) + 1;
      });
    });
    return stats;
  }, [articles]);

  // 按分类组织标签
  const categorizedTags = useMemo(() => {
    const result: Record<string, Array<[string, number]>> = {};
    const usedTags = new Set<string>();

    Object.entries(TAG_CATEGORIES).forEach(([category, categoryTags]) => {
      const tags: Array<[string, number]> = [];
      categoryTags.forEach((tag) => {
        Object.entries(tagStats).forEach(([t, count]) => {
          if (t.toLowerCase().includes(tag.toLowerCase()) || tag.toLowerCase().includes(t.toLowerCase())) {
            if (!usedTags.has(t)) {
              tags.push([t, count]);
              usedTags.add(t);
            }
          }
        });
      });
      if (tags.length > 0) {
        result[category] = tags.sort((a, b) => b[1] - a[1]);
      }
    });

    // 未分类标签
    const uncategorized: Array<[string, number]> = [];
    Object.entries(tagStats).forEach(([tag, count]) => {
      if (!usedTags.has(tag)) {
        uncategorized.push([tag, count]);
      }
    });
    if (uncategorized.length > 0) {
      result['其他'] = uncategorized.sort((a, b) => b[1] - a[1]);
    }

    return result;
  }, [tagStats]);

  // 筛选后的文章
  const filteredArticles = useMemo(() => {
    if (selectedTags.size === 0) {
      return articles;
    }
    return articles.filter((article) =>
      article.tags.some((tag) => selectedTags.has(tag))
    );
  }, [articles, selectedTags]);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  }, []);

  const clearFilter = useCallback(() => {
    setSelectedTags(new Set());
  }, []);

  return (
    <div className="flex gap-8">
      {/* 左侧标签栏 */}
      <aside className={`${isSidebarOpen ? 'w-56' : 'w-12'} flex-shrink-0 transition-all duration-200`}>
        <div className="sticky top-24">
          {/* 折叠按钮 */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mb-4 p-2 text-muted hover:text-primary transition-colors"
            aria-label={isSidebarOpen ? '收起' : '展开'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isSidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              )}
            </svg>
          </button>

          {isSidebarOpen && (
            <>
              {/* 已选标签 */}
              {selectedTags.size > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-caption uppercase tracking-wider text-muted font-semibold">
                      已选 {selectedTags.size}
                    </span>
                    <button
                      onClick={clearFilter}
                      className="text-xs text-secondary hover:text-primary"
                    >
                      清除
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {Array.from(selectedTags).map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--color-primary)] text-[var(--color-bg)] text-xs"
                      >
                        {tag}
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 标签分类 */}
              <nav className="space-y-4">
                {Object.entries(categorizedTags).map(([category, tags]) => (
                  <div key={category}>
                    <h3 className="text-caption uppercase tracking-wider text-muted font-semibold mb-2">
                      {category}
                    </h3>
                    <div className="space-y-1">
                      {tags.map(([tag, count]) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`w-full text-left px-2 py-1.5 text-sm rounded transition-colors flex items-center justify-between ${
                            selectedTags.has(tag)
                              ? 'bg-[var(--color-primary)] text-[var(--color-bg)]'
                              : 'text-secondary hover:text-primary hover:bg-[var(--color-bg)]'
                          }`}
                        >
                          <span className="truncate">{tag}</span>
                          <span className={`text-xs ${selectedTags.has(tag) ? 'opacity-70' : 'text-muted'}`}>
                            {count}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>
            </>
          )}
        </div>
      </aside>

      {/* 右侧文章列表 */}
      <main className="flex-1 min-w-0">
        {/* 文章数量 */}
        <div className="mb-6 pb-4 border-b border-[var(--color-border)]">
          <span className="text-secondary">
            <span className="font-semibold text-primary text-lg">{filteredArticles.length}</span> 篇文章
          </span>
        </div>

        {/* 文章列表 */}
        <div className="grid gap-4 md:grid-cols-2">
          {filteredArticles.map((article) => (
            <a
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="group block p-5 bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all duration-200"
            >
              <div className="flex flex-wrap gap-2 mb-2">
                {article.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className={`text-xs ${
                      selectedTags.has(tag) ? 'text-primary font-semibold' : 'text-muted'
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
                {article.tags.length > 3 && (
                  <span className="text-xs text-muted">+{article.tags.length - 3}</span>
                )}
              </div>

              <h3 className="text-lg font-semibold text-primary mb-2 group-hover:opacity-80 transition-opacity line-clamp-1">
                {article.title}
              </h3>

              <p className="text-secondary text-sm mb-3 line-clamp-2">
                {article.description}
              </p>

              <div className="flex items-center justify-between text-xs text-muted">
                <span>{article.pubDate.toLocaleDateString('zh-CN')}</span>
                <span className="text-secondary">{article.category}</span>
              </div>
            </a>
          ))}
        </div>

        {/* 空状态 */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-16">
            <div className="text-muted mb-4">没有找到匹配的文章</div>
            <button
              onClick={clearFilter}
              className="text-sm text-secondary hover:text-primary transition-colors"
            >
              清除筛选
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
