'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { consoleUrl } from '../../../lib/console';
import { prefersReducedMotion } from '../../../lib/motion';
import LogoMark from '../LogoMark';
import { useInView, useScrollProgress, useTick } from '../motion/hooks';
import Reveal from '../motion/Reveal';
import { stagger } from '../motion/stagger';
import { GithubIcon, PixelArrow } from '../ui/icons';

/*
 * Web console pitch with a playable mock of the real app (app.osmogrep.com): a sidebar app whose
 * views auto-cycle (Overview → Review → Evidence) until you click one. Same example as the rest of
 * the site: a new user without a profile crashes src/notify.ts.
 */
const VIEWS = [
  { id: 'overview', label: 'Overview', path: '/dashboard' },
  { id: 'review', label: 'Reviews', path: '/reviews/acme-api-482' },
  { id: 'evidence', label: 'Evidence', path: '/reviews/acme-api-482/evidence' },
] as const;
const SPIN = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏';

function OverviewView() {
  const url = 'github.com/acme/api/pull/482';
  const t = useTick(40, 90, 39);
  const typed = Math.min(url.length, t);
  const opened = t > url.length + 4;
  return (
    <div>
      <p className="text-[13px] font-bold text-ink">Overview</p>
      <div className="mt-3 flex border border-grid bg-paper">
        <span className="flex-1 truncate px-3 py-2 text-ink">{url.slice(0, typed)}{!opened && <span className="term-caret ml-px inline-block h-3 w-1.5 translate-y-0.5 bg-accent" />}</span>
        <span className={`px-3 py-2 transition-colors ${opened ? 'bg-accent text-white' : 'bg-ink text-white'}`}>{opened ? 'Opening…' : 'Open PR'}</span>
      </div>
      <p className="mb-1.5 mt-4 text-ink-light">repositories</p>
      {[['acme/api', opened ? `${SPIN[t % 10]} review running` : 'idle', opened ? 'text-accent' : 'text-ink-light'], ['acme/web', '✓ verified fix', 'text-pass'], ['acme/billing', 'idle', 'text-ink-light']].map(([r, s, c]) => (
        <div key={r} className="flex items-center border-t border-dashed border-grid py-2">
          <GithubIcon className="mr-2 h-3 w-3 text-ink-light" />
          <span className="text-ink">{r}</span>
          <span className={`ml-auto ${c}`}>{s}</span>
        </div>
      ))}
    </div>
  );
}

function ReviewView() {
  const STEPS: [string, string, 'pass' | 'fail' | 'accent'][] = [
    ['Source review', 'notify.ts reads profile.email', 'pass'],
    ['Environment', 'sandbox started on demand', 'pass'],
    ['Reproduce', 'notify.test.ts fails on base', 'fail'],
    ['Repair', 'one-line source fix', 'accent'],
    ['Verify', 'original tests pass', 'pass'],
  ];
  const t = useTick(STEPS.length * 3 + 4, 260, STEPS.length * 3);
  const done = Math.min(STEPS.length, Math.floor(t / 3));
  const tone = { pass: 'text-pass', fail: 'text-fail', accent: 'text-accent' };
  const mark = { pass: '✓', fail: '✗', accent: '◆' };
  return (
    <div>
      <p className="text-[13px] font-bold text-ink">acme/api #482 · Send order emails</p>
      <p className="mt-0.5 text-ink-light">review · source and CI first, sandbox when needed</p>
      <ol className="mt-4 space-y-2">
        {STEPS.map(([title, detail, kind], i) => (
          <li key={title} className={`flex items-center gap-3 transition-opacity ${i <= done ? 'opacity-100' : 'opacity-35'}`}>
            <span className={`flex h-5 w-5 shrink-0 items-center justify-center border ${i < done ? `border-current ${tone[kind]}` : 'border-grid text-ink-light'}`}>
              {i < done ? mark[kind] : i === done ? <span className="text-accent">{SPIN[t % 10]}</span> : ''}
            </span>
            <span className="w-24 shrink-0 text-ink">{title}</span>
            <span className="truncate text-ink-light">{detail}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function EvidenceView() {
  const t = useTick(14, 220, 13);
  const bars = (pass: number, fail: number, on: boolean) => (
    <div className="flex h-2 gap-0.5">
      {Array.from({ length: pass + fail }, (_, i) => <span key={i} className={`flex-1 transition-colors duration-300 ${on ? (i >= pass ? 'bg-fail' : 'bg-pass') : 'bg-grid'}`} />)}
    </div>
  );
  return (
    <div>
      <p className="text-[13px] font-bold text-ink">Evidence</p>
      <div className="mt-3 border border-grid">
        <div className="border-b border-grid bg-paper px-3 py-1 text-ink-light">src/notify.ts</div>
        <div className="bg-fail/10 px-3 py-1 text-fail">- send(user.profile.email)</div>
        <div className={`bg-pass/10 px-3 py-1 text-pass transition-opacity duration-300 ${t > 2 ? 'opacity-100' : 'opacity-0'}`}>+ send(user.profile?.email ?? user.email)</div>
      </div>
      <div className="mt-4 space-y-2">
        <div><div className="mb-1 flex justify-between text-ink-light"><span>base</span><span className="text-fail">3 passed · 1 failed</span></div>{bars(3, 1, t > 5)}</div>
        <div><div className="mb-1 flex justify-between text-ink-light"><span>candidate</span><span className="text-pass">4 passed · 0 failed</span></div>{bars(4, 0, t > 8)}</div>
      </div>
      <div className={`mt-4 flex gap-2 transition-opacity ${t > 10 ? 'opacity-100' : 'opacity-0'}`}>
        <span className="bg-ink px-2.5 py-1 text-white">Export patch</span>
        <span className="border border-grid px-2.5 py-1 text-ink">run.log</span>
      </div>
    </div>
  );
}

const VIEW_UI: Record<(typeof VIEWS)[number]['id'], () => ReactNode> = { overview: OverviewView, review: ReviewView, evidence: EvidenceView };

function ConsoleMock() {
  const [viewRef, seen] = useInView<HTMLDivElement>(0.3);
  const [view, setView] = useState(0);
  const [pinned, setPinned] = useState(false);
  useEffect(() => {
    if (!seen || pinned || prefersReducedMotion()) return;
    const id = setInterval(() => setView((v) => (v + 1) % VIEWS.length), 5200);
    return () => clearInterval(id);
  }, [seen, pinned]);
  const View = VIEW_UI[VIEWS[view].id];
  return (
    <div ref={viewRef} className="overflow-hidden border border-grid bg-surface font-mono text-[11px] shadow-[0_30px_70px_-30px_rgba(0,0,0,.35)]">
      <div className="flex items-center gap-1.5 border-b border-grid bg-paper px-3 py-2 text-ink-light">
        <i className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" /><i className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" /><i className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        <span className="ml-3 flex-1 truncate border border-grid bg-surface px-2 py-0.5">app.osmogrep.com{VIEWS[view].path}</span>
      </div>
      <div className="grid min-h-[330px] grid-cols-[130px_1fr]">
        <nav className="border-r border-grid bg-paper/60 p-2.5" aria-label="Console views">
          <p className="mb-3 flex items-center gap-1.5 px-1 text-[12px] font-bold text-ink"><LogoMark className="h-3.5" still />osmogrep</p>
          {VIEWS.map((v, i) => (
            <button key={v.id} type="button" onClick={() => { setView(i); setPinned(true); }} className={`mb-0.5 block w-full px-2 py-1.5 text-left transition-colors ${i === view ? 'border border-grid bg-surface text-ink' : 'border border-transparent text-ink-light hover:text-ink'}`}>
              {v.label}
            </button>
          ))}
          <p className="mt-6 px-2 text-[10px] text-ink-light">Settings</p>
        </nav>
        <div key={VIEWS[view].id} className="term-in p-4">{seen && <View />}</div>
      </div>
    </div>
  );
}

export default function ConsoleSection() {
  const [ref, p] = useScrollProgress<HTMLElement>();
  const drift = (speed: number) => ({ transform: `translateY(${(0.5 - p) * speed}px)` });
  return (
    <section ref={ref} className="w-full overflow-hidden py-24 md:py-32">
      <div className="mx-auto grid max-w-[1280px] items-center gap-14 px-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <p data-stagger style={stagger(0)} className="font-mono text-[12px] text-accent">web console</p>
          <h2 data-stagger style={stagger(1)} className="mt-3 text-4xl font-bold leading-tight tracking-tight text-ink md:text-5xl">
            Paste a PR.
            <br />
            Get the proof.
          </h2>
          <p data-stagger style={stagger(2)} className="mt-5 max-w-md text-lg text-ink-light">
            The same engine in your browser. Connect GitHub, open a pull request, and watch Osmogrep review it, reproduce the failure and verify the fix.
          </p>
          <ul data-stagger style={stagger(3)} className="mt-7 space-y-2.5 font-mono text-[13px] text-ink">
            {['Review starts from source and CI', 'Sandboxes start only when needed', 'Export the patch and the run log'].map((s, i) => (
              <li key={s} className="flex gap-3"><span className="text-accent">0{i + 1}</span>{s}</li>
            ))}
          </ul>
          <div data-stagger style={stagger(4)} className="mt-9 flex flex-wrap items-center gap-6">
            <a href={consoleUrl} className="group relative inline-flex items-stretch overflow-hidden bg-ink font-mono text-sm text-white transition-transform duration-150 active:scale-[0.98]">
              <span className="absolute inset-0 grid grid-cols-12 grid-rows-3" aria-hidden="true">
                {Array.from({ length: 36 }, (_, i) => <span key={i} className="nav-dissolve bg-accent" style={{ transitionDelay: `${((i * 17) % 36) * 8}ms` }} />)}
              </span>
              <span className="relative flex items-center gap-2.5 px-5 py-3.5 font-bold"><GithubIcon className="h-4 w-4" /> Open the web console</span>
              <span className="relative flex w-12 items-center justify-center overflow-hidden border-l border-white/15">
                <span className="transition-transform duration-300 group-hover:translate-x-10"><PixelArrow className="h-3 w-4" /></span>
                <span className="absolute -translate-x-10 transition-transform duration-300 group-hover:translate-x-0"><PixelArrow className="h-3 w-4" /></span>
              </span>
            </a>
            <a href="/docs" className="group inline-flex items-center gap-2 font-mono text-[13px] text-ink-light hover:text-accent">
              How reviews work <span className="transition-transform group-hover:translate-x-1"><PixelArrow /></span>
            </a>
          </div>
        </Reveal>

        <Reveal className="relative">
          <div className="console-depth-layer" style={drift(150)}><div data-stagger className="scroll-scene"><ConsoleMock /></div></div>
          <div className="console-depth-layer absolute -left-6 -top-6 hidden bg-accent px-3 py-2 font-mono text-[12px] text-white shadow-lg md:block" style={drift(-120)}>
            NULL-003 reproduced in acme/api
          </div>
          <div className="console-depth-layer absolute -bottom-6 -right-4 hidden bg-ink px-3 py-2 font-mono text-[12px] text-white shadow-lg md:block" style={drift(220)}>
            <span className="text-[#7DD69A]">✓</span> fix verified · tests green
          </div>
        </Reveal>
      </div>
    </section>
  );
}
