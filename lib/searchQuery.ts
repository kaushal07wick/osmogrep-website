import type { SearchDoc } from './search';

/** Lowercased, whitespace-split search terms. */
export const queryTerms = (query: string) => query.toLowerCase().split(/\s+/).filter(Boolean);

/**
 * Every term must appear in the title or text. Ranking: a term in the title is worth 10
 * (+5 if the title starts with it), a term in the text is worth 1. Returns the top 7.
 */
export function searchDocs(index: SearchDoc[], query: string, limit = 7): SearchDoc[] {
  const terms = queryTerms(query);
  if (!terms.length) return [];
  return index
    .map((d) => {
      const title = d.title.toLowerCase();
      const text = d.text.toLowerCase();
      if (!terms.every((t) => title.includes(t) || text.includes(t))) return null;
      const score = terms.reduce((n, t) => n + (title.includes(t) ? 10 : 0) + (title.startsWith(t) ? 5 : 0) + (text.includes(t) ? 1 : 0), 0);
      return { d, score };
    })
    .filter((r): r is { d: SearchDoc; score: number } => r !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.d);
}

/** About 90 characters of `text` starting a little before the first term it contains. */
export function snippet(text: string, terms: string[], width = 90): string {
  const hits = terms.map((t) => text.toLowerCase().indexOf(t)).filter((i) => i >= 0);
  const start = hits.length ? Math.max(0, Math.min(...hits) - 30) : 0;
  return (start ? '…' : '') + text.slice(start, start + width) + (text.length > start + width ? '…' : '');
}
