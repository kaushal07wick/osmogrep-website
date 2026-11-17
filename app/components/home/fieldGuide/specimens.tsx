import type { CSSProperties, ReactNode } from 'react';
import { FiCreditCard, FiDatabase, FiGitMerge } from 'react-icons/fi';

function Diagram({ label, children }: { label: string; children: ReactNode }) {
  return <svg className="fg-diagram" viewBox="0 0 320 164" role="img" aria-label={label}>{children}</svg>;
}

function Wire({ d, delay = 0 }: { d: string; delay?: number }) {
  return <g><path className="fg-wire" d={d} /><path className="fg-flow" d={d} style={{ animationDelay: `${delay}s` }} /></g>;
}

function Node({ x, y, w, text, alert = false }: { x: number; y: number; w: number; text: string; alert?: boolean }) {
  return <g className={`fg-node${alert ? ' fg-warning' : ''}`} transform={`translate(${x} ${y})`}><rect width={w} height="32" /><text x={w / 2} y="20" textAnchor="middle">{text}</text></g>;
}

function Queries() {
  return <Diagram label="One orders request fans out into a separate user lookup for every order">
    <Node x={4} y={65} w={90} text="orders" />
    {[12, 66, 120].map((y, i) => <g key={y}><Wire d={`M94 81 H129 V${y + 16} H173`} delay={-i * .7} /><Node x={173} y={y} w={140} text={`lookup ${i + 1}`} /></g>)}
    <text className="fg-caption" x="4" y="155">1 request → 1 + N queries</text>
  </Diagram>;
}

function Race() {
  return <Diagram label="Two workers read 100 and both write 150, losing one increment; the expected value is 200">
    <text className="fg-caption" x="8" y="18">WORKER A</text><text className="fg-caption" x="212" y="18">WORKER B</text>
    <Node x={8} y={30} w={100} text="read 100" /><Node x={212} y={30} w={100} text="read 100" />
    <Wire d="M58 62 V84 Q58 96 72 96 H113" /><Wire d="M262 62 V84 Q262 96 248 96 H207" delay={-.8} />
    <g className="fg-race-result"><Node x={113} y={80} w={94} text="150" alert /></g>
    <text className="fg-caption" x="160" y="145" textAnchor="middle">+50 twice · expected 200</text>
  </Diagram>;
}

function Charges() {
  return <Diagram label="Retrying a payment without an idempotency key creates two receipts for the same order">
    <Node x={8} y={62} w={96} text="retry" />
    <Wire d="M104 78 H142 V43 H195" /><Wire d="M142 78 V117 H195" delay={-1.6} />
    {[26, 100].map((y, i) => <g key={y} transform={`translate(195 ${y})`}><g className={`fg-receipt${i ? ' fg-receipt--duplicate' : ''}`} style={{ '--i': i } as CSSProperties}><path d="M0 0 H112 V42 L104 37 L96 42 L88 37 L80 42 L72 37 L64 42 L56 37 L48 42 L40 37 L32 42 L24 37 L16 42 L8 37 L0 42 Z" /><text x="12" y="26">$49.00</text></g></g>)}
    <text className="fg-caption" x="8" y="152">1 order → 2 charges</text>
  </Diagram>;
}

export const SPECIMENS = [
  { id: 'queries', category: 'N+1 queries', name: 'Queries multiply.', Icon: FiDatabase, Demo: Queries },
  { id: 'race', category: 'Race conditions', name: 'Updates collide.', Icon: FiGitMerge, Demo: Race },
  { id: 'charges', category: 'Payment retries', name: 'Retries duplicate.', Icon: FiCreditCard, Demo: Charges },
];
