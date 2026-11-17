import Link from 'next/link';
import { FiArrowDown, FiArrowUpRight, FiCheck, FiGitMerge, FiGitPullRequest, FiX } from 'react-icons/fi';
import interaction from '../../../public/data/pr-interaction.json';
import repair from '../../../public/data/catcher-acceptance.json';
import Reveal from '../motion/Reveal';
import styles from './MeasuredRuns.module.css';

const number = (value: number) => value.toLocaleString('en-US');

export default function MeasuredRuns() {
  return (
    <section id="measured-runs" aria-labelledby="measured-runs-title" className="w-full border-y border-grid bg-paper py-16 md:py-24">
      <div className="mx-auto max-w-[1280px] px-6">
        <Reveal className="mb-9 flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-accent">Measured runtime experiments</p>
            <h2 id="measured-runs-title" className="mt-3 text-3xl font-bold leading-tight tracking-tight text-ink md:text-5xl">Inspect the run.<br />Follow the evidence.</h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-ink-light">Two controlled cases. Real model calls and isolated execution. Revisions, outcomes and limits included.</p>
        </Reveal>
        <div className="grid gap-5 lg:grid-cols-2">
          <Reveal className={styles.card}>
            <div className={styles.content}>
              <p className={styles.eyebrow}><FiGitMerge aria-hidden="true" /> Cross-PR interaction <span>Controlled case</span></p>
              <h3 className={styles.title}>Passed separately.<br />Failed together.</h3>
              <p className={styles.description}>One PR lowers capacity. Another adds workers. The same generated test exposes the incompatible combination.</p>
              <div className={styles.branch}>
                <svg viewBox="0 0 440 130" aria-hidden="true" focusable="false">
                  <path d="M24 65 H75 C100 65 95 24 125 24 H300 C330 24 320 65 355 65 H416 M75 65 C100 65 95 106 125 106 H300 C330 106 320 65 355 65" />
                  <circle cx="24" cy="65" r="6" /><circle cx="416" cy="65" r="8" className={styles.failNode} />
                </svg>
                <span className={styles.base}>Base <FiCheck aria-label="passed" /></span>
                <span className={styles.left}><FiGitPullRequest aria-hidden="true" /> Capacity PR <FiCheck aria-label="passed" /></span>
                <span className={styles.right}><FiGitPullRequest aria-hidden="true" /> Workers PR <FiCheck aria-label="passed" /></span>
                <span className={styles.combined}>Combined <FiX aria-label="failed" /></span>
              </div>
              <dl className={styles.metrics}>
                <div><dt>Model calls</dt><dd>{interaction.metrics.modelRequests}</dd></div>
                <div><dt>Reported tokens</dt><dd>{number(interaction.metrics.totalTokens)}</dd></div>
                <div><dt>Recorded time</dt><dd>{(interaction.metrics.durationMs / 1000).toFixed(1)}<small>s</small></dd></div>
              </dl>
              <p className={styles.scope}>4 cloud VMs · all closed · local test-DB coordination · no repair</p>
            </div>
            <div className={styles.links}><Link href="/blog/two-passing-prs-one-runtime-failure">Read the experiment <FiArrowUpRight aria-hidden="true" /></Link><a href="/data/pr-interaction.json" download>Evidence <FiArrowDown aria-hidden="true" /></a></div>
          </Reveal>
          <Reveal className={styles.card}>
            <div className={styles.content}>
              <p className={styles.eyebrow}><FiGitPullRequest aria-hidden="true" /> Single-PR repair <span>Controlled case</span></p>
              <h3 className={styles.title}>A repair checked against<br />the same reproducer.</h3>
              <p className={styles.description}>A rejected task leaks its lease. Catcher reproduces the failure, repairs cleanup and reruns the frozen test.</p>
              <ol className={styles.chain} aria-label="Differential verification outcomes">
                {repair.observations.map(row => <li key={row.phase} className={row.exitCode === 0 ? styles.passed : styles.failed}>
                  <span>{row.phase === 'candidate' ? 'PR' : row.phase === 'repair' ? 'Repair' : 'Base'}</span>
                  {row.exitCode === 0 ? <FiCheck aria-hidden="true" /> : <FiX aria-hidden="true" />}<strong>{row.exitCode === 0 ? 'Pass' : 'Fail'}</strong>
                </li>)}
              </ol>
              <dl className={styles.metrics}>
                <div><dt>Model calls</dt><dd>{repair.modelCalls}</dd></div>
                <div><dt>Reported tokens</dt><dd>{number(repair.tokens.total)}</dd></div>
                <div><dt>Recorded time</dt><dd>{(repair.durationMs / 1000).toFixed(1)}<small>s</small></dd></div>
              </dl>
              <p className={styles.scope}>2 cloud VMs · both closed · deployed workflow · original tests preserved</p>
            </div>
            <div className={styles.links}><Link href="/blog/from-pull-request-to-runtime-regression">Read the experiment <FiArrowUpRight aria-hidden="true" /></Link><a href="/blog/runtime-regression-evidence.json" download>Evidence <FiArrowDown aria-hidden="true" /></a></div>
          </Reveal>
        </div>
        <p className="mt-5 max-w-3xl text-xs leading-relaxed text-ink-light">These are controlled experiments on different tasks and builds. They show the recorded outcomes, not a general detection rate.</p>
      </div>
    </section>
  );
}
