'use client';

import { useEffect, useState } from 'react';
import { GithubIcon, PixelStar } from './icons';
import { REPO, REPO_URL } from './links';

/** GitHub cell: live star count, pixel star that lights up on hover, and a .frame tooltip. */
export default function GithubStars() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    let live = true;
    fetch('/api/github')
      .then((res) => res.json())
      .then((data: { stars?: number }) => live && setStars(data.stars ?? null))
      .catch(() => {}); // the cell still works as a link without a count
    return () => {
      live = false;
    };
  }, []);

  return (
    <a
      href={REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Star Osmogrep on GitHub${stars ? ` (${stars} stars)` : ''}`}
      className="group relative hidden items-center gap-2 border-l border-grid px-4 font-mono text-[12px] text-ink-light transition-colors hover:text-ink sm:flex"
    >
      <GithubIcon className="h-4 w-4 text-ink" />
      <PixelStar />
      <span>{stars ?? '–'}</span>

      <span role="tooltip" className="nav-tip pointer-events-none absolute right-2 top-full z-10 mt-3 w-max opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100">
        <svg viewBox="0 0 7 4" shapeRendering="crispEdges" className="absolute -top-[7px] right-5 h-2 w-3.5" aria-hidden="true">
          <path d="M3 0h1v1H3zM2 1h3v1H2zM1 2h5v1H1zM0 3h7v1H0z" className="fill-ink" />
        </svg>
        <span className="frame flex items-center gap-3 px-3.5 py-2.5 shadow-lg shadow-black/5">
          <PixelStar className="h-[14px] w-[18px]" lit />
          <span className="leading-tight">
            <span className="block font-sans text-[13px] font-semibold text-ink">Star us on GitHub</span>
            <span className="block text-[11px] text-ink-light">
              {REPO}
              {stars ? ` · ${stars} ★` : ''}
            </span>
          </span>
        </span>
      </span>
    </a>
  );
}
