import { useState, useEffect, useCallback, useRef } from 'react';

interface SearchResult {
  url: string;
  meta: {
    title: string;
  };
  excerpt: string;
}

// Declare Pagefind type
declare global {
  interface Window {
    pagefind?: {
      init: () => Promise<void>;
      search: (query: string) => Promise<{
        results: Array<{ data: () => Promise<SearchResult> }>;
      }>;
    };
  }
}

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [pagefindLoaded, setPagefindLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load Pagefind via script
  useEffect(() => {
    const loadPagefind = async () => {
      // Check if already loaded
      if (window.pagefind) {
        try {
          await window.pagefind.init();
          setPagefindLoaded(true);
        } catch {
          setPagefindLoaded(false);
        }
        return;
      }

      // Try to load script
      const script = document.createElement('script');
      script.src = '/pagefind/pagefind.js';
      script.async = true;

      script.onload = async () => {
        try {
          if (window.pagefind) {
            await window.pagefind.init();
            setPagefindLoaded(true);
          }
        } catch {
          setPagefindLoaded(false);
        }
      };

      script.onerror = () => {
        // Pagefind not available (dev mode)
        setPagefindLoaded(false);
      };

      document.head.appendChild(script);
    };

    loadPagefind();
  }, []);

  // Open modal
  const openModal = useCallback(() => {
    setIsOpen(true);
    setQuery('');
    setResults([]);
    setSelectedIndex(0);
    // Focus input after modal opens
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, []);

  // Close modal
  const closeModal = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
  }, []);

  // Listen for button click and keyboard shortcut
  useEffect(() => {
    const handleOpenSearch = () => openModal();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openModal();
      }

      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        closeModal();
      }

      // Arrow navigation when open
      if (isOpen && results.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && results[selectedIndex]) {
          window.location.href = results[selectedIndex].url;
          closeModal();
        }
      }
    };

    // Listen for button click
    const searchBtn = document.getElementById('search-btn');
    searchBtn?.addEventListener('click', handleOpenSearch);

    // Listen for keyboard
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      searchBtn?.removeEventListener('click', handleOpenSearch);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, openModal, closeModal, results.length, selectedIndex]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Search
  useEffect(() => {
    const search = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        if (window.pagefind) {
          // Use Pagefind
          const searchResult = await window.pagefind.search(query);
          const data = await Promise.all(
            searchResult.results.slice(0, 10).map((r) => r.data())
          );
          setResults(data);
        } else {
          // Fallback: search in known articles (for dev mode)
          const articles = [
            { url: '/articles/getting-started/', title: '开始使用知识库', excerpt: '快速了解如何使用这个前端知识库系统' },
          ];

          const filtered = articles.filter(
            (a) =>
              a.title.toLowerCase().includes(query.toLowerCase()) ||
              a.excerpt.toLowerCase().includes(query.toLowerCase())
          );

          setResults(
            filtered.map((a) => ({
              url: a.url,
              meta: { title: a.title },
              excerpt: a.excerpt,
            }))
          );
        }
        setSelectedIndex(0);
      } catch (e) {
        console.error('Search error:', e);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(search, 200);
    return () => clearTimeout(debounce);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/50"
      onClick={closeModal}
    >
      <div
        className="w-full max-w-xl bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-2xl overflow-hidden mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-border)]">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索文章..."
            className="flex-1 bg-transparent text-primary placeholder:text-muted focus:outline-none text-base"
          />
          <kbd className="px-2 py-1 text-xs text-muted bg-[var(--color-bg)] border border-[var(--color-border)] rounded flex-shrink-0">ESC</kbd>
        </div>

        <div className="max-h-[50vh] overflow-y-auto">
          {loading && (
            <div className="px-4 py-8 text-center text-muted">搜索中...</div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="px-4 py-8 text-center text-muted">
              <p>未找到相关内容</p>
              {!pagefindLoaded && (
                <p className="text-sm mt-2">提示: 开发模式下仅搜索示例文章，完整搜索请运行 <code className="px-1.5 py-0.5 bg-[var(--color-bg)] rounded text-xs">pnpm build && pnpm preview</code></p>
              )}
            </div>
          )}

          {!loading && query && results.length > 0 && (
            <>
              {!pagefindLoaded && (
                <div className="px-4 py-2 text-xs text-muted bg-[var(--color-bg)] border-b border-[var(--color-border)]">
                  开发模式 - 仅显示示例文章
                </div>
              )}
              {results.map((result, index) => (
                <a
                  key={result.url}
                  href={result.url}
                  onClick={closeModal}
                  className={`block px-4 py-3 border-b border-[var(--color-border)] last:border-0 transition-colors ${
                    index === selectedIndex
                      ? 'bg-[var(--color-bg)]'
                      : 'hover:bg-[var(--color-bg)]'
                  }`}
                >
                  <div className="font-semibold text-primary mb-1">{result.meta.title}</div>
                  <div
                    className="text-sm text-secondary line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: result.excerpt }}
                  />
                </a>
              ))}
            </>
          )}

          {!query && (
            <div className="px-4 py-8 text-center text-muted">
              <p>输入关键词开始搜索</p>
              {!pagefindLoaded && (
                <p className="text-sm mt-2">开发模式 - 完整搜索请运行 <code className="px-1.5 py-0.5 bg-[var(--color-bg)] rounded text-xs">pnpm build && pnpm preview</code></p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
