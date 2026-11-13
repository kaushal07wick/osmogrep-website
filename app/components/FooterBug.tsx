'use client';

import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../lib/motion';

/* 12x8 pixel beetle with two leg frames. o = shell, k = ink. */
const BUG_TOP = ['...kk..kk...', '....k..k....', '..oooooooo..', '.oookoookoo.', '.oooooooooo.', '..oooooooo..'];
const LEGS_A = ['.k..k..k..k.', 'k..k..k..k..'];
const LEGS_B = ['..k..k..k..k', '.k..k..k..k.'];
const Pixels = ({ rows, y0 = 0 }: { rows: string[]; y0?: number }) => (
  <>
    {rows.flatMap((r, y) =>
      r.split('').map((c, x) =>
        c === '.' ? null : (
          <rect key={`${x}-${y}`} x={x} y={y + y0} width="1" height="1" className={c === 'o' ? 'fill-accent' : 'fill-ink'} />
        ),
      ),
    )}
  </>
);

/* Walks the footer's front ridge (#ridgeB, drawn in a 1200x280 box stretched to the container). */
export default function FooterBug() {
  const bug = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = bug.current!;
    const box = el.parentElement!;
    const ridge = box.querySelector<SVGPathElement>('#ridgeB');
    if (!ridge) return;
    const total = ridge.getTotalLength();
    const yAt = (u: number) => {
      let lo = 0, hi = total;
      for (let i = 0; i < 16; i++) {
        const mid = (lo + hi) / 2;
        if (ridge.getPointAtLength(mid).x < u) lo = mid;
        else hi = mid;
      }
      return ridge.getPointAtLength(lo).y;
    };
    const place = (x: number) => {
      const w = box.clientWidth, h = box.clientHeight;
      const y = (yAt(((x + 16) / w) * 1200) * h) / 280; // sample under the bug's middle
      el.style.transform = `translate(${x}px, ${y}px) translateY(-100%)`;
    };
    if (prefersReducedMotion()) return place(160);
    let raf = 0, last = performance.now(), x = -40;
    const tick = (t: number) => {
      x += Math.min(t - last, 50) * 0.05; // ~50px/s
      last = t;
      if (x > box.clientWidth + 10) x = -40;
      place(x);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div ref={bug} className="absolute left-0 top-0 will-change-transform" aria-hidden="true">
      <svg viewBox="0 0 12 8" shapeRendering="crispEdges" className="h-5 w-8">
        <Pixels rows={BUG_TOP} />
        <g className="nav-legs-a"><Pixels rows={LEGS_A} y0={6} /></g>
        <g className="nav-legs-b"><Pixels rows={LEGS_B} y0={6} /></g>
      </svg>
    </div>
  );
}
