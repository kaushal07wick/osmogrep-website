'use client';

import type { ReactNode } from 'react';
import { useTick } from '../../motion/hooks';

/* The field guide's specimens: dangerous, common runtime bugs that slip past AI agents and junior
   engineers. Each has a pixel icon, a danger level (1-5), a mock-Latin name, its habitat, the buggy
   and fixed line, and a small looping animation that shows the bug happening. */

export type Specimen = {
  latin: string;
  name: string;
  icon: keyof typeof ICONS;
  danger: 1 | 2 | 3 | 4 | 5;
  missedBy: string;
  habitat: string;
  before: ReactNode;
  after: ReactNode;
  Demo: () => ReactNode;
};

const Bad = ({ children }: { children: ReactNode }) => <span className="text-fail">{children}</span>;
const Good = ({ children }: { children: ReactNode }) => <span className="text-pass">{children}</span>;

/* ---------- 9x9 pixel icons (x = ink, o = accent) ---------- */
const ICONS = {
  db: ['..xxxxx..', '.x.....x.', '.xxxxxxx.', '.x.....x.', '.xxxxxxx.', '.x.....x.', '.xxxxxxx.', '.x.....x.', '..xxxxx..'],
  loop: ['..xxxxx..', '.x.....x.', 'x.......x', 'x.......o', 'x......oo', 'x.......o', 'x.......x', '.x.....x.', '..xxxxx..'],
  clock: ['..xxxxx..', '.x..x..x.', 'x...x...x', 'x...x...x', 'x...xooox', 'x.......x', 'x.......x', '.x.....x.', '..xxxxx..'],
  swords: ['o.......o', '.o.....o.', '..o...o..', '...o.o...', '....o....', '...x.x...', '..x...x..', '.xx...xx.', 'xx.....xx'],
  key: ['.........', '.xxx.....', 'x...x....', 'x...xoooo', 'x...x.o.o', '.xxx.....', '.........', '.........', '.........'],
  memory: ['xxxxxxxxx', 'x.......x', 'xoooo...x', 'xoooo...x', 'xoooooo.x', 'xoooooo.x', 'xooooooox', 'x.......x', 'xxxxxxxxx'],
  card: ['xxxxxxxxx', 'x.......x', 'xxxxxxxxx', 'x.......x', 'x.oo....x', 'x.......x', 'xxxxxxxxx', '.........', '.........'],
  folder: ['xxx......', 'x..xxxxxx', 'x.......x', 'x..o.o..x', 'x.o.o...x', 'xo.o....x', 'x.......x', 'xxxxxxxxx', '.........'],
  hourglass: ['xxxxxxxxx', '.x.....x.', '..xooox..', '...xox...', '....x....', '...x.x...', '..x.o.x..', '.xooooox.', 'xxxxxxxxx'],
};

export const PixelIcon = ({ name, className = 'h-5 w-5' }: { name: keyof typeof ICONS; className?: string }) => (
  <svg viewBox="0 0 9 9" shapeRendering="crispEdges" className={className} aria-hidden="true">
    {ICONS[name].flatMap((r, y) =>
      r.split('').map((c, x) => (c === 'x' || c === 'o' ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" className={c === 'o' ? 'fill-accent' : 'fill-current'} /> : null)),
    )}
  </svg>
);

/* ---------- mini demos ---------- */
const DemoBox = ({ children }: { children: ReactNode }) => (
  <div className="h-[54px] overflow-hidden border border-dashed border-grid bg-paper/70 px-3 py-2 font-mono text-[11px] leading-[17px] text-ink">{children}</div>
);

function SqlDemo() {
  const input = "' OR 1=1 --";
  const i = useTick(input.length + 8, 140);
  const typed = input.slice(0, Math.min(i, input.length));
  return (
    <DemoBox>
      <div className="truncate">SELECT * FROM users WHERE name = &apos;<Bad>{typed.slice(1)}</Bad>&apos;</div>
      <div className={i >= input.length ? 'text-fail' : 'text-ink-light'}>{i >= input.length ? '→ 48,213 rows returned' : 'waiting for input…'}</div>
    </DemoBox>
  );
}

function NPlusOneDemo() {
  const i = useTick(12, 260);
  return (
    <DemoBox>
      <div className="flex flex-wrap gap-[3px]">
        {Array.from({ length: 22 }, (_, k) => <span key={k} className={`h-2 w-2 ${k <= i * 2 ? (k === 0 ? 'bg-ink' : 'bg-fail') : 'bg-grid'}`} />)}
      </div>
      <div className="mt-1 text-ink-light">queries this request: <Bad>{1 + Math.min(i * 2, 21)}</Bad></div>
    </DemoBox>
  );
}

function AwaitDemo() {
  const i = useTick(6, 600);
  return (
    <DemoBox>
      <div>saveOrder(cart) <span className="text-ink-light">{'// no await'}</span></div>
      <div>
        {i < 2 && <span className="text-ink-light">⠿ pending…</span>}
        {i >= 2 && i < 4 && <Good>res.send(200) ✓</Good>}
        {i >= 4 && <Bad>✗ save failed · nobody heard</Bad>}
      </div>
    </DemoBox>
  );
}

function RaceDemo() {
  const i = useTick(8, 380);
  const a = Math.min(i, 3), b = Math.min(Math.max(i - 1, 0), 3);
  const steps = ['read 100', 'add 50', 'write 150', 'done'];
  return (
    <DemoBox>
      <div className="grid grid-cols-2 gap-2">
        <div>A: {steps[a]}</div>
        <div>B: {steps[b]}</div>
      </div>
      <div>balance: {i >= 4 ? <Bad>150 (expected 200)</Bad> : <span className="text-ink-light">100</span>}</div>
    </DemoBox>
  );
}

function SecretDemo() {
  const i = useTick(6, 700);
  return (
    <DemoBox>
      <div className="truncate">log.info(&quot;auth&quot;, headers)</div>
      <div className="truncate">
        {i < 3 ? <span className="text-ink-light">…</span> : <>Authorization: Bearer <Bad>sk_live_9fA2…x81</Bad></>}
      </div>
    </DemoBox>
  );
}

function MemoryDemo() {
  const i = useTick(10, 300);
  return (
    <DemoBox>
      <div className="h-2.5 w-full bg-grid">
        <div className={`h-full transition-[width] duration-300 ${i > 7 ? 'bg-fail' : 'bg-accent'}`} style={{ width: `${Math.min(100, (i + 1) * 11)}%` }} />
      </div>
      <div className="mt-1.5">{i > 7 ? <Bad>✗ heap out of memory</Bad> : <span className="text-ink-light">loading all rows… {(i + 1) * 120}k</span>}</div>
    </DemoBox>
  );
}

function DoubleChargeDemo() {
  const i = useTick(6, 600);
  return (
    <DemoBox>
      <div>POST /charge {i >= 1 && <span className="text-ink-light">· timeout</span>}{i >= 2 && <span> · retry</span>}</div>
      <div>{i >= 3 ? <><Bad>$49.00</Bad> <Bad>$49.00</Bad> <span className="text-ink-light">charged twice</span></> : <span className="text-ink-light">card ••4242</span>}</div>
    </DemoBox>
  );
}

function TraversalDemo() {
  const parts = ['uploads', '..', '..', '..', 'etc', 'passwd'];
  const i = useTick(parts.length + 3, 420);
  return (
    <DemoBox>
      <div className="truncate">GET /files?name=<Bad>{parts.slice(1, Math.min(i, parts.length - 1) + 1).join('/')}</Bad></div>
      <div className="truncate">{i >= parts.length ? <Bad>root:x:0:0:root:/root:/bin/bash</Bad> : <span className="text-ink-light">resolving path…</span>}</div>
    </DemoBox>
  );
}

function TimeoutDemo() {
  const i = useTick(40, 150, 0);
  const spin = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'[i % 10];
  return (
    <DemoBox>
      <div>await fetch(partnerApi) <span className="text-accent">{spin}</span></div>
      <div className="text-ink-light">waiting {(i * 0.15 + 30).toFixed(1)}s · <Bad>workers stuck: {Math.min(16, 1 + (i >> 2))}/16</Bad></div>
    </DemoBox>
  );
}

export const SPECIMENS: Specimen[] = [
  { latin: 'Injectio sqlensis', name: 'SQL injection', icon: 'db', danger: 5, missedBy: 'AI agents',
    habitat: 'queries built with strings',
    before: <>`… WHERE name = &apos;<Bad>${'{name}'}</Bad>&apos;`</>, after: <>sql`… WHERE name = <Good>${'{name}'}</Good>`</>, Demo: SqlDemo },
  { latin: 'Interrogatio multiplex', name: 'N+1 queries', icon: 'loop', danger: 3, missedBy: 'juniors',
    habitat: 'ORM calls inside loops',
    before: <>for (o of orders) <Bad>await o.getUser()</Bad></>, after: <>Order.findAll(<Good>{'{ include: User }'}</Good>)</>, Demo: NPlusOneDemo },
  { latin: 'Promissa orphana', name: 'missing await', icon: 'hourglass', danger: 4, missedBy: 'AI agents',
    habitat: 'fire-and-forget async calls',
    before: <><Bad>saveOrder(cart)</Bad>; res.send(200)</>, after: <><Good>await</Good> saveOrder(cart); res.send(200)</>, Demo: AwaitDemo },
  { latin: 'Cursor concurrens', name: 'race condition', icon: 'swords', danger: 5, missedBy: 'both',
    habitat: 'read-modify-write under load',
    before: <><Bad>b = get(); set(b + amt)</Bad></>, after: <><Good>UPDATE … SET b = b + $1</Good></>, Demo: RaceDemo },
  { latin: 'Clavis exposita', name: 'secret in logs', icon: 'key', danger: 5, missedBy: 'juniors',
    habitat: 'debug logging of headers and env',
    before: <>log.info(<Bad>req.headers</Bad>)</>, after: <>log.info(<Good>redact(req.headers)</Good>)</>, Demo: SecretDemo },
  { latin: 'Memoria vorax', name: 'unbounded query', icon: 'memory', danger: 4, missedBy: 'AI agents',
    habitat: 'exports, reports, admin pages',
    before: <>db.rows.<Bad>findAll()</Bad></>, after: <>db.rows.findAll(<Good>{'{ limit, cursor }'}</Good>)</>, Demo: MemoryDemo },
  { latin: 'Duplex chargius', name: 'double charge', icon: 'card', danger: 5, missedBy: 'both',
    habitat: 'retries without idempotency keys',
    before: <>retry(() =&gt; <Bad>charge(card)</Bad>)</>, after: <>charge(card, <Good>{'{ idempotencyKey }'}</Good>)</>, Demo: DoubleChargeDemo },
  { latin: 'Semita fugiens', name: 'path traversal', icon: 'folder', danger: 5, missedBy: 'AI agents',
    habitat: 'file downloads by name',
    before: <>readFile(<Bad>dir + name</Bad>)</>, after: <>readFile(<Good>safeJoin(dir, name)</Good>)</>, Demo: TraversalDemo },
  { latin: 'Expectatio aeterna', name: 'no timeout', icon: 'clock', danger: 3, missedBy: 'juniors',
    habitat: 'calls to third-party APIs',
    before: <><Bad>await fetch(url)</Bad></>, after: <>fetch(url, <Good>{'{ signal: AbortSignal.timeout(5e3) }'}</Good>)</>, Demo: TimeoutDemo },
];
