'use client';

import { useId, useState } from 'react';
import { FiArrowUpRight, FiCheck, FiCpu, FiGitPullRequest, FiLayers, FiMinus, FiX } from 'react-icons/fi';
import { SiGithub, SiPython } from 'react-icons/si';
import evidence from '../../../public/data/tinygrad-jit-verification.json';
import './tinygrad-figure.css';

export type TinygradFigureKind = 'summary' | 'binding' | 'results';

function Summary() {
  return <figure className="tinygrad-figure tg-summary frame" aria-label="Tinygrad verification at a glance">
    <div className="tg-repository"><span className="tg-logo"><img src="/blog/tinygrad-logo.svg" alt="tinygrad official logo" width="90" height="42" /></span><div><a href="https://github.com/tinygrad/tinygrad" target="_blank" rel="noreferrer"><SiGithub aria-hidden="true"/> tinygrad/tinygrad <FiArrowUpRight aria-hidden="true"/></a><span>JIT input-return repair · recorded 19 Nov 2026</span></div><span className="tg-device"><FiCpu aria-hidden="true"/> CPU:X86</span></div>
    <div className="tg-metrics"><div><strong>{evidence.results.suite.total}</strong><span>tests reported</span></div><div><strong><span className="tg-fail">1</span><span className="tg-metric-arrow">→</span><span className="tg-pass">0</span></strong><span>failures after repair</span></div><div><strong>{evidence.results.suite.withFix.skipped}</strong><span>skipped on both heads</span></div><div><strong className="tg-pass">5 / 5</strong><span>additional cases pass</span></div></div>
    <figcaption><strong>Repair:</strong> Claude Code. <strong>Cloud verification:</strong> OsmoGrep + E2B. Additional cases were written after the fix.</figcaption>
  </figure>;
}

function Binding() {
  const [fixed, setFixed] = useState(false);
  const id = useId().replace(/:/g, '');
  return <figure className="tinygrad-figure tg-binding frame" aria-label="Interactive JIT buffer binding diagram">
    <div className="tg-heading"><div><span className="tg-eyebrow"><FiLayers aria-hidden="true"/> Reference binding</span><h3>Follow the current buffer.</h3></div><div className="tg-switch" role="group" aria-label="Buffer binding implementation"><button type="button" aria-pressed={!fixed} onClick={()=>setFixed(false)}>Before repair</button><button type="button" aria-pressed={fixed} onClick={()=>setFixed(true)}>After repair</button></div></div>
    <div className="tg-types"><div><strong>Tensor</strong><span>Python wrapper</span></div><span aria-hidden="true">→</span><div><strong>UOp graph</strong><span>value / view expression</span></div><span aria-hidden="true">→</span><div><strong>Buffer</strong><span>realized device storage</span></div></div>
    <div className="tg-diagram-scroll" tabIndex={0} role="region" aria-label="JIT return reference diagram">
      <svg viewBox="0 0 760 400" role="img" aria-labelledby={`${id}-title`} aria-describedby={`${id}-desc`} data-repaired={fixed}>
        <title id={`${id}-title`}>{fixed?'Return template binds to this call’s buffer':'Returned Tensor retains the capture-time buffer'}</title>
        <desc id={`${id}-desc`}>Execution uses the current input buffer. {fixed?'The JIT-owned return template also binds to that buffer through PARAM slot zero.':'The returned tensor still references the captured input buffer, yielding 11 rather than 21.'} Buffer labels A and B are illustrative; the values come from the recorded failure.</desc>
        <defs><marker id={`${id}-arrow`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 7 4 0 8" fill="none" stroke="#8a877e" strokeWidth="1.3"/></marker><pattern id={`${id}-dots`} width="9" height="9" patternUnits="userSpaceOnUse"><rect width="1" height="1" fill="#c9c5b8"/></pattern></defs>
        <rect width="760" height="400" fill={`url(#${id}-dots)`} opacity=".4"/>
        <g className="tg-node"><rect x="24" y="55" width="232" height="93"/><text x="44" y="83" className="tg-svg-small">CAPTURE-TIME BUFFER A</text><text x="44" y="122">[11, 11, 11, 11]</text></g>
        <g className="tg-node tg-node-current"><rect x="24" y="252" width="232" height="93"/><text x="44" y="280" className="tg-svg-small">CURRENT INPUT BUFFER B</text><text x="44" y="319">[21, 21, 21, 21]</text></g>
        <g className="tg-node"><rect x="493" y="260" width="242" height="76"/><text x="516" y="289">run_linear(...)</text><text x="516" y="315" className="tg-svg-small">executes against current input</text></g>
        <path d="M256 298H490" className="tg-edge tg-execution-edge" markerEnd={`url(#${id}-arrow)`}/>
        <path key={String(fixed)} d={fixed?'M256 280H327V103H490':'M256 103H490'} className={`tg-edge tg-return-edge ${fixed?'tg-edge-fixed':'tg-edge-broken'}`} markerEnd={`url(#${id}-arrow)`}/>
        {fixed&&<g className="tg-slot"><rect x="283" y="165" width="130" height="62"/><text x="348" y="191">PARAM[0]</text><text x="348" y="212">→ bufs[0]</text></g>}
        <g className={`tg-node tg-return-node ${fixed?'tg-fixed':'tg-broken'}`}><rect x="493" y="55" width="242" height="109"/><text x="516" y="83" className="tg-svg-small">{fixed?'JIT-OWNED RETURN':'CAPTURED RETURN'}</text><text x="516" y="118">{fixed?'[21, 21, 21, 21]':'[11, 11, 11, 11]'}</text><text x="516" y="145" className="tg-svg-small">{fixed?'bound to this invocation':'stale input reference'}</text></g>
        <text x="380" y="379" className="tg-svg-footer">{fixed?'Return and execution share the same bound buffer list.':'The computation’s input changes; the returned reference does not.'}</text>
      </svg>
      <div className="tg-mobile-binding" role="img" aria-label={fixed?'Return template binds to this call’s buffer':'Returned Tensor retains the capture-time buffer'}>
        <div className="tg-mobile-buffers"><div><span>CAPTURED · A</span><strong>[11, 11, 11, 11]</strong></div><div className="tg-mobile-current"><span>CURRENT · B</span><strong>[21, 21, 21, 21]</strong></div></div>
        <div className="tg-mobile-flow"><span>execution → B</span><span className={fixed?'tg-pass':'tg-fail'}>{fixed?'PARAM[0] → B':'return → A'}</span></div>
        <div className={`tg-mobile-return ${fixed?'tg-fixed':'tg-broken'}`}><span>{fixed?'JIT-OWNED RETURN':'CAPTURED RETURN'}</span><strong>{fixed?'[21, 21, 21, 21]':'[11, 11, 11, 11]'}</strong><small>{fixed?'Bound to this invocation’s buffer.':'Still references the earlier input.'}</small></div>
      </div>
    </div>
    <div className={`tg-binding-outcome ${fixed?'tg-pass':'tg-fail'}`} role="status">{fixed?<FiCheck aria-hidden="true"/>:<FiX aria-hidden="true"/>}<span>{fixed?'Return bound to the current buffer. Earlier caller-owned tensors are not rebound.':'4 of 4 values mismatch: the return is one input behind.'}</span></div>
    <figcaption>Illustrated references, not a memory trace. Switch implementations to follow the pointer. The repair changes wrapper identity; gradient state is not carried to the new wrapper.</figcaption>
  </figure>;
}

function Results() {
  const [fixed, setFixed] = useState(true);
  const result = fixed?evidence.results.suite.withFix:evidence.results.suite.withoutFix;
  const run=evidence.runs.find(r=>r.label===(fixed?'Suite with repair':'Suite without repair'))!;
  return <figure className="tinygrad-figure tg-results frame" aria-label="Recorded tinygrad test comparison">
    <div className="tg-heading"><div><span className="tg-eyebrow"><SiPython aria-hidden="true"/> Recorded cloud execution</span><h3>One test changes the verdict.</h3></div><div className="tg-switch" role="group" aria-label="Test result revision"><button type="button" aria-pressed={!fixed} onClick={()=>setFixed(false)}>Without repair</button><button type="button" aria-pressed={fixed} onClick={()=>setFixed(true)}>With repair</button></div></div>
    <div className="tg-result-numbers" aria-live="polite"><span className="tg-pass"><FiCheck aria-hidden="true"/><strong>{result.passed}</strong> passed</span><span className={result.failed?'tg-fail':''}><FiX aria-hidden="true"/><strong>{result.failed}</strong> failed</span><span><FiMinus aria-hidden="true"/><strong>{result.skipped}</strong> skipped</span></div>
    <div className="tg-test-bar" aria-label={`${result.passed} passed, ${result.failed} failed, ${result.skipped} skipped`}><span className="tg-bar-pass" style={{flex:result.passed}}/>{result.failed>0&&<span className="tg-bar-fail" style={{flex:result.failed}}/>}<span className="tg-bar-skip" style={{flex:result.skipped}}/></div>
    <div className="tg-log-label"><span>unittest · 3 files · CPU:X86</span><span>exit {run.commands[0].exitCode}</span></div>
    <pre className="tg-recorded-log" tabIndex={0} aria-label={`${fixed?'With':'Without'} repair recorded test output`}><code>{run.commands[0].unittestSummary}</code></pre>
    <a className="tg-evidence-link" href={run.githubReport} target="_blank" rel="noreferrer"><FiGitPullRequest aria-hidden="true"/> Read the actual GitHub test report <FiArrowUpRight aria-hidden="true"/></a>
    <figcaption>The same three test-file blobs on both heads. Ten tests are skipped in both runs. These execution jobs made zero model calls; compute still ran.</figcaption>
  </figure>;
}

export default function TinygradFigure({kind}:{kind:TinygradFigureKind}) {
  return kind==='summary'?<Summary/>:kind==='binding'?<Binding/>:<Results/>;
}
