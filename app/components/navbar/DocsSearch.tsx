'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import Link from 'next/link';
import { LuArrowDown, LuArrowUp, LuCornerDownLeft, LuSearch, LuX } from 'react-icons/lu';
import { docs, docHref } from '../../../lib/docs';
import { queryTerms, searchDocs, snippet } from '../../../lib/searchQuery';
import { mark } from './searchHelpers';
import { docIcons } from '../../docs/docIcons';
import './docs-search.css';

const index = docs.map(doc => ({ kind: 'docs' as const, title: doc.title, href: docHref(doc.slug), text: `${doc.description} ${'keywords' in doc ? doc.keywords : ''}` }));
const popular = ['', 'cli', 'github', 'runtime', 'configuration'].map(slug => index.find(doc => doc.href === docHref(slug))!);

export default function DocsSearch({ open, query, onQuery, onPick, onClose, inputRef }: {
  open: boolean; query: string; onQuery(value: string): void; onPick(href: string): void;
  onClose(): void; inputRef: RefObject<HTMLInputElement | null>;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const results = useRef<HTMLUListElement>(null);
  const [selected, setSelected] = useState(0);
  const terms = queryTerms(query);
  const matches = terms.length ? searchDocs(index, query, 8) : popular;

  useEffect(() => {
    const modal = dialog.current!;
    if (!open) { if (modal.open) modal.close(); return; }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    modal.showModal();
    inputRef.current?.focus();
    return () => { if (modal.open) modal.close(); document.body.style.overflow = previousOverflow; };
  }, [open, inputRef]);
  useEffect(() => setSelected(0), [query]);

  function focusResult(position: number) {
    const links = results.current?.querySelectorAll<HTMLAnchorElement>('a');
    if (!links?.length) return;
    const next = (position + links.length) % links.length;
    setSelected(next); links[next].focus();
  }

  return <dialog ref={dialog} id="docs-search" className="docs-search" aria-label="Search documentation" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="docs-search-content">
      <div className="docs-search-input">
        <LuSearch aria-hidden="true" />
        <input ref={inputRef} type="search" value={query} onChange={event => onQuery(event.target.value)} aria-label="Search documentation" placeholder="Search guides, commands, workflows…" autoComplete="off" onKeyDown={event => {
          if (event.key === 'ArrowDown') { event.preventDefault(); focusResult(0); }
          if (event.key === 'ArrowUp') { event.preventDefault(); focusResult(matches.length - 1); }
          if (event.key === 'Enter' && matches[selected]) { event.preventDefault(); onPick(matches[selected].href); }
        }} />
        <button type="button" aria-label="Close search" onClick={onClose}><LuX aria-hidden="true" /><kbd>Esc</kbd></button>
      </div>
      <div className="docs-search-results">
        <p className="docs-search-label" aria-live="polite">{terms.length ? `${matches.length === 8 ? 'Top ' : ''}${matches.length} matching ${matches.length === 1 ? 'guide' : 'guides'}` : 'Popular guides'}</p>
        {matches.length ? <ul ref={results} onKeyDown={event => {
          if (event.key === 'ArrowDown') { event.preventDefault(); focusResult(selected + 1); }
          if (event.key === 'ArrowUp') { event.preventDefault(); focusResult(selected - 1); }
        }}>{matches.map((result, position) => {
          const doc = docs.find(doc => docHref(doc.slug) === result.href)!;
          const Icon = docIcons[doc.slug];
          return <li key={result.href}><Link href={result.href} data-selected={selected === position} onFocus={() => setSelected(position)} onMouseEnter={() => setSelected(position)} onClick={event => { event.preventDefault(); onPick(result.href); }}>
            <Icon aria-hidden="true" /><span><small>{doc.group}</small><strong>{mark(result.title, terms, 'docs-search-match')}</strong><span>{mark(snippet(doc.description, terms, 125), terms, 'docs-search-match')}</span></span><LuCornerDownLeft className="docs-search-enter" aria-hidden="true" />
          </Link></li>;
        })}</ul> : <div className="docs-search-empty"><LuSearch aria-hidden="true" /><strong>No guides found</strong><p>Try a topic like GitHub, memory or runtime checks.</p></div>}
      </div>
      <div className="docs-search-footer"><span>OsmoGrep documentation</span><span><LuArrowUp aria-hidden="true" /><LuArrowDown aria-hidden="true" /> navigate <LuCornerDownLeft aria-hidden="true" /> open</span></div>
    </div>
  </dialog>;
}
