'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { FaApple, FaLinux, FaWindows } from 'react-icons/fa6';
import { SiNeovim } from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';
import { features } from '../../../lib/features';

/* Mounted only while the features panel is open, so none of these animations run otherwise. */
const d = (s: number) => ({ animationDelay: `${s}s` });

const RuntimeChecks = () => (
  <div className="w-48 space-y-1.5 font-mono text-[10px]">
    {['auth.test.ts', 'cart.test.ts', 'checkout.test.ts', 'queue.test.ts'].map((f, i) => (
      <div key={f} style={d(i * 0.5)} className="feat-rise flex items-center gap-2 border border-grid bg-surface px-2 py-1">
        <span className={f.startsWith('checkout') ? 'text-fail' : 'text-pass'}>{f.startsWith('checkout') ? '✗' : '✓'}</span>
        <span className="text-ink">{f}</span>
        <span className="ml-auto text-ink-light">{f.startsWith('checkout') ? 'failed' : `${12 + i * 7}ms`}</span>
      </div>
    ))}
  </div>
);

const FailureReplay = () => (
  <div className="w-52 border border-grid bg-surface font-mono text-[10px]">
    <div className="border-b border-grid px-2 py-1 text-ink-light">checkout.test.js</div>
    <div className="relative h-14">
      <div className="feat-swap-a absolute inset-0 flex flex-col justify-center px-2">
        <span className="text-ink-light">original source</span>
        <span className="text-fail">3 passed · 1 failed</span>
      </div>
      <div className="feat-swap-b absolute inset-0 flex flex-col justify-center px-2">
        <span className="text-ink-light">after source fix</span>
        <span className="text-pass">4 passed · 0 failed</span>
      </div>
    </div>
  </div>
);

const PatchVerify = () => (
  <div className="w-56 border border-grid bg-surface font-mono text-[10px] leading-relaxed">
    <div className="border-b border-grid px-2 py-1 text-ink-light">checkout.ts</div>
    <div className="px-1 py-1">
      <div className="px-1 text-ink-light">  const order = await</div>
      <div style={d(0.3)} className="feat-rise bg-fail/10 px-1 text-fail">- createOrder(cart)</div>
      <div style={d(0.9)} className="feat-rise bg-pass/10 px-1 text-pass">+ createOrder(cart, {'{'} key {'}'})</div>
      <div style={d(1.5)} className="feat-rise px-1 text-pass">✓ verified by 4 tests</div>
    </div>
  </div>
);

const ContextGraph = () => (
  <svg viewBox="0 0 200 110" className="h-[110px] w-[200px] text-accent" fill="none" aria-hidden="true">
    {[
      [100, 55, 45, 25], [100, 55, 155, 25], [100, 55, 45, 85], [100, 55, 155, 85], [45, 25, 20, 55], [155, 85, 182, 60],
    ].map(([x1, y1, x2, y2], i) => (
      <g key={i}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeOpacity="0.2" />
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1.5" className="index-edge-flow" style={d(i * 0.2)} />
      </g>
    ))}
    {[[45, 25], [155, 25], [45, 85], [155, 85], [20, 55], [182, 60]].map(([x, y], i) => (
      <rect key={i} x={x - 3} y={y - 3} width="6" height="6" fill="currentColor" className="index-node-breathe" style={d(i * 0.15)} />
    ))}
    <rect x="92" y="47" width="16" height="16" className="fill-ink" />
    <text x="100" y="105" textAnchor="middle" className="fill-ink-light font-mono" fontSize="8">symbols · imports · calls</text>
  </svg>
);

const TerminalAgent = () => (
  <div className="w-56 bg-ink p-2.5 font-mono text-[10px] leading-relaxed text-white/80">
    <div><span className="text-accent">$</span> osmogrep</div>
    <div className="flex"><span className="text-white/50">&gt;&nbsp;</span><span className="feat-type" style={{ ['--n' as string]: 25 }}>why does checkout run twice</span></div>
    <div style={d(1.6)} className="feat-rise text-white/50">[read] src/checkout.ts</div>
    <div style={d(2.1)} className="feat-rise text-white/50">[run] npm test checkout</div>
    <div style={d(2.6)} className="feat-rise text-accent">retry sends the order twice</div>
  </div>
);

const ShellSlash = () => (
  <div className="flex w-56 flex-wrap justify-center gap-1.5 font-mono text-[10px]">
    {['!git status', '/help', '!cargo test', '/clear', '!npm run lint', '/quit'].map((c, i) => (
      <span key={c} style={d(i * 0.35)} className={`feat-rise border px-2 py-1 ${c.startsWith('!') ? 'border-grid bg-surface text-ink' : 'border-accent/40 bg-accent/10 text-accent'}`}>
        {c}
      </span>
    ))}
  </div>
);

const WebConsole = () => (
  <div className="w-56 border border-grid bg-surface font-mono text-[10px]">
    <div className="flex items-center gap-1.5 border-b border-grid px-2 py-1 text-ink-light">
      <span className="h-1.5 w-1.5 rounded-full bg-grid" /><span className="h-1.5 w-1.5 rounded-full bg-grid" />
      <span className="ml-1">app.osmogrep.com</span>
    </div>
    {[
      ['acme/api', 'checking', 'text-ink-light'],
      ['acme/web', '✓ 0 issues', 'text-pass'],
      ['acme/billing', '✗ 1 failure', 'text-fail'],
    ].map(([repo, state, cls], i) => (
      <div key={repo} style={d(i * 0.4)} className="feat-rise flex items-center gap-2 border-b border-grid/60 px-2 py-1 last:border-0">
        <span className="text-ink">{repo}</span>
        <span className={`ml-auto flex items-center gap-1 ${cls}`}>
          {state === 'checking' && <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent" />}
          {state}
        </span>
      </div>
    ))}
  </div>
);

const Everywhere = () => (
  <div className="flex items-center gap-4 text-2xl text-ink-light">
    {[FaApple, FaLinux, FaWindows, VscVscode, SiNeovim].map((Icon, i) => (
      <span key={i} style={d(i * 0.3)} className="bob-soft inline-block">
        <Icon aria-hidden="true" />
      </span>
    ))}
  </div>
);

const previews: Record<string, ReactNode> = {
  'runtime-checks': <RuntimeChecks />,
  'failure-replay': <FailureReplay />,
  'patch-verify': <PatchVerify />,
  'repo-context': <ContextGraph />,
  'terminal-agent': <TerminalAgent />,
  'shell-commands': <ShellSlash />,
  'web-console': <WebConsole />,
  'everywhere': <Everywhere />,
};

/* All eight at once: pixel-notched tiles with a mono path, title and line of copy over a live preview. */
export default function FeaturesPanel() {
  return (
    <div className="feat-drop border-b border-grid bg-paper shadow-2xl shadow-black/10">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-3 p-5 lg:grid-cols-4">
        {features.map((f) => (
          <Link key={f.slug} href={f.href} className="frame group">
            <span className="flex h-full flex-col">
              <span className="px-4 pt-3.5">
                <span className="block font-medium text-ink transition-colors group-hover:text-accent">{f.title}</span>
                <span className="mt-0.5 block font-mono text-[11px] text-ink-light">{f.desc}</span>
              </span>
              <span className="mx-3 mb-3 mt-3 flex h-[132px] items-center justify-center overflow-hidden bg-paper bg-[radial-gradient(circle_at_1px_1px,rgba(24,24,27,0.09)_1px,transparent_0)] bg-[size:8px_8px]">
                <span className="scale-[0.92]">{previews[f.slug]}</span>
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
