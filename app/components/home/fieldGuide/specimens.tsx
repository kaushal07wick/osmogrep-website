import type { ReactNode } from 'react';
import type { IconType } from 'react-icons';
import { FiDatabase, FiGitMerge, FiShield } from 'react-icons/fi';

function Diagram({ label, children }: { label: string; children: ReactNode }) {
  return <svg className="fg-diagram" viewBox="0 0 320 164" role="img" aria-label={label}>{children}</svg>;
}

function Wire({ d, delay = 0, quiet = false }: { d: string; delay?: number; quiet?: boolean }) {
  return <g><path className="fg-wire" d={d} />{!quiet && <path className="fg-flow" d={d} style={{ animationDelay: `${delay}s` }} />}</g>;
}

function Node({ x, y, w = 90, text, tone = '' }: { x: number; y: number; w?: number; text: string; tone?: string }) {
  return <g className={`fg-node ${tone}`} transform={`translate(${x} ${y})`}><rect width={w} height="32" rx="0" /><text x={w / 2} y="20" textAnchor="middle">{text}</text></g>;
}

function Queries() {
  return <Diagram label="One orders request fans out into a separate user lookup for every order">
    <Node x={4} y={65} w={90} text="orders" />
    {[12, 66, 120].map((y,i)=><g key={y}><Wire d={`M94 81 H129 V${y+16} H173`} delay={-i*.7} /><Node x={173} y={y} w={140} text={`user lookup ${i+1}`} /></g>)}
    <text className="fg-caption fg-alert" x="4" y="155">1 request → 1 + N queries</text>
  </Diagram>;
}

function Sql() {
  return <Diagram label="Untrusted input crosses into SQL syntax and changes the query">
    <text className="fg-caption" x="10" y="17">USER INPUT</text>
    <g className="fg-payload"><rect x="10" y="30" width="178" height="38" rx="0" /><text x="24" y="54">&apos; OR 1=1 --</text></g>
    <path className="fg-sql-boundary" d="M222 18 V148" strokeDasharray="4 5" />
    <Wire d="M188 49 H260 V96 H296" />
    <g className="fg-sql-rows">{[90, 106, 122].map((y, i) => <rect key={y} x="14" y={y} width={142 + i * 21} height="8" rx="0" />)}</g>
    <text className="fg-caption fg-alert" x="14" y="154">input → executable syntax</text>
    <g className="fg-node fg-warning" transform="translate(246 80)"><rect width="64" height="32" rx="0" /><text x="32" y="20" textAnchor="middle">all rows</text></g>
  </Diagram>;
}

function Race() {
  return <Diagram label="Two workers read 100 and both write 150, losing one increment">
    <text className="fg-caption" x="8" y="18">WORKER A</text><text className="fg-caption" x="212" y="18">WORKER B</text>
    <Node x={8} y={30} w={100} text="read 100" /><Node x={212} y={30} w={100} text="read 100" />
    <Wire d="M58 62 V84 Q58 96 72 96 H113" /><Wire d="M262 62 V84 Q262 96 248 96 H207" delay={-.8} />
    <g className="fg-race-result"><Node x={113} y={80} w={94} text="150" tone="fg-warning" /></g>
    <text className="fg-caption" x="160" y="145" textAnchor="middle">+50 twice · expected 200</text>
  </Diagram>;
}

type Specimen = { id: string; name: string; category: string; Icon: IconType; Demo: () => ReactNode };

export const SPECIMENS: Specimen[] = [
  { id: 'queries', name: 'One request. Many queries.', category: 'N+1 queries', Icon: FiDatabase, Demo: Queries },
  { id: 'sql', name: 'Input becomes SQL.', category: 'SQL injection', Icon: FiShield, Demo: Sql },
  { id: 'race', name: 'Two writes. One lost update.', category: 'Race condition', Icon: FiGitMerge, Demo: Race },
];
