'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import LogoMark from '../LogoMark';
import FeaturesPanel from './FeaturesPanel';
import GithubStars from './GithubStars';
import { SearchIcon } from './icons';
import { barLinks } from './links';
import { CellLabel, cellClass } from './NavCell';
import SearchMenu from './SearchMenu';
import SignInButton from './SignInButton';

/** Hover opens a panel; a click within this window of that hover keeps it open instead of toggling it shut. */
const HOVER_CLICK_GRACE_MS = 600;

/**
 * Site header. Owns which panel is open (features or search) and how they close:
 * Esc, a click outside, the pointer leaving the header, or a route change.
 */
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const header = useRef<HTMLElement>(null);
  const searchButton = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const hoverOpenedAt = useRef(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const [search, setSearch] = useState(false);
  const [features, setFeatures] = useState(false);
  const [query, setQuery] = useState('');

  const closeAll = () => {
    setSearch(false);
    setFeatures(false);
    setQuery('');
  };
  const openSearch = () => {
    setFeatures(false);
    setSearch(true);
    requestAnimationFrame(() => input.current?.focus());
  };
  const go = (href: string) => {
    closeAll();
    if (href.startsWith('http')) location.assign(href);
    else router.push(href);
  };
  const hoverOpen = (isOpen: boolean) => {
    if (!isOpen) hoverOpenedAt.current = Date.now();
  };
  const justHoverOpened = () => Date.now() - hoverOpenedAt.current < HOVER_CLICK_GRACE_MS;

  useEffect(closeAll, [pathname]);

  // A click anywhere outside the header closes whatever is open.
  useEffect(() => {
    if (!search && !features) return;
    const onDown = (e: MouseEvent) => {
      if (!header.current?.contains(e.target as Node)) closeAll();
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [search, features]);

  // Esc closes; `/` opens search from anywhere except form fields.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (search || features)) {
        if (search) searchButton.current?.focus();
        closeAll();
      } else if (e.key === '/' && !search && !(e.target as HTMLElement).closest('input, textarea, select, [contenteditable="true"]')) {
        e.preventDefault();
        openSearch();
      }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [search, features]);

  return (
    <header
      ref={header}
      className="nav-bleed sticky top-0 z-[250] w-full"
      onMouseLeave={() => {
        setFeatures(false);
        if (!query) setSearch(false); // keep a typed search open
      }}
    >
      <nav
        className="relative flex h-14 w-full border-b border-grid bg-paper/95 text-sm backdrop-blur-sm"
        // Pointing at anything in the bar other than the features cell closes the features panel.
        onMouseOver={(e) => {
          if (features && !(e.target as Element).closest('[aria-controls="nav-features"]')) setFeatures(false);
        }}
      >
        <Link href="/" className="flex shrink-0 items-center gap-2 px-4 md:px-6">
          <LogoMark className="h-7" />
          <span className="font-mono text-lg font-bold tracking-tight text-ink">osmogrep</span>
        </Link>

        <div className="flex-1" />

        <button
          type="button"
          aria-expanded={features}
          aria-controls="nav-features"
          onMouseEnter={() => { setHovered('features'); hoverOpen(features); setFeatures(true); setSearch(false); }}
          onMouseLeave={() => setHovered(null)}
          onClick={() => { setFeatures(justHoverOpened() || !features); setSearch(false); }}
          className={`${cellClass} ${features ? 'bg-accent text-white' : ''}`}
        >
          <CellLabel text="features" hovered={hovered === 'features'} open={features} />
          <span className={`relative text-[10px] transition-transform group-hover:text-white ${features ? 'rotate-180' : 'text-ink-light'}`}>▾</span>
        </button>

        {barLinks.map((l) => (
          <Link
            key={l.cmd}
            href={l.href}
            aria-current={pathname.startsWith(l.href) ? 'page' : undefined}
            onMouseEnter={() => setHovered(l.cmd)}
            onMouseLeave={() => setHovered(null)}
            className={cellClass}
          >
            <CellLabel text={l.cmd} hovered={hovered === l.cmd} active={pathname.startsWith(l.href)} />
          </Link>
        ))}

        <button
          ref={searchButton}
          type="button"
          onMouseEnter={() => { hoverOpen(search); openSearch(); }}
          onClick={() => (search && !justHoverOpened() ? closeAll() : openSearch())}
          aria-expanded={search}
          aria-controls="nav-terminal"
          aria-label="Search and menu (press /)"
          className={`flex w-14 items-center justify-center border-l border-grid transition-colors ${search ? 'bg-ink text-white' : 'text-ink-light hover:text-ink'}`}
        >
          <SearchIcon />
        </button>

        <GithubStars />
        <SignInButton />
      </nav>

      {features && (
        <div id="nav-features" className="absolute inset-x-0 top-full hidden md:block">
          <FeaturesPanel />
        </div>
      )}

      <SearchMenu open={search} query={query} onQuery={setQuery} onPick={go} inputRef={input} />
    </header>
  );
}
