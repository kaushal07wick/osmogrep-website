'use client';

import { useEffect, useMemo, useState, type ReactNode, type RefObject } from 'react';
import Link from 'next/link';
import type { SearchDoc } from '../../../lib/search';
import { prefersReducedMotion } from '../../../lib/motion';
import { SearchIcon } from './icons';
import { menuLinks } from './links';
import { loadIndex, mark, queryTerms, searchDocs, snippet } from './searchHelpers';

type Row = { key: string; href: string; tag: string; body: (selected: boolean) => ReactNode };

/**
 * Dark panel that unrolls under the bar. A search line on top; with nothing typed it lists
 * menuLinks, and as you type the same rows become site search results.
 */
export default function SearchMenu({
  open,
  query,
  onQuery,
  onPick,
  inputRef,
}: {
  open: boolean;
  query: string;
  onQuery: (q: string) => void;
  onPick: (href: string) => void;
  inputRef: RefObject<HTMLInputElement | null>;
}) {
  const [index, setIndex] = useState<SearchDoc[]>([]);
  const [sel, setSel] = useState(0);

  useEffect(() => {
    if (open) loadIndex().then(setIndex);
  }, [open]);
  useEffect(() => setSel(0), [query]);

  const rows = useMemo<Row[]>(() => {
    if (!query) return menuLinks.map((m) => ({ key: m.cmd, href: m.href, tag: m.cmd, body: () => m.desc }));
    const terms = queryTerms(query);
    return searchDocs(index, query).map((d) => ({
      key: d.kind + d.href + d.title,
      href: d.href,
      tag: d.kind,
      body: (s) => (
        <>
          <span className="text-white">{mark(d.title, terms, s ? 'bg-ink text-white' : 'bg-accent text-white')}</span>
          <span className={`ml-3 ${s ? 'text-white/80' : 'text-white/45'}`}>
            {mark(snippet(d.text, terms), terms, s ? 'bg-ink text-white' : 'bg-accent/80 text-white')}
          </span>
        </>
      ),
    }));
  }, [query, index]);

  return (
    <div
      id="nav-terminal"
      className={`absolute inset-x-0 top-full grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] ${open ? 'grid-rows-[1fr]' : 'pointer-events-none grid-rows-[0fr]'}`}
    >
      <div className="overflow-hidden">
        <div className="border-b border-black bg-ink font-mono text-[13px] text-white/70 shadow-2xl shadow-black/30">
          <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6">
            <label className="relative flex items-center gap-3 border-b border-white/10 px-2 pb-4 text-white">
              <SearchIcon />
              <span className="relative min-w-0 flex-1">
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => onQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, rows.length - 1)); }
                    if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
                    if (e.key === 'Enter' && rows[sel]) { e.preventDefault(); onPick(rows[sel].href); }
                  }}
                  tabIndex={open ? 0 : -1}
                  aria-label="Search the site"
                  className="nav-search w-full bg-transparent text-[15px] text-white caret-accent"
                />
                {!query && <Hint active={open} />}
              </span>
              <kbd className="text-[10px] text-white/35">esc</kbd>
              {/* A thin orange line grows under the field as you type. */}
              <span
                className="absolute bottom-[-1px] left-0 h-px bg-accent transition-[width] duration-300 ease-out"
                style={{ width: query ? `${Math.min(100, 8 + query.length * 6)}%` : 0 }}
              />
            </label>

            {query && rows.length === 0 ? (
              <p className="px-2 py-1.5 text-white/50">no matches for “{query}”. try a word like pricing or a command like /help</p>
            ) : (
              <ul className="space-y-0.5">
                {rows.map((r, i) => (
                  <li key={r.key} style={{ animationDelay: `${i * 40}ms` }} className={open ? 'nav-line-in' : 'opacity-0'}>
                    <Link
                      href={r.href}
                      tabIndex={open ? 0 : -1}
                      onMouseEnter={() => setSel(i)}
                      onFocus={() => setSel(i)}
                      onClick={(e) => { e.preventDefault(); onPick(r.href); }}
                      className={`grid grid-cols-[20px_110px_1fr] rounded-[3px] px-2 py-1.5 sm:grid-cols-[24px_140px_1fr] ${sel === i ? 'bg-accent text-white' : ''}`}
                    >
                      <span>{sel === i ? '>' : ''}</span>
                      <span className={sel === i ? 'text-white' : 'text-accent'}>{r.tag}</span>
                      <span className="truncate">{r.body(sel === i)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <p className={`${open ? 'nav-line-in' : 'opacity-0'} mt-4 hidden px-2 text-[11px] text-white/40 sm:block`} style={{ animationDelay: '300ms' }}>
              ↑↓ move · enter open
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Placeholder that types example searches, so it is obvious what you can look for. */
const EXAMPLES = ['pricing', '/help', 'install on linux', 'checkout bug', 'changelog'];
function Hint({ active }: { active: boolean }) {
  const [text, setText] = useState('');
  useEffect(() => {
    if (!active || prefersReducedMotion()) return setText(EXAMPLES[0]);
    let word = 0, len = 0, dir = 1, wait = 0;
    const id = setInterval(() => {
      if (wait > 0) return void wait--;
      const w = EXAMPLES[word];
      len += dir;
      if (len === w.length) { dir = -1; wait = 18; } // hold the full word
      if (len === 0) { dir = 1; word = (word + 1) % EXAMPLES.length; wait = 4; }
      setText(w.slice(0, len));
    }, 70);
    return () => clearInterval(id);
  }, [active]);
  return (
    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center text-[15px] text-white/35" aria-hidden="true">
      search osmogrep, try&nbsp;<span className="text-white/60">{text}</span>
    </span>
  );
}
