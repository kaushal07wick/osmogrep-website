import Link from 'next/link';
import { FiArrowRight, FiArrowUpRight, FiCheck, FiFileText, FiGitPullRequest, FiLayers, FiTerminal, FiTool, FiX } from 'react-icons/fi';
import Reveal from '../motion/Reveal';
import styles from './HowItWorks.module.css';

export default function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-title" className={styles.section}>
      <div className={styles.container}>
        <Reveal className={styles.heading}>
          <div><p className={styles.kicker}>How it works</p><h2 id="how-it-works-title">Understand the change.<br /><em>Then put it to the test.</em></h2></div>
          <p>Source context shapes the hypothesis. Isolated execution checks the behavior. A repair gets checked against the same test.</p>
        </Reveal>
        <p className={styles.exampleLabel}>Illustrated workflow · resource cleanup</p>
        <div className={styles.workflow}>
          <Reveal className={styles.step}>
            <div className={styles.stepLabel}><FiLayers aria-hidden="true" /><span>Context</span><FiArrowRight aria-hidden="true" /></div>
            <div className={`${styles.visual} ${styles.context}`} role="img" aria-label="Read the PR alongside callers, configuration and tests to identify missing resource cleanup on rejection.">
              <div className={styles.change}><FiGitPullRequest aria-hidden="true" /><span>Changed execution path</span></div>
              <div className={styles.dependencies}><span>Callers</span><span>Config</span><span>Tests</span></div>
              <div className={styles.contract}><FiFileText aria-hidden="true" /><div><small>Behavior to preserve</small><p>Release the lease,<br />even when a task rejects.</p></div></div>
            </div>
            <h3>Read beyond the diff.</h3>
            <p>Retrieve relevant source, callers and tests. Establish the expected behavior before proposing a failure or a fix.</p>
          </Reveal>
          <Reveal className={styles.step}>
            <div className={styles.stepLabel}><FiTerminal aria-hidden="true" /><span>Experiment</span><FiArrowRight aria-hidden="true" /></div>
            <div className={`${styles.visual} ${styles.experiment}`} role="img" aria-label="An illustrative generated rejection test passes on the base and fails on the PR with a lease still held.">
              <div className={styles.terminalTitle}><span /> Isolated sandbox</div>
              <code className={styles.command}>$ node --test reproducer.mjs</code>
              <div className={styles.testRow}><span>Base</span><strong><FiCheck aria-hidden="true" /> PASS</strong></div>
              <div className={styles.testRow}><span>PR</span><strong className={styles.failed}><FiX aria-hidden="true" /> FAIL</strong></div>
              <p className={styles.testError}>Expected: 0 leases held<br /><span>Observed: 1 lease held</span></p>
            </div>
            <h3>Test a specific failure.</h3>
            <p>Generate a focused reproducer with a justified expectation. Compare the same test on base and candidate revisions.</p>
          </Reveal>
          <Reveal className={styles.step}>
            <div className={styles.stepLabel}><FiTool aria-hidden="true" /><span>Repair & verify</span><FiCheck aria-hidden="true" /></div>
            <div className={`${styles.visual} ${styles.patch}`} role="img" aria-label="Illustrative repair puts release in a finally block, then reruns the reproducer and original tests.">
              <div className={styles.patchTitle}><span>Cleanup on every exit</span><small>Illustrative diff</small></div>
              <pre><code><span className={styles.removed}>− await task();</span><span className={styles.removed}>− lease.release();</span><span className={styles.added}>+ try {'{'} await task(); {'}'}</span><span className={styles.added}>+ finally {'{'} lease.release(); {'}'}</span></code></pre>
              <div className={styles.recheck}><FiCheck aria-hidden="true" /><span>Reproducer + original tests</span></div>
            </div>
            <h3>Keep the proof with the patch.</h3>
            <p>When a repair is produced, rerun the reproducer and preserve original-test results. Export the patch, commands and evidence.</p>
          </Reveal>
        </div>
        <Reveal className={styles.outcomes}>
          <div><span className={styles.outcomeTitle}>The outcome stays explicit.</span><p>A prediction alone is not a confirmed runtime bug.</p></div>
          <div className={styles.states}><span><i className={styles.green} /> Reproduced</span><span><i className={styles.gray} /> Not reproduced</span><span><i className={styles.amber} /> Inconclusive</span></div>
          <Link href="/docs/verification">How verification works <FiArrowUpRight aria-hidden="true" /></Link>
        </Reveal>
      </div>
    </section>
  );
}
