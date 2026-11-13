'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { prefersReducedMotion } from '../../../lib/motion';
import type { FooterScene } from '../../../lib/footer/scene';
import Bug, { type Mood } from '../bug/Bug';

/*
 * The footer bug walks the ASCII ridges of the footer scene (heights come from scene.ridgeY).
 *
 * Easter eggs (add new ones here and in the handlers below):
 *   1. wander     it strolls, stops to look around, mutters, turns at the edges
 *   2. flee       point at it and it panics and runs away
 *   3. squish     click it: it freezes, flinches and complains
 *   4. squash     click it 4 times within 2.5s: it dies, flips over, respawns. Kills are remembered.
 *   5. hop        double-click it: it jumps
 *   6. crumb      click the ground: a crumb drops, it walks over and eats it
 *   7. grep       type "grep" anywhere: a reticle locks on it
 *   8. swarm      Konami code (↑↑↓↓←→←→BA): a swarm marches across
 *   9. veteran    10 kills unlocks a title
 *  10. explorer   it hops between ridges and scouts with its binoculars
 */
const KILLS_KEY = 'osmogrep:bugs-squashed';
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
const MUTTER = ['no bugs here…', 'definitely not a race condition', 'it works on my machine', 'undefined is fine', 'just passing through', 'who touched prod?'];
const OUCH = ['ouch', 'hey!', 'rude', 'segfault!', 'stop that', '404: dignity'];
const SCOUT = ['new ridge!', 'better view up here', 'scouting…'];
const BUG_W = 28;
const pick = <T,>(a: T[]) => a[(Math.random() * a.length) | 0];

const readKills = () => {
  try { return Number(localStorage.getItem(KILLS_KEY)) || 0; } catch { return 0; }
};
const saveKills = (n: number) => {
  try { localStorage.setItem(KILLS_KEY, String(n)); } catch { /* private mode: just don't remember */ }
};

export default function FooterBug({ scene, host }: { scene: FooterScene | null; host: RefObject<HTMLDivElement | null> }) {
  const bug = useRef<HTMLDivElement>(null);
  const s = useRef({ x: 80, dir: 1, ridge: 0, fleeUntil: 0, pauseUntil: 0, deadUntil: 0, stunUntil: 0, hits: [] as number[], crumb: null as number | null });
  const [mood, setMood] = useState<Mood>('walk');
  const [dir, setDir] = useState(1);
  const [say, setSay] = useState<{ text: string; id: number } | null>(null);
  const [crumb, setCrumb] = useState<{ x: number; y: number } | null>(null);
  const [hop, setHop] = useState(0);
  const [locked, setLocked] = useState(false);
  const [swarm, setSwarm] = useState(0);

  const speak = (text: string, ms = 1600) => {
    const id = Date.now();
    setSay({ text, id });
    setTimeout(() => setSay((cur) => (cur?.id === id ? null : cur)), ms);
  };

  useEffect(() => {
    const el = bug.current;
    const box = host.current;
    if (!scene || !el || !box) return;
    const yAt = (x: number) => scene.ridgeY(s.current.ridge, x + BUG_W / 2);
    const place = () => (el.style.transform = `translate(${s.current.x}px, ${yAt(s.current.x)}px) translateY(-100%)`);
    if (prefersReducedMotion()) return void place();

    let raf = 0;
    let last = performance.now();
    let nextIdle = last + 4000;
    let nextRidge = last + 9000;
    const tick = (t: number) => {
      const st = s.current;
      const dt = Math.min(t - last, 50);
      last = t;
      const max = box.clientWidth - BUG_W;

      if (t < st.deadUntil) {
        // egg 4: lying there, belly up
      } else if (st.deadUntil) {
        st.deadUntil = 0;
        st.x = 0;
        st.dir = 1;
        setDir(1);
        setMood('walk');
        speak('…I’m back');
      } else if (st.crumb !== null && Math.abs(st.crumb - st.x) < 4) {
        st.crumb = null;
        st.pauseUntil = t + 1400;
        setCrumb(null);
        setMood('happy');
        speak('nom');
      } else if (t < st.stunUntil) {
        // egg 3: frozen after a hit, so quick follow-up clicks can land
      } else if (t >= st.pauseUntil) {
        const fleeing = t < st.fleeUntil;
        if (st.crumb !== null && !fleeing) st.dir = st.crumb > st.x ? 1 : -1;
        st.x += st.dir * dt * (fleeing ? 0.15 : 0.045);
        if (st.x <= 0 || st.x >= max) {
          st.x = Math.min(max, Math.max(0, st.x));
          st.dir *= -1;
        }
        setDir(st.dir);
        setMood(fleeing ? 'scared' : 'walk');
        if (t > nextRidge && st.crumb === null) {
          // egg 10: hop to another ridge
          nextRidge = t + 9000 + Math.random() * 9000;
          const others = Array.from({ length: scene.ridgeCount }, (_, i) => i).filter((i) => i !== st.ridge);
          st.ridge = pick(others);
          setHop((n) => n + 1);
          if (Math.random() < 0.4) speak(pick(SCOUT), 1500);
        }
        if (t > nextIdle && st.crumb === null) {
          // egg 1: stop, look around, sometimes mutter
          nextIdle = t + 5000 + Math.random() * 6000;
          st.pauseUntil = t + 1800;
          setMood('curious');
          if (Math.random() < 0.5) speak(pick(MUTTER), 1800);
        }
      }
      place();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // egg 6: click the ground to drop a crumb (on the front ridge, where the bug can reach it)
    const onGround = (e: MouseEvent) => {
      if (el.contains(e.target as Node) || s.current.deadUntil) return;
      const r = box.getBoundingClientRect();
      const x = Math.min(box.clientWidth - BUG_W, Math.max(0, e.clientX - r.left - BUG_W / 2));
      s.current.ridge = 0;
      s.current.crumb = x;
      s.current.pauseUntil = 0;
      setCrumb({ x, y: scene.ridgeY(0, x + BUG_W / 2) });
    };
    box.addEventListener('click', onGround);

    // eggs 7 and 8: typed sequences
    let typed: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input, textarea, [contenteditable="true"]')) return;
      typed = [...typed, e.key].slice(-10);
      if (typed.slice(-4).join('').toLowerCase() === 'grep') {
        setLocked(true);
        speak('grep: 1 match', 2000);
        setTimeout(() => setLocked(false), 2000);
      }
      if (typed.join(',') === KONAMI.join(',')) setSwarm((n) => n + 1);
    };
    addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(raf);
      box.removeEventListener('click', onGround);
      removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  // egg 2: run away from the pointer
  const onEnter = (e: React.PointerEvent) => {
    const st = s.current;
    if (st.deadUntil || e.pointerType === 'touch' || performance.now() < st.stunUntil + 400) return;
    const center = bug.current!.getBoundingClientRect().left + BUG_W / 2;
    st.dir = e.clientX < center ? 1 : -1;
    st.fleeUntil = performance.now() + 900;
    st.pauseUntil = 0;
    if (Math.random() < 0.4) speak('eep!', 700);
  };

  // eggs 3, 4 and 9: squish, squash, veteran
  const onHit = (e: React.PointerEvent) => {
    e.stopPropagation();
    const st = s.current;
    const now = performance.now();
    if (st.deadUntil) return;
    st.hits = [...st.hits.filter((t) => now - t < 2500), now];
    if (st.hits.length >= 4) {
      st.hits = [];
      st.deadUntil = now + 3500;
      st.crumb = null;
      setCrumb(null);
      setMood('caught');
      const kills = readKills() + 1;
      saveKills(kills);
      speak(kills === 10 ? 'achievement: exterminator' : kills > 10 ? `exterminator · ${kills} squashed` : `squashed ×${kills}`, 2600);
      return;
    }
    st.stunUntil = now + 700;
    st.fleeUntil = 0;
    setMood('scared');
    speak(pick(OUCH), 900);
  };

  return (
    <>
      {crumb && (
        <span className="absolute left-0 top-0 h-1.5 w-1.5 bg-accent" style={{ transform: `translate(${crumb.x + BUG_W / 2}px, ${crumb.y - 4}px)` }} aria-hidden="true" />
      )}
      <div
        ref={bug}
        className="absolute left-0 top-0 z-10 cursor-crosshair touch-manipulation"
        onPointerEnter={onEnter}
        onPointerDown={onHit}
        onDoubleClick={() => setHop((n) => n + 1)}
        aria-hidden="true"
      >
        {say && (
          <span key={say.id} className="bug-say absolute bottom-full left-1/2 mb-2 whitespace-nowrap bg-white px-1.5 py-0.5 font-mono text-[10px] text-ink">
            {say.text}
          </span>
        )}
        {locked && (
          <span className="absolute -inset-2">
            {['left-0 top-0 border-l-2 border-t-2', 'right-0 top-0 border-r-2 border-t-2', 'bottom-0 left-0 border-b-2 border-l-2', 'bottom-0 right-0 border-b-2 border-r-2'].map((c) => (
              <span key={c} className={`absolute h-2 w-2 border-accent ${c}`} />
            ))}
          </span>
        )}
        <div key={hop} className={hop ? 'bug-hop' : ''}>
          <div style={{ transform: dir < 0 ? 'scaleX(-1)' : undefined }}>
            <Bug mood={mood} className="h-5 w-7 text-white" gear />
          </div>
        </div>
      </div>

      {/* egg 8: the swarm */}
      {swarm > 0 && (
        <div key={swarm} className="pointer-events-none absolute inset-x-0 bottom-6 h-8 overflow-hidden" aria-hidden="true">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} className="bug-swarm absolute left-0" style={{ animationDelay: `${i * 180}ms`, top: `${(i % 3) * 8}px` }}>
              <Bug className="h-4 w-6 text-white" />
            </span>
          ))}
        </div>
      )}
    </>
  );
}
