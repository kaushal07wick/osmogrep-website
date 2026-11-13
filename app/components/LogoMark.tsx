'use client';

import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../../lib/motion';

/* Osmogrep mark: pixel ring with one orange flaw. The flaw orbits nonstop; the step of
   ring right behind it blinks empty, like a gap it just opened. */
const RING = [
  '...xxxxx...',
  '.xxxxxxxxx.',
  '.xx.....xx.',
  'xx.......xx',
  'xx.......xx',
  'xx.......xx',
  'xx.......xx',
  '.xx.....xx.',
  '.xxxxxxxxx.',
  '...xxxxx...',
];
const FLAW = new Set(['9-4', '10-4', '9-5', '10-5']);
// a = angle around the center as a 0..1 fraction, 0 = right edge, increasing clockwise.
const CELLS = RING.flatMap((r, y) => r.split('').flatMap((c, x) => (c === 'x' ? [{ x, y }] : []))).map((p) => ({
  ...p,
  key: `${p.x}-${p.y}`,
  a: (Math.atan2(p.y + 0.5 - 5, p.x + 0.5 - 5.5) / (2 * Math.PI) + 1) % 1,
}));

const ORBIT = 7000; // ms per lap
const BLINK = 380; // ms per blink phase of the trailing gap
const HEAD = 0.045; // half-width of the orange head, as a fraction of the lap

const near = (a: number, p: number, w: number) => Math.min(Math.abs(a - p), 1 - Math.abs(a - p)) < w;

export default function LogoMark({
  className = 'h-7',
  ring = 'var(--color-ink)',
  flaw = 'var(--color-accent)',
  still = false,
}: {
  className?: string;
  ring?: string;
  flaw?: string;
  still?: boolean;
}) {
  const [ms, setMs] = useState(0);
  useEffect(() => {
    if (still || prefersReducedMotion()) return;
    const start = performance.now();
    const id = setInterval(() => setMs(performance.now() - start), 50);
    return () => clearInterval(id);
  }, [still]);

  if (still) {
    return (
      <svg viewBox="0 0 11 10" shapeRendering="crispEdges" className={`${className} aspect-[11/10] w-auto shrink-0`} aria-hidden="true">
        {CELLS.map(({ x, y, key }) => (FLAW.has(key) ? null : <rect key={key} x={x} y={y} width="1" height="1" style={{ fill: ring }} />))}
        <rect x="9" y="4" width="2" height="2" style={{ fill: flaw }} />
      </svg>
    );
  }

  const head = (ms % ORBIT) / ORBIT;
  const trail = (head - 2 * HEAD + 1) % 1; // the step just behind the head
  const gapOpen = Math.floor(ms / BLINK) % 2 === 1;

  return (
    <svg viewBox="0 0 11 10" shapeRendering="crispEdges" className={`${className} aspect-[11/10] w-auto shrink-0`} aria-hidden="true">
      {CELLS.map(({ x, y, key, a }) => {
        if (gapOpen && near(a, trail, HEAD)) return null;
        return <rect key={key} x={x} y={y} width="1" height="1" style={{ fill: near(a, head, HEAD) ? flaw : ring }} />;
      })}
    </svg>
  );
}
