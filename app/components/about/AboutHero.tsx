'use client';

import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../../../lib/motion';
import Bug from '../bug/Bug';

/* About hero: a manifesto headline. The bug walks across the base line and leaves an orange
   trail; when it reaches the highlighted word, a reticle closes on it and it's caught. */
export default function AboutHero() {
  const lane = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(0); // 0..1 across the lane
  useEffect(() => {
    if (prefersReducedMotion()) return setX(1);
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      setX(Math.min(1, ((t - t0) / 7000) % 1.35)); // walk 7s, rest, loop
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const caught = x >= 1;

  return (
    <section className="zone zone-engraved w-full pb-16 pt-20 md:pt-28">
      <div className="mx-auto max-w-[1280px] px-6">
        <p className="hero-fade font-mono text-[12px] text-accent">about · field notes</p>
        <h1 className="mt-5 max-w-5xl text-5xl font-bold leading-[1.05] tracking-tight text-ink md:text-7xl">
          Code compiles. Tests pass. <span className="bg-accent px-2 text-white">Prod</span> still breaks.
        </h1>
        <p className="hero-fade mt-8 max-w-2xl text-lg leading-relaxed text-ink-light" style={{ animationDelay: '0.3s' }}>
          Osmogrep exists for the gap between “it works on my machine” and what really happens at runtime. We run your
          code the way your users do, catch what breaks, and hand you a fix with the proof attached.
        </p>

        {/* the bug's walk */}
        <div ref={lane} className="relative mt-14 h-12" aria-hidden="true">
          <div className="absolute inset-x-0 bottom-2 h-px bg-grid" />
          <div className="absolute bottom-2 left-0 h-px bg-accent" style={{ width: `${x * 100}%` }} />
          <div className="absolute bottom-2 transition-none" style={{ left: `calc(${x * 100}% - ${x * 40}px)` }}>
            <Bug mood={caught ? 'caught' : x > 0.85 ? 'scared' : 'walk'} className="h-7 w-10 text-ink" />
            {caught && (
              <span className="reticle-lock absolute -inset-2 top-1/2">
                {['left-0 top-0 border-l-2 border-t-2', 'right-0 top-0 border-r-2 border-t-2', 'bottom-0 left-0 border-b-2 border-l-2', 'bottom-0 right-0 border-b-2 border-r-2'].map((c) => (
                  <span key={c} className={`absolute h-2 w-2 border-accent ${c}`} />
                ))}
              </span>
            )}
          </div>
          <span className={`absolute bottom-3 right-0 font-mono text-[11px] transition-opacity ${caught ? 'text-accent opacity-100' : 'opacity-0'}`}>caught · before prod</span>
        </div>
      </div>
    </section>
  );
}
