'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const REPO_URL = 'https://github.com/kaushal07wick/OsmoGrep';

type RepoStats = {
  stars: number;
  forks: number;
  commits: number;
};

export default function NavbarClient() {
  const pathname = usePathname();
  const [stats, setStats] = useState<RepoStats | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch('/api/github')
      .then((res) => res.json())
      .then((data: RepoStats) => {
        if (mounted) setStats(data);
      })
      .catch(() => {
        if (mounted) setStats({ stars: 0, forks: 0, commits: 0 });
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileMenuOpen]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const linkClass = (href: string) =>
    `relative transition-colors decoration-accent hover:underline hover:decoration-2 underline-offset-4 ${
      isActive(href) ? 'text-accent font-semibold underline decoration-2' : 'text-ink-light hover:text-accent'
    }`;

  const mobileLinkClass = (href: string) =>
    `${isActive(href) ? 'text-accent' : 'text-ink hover:text-accent'} transition-colors`;

  const closeAndNavigate = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-[250] isolate w-full border-b border-grid bg-white/95 backdrop-blur-md transition-all duration-300">
      <div className="container mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4 sm:px-6 md:h-16 relative z-[251]">
        <Link href="/" className="flex items-center gap-3 group z-50">
          <span className="inline-flex items-center justify-center text-accent">
            <svg viewBox="0 0 28 28" className="h-7 w-7 md:h-8 md:w-8" fill="currentColor" aria-hidden="true">
              <path d="M6.7 8.8a1.1 1.1 0 0 1 1.55-.06l4.3 3.99a1.1 1.1 0 0 1 0 1.62l-4.3 3.99a1.1 1.1 0 1 1-1.49-1.61l3.43-3.18-3.43-3.18a1.1 1.1 0 0 1-.06-1.57Z" />
              <path d="M13.9 17.7c0-.61.49-1.1 1.1-1.1h6.3a1.1 1.1 0 1 1 0 2.2H15c-.61 0-1.1-.49-1.1-1.1Z" />
            </svg>
          </span>
          <span className="text-2xl leading-none font-bold tracking-tight text-accent md:text-3xl">Osmogrep</span>
        </Link>

        <button
          className="md:hidden z-[202] p-2 text-ink hover:text-accent active:text-accent transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>

        {mobileMenuOpen && (
          <div className="fixed inset-x-0 top-14 z-[260] border-t border-grid bg-paper md:hidden max-h-[calc(100dvh-3.5rem)] overflow-y-auto shadow-lg">
            <div className="flex flex-col gap-6 px-5 py-6 text-base font-space font-bold sm:text-lg">
              <Link href="/" onClick={closeAndNavigate} className={mobileLinkClass('/')}>Home</Link>
              <Link href="/install" onClick={closeAndNavigate} className={mobileLinkClass('/install')}>CLI</Link>
              <Link href="/docs" onClick={closeAndNavigate} className={mobileLinkClass('/docs')}>Documentation</Link>
              <Link href="/blog" onClick={closeAndNavigate} className={mobileLinkClass('/blog')}>Blogs</Link>
              <Link href="/pricing" onClick={closeAndNavigate} className={mobileLinkClass('/pricing')}>Pricing</Link>
              <Link href="/get-started" onClick={closeAndNavigate} className="btn-primary mt-2 text-center">Get Started</Link>
            </div>
          </div>
        )}

        <div className="hidden md:flex items-center flex-1 justify-end gap-10 pointer-events-auto">
          <div className="flex items-center gap-8 font-medium text-sm relative z-[201]">
            <Link href="/install" className={linkClass('/install')}>CLI</Link>
            <Link href="/pricing" className={linkClass('/pricing')}>Pricing</Link>
            <Link href="/blog" className={linkClass('/blog')}>Blogs</Link>
            <Link href="/docs" className={linkClass('/docs')}>Documentation</Link>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-sm border border-grid bg-white/60 backdrop-blur-sm hover:bg-accent/5 transition-colors hover:border-accent hover:text-accent text-xs text-ink-light font-mono"
            >
              <svg className="w-3.5 h-3.5 text-ink" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.67 0 8.2c0 3.63 2.29 6.7 5.47 7.79.4.08.55-.18.55-.39 0-.2-.01-.72-.01-1.42-2.01.38-2.53-.5-2.69-.96-.09-.24-.48-.96-.82-1.15-.28-.16-.68-.56-.01-.57.63-.01 1.08.59 1.23.84.72 1.24 1.87.89 2.33.68.07-.53.28-.89.51-1.1-1.78-.21-3.64-.92-3.64-4.1 0-.91.32-1.66.84-2.24-.08-.21-.37-1.06.08-2.2 0 0 .69-.23 2.26.86A7.6 7.6 0 0 1 8 3.8c.68 0 1.37.09 2.01.27 1.57-1.09 2.26-.86 2.26-.86.45 1.14.16 1.99.08 2.2.52.58.84 1.33.84 2.24 0 3.19-1.87 3.89-3.65 4.1.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.14.47.55.39A8.24 8.24 0 0 0 16 8.2C16 3.67 12.42 0 8 0Z" />
              </svg>
              <span className="text-ink">★</span> {stats ? stats.stars : '-'}
            </a>
            <Link href="/get-started" className="btn-primary text-sm font-medium px-4 py-2">
              Get Started
            </Link>
          </div>
        </div>
      </div>

    </nav>
  );
}
