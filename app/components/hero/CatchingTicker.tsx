'use client';

import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../../../lib/motion';
import Bug from '../bug/Bug';

/* The bug is the bug: it shows what it's up to in your runtime. The ticker rolls through them. */
const KINDS = [
  'dereferencing null',
  'racing a mutex',
  'leaking file handles',
  'double-spending a retry',
  'swallowing a rejection',
  'overflowing the heap',
  'deadlocking a worker',
  'corrupting shared state',
];

/** "bug@prod $ <doing>" line above the headline: the walking bug plus a word that rolls in letter by letter. */
export default function CatchingTicker() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = setInterval(() => setI((n) => (n + 1) % KINDS.length), 2200);
    return () => clearInterval(id);
  }, []);
  return (
    <p className="hero-fade flex items-center gap-3 font-mono text-[13px] text-ink-light">
      <Bug className="h-5 w-7 text-ink" />
      <span>bug@prod <span className="text-ink/40">$</span></span>
      <span key={i} className="inline-flex overflow-hidden text-accent" aria-live="polite">
        {KINDS[i].split('').map((c, k) => (
          <span key={k} className="roll-in inline-block whitespace-pre" style={{ animationDelay: `${k * 22}ms` }}>
            {c}
          </span>
        ))}
      </span>
    </p>
  );
}
