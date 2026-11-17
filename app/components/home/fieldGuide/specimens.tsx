import type { CSSProperties, ReactNode } from 'react';
import type { IconType } from 'react-icons';
import { FiActivity, FiClock, FiCreditCard, FiDatabase, FiFolder, FiGitMerge, FiKey, FiLayers, FiShield } from 'react-icons/fi';

function Diagram({ label, wide = false, compact, children }: { label: string; wide?: boolean; compact?: ReactNode; children: ReactNode }) {
  return <>
    <svg className={`fg-diagram${compact ? ' fg-diagram--wide' : ''}`} viewBox={wide ? '0 0 600 164' : '0 0 320 164'} role="img" aria-label={label}>{children}</svg>
    {compact && <svg className="fg-diagram fg-diagram--compact" viewBox="0 0 320 164" role="img" aria-label={label}>{compact}</svg>}
  </>;
}

function Wire({ d, delay = 0, quiet = false }: { d: string; delay?: number; quiet?: boolean }) {
  return <g><path className="fg-wire" d={d} />{!quiet && <path className="fg-flow" d={d} style={{ animationDelay: `${delay}s` }} />}</g>;
}

function Node({ x, y, w = 90, text, tone = '' }: { x: number; y: number; w?: number; text: string; tone?: string }) {
  return <g className={`fg-node ${tone}`} transform={`translate(${x} ${y})`}><rect width={w} height="32" rx="5" /><text x={w / 2} y="20" textAnchor="middle">{text}</text></g>;
}

function Queries() {
  return <Diagram wide label="One orders request fans out into a separate user lookup for every order" compact={<>
    <Node x={4} y={65} w={90} text="orders" />
    {[12, 66, 120].map((y,i)=><g key={y}><Wire d={`M94 81 H129 V${y+16} H173`} delay={-i*.7} /><Node x={173} y={y} w={140} text={`user lookup ${i+1}`} /></g>)}
    <text className="fg-caption fg-alert" x="4" y="155">1 request → 1 + N queries</text>
  </>}>
    <Node x={8} y={65} w={104} text="GET /orders" />
    {[8, 38, 68, 98, 128].map((y, i) => <g key={y}>
      <Wire d={`M112 81 H156 Q174 81 174 ${y + 14} H268`} delay={-i * .45} />
      <g className="fg-query" style={{ '--i': i } as CSSProperties}><rect x="268" y={y} width="126" height="26" rx="4" /><text x="331" y={y + 17} textAnchor="middle">user lookup {i + 1}</text></g>
      <Wire d={`M394 ${y + 14} H430 Q454 ${y + 14} 454 81 H492`} delay={-i * .45 - 1} />
    </g>)}
    <g className="fg-database" transform="translate(492 48)"><path d="M0 12 V58 C0 76 96 76 96 58 V12" /><ellipse cx="48" cy="12" rx="48" ry="12" /><path d="M0 34 C0 52 96 52 96 34" /><text x="48" y="55" textAnchor="middle">database</text></g>
    <text className="fg-caption" x="8" y="145">1 request</text><text className="fg-caption fg-alert" x="492" y="145">1 + N queries</text>
  </Diagram>;
}

function Sql() {
  return <Diagram label="Untrusted input crosses into SQL syntax and changes the query">
    <text className="fg-caption" x="10" y="17">USER INPUT</text>
    <g className="fg-payload"><rect x="10" y="30" width="178" height="38" rx="5" /><text x="24" y="54">&apos; OR 1=1 --</text></g>
    <path className="fg-sql-boundary" d="M222 18 V148" strokeDasharray="4 5" />
    <Wire d="M188 49 H260 V96 H296" />
    <g className="fg-sql-rows">{[90, 106, 122].map((y, i) => <rect key={y} x="14" y={y} width={142 + i * 21} height="8" rx="2" />)}</g>
    <text className="fg-caption fg-alert" x="14" y="154">input → executable syntax</text>
    <g className="fg-node fg-warning" transform="translate(246 80)"><rect width="64" height="32" rx="5" /><text x="32" y="20" textAnchor="middle">all rows</text></g>
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

function Await() {
  return <Diagram label="The HTTP response returns before saving fails, leaving the error unobserved">
    <text className="fg-caption" x="10" y="16">TIME →</text>
    <Wire d="M20 54 H300" quiet /><Wire d="M20 108 H300" quiet />
    <circle className="fg-event fg-event--early" cx="104" cy="54" r="6" /><circle className="fg-event fg-event--late" cx="258" cy="108" r="6" />
    <path className="fg-await-gap" d="M104 68 V91 H258" strokeDasharray="3 4" />
    <text className="fg-caption fg-success" x="70" y="36">200 OK</text><text className="fg-caption fg-alert" x="199" y="143">save failed</text>
    <text className="fg-track-label" x="12" y="79">response</text><text className="fg-track-label" x="12" y="136">database</text>
  </Diagram>;
}

function Charges() {
  return <Diagram label="A payment retry creates two receipts when the operation has no idempotency key">
    <Node x={8} y={62} w={96} text="retry" />
    <Wire d="M104 78 H142 V43 H195" /><Wire d="M142 78 V117 H195" delay={-1.6} />
    {[26, 100].map((y, i) => <g className="fg-receipt" key={y} style={{ '--i': i } as CSSProperties} transform={`translate(195 ${y})`}><path d="M0 0 H112 V42 L104 37 L96 42 L88 37 L80 42 L72 37 L64 42 L56 37 L48 42 L40 37 L32 42 L24 37 L16 42 L8 37 L0 42 Z" /><text x="12" y="26">$49.00</text><text className="fg-caption" x="91" y="26">✓</text></g>)}
    <text className="fg-caption fg-alert" x="8" y="152">same order · charged twice</text>
  </Diagram>;
}

function Memory() {
  return <Diagram label="An unbounded query fills the available memory as the dataset grows">
    <text className="fg-caption" x="8" y="16">DATASET GROWS →</text>
    <path className="fg-capacity" d="M8 48 H312" strokeDasharray="4 4" /><text className="fg-caption" x="8" y="40">heap limit</text>
    {[28, 45, 60, 80, 98, 119, 144].map((height, i) => <rect key={height} className="fg-memory-bar" x={14 + i * 43} y={151 - height} width="29" height={height} rx="2" style={{ '--i': i } as CSSProperties} />)}
  </Diagram>;
}

function Secrets() {
  return <Diagram wide label="Logging an entire request carries the Authorization header into a log store" compact={<>
    <g className="fg-log-window"><rect x="4" y="4" width="312" height="149" rx="7" /><text className="fg-caption" x="20" y="26">SHARED LOG STORE</text><text x="20" y="57">method: POST</text><text x="20" y="80">status: 200</text><rect className="fg-secret-highlight" x="13" y="94" width="294" height="31" rx="3" /><text className="fg-secret-text" x="20" y="114">authorization: Bearer …</text></g>
  </>}>
    <Node x={8} y={61} w={105} text="request" />
    <Wire d="M113 77 H162" /><Wire d="M390 77 H444" delay={-1} />
    <g className="fg-log-window" transform="translate(162 12)"><rect width="228" height="141" rx="7" /><path d="M0 29 H228" /><circle cx="13" cy="15" r="3" /><circle cx="25" cy="15" r="3" /><circle cx="37" cy="15" r="3" /><text className="fg-caption" x="52" y="19">request.log</text><text x="16" y="54">method: POST</text><text x="16" y="77">status: 200</text><rect className="fg-secret-highlight" x="9" y="88" width="210" height="25" rx="3" /><text className="fg-secret-text" x="16" y="105">authorization: Bearer …</text><text className="fg-caption" x="16" y="132">credentials crossed a boundary</text></g>
    <g className="fg-log-store"><Node x={444} y={61} w={144} text="shared log store" tone="fg-warning" /></g>
  </Diagram>;
}

function Traversal() {
  return <Diagram wide label="A path using parent directories escapes the uploads folder and reaches a private file" compact={<>
    <g className="fg-root-boundary"><rect x="4" y="4" width="212" height="150" rx="8" /><text className="fg-caption" x="16" y="25">/uploads</text></g>
    <Node x={16} y={42} w={172} text="../../private/key" />
    <Wire d="M102 74 V107 H254" /><g className="fg-escaped-file"><path d="M260 82 H293 L308 97 V138 H260 Z M293 82 V97 H308" /></g>
    <text className="fg-caption fg-alert" x="16" y="144">escapes the allowed root</text>
  </>}>
    <g className="fg-root-boundary"><rect x="8" y="8" width="360" height="148" rx="8" /><text className="fg-caption" x="24" y="32">ALLOWED ROOT /uploads</text></g>
    <Wire d="M40 64 H82 V113 H131" quiet /><Node x={131} y={97} w={140} text="photo.png" />
    <g className="fg-path-payload"><rect x="25" y="46" width="194" height="35" rx="4" /><text x="39" y="68">../../private/key</text></g>
    <Wire d="M219 63 H310 Q330 63 330 81 H447" />
    <g className="fg-escaped-file"><path d="M470 30 H524 L546 52 V127 H470 Z M524 30 V52 H546" /><path d="M484 76 H531 M484 89 H523 M484 102 H517" /><text className="fg-caption fg-alert" x="508" y="151" textAnchor="middle">outside root</text></g>
  </Diagram>;
}

function Timeout() {
  return <Diagram label="A slow dependency keeps all eight illustrated workers occupied without a deadline">
    <g className="fg-clock"><circle cx="78" cy="76" r="47" /><circle className="fg-clock-track" cx="78" cy="76" r="39" /><path className="fg-clock-hand" d="M78 76 V46 M78 76 H99" /><circle cx="78" cy="76" r="3" /></g>
    <Wire d="M127 76 H186" />
    <g className="fg-worker-pool">{Array.from({ length: 8 }, (_, i) => <rect key={i} x={194 + i % 4 * 29} y={48 + Math.floor(i / 4) * 32} width="20" height="22" rx="4" style={{ '--i': i } as CSSProperties} />)}</g>
    <text className="fg-caption" x="78" y="151" textAnchor="middle">still waiting…</text><text className="fg-caption fg-alert" x="248" y="151" textAnchor="middle">workers occupied</text>
  </Diagram>;
}

type Specimen = { id: string; name: string; category: string; context: string; fix: string; Icon: IconType; Demo: () => ReactNode };

export const SPECIMENS: Specimen[] = [
  { id: 'queries', name: 'One request. A crowd of queries.', category: 'N+1 queries', context: 'A lookup inside a loop gets more expensive with every order.', fix: 'Batch related lookups before mapping the results.', Icon: FiDatabase, Demo: Queries },
  { id: 'sql', name: 'Data becomes an instruction.', category: 'SQL injection', context: 'String interpolation lets user input rewrite the query.', fix: 'Bind values as query parameters.', Icon: FiShield, Demo: Sql },
  { id: 'race', name: 'Two writes. One lost update.', category: 'Race condition', context: 'Concurrent workers overwrite the same stale value.', fix: 'Apply the increment atomically.', Icon: FiGitMerge, Demo: Race },
  { id: 'await', name: 'Success leaves too early.', category: 'Missing await', context: 'The response is sent while a critical write is still pending.', fix: 'Await the write and handle its failure.', Icon: FiActivity, Demo: Await },
  { id: 'charges', name: 'A retry becomes a second charge.', category: 'Double charge', context: 'The payment succeeds. Its response gets lost. The caller retries.', fix: 'Reuse a stable, enforced idempotency key.', Icon: FiCreditCard, Demo: Charges },
  { id: 'memory', name: 'The dataset outgrows the heap.', category: 'Unbounded query', context: 'Loading every row makes memory depend on your data size.', fix: 'Read bounded pages or stream the results.', Icon: FiLayers, Demo: Memory },
  { id: 'secrets', name: 'A debug line tells too much.', category: 'Secret exposure', context: 'Logging the whole request sends credentials wherever your logs go.', fix: 'Allowlist useful fields. Redact credentials before logging.', Icon: FiKey, Demo: Secrets },
  { id: 'traversal', name: 'A filename takes a detour.', category: 'Path traversal', context: 'Parent-directory segments can escape the intended file boundary.', fix: 'Resolve and confine file access, including symlink handling.', Icon: FiFolder, Demo: Traversal },
  { id: 'timeout', name: 'Waiting becomes the workload.', category: 'Missing timeout', context: 'A stalled dependency holds onto workers with no deadline.', fix: 'Bound the request and release resources on cancellation.', Icon: FiClock, Demo: Timeout },
];
