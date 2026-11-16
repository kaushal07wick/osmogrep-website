'use client';

import { useEffect, useMemo, useState, type RefObject } from 'react';
import Link from 'next/link';
import { FiArrowUpRight, FiBookOpen, FiBox, FiFileText, FiGitCommit, FiGrid } from 'react-icons/fi';
import type { SearchDoc } from '../../../lib/search';
import { searchShortcuts } from '../../../lib/searchShortcuts';
import { prefersReducedMotion } from '../../../lib/motion';
import { SearchIcon } from '../ui/icons';
import { loadIndex, mark, queryTerms, searchDocs, snippet } from './searchHelpers';
import './search.css';

const kinds = {
  workspace: { label: 'Console', icon: FiGrid },
  docs: { label: 'Guide', icon: FiBookOpen },
  feature: { label: 'Workflow', icon: FiBox },
  blog: { label: 'Article', icon: FiFileText },
  changelog: { label: 'Update', icon: FiGitCommit },
  page: { label: 'Page', icon: FiArrowUpRight },
};

export default function SearchMenu({ open, query, onQuery, onPick, inputRef }: {
  open: boolean;
  query: string;
  onQuery: (q: string) => void;
  onPick: (href: string) => void;
  inputRef: RefObject<HTMLInputElement | null>;
}) {
  const [index, setIndex] = useState<SearchDoc[] | null>(null);
  const [sel, setSel] = useState(0);
  const searching = Boolean(query.trim());
  const failed = index?.length === 0;
  useEffect(() => { if (open) loadIndex().then(setIndex); }, [open]);
  useEffect(() => setSel(0), [query, open]);

  const rows = useMemo(() => {
    if (searching && !failed) return searchDocs(index || [], query, 10);
    return [...searchShortcuts, ...(index?.filter(doc => doc.kind === 'blog').slice(0, 1) || []), ...(index?.filter(doc => doc.kind === 'changelog').slice(0, 1) || [])];
  }, [query, searching, failed, index]);
  useEffect(() => {
    if (open) document.getElementById(`nav-search-result-${sel}`)?.scrollIntoView({ block: 'nearest' });
  }, [sel, open]);
  const terms = queryTerms(query);

  return <div id="nav-terminal" inert={!open} className={`nav-search-shell ${open ? 'is-open' : ''}`}>
    <div className="nav-search-clip"><div className="nav-search-panel"><div className="nav-search-inner">
      <label className="nav-search-field"><SearchIcon /><span>
        <input ref={inputRef} value={query} type="search" autoComplete="off" spellCheck={false} onChange={event => onQuery(event.target.value)}
          onKeyDown={event => {
            if (event.key === 'ArrowDown') { event.preventDefault(); setSel(value => Math.min(value + 1, Math.max(0, rows.length - 1))); }
            if (event.key === 'ArrowUp') { event.preventDefault(); setSel(value => Math.max(value - 1, 0)); }
            if (event.key === 'Enter' && rows[sel]) { event.preventDefault(); onPick(rows[sel].href); }
          }} aria-label="Search the site" aria-controls="nav-search-results" aria-describedby="nav-search-status" className="nav-search" />
        {!query && <Hint active={open} />}
      </span><kbd>esc</kbd></label>
      <p id="nav-search-status" className="nav-search-status" role="status">{failed ? 'Search is unavailable. Shortcuts are still available.' : searching ? index === null ? 'Searching…' : `${rows.length} ${rows.length === 1 ? 'result' : 'results'}` : 'Explore OsmoGrep'}</p>
      {searching && !failed && index !== null && rows.length === 0 ? <p className="nav-search-empty">No matches for “{query}”. Try memory, runtime checks or architecture.</p> :
        <ul id="nav-search-results" className={`nav-search-results ${searching && !failed ? 'is-searching' : ''}`}>{rows.map((row, i) => {
          const kind = kinds[row.kind];
          const Icon = kind.icon;
          return <li key={row.href}>
            <Link id={`nav-search-result-${i}`} href={row.href} onMouseEnter={() => setSel(i)} onFocus={() => setSel(i)} onClick={event => { event.preventDefault(); onPick(row.href); }} data-selected={sel === i} className="nav-search-result">
              <Icon aria-hidden="true" /><span className="nav-search-copy"><span className="nav-search-result-meta">{kind.label}{!searching && row.kind === 'blog' ? ' · Latest' : ''}</span><strong>{mark(row.title, terms, 'nav-search-match')}</strong><span className="nav-search-description">{mark(snippet(row.text, terms, 120), terms, 'nav-search-match')}</span></span><FiArrowUpRight className="nav-search-arrow" aria-hidden="true" />
            </Link>
          </li>;
        })}</ul>}
      <div className="nav-search-footer"><span>↑↓ move <span aria-hidden="true">·</span> enter open <span aria-hidden="true">·</span> esc close</span></div>
    </div></div></div>
  </div>;
}

const EXAMPLES = ['Slack memory', 'runtime verification', 'team invites', 'architecture', 'tokens'];
function Hint({ active }: { active: boolean }) {
  const [text, setText] = useState(EXAMPLES[0]);
  useEffect(() => {
    if (!active || prefersReducedMotion()) return setText(EXAMPLES[0]);
    let word = 0, len = 0, dir = 1, wait = 0;
    const id = setInterval(() => {
      if (wait > 0) return void wait--;
      const example = EXAMPLES[word];
      len += dir;
      if (len === example.length) { dir = -1; wait = 18; }
      if (len === 0) { dir = 1; word = (word + 1) % EXAMPLES.length; wait = 4; }
      setText(example.slice(0, len));
    }, 70);
    return () => clearInterval(id);
  }, [active]);
  return <span className="nav-search-hint" aria-hidden="true">Search OsmoGrep <span>· {text}</span></span>;
}
