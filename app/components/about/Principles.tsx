'use client';

import type { ReactNode } from 'react';
import { useTick } from '../motion/hooks';
import Reveal from '../motion/Reveal';
import { stagger } from '../motion/stagger';

/* Four principles, each with a tiny live illustration of what it means in practice. */

function EvidenceArt() {
  const t = useTick(8, 450);
  return (
    <div className="font-mono text-[11px]">
      <div className="flex gap-1">{[0, 1, 2, 3].map((i) => <span key={i} className={`h-2 flex-1 ${i === 3 ? (t > 3 ? 'bg-pass' : 'bg-fail') : 'bg-pass'}`} />)}</div>
      <p className={`mt-2 ${t > 3 ? 'text-pass' : 'text-fail'}`}>{t > 3 ? '4 passed · proof attached' : '3 passed · 1 failed'}</p>
    </div>
  );
}

function TestsArt() {
  const t = useTick(6, 600);
  return (
    <div className="font-mono text-[11px] text-ink">
      <p>tests/notify.test.ts <span className="text-ink-light">unchanged</span></p>
      <p className={`mt-1 ${t % 2 ? 'text-pass' : 'text-ink-light'}`}>{t % 2 ? '✓ diff: 0 lines' : '· checking diff…'}</p>
    </div>
  );
}

function SandboxArt() {
  const t = useTick(10, 320);
  return (
    <div className="flex items-center gap-2 font-mono text-[11px]">
      <span className="border border-grid px-2 py-1 text-ink">your repo</span>
      <span className="relative h-px w-10 bg-grid"><span className="absolute -top-[2px] h-[5px] w-[5px] bg-accent" style={{ left: `${(t / 9) * 100}%` }} /></span>
      <span className="border border-accent bg-accent/10 px-2 py-1 text-accent">sandbox</span>
      <span className="text-ink-light line-through">prod</span>
    </div>
  );
}

function AuditArt() {
  const t = useTick(5, 700);
  const lines = ['read src/notify.ts', 'run npm test', 'patch notify.ts:3', 'rerun tests'];
  return (
    <div className="font-mono text-[11px] leading-[17px] text-ink-light">
      {lines.slice(0, Math.max(1, t)).map((l, i) => <p key={l}><span className="text-accent">{String(i + 1).padStart(2, '0')}</span> {l}</p>)}
    </div>
  );
}

const PRINCIPLES: { title: string; body: string; Art: () => ReactNode }[] = [
  { title: 'Evidence over opinion', body: 'A fix is only done when a failing run turns green. Every patch ships with the run that proves it.', Art: EvidenceArt },
  { title: 'Your tests are the judge', body: 'We never edit your tests to make them pass. The original suite stays exactly as you wrote it.', Art: TestsArt },
  { title: 'Sandbox first', body: 'Bugs are reproduced in isolated workspaces, never against production data or systems.', Art: SandboxArt },
  { title: 'Every step on the record', body: 'Each file read, command run and edit made is logged and replayable. No black boxes.', Art: AuditArt },
];

export default function Principles() {
  return (
    <section className="zone zone-pinstripe w-full py-24 md:py-28">
      <div className="mx-auto max-w-[1280px] px-6">
        <Reveal>
          <p data-stagger style={stagger(0)} className="font-mono text-[12px] text-accent">principles</p>
          <h2 data-stagger style={stagger(1)} className="mt-3 text-4xl font-bold leading-tight tracking-tight text-ink md:text-5xl">How we decide what to build.</h2>
        </Reveal>
        <Reveal className="mt-12 grid gap-4 md:grid-cols-2">
          {PRINCIPLES.map(({ title, body, Art }, i) => (
            <article key={title} data-stagger style={stagger(i)} className="frame group flex flex-col bg-surface p-7 transition-transform duration-300 hover:-translate-y-1">
              <span className="font-mono text-[12px] text-accent">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-3 text-2xl font-bold tracking-tight text-ink transition-colors group-hover:text-accent">{title}</h3>
              <p className="mt-3 max-w-md text-ink-light">{body}</p>
              <div className="mt-6 border-t border-dashed border-grid pt-5"><Art /></div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
