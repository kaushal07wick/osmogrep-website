import Link from "next/link";
import { LuArrowUpRight, LuCheck, LuFlaskConical, LuShieldCheck, LuX } from "react-icons/lu";
import { SiOpenai } from "react-icons/si";
import ArchitectureDiagram from "./ArchitectureDiagram";
import evidence from "../../public/data/catcher-acceptance.json";
import styles from "./EngineeringGuides.module.css";

export default function ArchitectureGuide() {
  return <>
    <section id="keep-the-control-plane-small" className={styles.section}>
      <h2>Follow a review through the system.</h2>
      <p>Select a component to inspect its responsibilities and boundaries. The cloud Catcher is TypeScript orchestration inside the web application; the Rust terminal remains an independent coding agent.</p>
      <ArchitectureDiagram/>
      <nav className={styles.jumpLinks} aria-label="Architecture topics"><a href="#context-before-reasoning">Context</a><a href="#models-have-scoped-jobs">Model roles</a><a href="#differential-verification">Verification</a><a href="#runtime-has-its-own-budget">Budgets</a><a href="#recorded-acceptance">Measured run</a></nav>
    </section>
    <section id="context-before-reasoning" className={styles.section}>
      <div className={styles.sectionHeading}><span className={styles.number}>01</span><div><h2>Context before a verdict.</h2><p>Capture the change. Follow its consumers. Establish the expected behavior.</p></div></div>
      <div className={styles.contextLayers}><div><span>CHANGE</span><strong>Base + head</strong><small>PR goal, changed hunks, source anchors</small></div><div><span>REPOSITORY</span><strong>Behavior + consumers</strong><small>Tests, manifests, conventions, relevant callers</small></div><div><span>HISTORY</span><strong>Revision-scoped facts</strong><small>Reusable syntax relationships and investigations</small></div><div><span>OPTIONAL</span><strong>Team decisions</strong><small>Selected, repository-mapped channel excerpts</small></div></div>
      <p>Screening can stop an empty diff or complete prose-only change on a trusted non-executable documentation allowlist before model work. A README extension alone is insufficient; executable examples, configuration and incomplete snapshots need further inspection.</p>
      <details className="docs-details"><summary>Context storage, freshness and access</summary><div className="docs-table-wrap"><table><thead><tr><th>Layer</th><th>Captured evidence</th><th>Boundary</th></tr></thead><tbody>
        <tr><td>Change snapshot</td><td>Immutable GitHub source, base/head SHAs and hunk anchors.</td><td>Stale revisions and truncated input remain visible.</td></tr>
        <tr><td>Repository context</td><td>Purpose, setup, test/build configuration and relevant consumers.</td><td>File/read/byte budgets; secret and path filters.</td></tr>
        <tr><td>Structural history</td><td>Content-addressed syntax facts and earlier investigations.</td><td>Workspace + repository + revision scope; unchanged facts can be reused.</td></tr>
        <tr><td>Channel memory</td><td>Relevant retained excerpts from explicitly selected channels.</td><td>Selected-channel mapping, fresh access checks and untrusted-input treatment.</td></tr>
      </tbody></table></div><p>The stored syntax graph currently represents <code>IMPORTS</code> and <code>DEFINES</code> for supported analysis. It is not a complete semantic call graph, deployed dependency map or production telemetry collector. Revision mappings isolate branches.</p></details>
    </section>
    <section id="models-have-scoped-jobs" className={styles.section}>
      <div className={styles.sectionHeading}><span className={styles.number}>02</span><div><h2>Different roles. One budget.</h2><p>Model outputs guide the investigation. Execution establishes the result.</p></div></div>
      <div className={styles.modelRoles}><div><SiOpenai aria-hidden="true"/><span>PRIMARY · GPT-5.2</span><h3>Investigate, plan, repair.</h3><p>Trace a change → trigger → observable failure, citing source and assumptions. Plan a meaningful experiment and propose a correction within the allowed tools.</p></div><div><SiOpenai aria-hidden="true"/><span>ADVISOR · GPT-5.4-MINI</span><h3>Challenge the reasoning.</h3><p>Review causal claims and counterevidence. Separately assess the test oracle and exact execution contract before an expensive experiment.</p></div></div>
      <p>These are configurable defaults. Source assessment is read-only; repair tools run in target sandboxes. The coordinator owns stage transitions and the shared request/token ledger. Two agreeing models do not constitute runtime proof.</p>
    </section>
    <section id="differential-verification" className={styles.section}>
      <div className={styles.sectionHeading}><span className={styles.number}>03</span><div><h2>One experiment. Three revisions.</h2><p>Freeze the test, command, baseline fixtures and environment identity before comparing behavior.</p></div></div>
      <div className={styles.three} aria-label="Required differential evidence"><div data-result="pass"><strong>01 · Base</strong><span><LuCheck aria-hidden="true"/>PASS</span><small>The independently justified expectation holds on the captured known-good revision.</small></div><div data-result="fail"><strong>02 · Candidate</strong><span><LuX aria-hidden="true"/>FAIL</span><small>The identical experiment exposes the changed behavior.</small></div><div data-result="pass"><strong>03 · Repair</strong><span><LuCheck aria-hidden="true"/>PASS</span><small>The same experiment passes after the proposed correction.</small></div></div>
      <p>Original-suite results, source fingerprints and test hashes must remain valid. Missing setup, an invalid oracle or stale evidence yields a limited result. Green utility tests alone do not demonstrate regression detection.</p>
      <details className="docs-details"><summary>Related PRs and evidence states</summary><p>Related-PR analysis accepts an explicit pair, checks a shared captured dependency neighborhood and compatible base revisions, and handles conflicts before comparing individual and combined revisions. It does not continuously enumerate every open PR combination.</p><div className={styles.statusList} aria-label="Investigation outcomes">{["Predicted","Experiment ready","Not reproduced","Inconclusive","Execution failure","Repair verified"].map(status=><span key={status}>{status}</span>)}</div><p>A verified repair describes only the captured behavior and environment. A report retains unsuccessful and inconclusive observations instead of promoting every generated failure to a bug.</p></details>
    </section>
    <section id="runtime-has-its-own-budget" className={styles.section}>
      <div className={styles.sectionHeading}><span className={styles.number}>04</span><div><h2>Bound the expensive parts.</h2><p>Configured defaults and ceilings, rather than performance or cost promises.</p></div></div>
      <div className={styles.limitStrip}><div><strong>10</strong><span>shared model requests</span></div><div><strong>15 min</strong><span>standalone runtime bound</span></div><div><strong>3</strong><span>standalone target VM cap</span></div><div><strong>30 s</strong><span>coordinator idle bound</span></div></div>
      <p>Reservations precede paid calls. Unresolved usage stops additional paid work. Base and candidate use an approved image/resource cohort; uncertain dependency-cache state falls back to clean setup.</p>
      <details className="docs-details"><summary>Context, token, lease and resource limits</summary><div className="docs-table-wrap"><table><thead><tr><th>Boundary</th><th>Current default / ceiling</th><th>Enforcement</th></tr></thead><tbody>
        <tr><td>Initial context</td><td>12 files · 24 read attempts · 96,000 total bytes</td><td>Selective retrieval, not the whole repository in every prompt.</td></tr>
        <tr><td>Shared model ledger</td><td>10 requests · 524,288 input tokens · 40,960 output tokens</td><td>Roles and retries consume the same reservations.</td></tr>
        <tr><td>Source assessment</td><td>Up to 6 model requests within the shared ledger</td><td>Includes investigator and advisor activity.</td></tr>
        <tr><td>Standalone runtime</td><td>15 minutes · up to 3 target sandboxes</td><td>Pair and retry-revision paths have separate limits.</td></tr>
        <tr><td>Target provider lease</td><td>180 seconds · renewed every 30 seconds</td><td>Short-lived ownership with interruption cleanup.</td></tr>
        <tr><td>Coordinator</td><td>30-second idle bound · 28-minute lifetime</td><td>On-demand E2B orchestration, separate from repository execution.</td></tr>
      </tbody></table></div><p>Dependency reuse is restricted to supported installs with matching tenant, lockfile and toolchain identities. Observed resource use can inform subsequent sizing with conservative headroom. Admission, provider quotas, database pools and VM capacity are separate controls. Uncertain cleanup stays reserved until provider-aware reclamation confirms it.</p></details>
    </section>
    <section id="work-outlives-the-http-request" className={styles.section}>
      <div className={styles.sectionHeading}><span className={styles.number}>05</span><div><h2>Persist work. Fence stale workers.</h2><p>The API returns a job identity; execution and publication continue independently.</p></div></div>
      <div className={styles.durability}><div><h3>Durable state</h3><p>PostgreSQL retains jobs, events, model reservations, context, experiments, observations and publication state. Transactional claims, worker IDs and leases reject stale updates.</p></div><div><h3>Review continuity</h3><p>One identity groups attempts for a workspace, repository, PR and captured head. Individual evidence survives. Advancing the head invalidates earlier proof.</p></div><div><h3>Failure boundaries</h3><p>Expired execution fails rather than replaying uncertain side effects or charges. GitHub publication retries separately. Proposed fixes are never automatically merged.</p></div></div>
      <details className="docs-details"><summary>Workspace and team authorization</summary><p>Personal and team workspaces have separate data ownership. Each person signs in with GitHub. Teams use identity-bound invitations and Owner/Admin/Member roles, checked against current membership. Integration management requires an owner or admin. Channel authorization is a separate step; joining a team does not silently import a company directory or conversations.</p></details>
    </section>
    <section id="recorded-acceptance" className={styles.section}>
      <div className={styles.sectionHeading}><LuFlaskConical className={styles.headingIcon} aria-hidden="true"/><div><h2>One measured production run.</h2><p>A controlled resource-lease cleanup regression, through the deployed API and on-demand worker using real GitHub, OpenAI and E2B calls.</p></div></div>
      <div className={styles.statGrid}><div><strong>{evidence.modelCalls}</strong><span>reported model calls</span></div><div><strong>{evidence.tokens.total.toLocaleString("en-US")}</strong><span>input + output tokens</span></div><div><strong>{(evidence.durationMs/1000).toFixed(1)}s</strong><span>recorded execution interval</span></div><div><strong>2 / 2</strong><span>target VMs cleaned up</span></div></div>
      <figure className={styles.chart}><figcaption>Reported tokens by stage</figcaption>{evidence.stages.map(stage=><div className={styles.barRow} key={stage.name} data-model={stage.name.includes("advisor")?"advisor":"primary"}><span>{stage.label}</span><div className={styles.barTrack}><div className={styles.bar} style={{width:`${100*stage.tokens/Math.max(...evidence.stages.map(s=>s.tokens))}%`}}/></div><span>{stage.tokens.toLocaleString("en-US")}</span></div>)}<p>{evidence.tokens.input.toLocaleString("en-US")} input + {evidence.tokens.output.toLocaleString("en-US")} output. {evidence.tokens.cachedInput.toLocaleString("en-US")} cached input tokens are included in input, not added again.</p></figure>
      <div className="docs-table-wrap"><table><thead><tr><th>Phase</th><th>Reproducer</th><th>Original suite</th><th>Test source</th></tr></thead><tbody>{evidence.observations.map(row=><tr key={row.phase}><td>{row.phase}</td><td>Exit {row.exitCode} · {row.exitCode===0?"passed":"failed"}</td><td>Passed</td><td>Unchanged</td></tr>)}</tbody></table></div>
      <p>The generated test exposed a lease that was not released after a rejected task. A <code>try/finally</code> repair restored cleanup; the same test passed afterward. The patch and agent narrative were saved. No merge was performed.</p>
      <p className={styles.note}>This controlled example demonstrates the workflow. It does not measure detection accuracy across unrelated repositories.</p>
      <p className={styles.sourceNote}>Controlled run · 16 November 2026. <a href="/data/catcher-acceptance.json" download>Download measured record</a> · <a href={evidence.pullRequest} target="_blank" rel="noreferrer">Controlled PR<LuArrowUpRight aria-hidden="true"/></a></p>
    </section>
    <section id="observe-the-boundary-that-failed" className={styles.section}>
      <h2>Reports and supported scope.</h2>
      <p>Reports distinguish source findings, observed failures and verified repairs. Commands, exits, relevant logs, original-test integrity, generated-test source and proposed patches remain inspectable.</p>
      <div className={styles.controlNote}><LuShieldCheck aria-hidden="true"/><p>Private source review uses authorized GitHub App access. Hosted runtime execution supports public repositories and uses isolated experiments; it does not collect production telemetry.</p></div>
      <div className={styles.sourceLinks}><Link href="/docs/evidence">Evidence and verification<LuArrowUpRight aria-hidden="true"/></Link><Link href="/docs/cli">The separate terminal agent<LuArrowUpRight aria-hidden="true"/></Link></div>
    </section>
  </>;
}
