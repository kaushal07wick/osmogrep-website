'use client';

import type { ReactNode } from 'react';
import { SiClaude, SiOpenai } from 'react-icons/si';
import { useTick } from '../motion/hooks';

/* Live mini-UIs for the navbar features panel, one per feature slug. Each is a small, looping,
   realistic slice of the product. They only exist while the panel is open. */

const SPIN = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏';
const Window = ({ title, dark = false, children }: { title: string; dark?: boolean; children: ReactNode }) => (
  <div className={`w-[236px] overflow-hidden border font-mono text-[10px] leading-[16px] shadow-[0_10px_24px_-14px_rgba(0,0,0,.35)] ${dark ? 'border-black bg-[#141416] text-white/80' : 'border-grid bg-surface text-ink'}`}>
    <div className={`flex items-center gap-1 border-b px-2 py-1 ${dark ? 'border-white/10 text-white/40' : 'border-grid text-ink-light'}`}>
      <i className="h-1.5 w-1.5 rounded-full bg-[#FF5F57]" />
      <i className="h-1.5 w-1.5 rounded-full bg-[#FEBC2E]" />
      <i className="h-1.5 w-1.5 rounded-full bg-[#28C840]" />
      <span className="ml-1.5 truncate">{title}</span>
    </div>
    <div className="px-2.5 py-2">{children}</div>
  </div>
);

/** Test files run one after another; one fails; a progress bar tracks the run. */
function RuntimeChecks() {
  const FILES = [['auth.test.ts', 'pass', '41ms'], ['cart.test.ts', 'pass', '63ms'], ['checkout.test.ts', 'fail', ''], ['queue.test.ts', 'pass', '28ms']];
  const t = useTick(FILES.length * 3 + 5, 220);
  const done = Math.min(FILES.length, Math.floor(t / 3));
  return (
    <Window title="osmogrep run · sandbox">
      {FILES.map(([f, r, ms], i) => (
        <div key={f} className="flex items-center gap-1.5">
          <span className={i < done ? (r === 'pass' ? 'text-pass' : 'text-fail') : 'text-accent'}>{i < done ? (r === 'pass' ? '✓' : '✗') : i === done ? SPIN[t % 10] : '·'}</span>
          <span className={i <= done ? '' : 'text-ink-light'}>{f}</span>
          <span className="ml-auto text-ink-light">{i < done ? (r === 'pass' ? ms : <span className="text-fail">TypeError</span>) : ''}</span>
        </div>
      ))}
      <div className="mt-1.5 h-1 bg-grid">
        <div className="h-full bg-accent transition-[width] duration-200" style={{ width: `${(done / FILES.length) * 100}%` }} />
      </div>
    </Window>
  );
}

/** The failing test is replayed on the original source until the failure is pinned down. */
function FailureReplay() {
  const t = useTick(14, 260);
  const runs = Math.min(3, Math.floor(t / 3));
  return (
    <Window title="replay · notify.test.ts">
      <div className="text-ink-light">original source, {runs}/3 runs</div>
      <div className="mt-1 flex gap-1">
        {[0, 1, 2].map((i) => (
          <span key={i} className={`flex h-4 flex-1 items-center justify-center text-[9px] transition-colors ${i < runs ? 'bg-fail text-white' : i === runs ? 'bg-grid text-ink' : 'bg-grid/50 text-ink-light'}`}>
            {i < runs ? '✗' : i === runs ? SPIN[t % 10] : ''}
          </span>
        ))}
      </div>
      <div className={`mt-1.5 transition-opacity ${runs === 3 ? 'opacity-100' : 'opacity-0'}`}>
        <span className="text-fail">reproduced 3/3</span> <span className="text-ink-light">· notify.ts:3:27</span>
      </div>
    </Window>
  );
}

/** A one-line patch is written, then the original tests rerun green. */
function PatchVerify() {
  const t = useTick(16, 230);
  const add = '+ send(profile?.email ?? email)';
  const typed = Math.max(0, Math.min(add.length, (t - 2) * 5));
  const tests = Math.max(0, Math.min(4, t - 10));
  return (
    <Window title="src/notify.ts">
      <div className="bg-fail/10 px-1 text-fail line-through decoration-fail/40">- send(profile.email)</div>
      <div className="bg-pass/10 px-1 text-pass">{add.slice(0, typed)}{typed < add.length && t > 1 && <span className="term-caret inline-block h-2.5 w-1 bg-pass" />}</div>
      <div className="mt-1.5 flex items-center gap-1">
        {[0, 1, 2, 3].map((i) => <span key={i} className={`h-1.5 flex-1 ${i < tests ? 'bg-pass' : 'bg-grid'}`} />)}
        <span className={`ml-1 ${tests === 4 ? 'text-pass' : 'text-ink-light'}`}>{tests}/4</span>
      </div>
    </Window>
  );
}

/** You type a question; the agent reads files, runs a command and answers. */
function TerminalAgent() {
  const q = 'why does checkout run twice?';
  const t = useTick(30, 110);
  const typed = Math.min(q.length, t);
  const after = t - q.length;
  return (
    <Window title="osmogrep — zsh" dark>
      <div><span className="text-accent">›</span> {q.slice(0, typed)}{typed < q.length && <span className="term-caret inline-block h-2.5 w-1 bg-white/70" />}</div>
      {after > 0 && <div className="term-in text-white/45">  read src/checkout.ts</div>}
      {after > 1 && <div className="term-in text-white/45">  run npm test checkout <span className="text-[#FF8A6B]">✗</span></div>}
      {after > 2 && <div className="term-in text-accent">  retry() sends the order twice</div>}
    </Window>
  );
}

/** The skill call in Codex / Claude Code, with tool calls streaming in. */
function McpSkills() {
  const t = useTick(14, 320);
  const client = t < 7 ? 0 : 1;
  const steps = [['reproduce · base', 'text-[#FF8A6B]', '✗'], ['repair · candidate', 'text-accent', '◆'], ['verify · evidence saved', 'text-[#7DD69A]', '✓']];
  const shown = Math.min(3, (t % 7) - 1);
  return (
    <div className="w-[236px] font-mono text-[10px]">
      <div className="relative mb-1.5 grid grid-cols-2 border border-grid bg-surface">
        <span className="absolute inset-y-0 left-0 w-1/2 bg-ink transition-transform duration-300" style={{ transform: `translateX(${client * 100}%)` }} />
        <span className={`relative flex items-center justify-center gap-1 py-1 ${client === 0 ? 'text-white' : 'text-ink-light'}`}><SiOpenai aria-hidden="true" /> Codex</span>
        <span className={`relative flex items-center justify-center gap-1 py-1 ${client === 1 ? 'text-white' : 'text-ink-light'}`}><SiClaude aria-hidden="true" /> Claude Code</span>
      </div>
      <div className="border border-black bg-[#141416] px-2.5 py-2 leading-[16px] text-white/80">
        <div><span className="text-accent">{client ? '/' : '$'}osmogrep-verify</span> fix the regression</div>
        {steps.slice(0, Math.max(0, shown)).map(([s, c, m]) => (
          <div key={s} className={`term-in ${c}`}>  {m} {s}</div>
        ))}
      </div>
    </div>
  );
}

/** Repositories in the console change status as checks finish. */
function WebConsole() {
  const t = useTick(12, 400);
  const REPOS: [string, number, string, string][] = [
    ['acme/api', 2, '✗ 1 failure', 'text-fail'],
    ['acme/web', 5, '✓ 0 issues', 'text-pass'],
    ['acme/billing', 8, '✓ 0 issues', 'text-pass'],
  ];
  return (
    <Window title="app.osmogrep.com/repos">
      {REPOS.map(([name, at, result, cls]) => (
        <div key={name} className={`flex items-center border-b border-dashed border-grid py-[3px] last:border-0 ${t >= at && cls === 'text-fail' ? 'bg-fail/5' : ''}`}>
          <span>{name}</span>
          <span className={`ml-auto ${t >= at ? cls : 'text-ink-light'}`}>{t >= at ? result : `${SPIN[t % 10]} checking`}</span>
        </div>
      ))}
    </Window>
  );
}

export const previews: Record<string, ReactNode> = {
  'runtime-checks': <RuntimeChecks />,
  'failure-replay': <FailureReplay />,
  'patch-verify': <PatchVerify />,
  'terminal-agent': <TerminalAgent />,
  'mcp-skills': <McpSkills />,
  'web-console': <WebConsole />,
};
