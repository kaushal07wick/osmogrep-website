import Link from 'next/link';
import { FiArrowDown, FiArrowUpRight, FiCheck, FiGitMerge, FiGitPullRequest, FiX } from 'react-icons/fi';
import interaction from '../../../public/data/pr-interaction.json';
import repair from '../../../public/data/catcher-acceptance.json';
import Reveal from '../motion/Reveal';
import styles from './MeasuredRuns.module.css';

const number = (value: number) => value.toLocaleString('en-US');
const phases: Record<string, string> = { base: 'Base', left: 'Capacity PR', right: 'Workers PR', combined: 'Combined', candidate: 'PR', repair: 'Repair' };

export default function MeasuredRuns() {
  return (
    <section id="measured-runs" aria-labelledby="measured-runs-title" className={styles.section}>
      <div className={styles.container}>
        <Reveal className={styles.heading}>
          <div><p className={styles.kicker}>Open evidence</p><h2 id="measured-runs-title">Measured results.</h2></div>
        </Reveal>
        <div className={styles.reports}>
          <Reveal as="section" className={styles.report}>
            <div className={styles.interaction}>
              <p className={styles.figureLabel}><FiGitMerge aria-hidden="true" /> Cross-PR interaction</p>
              <div className={styles.branch} role="img" aria-label="Identical reproducer: base, capacity PR and workers PR pass; the combined revision fails.">
                <svg className={styles.wires} viewBox="0 0 400 180" preserveAspectRatio="none" aria-hidden="true"><path d="M55 90 H85 C110 90 100 40 135 40 H265 C295 40 285 90 320 90 H350 M85 90 C110 90 100 140 135 140 H265 C295 140 285 90 320 90" /></svg>
                {interaction.observations.map(row => <div key={row.phase} className={`${styles.node} ${styles[row.phase]} ${row.exitCode === 0 ? styles.pass : styles.fail}`}><span>{phases[row.phase]}</span><strong>{row.exitCode === 0 ? <FiCheck aria-hidden="true" /> : <FiX aria-hidden="true" />}{row.exitCode === 0 ? 'Pass' : 'Fail'}</strong></div>)}
              </div>
            </div>
            <div className={styles.content}>
              <div className={styles.caseMeta}><span>Controlled case</span></div>
              <h3>Two PRs. One conflict.</h3>
              <p className={styles.description}>Each PR passes alone. The combined revision fails.</p>
              <dl className={styles.metrics}>
                <div><dt>Model calls</dt><dd>{interaction.metrics.modelRequests}</dd></div>
                <div><dt>Reported tokens</dt><dd>{number(interaction.metrics.totalTokens)}</dd></div>
                <div><dt>Recorded time</dt><dd>{(interaction.metrics.durationMs / 1000).toFixed(1)}<small>s</small></dd></div>
              </dl>
              <p className={styles.scope}>4 cloud VMs, all closed · local test-DB coordination · no repair</p>
              <div className={styles.links}><Link href="/blog/two-passing-prs-one-runtime-failure">Case study <FiArrowUpRight aria-hidden="true" /></Link><a href="/data/pr-interaction.json" download>Evidence <FiArrowDown aria-hidden="true" /></a></div>
            </div>
          </Reveal>
          <Reveal as="section" className={styles.report}>
            <div className={styles.repair}>
              <p className={styles.figureLabel}><FiGitPullRequest aria-hidden="true" /> Single-PR repair</p>
              <ol className={styles.chain} aria-label="Differential verification outcomes">
                {repair.observations.map(row => <li key={row.phase} className={row.exitCode === 0 ? styles.pass : styles.fail}><span>{phases[row.phase]}</span>{row.exitCode === 0 ? <FiCheck aria-hidden="true" /> : <FiX aria-hidden="true" />}<strong>{row.exitCode === 0 ? 'Pass' : 'Fail'}</strong></li>)}
              </ol>
            </div>
            <div className={styles.content}>
              <div className={styles.caseMeta}><span>Controlled case</span></div>
              <h3>Lease cleanup repaired.</h3>
              <p className={styles.description}>The same test fails before the patch and passes after.</p>
              <dl className={styles.metrics}>
                <div><dt>Model calls</dt><dd>{repair.modelCalls}</dd></div>
                <div><dt>Reported tokens</dt><dd>{number(repair.tokens.total)}</dd></div>
                <div><dt>Recorded time</dt><dd>{(repair.durationMs / 1000).toFixed(1)}<small>s</small></dd></div>
              </dl>
              <p className={styles.scope}>2 cloud VMs, both closed · deployed workflow · original tests preserved</p>
              <div className={styles.links}><Link href="/blog/from-pull-request-to-runtime-regression">Case study <FiArrowUpRight aria-hidden="true" /></Link><a href="/blog/runtime-regression-evidence.json" download>Evidence <FiArrowDown aria-hidden="true" /></a></div>
            </div>
          </Reveal>
        </div>
        <p className={styles.limitation}>Controlled fixtures, not a general accuracy benchmark. Setup and limitations are included in each case study.</p>
      </div>
    </section>
  );
}
