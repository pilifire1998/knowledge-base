import { useState, useEffect, useCallback, useRef } from 'react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  showProgress?: boolean;
}

export default function TableOfContents({ showProgress = true }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [showBackTop, setShowBackTop] = useState(false);
  const [showFadeTop, setShowFadeTop] = useState(false);
  const [showFadeBottom, setShowFadeBottom] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Extract headings from article
  useEffect(() => {
    const articleHeadings = document.querySelectorAll('article h2, article h3, article h4');
    const items: TOCItem[] = Array.from(articleHeadings).map((heading) => ({
      id: heading.id,
      text: heading.textContent || '',
      level: parseInt(heading.tagName.charAt(1)),
    }));
    setHeadings(items);
  }, []);

  // Check scroll position for fade indicators
  const checkScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    setShowFadeTop(scrollTop > 10);
    setShowFadeBottom(scrollTop + clientHeight < scrollHeight - 10);
  }, []);

  // Track scroll position
  const handleScroll = useCallback(() => {
    // Active heading
    const articleHeadings = document.querySelectorAll('article h2, article h3, article h4');
    let currentId = '';

    articleHeadings.forEach((heading) => {
      const rect = heading.getBoundingClientRect();
      if (rect.top <= 120) {
        currentId = heading.id;
      }
    });

    setActiveId(currentId);

    // Reading progress
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    setProgress(Math.min(100, Math.max(0, scrollProgress)));

    // Show back to top
    setShowBackTop(scrollTop > 400);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Check fade on mount and when headings change
  useEffect(() => {
    checkScroll();
    const el = containerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      return () => el.removeEventListener('scroll', checkScroll);
    }
  }, [checkScroll, headings]);

  // Scroll to heading
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  // Back to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (headings.length === 0) return null;

  return (
    <div className="relative">
      {/* Top fade mask */}
      {showFadeTop && (
        <div className="toc-fade-top pointer-events-none absolute top-0 left-0 right-4 h-6 z-10" />
      )}

      {/* Bottom fade mask */}
      {showFadeBottom && (
        <div className="toc-fade-bottom pointer-events-none absolute bottom-0 left-0 right-4 h-6 z-10" />
      )}

      <div ref={containerRef} className="toc-container max-h-[calc(100vh-8rem)] overflow-y-auto pr-3">
        {/* Progress bar */}
        {showProgress && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-muted mb-1">
              <span>阅读进度</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1 bg-[var(--color-border)]/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-primary)] transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* TOC title */}
        <h4 className="text-caption uppercase tracking-wider text-muted mb-3 font-semibold">
          目录导航
        </h4>

        {/* TOC list */}
        <nav className="space-y-0.5">
          {headings.map((heading) => (
            <button
              key={heading.id}
              onClick={() => scrollToHeading(heading.id)}
              className={`w-full text-left py-2 px-2 rounded text-sm transition-all min-h-[44px] flex items-center ${
                activeId === heading.id
                  ? 'bg-[var(--color-primary)] text-[var(--color-bg)] font-semibold'
                  : 'text-secondary hover:text-primary hover:bg-[var(--color-bg)]'
              }`}
              style={{
                paddingLeft: `${(heading.level - 2) * 12 + 8}px`,
              }}
            >
              <span className="truncate block leading-snug">{heading.text}</span>
            </button>
          ))}
        </nav>

        {/* Quick jump - hidden on mobile */}
        <div className="mt-4 pt-4 border-t border-[var(--color-border)]/20 hidden sm:block">
          <div className="text-xs text-muted mb-2">快捷键</div>
          <div className="space-y-1 text-xs text-muted">
            <div><kbd className="px-1 bg-[var(--color-bg)] rounded">↑↓</kbd> 导航</div>
            <div><kbd className="px-1 bg-[var(--color-bg)] rounded">Enter</kbd> 跳转</div>
            <div><kbd className="px-1 bg-[var(--color-bg)] rounded">⌘K</kbd> 搜索</div>
          </div>
        </div>
      </div>

      {/* Floating Back to top - fixed position */}
      {showBackTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] shadow-lg hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)] hover:border-[var(--color-primary)] transition-all flex items-center justify-center"
          title="返回顶部"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
}
