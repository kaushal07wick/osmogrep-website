import Link from 'next/link';
import { FiArrowDown, FiArrowUpRight, FiCheck, FiGitMerge, FiTool, FiX } from 'react-icons/fi';
import interaction from '../../../public/data/pr-interaction.json';
import repair from '../../../public/data/catcher-acceptance.json';
import Reveal from '../motion/Reveal';
import styles from './MeasuredRuns.module.css';

const phases: Record<string, string> = { base: 'Base', candidate: 'PR', repair: 'Repair' };

export default function MeasuredRuns() {
  return (
    <section id="measured-runs" aria-labelledby="measured-runs-title" className={styles.section}>
      <div className={styles.container}>
        <Reveal className={styles.heading}><h2 id="measured-runs-title">Measured results.</h2></Reveal>
        <div className={styles.rows}>
          <article className={styles.row}>
            <FiGitMerge className={styles.icon} aria-hidden="true" />
            <div className={styles.summary}><span>Controlled case</span><h3>Two PRs. One conflict.</h3><p role="img" aria-label="Identical reproducer: base, capacity PR and workers PR pass; the combined revision fails.">Pass separately <span aria-hidden="true">→</span> <em>fail together</em></p></div>
            <dl className={styles.metrics}><div><dt>Model calls</dt><dd>{interaction.metrics.modelRequests}</dd></div><div><dt>Reported tokens</dt><dd>{interaction.metrics.totalTokens.toLocaleString('en-US')}</dd></div><div><dt>Recorded time</dt><dd>{(interaction.metrics.durationMs / 1000).toFixed(1)}<small>s</small></dd></div></dl>
            <div className={styles.links}><Link href="/blog/two-passing-prs-one-runtime-failure">Case study <FiArrowUpRight aria-hidden="true" /></Link><a href="/data/pr-interaction.json" download aria-label="Download interaction evidence"><FiArrowDown aria-hidden="true" /></a></div>
          </article>
          <article className={styles.row}>
            <FiTool className={styles.icon} aria-hidden="true" />
            <div className={styles.summary}><span>Controlled case</span><h3>Lease cleanup repaired.</h3><ol className={styles.outcomes} aria-label="Differential verification outcomes">{repair.observations.map(row => <li key={row.phase} className={row.exitCode === 0 ? styles.pass : styles.fail}>{phases[row.phase]}{row.exitCode === 0 ? <FiCheck aria-label="passed" /> : <FiX aria-label="failed" />}</li>)}</ol></div>
            <dl className={styles.metrics}><div><dt>Model calls</dt><dd>{repair.modelCalls}</dd></div><div><dt>Reported tokens</dt><dd>{repair.tokens.total.toLocaleString('en-US')}</dd></div><div><dt>Recorded time</dt><dd>{(repair.durationMs / 1000).toFixed(1)}<small>s</small></dd></div></dl>
            <div className={styles.links}><Link href="/blog/from-pull-request-to-runtime-regression">Case study <FiArrowUpRight aria-hidden="true" /></Link><a href="/blog/runtime-regression-evidence.json" download aria-label="Download repair evidence"><FiArrowDown aria-hidden="true" /></a></div>
          </article>
        </div>
        <p className={styles.note}>Controlled fixtures, not a general accuracy benchmark. Setup and limitations are in each case study.</p>
      </div>
    </section>
  );
}
