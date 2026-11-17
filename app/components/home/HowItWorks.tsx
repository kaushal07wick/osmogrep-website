import Link from 'next/link';
import { FiArrowUpRight, FiLayers, FiTerminal, FiTool } from 'react-icons/fi';
import Reveal from '../motion/Reveal';
import styles from './HowItWorks.module.css';

export default function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-title" className={styles.section}>
      <div className={styles.container}>
        <Reveal className={styles.heading}><p>How it works</p><h2 id="how-it-works-title">Context. Test. Repair.</h2></Reveal>
        <ol className={styles.steps}>
          <li><FiLayers aria-hidden="true" /><h3>Understand the change</h3><p>Read the diff, related code and tests.</p></li>
          <li><FiTerminal aria-hidden="true" /><h3>Check the behavior</h3><p>Compare a focused test across revisions.</p></li>
          <li><FiTool aria-hidden="true" /><h3>Verify the repair</h3><p>Check the patch. Keep the evidence.</p></li>
        </ol>
        <Link className={styles.details} href="/docs/verification">How verification works <FiArrowUpRight aria-hidden="true" /></Link>
      </div>
    </section>
  );
}
