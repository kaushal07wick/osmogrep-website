'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { prefersReducedMotion } from '../../../lib/motion';
import Bug from '../bug/Bug';
import { useInView } from '../motion/hooks';

/*
 * A macOS Terminal session where Osmogrep catches a real runtime bug and fixes it:
 *   `user.profile.email` throws when a new user has no profile.
 * cd → ls → `osmogrep run` (tests, failure, diagnostic; the bug crawls to `.email` and gets caught)
 * → `osmogrep fix` (patch, apply, rerun green). The view auto-scrolls like a real terminal, then loops.
 * It starts when scrolled into view.
 *
 * Each phase starts after the previous one's duration (ms). Rendering is just `p >= N`.
 */
const P = {
  cd: 0, // types `cd ~/acme/api`
  ls: 1, // types `ls`
  lsOut: 2,
  run: 3, // types `osmogrep run`
  index: 4, // spinner
  tests: 5, // counter
  cart: 6,
  auth: 7,
  fail: 8,
  error: 9,
  diag: 10, // diagnostic, bug enters
  crawl: 11, // bug walks to `.email`
  lock: 12, // reticle closes in
  caught: 13,
  fix: 14, // types `osmogrep fix`
  analyze: 15, // spinner
  patch: 16,
  apply: 17,
  rerun: 18, // counter
  green: 19,
  hold: 20,
} as const;
const DURATION = [1000, 450, 450, 1000, 800, 900, 250, 250, 400, 700, 500, 1700, 800, 1000, 1000, 900, 900, 700, 900, 500, 3500];
const LAST = DURATION.length - 1;
const TYPE_MS = 65; // per typed character

/* In the diagnostic, the gutter is 5ch and `.email` starts 26ch into the code line. */
const GUTTER = 5;
const TARGET = 26;
const LINE_3_LENGTH = 55; // `  return send(user.profile.email, 'Your order shipped')`

/** Current phase and ms spent in it (re-renders every 70ms while running). */
function useTimeline(running: boolean) {
  const [phase, setPhase] = useState(0);
  const [since, setSince] = useState(0);
  const [now, setNow] = useState(0);
  useEffect(() => {
    if (!running) return;
    if (prefersReducedMotion()) return setPhase(LAST);
    const id = setInterval(() => setNow(performance.now()), 70);
    setSince(performance.now());
    return () => clearInterval(id);
  }, [running]);
  useEffect(() => {
    if (!running || prefersReducedMotion()) return;
    const id = setTimeout(() => {
      setPhase(phase >= LAST ? 0 : phase + 1);
      setSince(performance.now());
    }, DURATION[phase]);
    return () => clearTimeout(id);
  }, [phase, running]);
  return { p: phase, t: Math.max(0, now - since) };
}

const SPIN = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏';
const spinner = (ms: number) => SPIN[Math.floor(ms / 80) % SPIN.length];

export default function CatchScene() {
  const [viewRef, seen] = useInView<HTMLDivElement>(0.3);
  const { p, t } = useTimeline(seen);
  const body = useRef<HTMLDivElement>(null);

  // Keep the newest output in view, like a real terminal.
  useEffect(() => {
    const el = body.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: p === 0 ? 'auto' : 'smooth' });
  }, [p]);

  /** A command typed at the prompt during phase `at`, complete afterwards. */
  const typed = (at: number, cmd: string) => (p > at ? cmd : cmd.slice(0, Math.floor(t / TYPE_MS)));
  const caret = <span className="term-caret ml-px inline-block h-[14px] w-[7px] translate-y-[2px] bg-white/75" />;
  const count = (at: number, total: number) => (p > at ? total : Math.min(total, Math.floor((t / DURATION[at]) * total)));
  const done = (at: number) => (p === at ? <span className="text-accent">{spinner(t)}</span> : <G>✓</G>);
  const crawling = p >= P.crawl;
  const locked = p >= P.lock;
  const caught = p >= P.caught;

  return (
    <div ref={viewRef} className="overflow-hidden rounded-[10px] border border-black/60 bg-[#141416] font-mono text-[12.5px] leading-[22px] text-white/80 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.55)] ring-1 ring-white/5">
      <div className="relative flex items-center border-b border-black/50 bg-gradient-to-b from-[#2E2E31] to-[#252528] px-3.5 py-2.5">
        <span className="flex gap-2" aria-hidden="true">
          <i className="h-3 w-3 rounded-full bg-[#FF5F57] ring-1 ring-black/20" />
          <i className="h-3 w-3 rounded-full bg-[#FEBC2E] ring-1 ring-black/20" />
          <i className="h-3 w-3 rounded-full bg-[#28C840] ring-1 ring-black/20" />
        </span>
        <span className="absolute inset-x-0 text-center text-[11.5px] text-white/50">api — osmogrep — zsh</span>
      </div>

      <div ref={body} className="h-[470px] overflow-hidden px-4 py-3">
        <Prompt dir="~">{typed(P.cd, 'cd ~/acme/api')}{p === P.cd && caret}</Prompt>
        {p >= P.ls && <Prompt dir="~/acme/api" branch>{typed(P.ls, 'ls')}{p === P.ls && caret}</Prompt>}
        <Line show={p >= P.lsOut}><Dir>src</Dir>  <Dir>tests</Dir>  package.json  tsconfig.json  README.md</Line>

        {p >= P.run && <Prompt dir="~/acme/api" branch>{typed(P.run, 'osmogrep run')}{p === P.run && caret}</Prompt>}
        <Line show={p >= P.index} className="text-white/50">  {done(P.index)} indexed src/ · symbols, imports, call paths</Line>
        <Line show={p >= P.tests} className="text-white/50">  {done(P.tests)} running test files in sandbox <span className="text-white/75">{count(P.tests, 3)}/3</span></Line>
        <Line show={p >= P.cart}>  <G>✓</G> cart.test.ts      <span className="text-white/40">passed</span></Line>
        <Line show={p >= P.auth}>  <G>✓</G> auth.test.ts      <span className="text-white/40">passed</span></Line>
        <Line show={p >= P.fail}>  <R>✗</R> notify.test.ts › <span className="text-white">sends email to a new user</span></Line>
        <Line show={p >= P.error} className="text-[#FF8A6B]">    TypeError: Cannot read properties of undefined (reading &apos;email&apos;)</Line>
        <Line show={p >= P.error} className="text-white/40">      at notify (src/notify.ts:3:27)</Line>

        {p >= P.diag && (
          <div className="term-in mt-2">
            <div className="whitespace-pre text-white/40">   ╭─ <span className="text-white/70">src/notify.ts:3:27</span></div>
            <div className="whitespace-pre"><span className="text-white/30"> 2 │ </span>  <K>const</K> user = <K>await</K> db.users.find(userId)</div>
            <div className={`relative whitespace-pre transition-colors duration-300 ${caught ? 'bg-accent/10' : 'bg-[#FF8A6B]/[0.07]'}`}>
              <span className="text-white/30"> 3 │ </span>  <K>return</K> send(user.profile
              <span className={caught ? 'text-white' : 'text-[#FFB4A1] underline decoration-[#FF8A6B] decoration-wavy underline-offset-4'}>.email</span>, <S>&apos;Your order shipped&apos;</S>)
              {/* the bug walks in from the gutter, stops on `.email`, panics when the reticle locks, flips when caught */}
              <span
                className="absolute top-1/2 -translate-y-1/2 transition-[left] ease-linear"
                style={{ left: `${GUTTER + (crawling ? TARGET + 1 : 0)}ch`, transitionDuration: `${DURATION[P.crawl]}ms` }}
              >
                <Bug mood={caught ? 'caught' : locked ? 'scared' : 'walk'} className="h-5 w-7 text-white" />
              </span>
              {/* reticle: four corner ticks close in on the bug (44px box centered on its 28px width) */}
              {locked && (
                <span className={`absolute top-1/2 h-[34px] w-[44px] ${caught ? 'reticle-done' : 'reticle-lock'}`} style={{ left: `calc(${GUTTER + TARGET + 1}ch - 8px)` }}>
                  <span className="absolute left-0 top-0 h-2.5 w-2.5 border-l-2 border-t-2 border-accent" />
                  <span className="absolute right-0 top-0 h-2.5 w-2.5 border-r-2 border-t-2 border-accent" />
                  <span className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b-2 border-l-2 border-accent" />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b-2 border-r-2 border-accent" />
                </span>
              )}
              {caught && (
                <span className="stamp absolute top-1/2" style={{ left: `${GUTTER + LINE_3_LENGTH + 2}ch` }}>
                  {/* ch above is measured in the line's font; the label's smaller font is set inside */}
                  <span className="block bg-accent px-1.5 text-[10px] leading-[16px] text-white">CAUGHT</span>
                </span>
              )}
            </div>
            <div className="whitespace-pre text-[#FF8A6B]">
              <span className="text-white/30">   │ </span>
              {' '.repeat(TARGET)}^^^^^^ <span className="text-white/50">profile is undefined until a user sets one</span>
            </div>
          </div>
        )}
        <Line show={caught} className="mt-1 text-white/60">
          <span className="text-accent">1 runtime issue</span> · NULL-003 · run <span className="text-white">osmogrep fix</span> to patch
        </Line>

        {p >= P.fix && <Prompt dir="~/acme/api" branch>{typed(P.fix, 'osmogrep fix')}{p === P.fix && caret}</Prompt>}
        <Line show={p >= P.analyze} className="text-white/50">  {done(P.analyze)} reproducing NULL-003 · tracing user.profile</Line>
        <Line show={p >= P.patch}>  <span className="text-accent">◆</span> patch src/notify.ts:3</Line>
        <Line show={p >= P.patch} className="bg-[#FF8A6B]/10 text-[#FFB4A1]">  -   return send(user.profile.email, …)</Line>
        <Line show={p >= P.patch} className="bg-[#7DD69A]/10 text-[#A8E8BB]">  +   return send(user.profile?.email ?? user.email, …)</Line>
        <Line show={p >= P.apply}>  apply patch? <span className="text-white/45">[Y/n]</span> y</Line>
        <Line show={p >= P.rerun} className="text-white/50">  {done(P.rerun)} rerunning tests <span className="text-white/75">{count(P.rerun, 3)}/3</span></Line>
        <Line show={p >= P.green}>  <G>✓ 3 of 3 test files passed</G> <span className="text-white/45">· original tests unchanged</span></Line>
        {p >= P.hold && <Prompt dir="~/acme/api" branch dirty>{caret}</Prompt>}
      </div>
    </div>
  );
}

/** zsh prompt: path, git branch, chevron. `dirty` marks uncommitted changes after the fix. */
function Prompt({ dir, branch = false, dirty = false, children }: { dir: string; branch?: boolean; dirty?: boolean; children?: ReactNode }) {
  return (
    <div className="term-in mt-1 whitespace-pre first:mt-0">
      <span className="text-[#7FB4FF]">{dir}</span>
      {branch && <span className="text-[#C792EA]"> main{dirty && <span className="text-[#FEBC2E]">*</span>}</span>}
      <span className="text-accent"> ❯ </span>
      <span className="text-white">{children}</span>
    </div>
  );
}

const Line = ({ show, children, className = '' }: { show: boolean; children: ReactNode; className?: string }) =>
  show ? <div className={`term-in whitespace-pre ${className}`}>{children}</div> : null;
const K = ({ children }: { children: ReactNode }) => <span className="text-[#C792EA]">{children}</span>;
const S = ({ children }: { children: ReactNode }) => <span className="text-[#C3E88D]">{children}</span>;
const G = ({ children }: { children: ReactNode }) => <span className="text-[#7DD69A]">{children}</span>;
const R = ({ children }: { children: ReactNode }) => <span className="text-[#FF8A6B]">{children}</span>;
const Dir = ({ children }: { children: ReactNode }) => <span className="font-bold text-[#7FB4FF]">{children}</span>;
