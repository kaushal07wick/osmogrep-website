'use client';

import type { ReactNode } from 'react';
import type { SearchDoc } from '../../../lib/search';
export { searchDocs, snippet, queryTerms } from '../../../lib/searchQuery';

/* Site search helpers used by the navbar's terminal menu. */
let indexPromise: Promise<SearchDoc[]> | null = null; // fetched once, on first open
export const loadIndex = () => (indexPromise ??= fetch('/api/search').then(async response => {
  if (!response.ok) throw new Error('Search unavailable');
  const data = await response.json();
  if (!Array.isArray(data) || !data.every(doc => doc && ['workspace','page','docs','feature','blog','changelog'].includes(doc.kind) && ['title','href','text'].every(field => typeof doc[field] === 'string') && /^(?:\/(?!\/)|https?:\/\/)/.test(doc.href))) throw new Error('Invalid search index');
  return data as SearchDoc[];
}).catch(() => ((indexPromise = null), [])));

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* Wrap matches in a grep-style orange highlight. */
export function mark(text: string, terms: string[], cls = 'bg-accent text-white'): ReactNode {
  if (!terms.length) return text;
  const re = new RegExp(`(${terms.map(escapeRe).join('|')})`, 'gi');
  return text.split(re).map((part, i) => (i % 2 ? <mark key={i} className={`px-px ${cls}`}>{part}</mark> : part));
}
