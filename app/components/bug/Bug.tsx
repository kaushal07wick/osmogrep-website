'use client';
import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../../../lib/motion';

/* The Osmogrep bug, with moods. 14x10 grid: the original 12x8 beetle plus one spare column
   each side and room above (raised antennae) and below (shadow).
   o = shell (accent)       d = shell shade (darker orange)
   g = happy shell (green)  G = happy shade
   k = outline/legs/eyes (currentColor)   w = eye white   s = shadow (currentColor, faint)
   gear only: B = boots   n = binocular body   l = binocular lens */
export type Mood = 'walk' | 'curious' | 'scared' | 'caught' | 'happy';

const FILL: Record<string, string> = {
  o: 'fill-accent',
  d: 'fill-fail',
  g: 'fill-[#22C55E]',
  G: 'fill-pass',
  k: 'fill-current',
  w: 'fill-white',
  s: 'fill-current opacity-20',
  B: 'fill-[#8B5A2B]',
  n: 'fill-[#3F3F46]',
  l: 'fill-[#9CC9FF]',
};

/** Adventure gear: boots on the lowest leg row (with a toe), binoculars held up in front of the eyes. */
function withGear(rows: string[]): string[] {
  const g = rows.map((r) => r.split(''));
  let feet = -1;
  g.forEach((r, y) => { if (r.includes('k') && !r.includes('s') && y > 5) feet = y; });
  if (feet >= 0) {
    const row = g[feet];
    row.forEach((c, x) => { if (c === 'k') { row[x] = 'B'; if (row[x + 1] === '.') row[x + 1] = 'B'; } });
  }
  for (const y of [3, 4]) { g[y][11] = 'n'; g[y][12] = 'n'; g[y][13] = 'l'; }
  return g.map((r) => r.join(''));
}
const GEARED = new Map<string[][], string[][]>();
const geared = (frames: string[][]) => GEARED.get(frames) ?? (GEARED.set(frames, frames.map(withGear)), GEARED.get(frames)!);

const LEGS_A = ['..k..k..k..k..', '.k..k..k..k...'];
const LEGS_B = ['...k..k..k..k.', '..k..k..k..k..'];
const SHADOW = '...ssssssss...';
const ANTENNAE = ['..............', '....kk..kk....', '.....k..k.....'];

// walk: the original bug exactly, eyes looking ahead; blinks every few steps.
const WALK_BODY = ['...oooooooo...', '..oookoookoo..', '..oooooooooo..', '...oooooooo...'];
const BLINK_BODY = ['...oooooooo...', '..oooooooooo..', '..oooooooooo..', '...oooooooo...'];
const WALK_A = [...ANTENNAE, ...WALK_BODY, ...LEGS_A, SHADOW];
const WALK_B = [...ANTENNAE, ...WALK_BODY, ...LEGS_B, SHADOW];
const WALK_BLINK = [...ANTENNAE, ...BLINK_BODY, ...LEGS_A, SHADOW];

// curious: stops, antennae perk up tall (one twitches), eyes glance ahead, then back over its shoulder.
const PERK = ['.....kk..kk...', '.....k...k....', '.....k..k.....'];
const PERK_TWITCH = ['.....kk.......', '.....k...kk...', '.....k..k.....'];
const LOOK_UP = ['...oooooooo...', '..ooookoooko..', '..oooooooooo..', '...oooooooo...'];
const LOOK_BACK = ['...oooooooo...', '..okoookoooo..', '..oooooooooo..', '...oooooooo...'];
const CURIOUS_A = [...PERK, ...LOOK_UP, ...LEGS_A, SHADOW];
const CURIOUS_B = [...PERK_TWITCH, ...LOOK_UP, ...LEGS_A, SHADOW];
const CURIOUS_C = [...PERK, ...LOOK_BACK, ...LEGS_A, SHADOW];

// scared: antennae shoot straight up in a V, eyes go wide, sweat drop, stiff tiptoe legs (+ shake).
const SCARED_A = [
  '...k......k...',
  '....k....k....',
  '.....k..k.....',
  '...oooooooo.k.',
  '..oowwoowwook.',
  '..oowkoowkoo..',
  '...dddddddd...',
  '..k..k..k..k..',
  '..k..k..k..k..',
  SHADOW,
];
const SCARED_B = SCARED_A.map((r, y) => (y === 5 ? '..ookwookwoo..' : r));

// caught: flipped on its back, x-eyes, antennae flopped out, stiff legs up, one twitching.
const CAUGHT_BODY = [
  '...dddddddd...',
  '..okokookoko..',
  '..ookooookoo..',
  '..okokookoko..',
  '.k.oooooooo.k.',
  'k............k',
];
const CAUGHT_A = ['..............', '..k..k..k..k..', '..k..k..k..k..', ...CAUGHT_BODY, SHADOW];
const CAUGHT_B = ['..............', '.k..k...k..k..', '..k..k..k..k..', ...CAUGHT_BODY, SHADOW];

// happy: fixed, shell goes green, ^ ^ eyes, little hop.
const HAPPY_BODY = ['...gggggggg...', '..ggkggggkgg..', '..gkgkggkgkg..', '...GGGGGGGG...'];
const HAPPY_A = [...ANTENNAE, ...HAPPY_BODY, ...LEGS_A, SHADOW];
const HAPPY_B = [...ANTENNAE.slice(1), ...HAPPY_BODY, '...k.k..k.k...', '..............', '..............', '....ssssss....'];

export const MOODS: Record<Mood, { frames: string[][]; ms: number }> = {
  walk: { frames: [WALK_A, WALK_B, WALK_A, WALK_B, WALK_A, WALK_B, WALK_BLINK, WALK_B], ms: 300 },
  curious: { frames: [CURIOUS_A, CURIOUS_A, CURIOUS_B, CURIOUS_A, CURIOUS_C, CURIOUS_C, CURIOUS_A, CURIOUS_A], ms: 350 },
  scared: { frames: [SCARED_A, SCARED_B], ms: 160 },
  caught: { frames: [CAUGHT_A, CAUGHT_B], ms: 220 },
  happy: { frames: [HAPPY_A, HAPPY_B], ms: 260 },
};

/** Plays string-row frames as crisp pixels; viewBox follows the sprite size. fx = class on the pixel group (e.g. bug-shake). */
export function Sprite({ frames, ms, className, fx }: { frames: string[][]; ms: number; className?: string; fx?: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    setI(0);
    if (prefersReducedMotion()) return;
    const id = setInterval(() => setI((n) => n + 1), ms);
    return () => clearInterval(id);
  }, [frames, ms]);
  const rows = frames[i % frames.length];
  return (
    <svg viewBox={`0 0 ${rows[0].length} ${rows.length}`} shapeRendering="crispEdges" className={className} aria-hidden="true">
      <g className={fx}>
        {rows.flatMap((r, y) =>
          r.split('').map((c, x) => (c === '.' ? null : <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" className={FILL[c]} />)),
        )}
      </g>
    </svg>
  );
}

/** Size with className (7:5 ratio, e.g. h-5 w-7); outline and legs use the text color. `gear` adds boots and binoculars. */
export default function Bug({ mood = 'walk', className = 'h-5 w-7 text-ink', gear = false }: { mood?: Mood; className?: string; gear?: boolean }) {
  const m = MOODS[mood];
  const frames = gear && mood !== 'caught' ? geared(m.frames) : m.frames;
  return <Sprite frames={frames} ms={m.ms} className={className} fx={mood === 'scared' ? 'bug-shake' : undefined} />;
}
