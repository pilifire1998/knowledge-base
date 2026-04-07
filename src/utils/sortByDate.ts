import type { CollectionEntry } from 'astro:content';

type DatedEntry = CollectionEntry<'articles'> & {
  data: {
    pubDate: Date;
  };
};

export function sortByDate(entries: DatedEntry[]): DatedEntry[] {
  return [...entries].sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );
}
