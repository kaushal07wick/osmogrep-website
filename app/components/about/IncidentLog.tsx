'use client';

import { useEffect, useRef, useState } from 'react';

/* Why we exist, told as the incident log every engineer has lived. Entries light up as the
   reader scrolls past them; the last line is the turn from problem to product. */
const LOG: [string, string, 'ink' | 'fail' | 'accent' | 'pass'][] = [
  ['17:42', 'PR merged. Review approved, CI green.', 'ink'],
  ['17:58', 'Deployed. Dashboards quiet.', 'ink'],
  ['02:14', 'Pager. Order emails failing for every new signup.', 'fail'],
  ['02:31', 'Root cause: user.profile is undefined until a user sets one.', 'fail'],
  ['02:33', 'No test ever created a user without a profile.', 'fail'],
  ['03:10', 'Hotfix shipped. Nobody can say for sure it holds.', 'accent'],
  ['——', 'We built Osmogrep so this happens in a sandbox, before the merge, with proof.', 'pass'],
];
const TONE = { ink: 'text-ink', fail: 'text-fail', accent: 'text-accent', pass: 'text-pass' };

export default function IncidentLog() {
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const [lit, setLit] = useState(-1);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setLit((v) => Math.max(v, Number((e.target as HTMLElement).dataset.i)))),
      { rootMargin: '0px 0px -35% 0px' },
    );
    items.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="w-full py-24 md:py-28">
      <div className="mx-auto grid max-w-[1280px] gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-28 lg:h-fit">
          <p className="font-mono text-[12px] text-accent">why we exist</p>
          <h2 className="mt-3 text-4xl font-bold leading-tight tracking-tight text-ink md:text-5xl">You&apos;ve had this night.</h2>
          <p className="mt-5 max-w-sm text-ink-light">An incident log most engineers could have written. Every line of it happened after the code looked fine.</p>
        </div>
        <ol className="frame bg-surface px-6 py-5 font-mono text-[14px]">
          {LOG.map(([time, text, tone], i) => (
            <li
              key={time + text}
              ref={(el) => { items.current[i] = el; }}
              data-i={i}
              className={`grid grid-cols-[64px_1fr] gap-4 border-b border-dashed border-grid py-4 transition-all duration-500 last:border-0 ${i <= lit ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-25'}`}
            >
              <span className={i <= lit ? 'text-ink-light' : 'text-grid'}>{time}</span>
              <span className={`${i === LOG.length - 1 ? 'font-bold' : ''} ${i <= lit ? TONE[tone] : 'text-ink-light'}`}>{text}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
