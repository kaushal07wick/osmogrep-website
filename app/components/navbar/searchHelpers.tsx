'use client';

import type { ReactNode } from 'react';
import type { SearchDoc } from '../../../lib/search';
export { searchDocs, snippet, queryTerms } from '../../../lib/searchQuery';

/* Site search helpers used by the navbar's terminal menu. */
let indexPromise: Promise<SearchDoc[]> | null = null; // fetched once, on first open
export const loadIndex = () => (indexPromise ??= fetch('/api/search').then((r) => r.json()).catch(() => ((indexPromise = null), [])));

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* Wrap matches in a grep-style orange highlight. */
export function mark(text: string, terms: string[], cls = 'bg-accent text-white'): ReactNode {
  if (!terms.length) return text;
  const re = new RegExp(`(${terms.map(escapeRe).join('|')})`, 'gi');
  return text.split(re).map((part, i) => (i % 2 ? <mark key={i} className={`px-px ${cls}`}>{part}</mark> : part));
}
