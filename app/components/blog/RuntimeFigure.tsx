'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { FiArrowDownRight, FiCheckCircle, FiCode, FiGitPullRequest, FiLayers, FiTerminal, FiXCircle } from 'react-icons/fi';
import { SiNodedotjs, SiOpenai } from 'react-icons/si';
import evidence from '../../../public/blog/runtime-regression-evidence.json';
import usage from '../../../public/data/catcher-acceptance.json';
import './runtime-figure.css';

const number = (value: number) => value.toLocaleString('en-US');
const phaseNames: Record<string, string> = { base: 'Base', candidate: 'PR', repair: 'Repair' };

function CausalGraph() {
  const [repaired, setRepaired] = useState(false);
  const id = useId().replace(/:/g, '');
  return <>
    <div className="runtime-figure-heading"><div><span className="runtime-eyebrow"><FiGitPullRequest /> Control flow</span><h3>One missed release. A later shortage.</h3></div><div className="runtime-switch" aria-label="Implementation shown"><button type="button" aria-pressed={!repaired} onClick={() => setRepaired(false)}>PR</button><button type="button" aria-pressed={repaired} onClick={() => setRepaired(true)}>Repair</button></div></div>
    <div className="runtime-graph-scroll" tabIndex={0} role="region" aria-label="Resource lease control flow diagram">
      <svg className="runtime-causal" viewBox="0 0 660 400" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
        <title id={`${id}-title`}>{repaired ? 'Repair releases the lease on both paths' : 'Rejected task bypasses cleanup'}</title>
        <desc id={`${id}-desc`}>Acquire a lease, then await the task. Success releases the lease. {repaired ? 'Finally also releases it after rejection; the error propagates.' : 'Rejection skips release; the generated test observes one active lease instead of zero.'}</desc>
        <defs><pattern id={`${id}-dots`} width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".7" fill="#f35a00" fillOpacity=".18" /></pattern><marker id={`${id}-arrow`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 8 4 0 8" fill="none" stroke="currentColor" /></marker></defs>
        <g className="runtime-graph-lines" fill="none" stroke="currentColor" strokeWidth="1.6" markerEnd={`url(#${id}-arrow)`}>
          <path d="M330 78V116" /><path d="M330 174V195Q330 210 315 210H160Q145 210 145 225V245" /><path className={repaired ? 'runtime-edge-pass' : 'runtime-edge-fail'} d="M330 174V195Q330 210 345 210H500Q515 210 515 225V245" /><path className={repaired ? 'runtime-edge-pass' : 'runtime-edge-fail'} d="M515 301V337" />
        </g>
        <g className="runtime-graph-node"><rect x="230" y="20" width="200" height="58" rx="5" /><text x="330" y="45">pool.acquire()</text><text className="runtime-node-sub" x="330" y="64">lease becomes active</text></g>
        <g className="runtime-graph-node"><rect x="230" y="116" width="200" height="58" rx="5" /><text x="330" y="141">await task()</text><text className="runtime-node-sub" x="330" y="160">two possible outcomes</text></g>
        <text className="runtime-edge-label" x="145" y="232">resolves</text><text className="runtime-edge-label" x="515" y="232">rejects</text>
        <g className="runtime-graph-node runtime-graph-pass"><rect x="40" y="245" width="210" height="56" rx="5" /><text x="145" y="270">release()</text><text className="runtime-node-sub" x="145" y="289">successful result preserved</text></g>
        <g className={`runtime-graph-node ${repaired ? 'runtime-graph-pass' : 'runtime-graph-fail'}`}><rect x="410" y="245" width="210" height="56" rx="5" fill={`url(#${id}-dots)`} /><text x="515" y="270">{repaired ? 'finally → release()' : 'release() bypassed'}</text><text className="runtime-node-sub" x="515" y="289">error still propagates</text></g>
        <g className={`runtime-graph-node ${repaired ? 'runtime-graph-pass' : 'runtime-graph-fail'}`}><rect x="410" y="337" width="210" height="45" rx="5" /><text x="515" y="365">active leases = {repaired ? '0' : '1'}</text></g>
        <text className="runtime-edge-label" x="145" y="365">observed by the frozen test</text>
      </svg>
    </div>
    <div className="runtime-projection"><FiArrowDownRight aria-hidden="true" /><p><strong>Downstream prediction</strong> Repeated leaked leases could exhaust a finite pool and affect later callers. This run observed the leak; it did not measure production exhaustion.</p></div>
    <figcaption>Source-derived control flow. Switch to the repair to see the cleanup path restored.</figcaption>
  </>;
}

function Experiment() {
  const [phase, setPhase] = useState('candidate');
  const observation = evidence.observations.find(row => row.phase === phase)!;
  return <>
    <div className="runtime-figure-heading"><div><span className="runtime-eyebrow"><FiTerminal /> Recorded execution</span><h3>Read the result, not just the verdict.</h3></div><SiNodedotjs className="runtime-platform-icon" aria-label="Node.js" /></div>
    <div className="runtime-phase-picker" aria-label="Recorded revision"><>{evidence.observations.map(row => <button type="button" key={row.phase} aria-pressed={phase === row.phase} onClick={() => setPhase(row.phase)} data-result={row.exitCode === 0 ? 'pass' : 'fail'}>{row.exitCode === 0 ? <FiCheckCircle /> : <FiXCircle />}<strong>{phaseNames[row.phase]}</strong><span>exit {row.exitCode} · {row.durationMs} ms</span></button>)}</></div>
    <div className="runtime-log-head"><span>reproducer.mjs</span><span role="status">{phaseNames[phase]} · {observation.exitCode === 0 ? 'passed' : 'assertion failed'}</span></div>
    <pre className="runtime-log" tabIndex={0} aria-label={`${phaseNames[phase]} recorded TAP output`}><code>{observation.output.trimEnd().split('\n').map((line, index) => <span key={`${phase}-${index}`} className={line.startsWith('not ok') || line.includes('lease was not released') || line.trim() === '1 !== 0' ? 'runtime-log-fail' : line.startsWith('ok ') ? 'runtime-log-pass' : undefined}>{line}{'\n'}</span>)}</code></pre>
    <div className="runtime-integrity"><FiCheckCircle aria-hidden="true" /><span>Original suite passed · original tests unchanged · identical generated source</span></div>
    <details className="runtime-source"><summary><FiCode aria-hidden="true" /> Inspect the generated test</summary><pre tabIndex={0}><code>{evidence.experiment.source}</code></pre></details>
    <figcaption>Actual captured output. Durations include observation and integrity reads. The base and PR used two target VMs; repair reused the PR VM.</figcaption>
  </>;
}

function Compute() {
  const [selected, setSelected] = useState('repair');
  const stage = usage.stages.find(row => row.name === selected)!;
  const calls = evidence.modelCalls.filter(row => row.stage === selected);
  const max = Math.max(...usage.stages.map(row => row.tokens));
  return <>
    <div className="runtime-figure-heading"><div><span className="runtime-eyebrow"><SiOpenai /> Measured model usage</span><h3>{number(usage.tokens.total)} tokens. Where did they go?</h3></div></div>
    <div className="runtime-usage-stats"><div><strong>{usage.modelCalls}</strong><span>model requests</span></div><div><strong>{(usage.durationMs / 1000).toFixed(1)}s</strong><span>worker interval</span></div><div><strong>{usage.sandboxes.length} / {usage.sandboxes.length}</strong><span>target VMs cleaned up</span></div></div>
    <div className="runtime-stage-chart" aria-label="Reported tokens by analysis stage">{usage.stages.map(row => <button type="button" key={row.name} aria-pressed={selected === row.name} onClick={() => setSelected(row.name)} className="runtime-stage-row"><span className="runtime-stage-name">{row.label}</span><span className="runtime-stage-track"><span className="runtime-stage-fill" style={{ width: `${row.tokens / max * 100}%` }} /></span><span className="runtime-stage-value">{number(row.tokens)}<small>{(row.tokens / usage.tokens.total * 100).toFixed(1)}%</small></span></button>)}</div>
    <div className="runtime-stage-detail" role="status"><FiLayers aria-hidden="true" /><p><strong>{stage.label}</strong> · {calls.length} {calls.length === 1 ? 'request' : 'requests'} · {number(calls.reduce((sum, row) => sum + row.inputTokens, 0))} input + {number(calls.reduce((sum, row) => sum + row.outputTokens, 0))} output tokens<br /><span>{calls[0].model} · {number(calls.reduce((sum, row) => sum + row.cachedInputTokens, 0))} cached input tokens</span></p></div>
    <figcaption>Input + output, summed from ten recorded requests. Cached input is a subset of input. Select a stage for its breakdown. One controlled run; no price or accuracy estimate.</figcaption>
  </>;
}

export default function RuntimeFigure({ kind }: { kind: 'causal' | 'experiment' | 'compute' }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        element.dataset.visible = 'true';
        observer.disconnect();
      }
    }, { threshold: .15 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <figure ref={ref} className={`runtime-figure runtime-figure-${kind}`} aria-label={kind === 'causal' ? 'Interactive resource lifecycle diagram' : kind === 'experiment' ? 'Differential execution evidence' : 'Token usage chart'}>{kind === 'causal' ? <CausalGraph /> : kind === 'experiment' ? <Experiment /> : <Compute />}</figure>;
}
