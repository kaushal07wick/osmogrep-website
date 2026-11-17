'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { FiArrowUpRight, FiCornerDownRight } from 'react-icons/fi';
import Reveal from '../../motion/Reveal';
import { SPECIMENS } from './specimens';
import './field-guide.css';

export default function FieldGuide() {
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) entry.target.classList.toggle('is-visible', entry.isIntersecting);
    }, { threshold: 0.12 });
    element.querySelectorAll('.fg-card').forEach(card => observer.observe(card));
    const visibility = () => { element.dataset.paused = String(document.hidden); };
    visibility();
    document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); };
  }, []);

  return (
    <section ref={section} id="field-guide" className="field-guide" aria-labelledby="field-guide-title">
      <div className="fg-container">
        <Reveal className="fg-heading">
          <div>
            <p className="fg-eyebrow"><span aria-hidden="true" /> The anatomy of a bug</p>
            <h2 id="field-guide-title">Tiny changes.<br /><em>Unexpected fallout.</em></h2>
          </div>
          <div className="fg-intro"><p>A query. A retry. One missing await.<br />Follow the ripple through the system.</p><span>9 illustrated failure patterns</span></div>
        </Reveal>

        <div className="fg-gallery">
          {SPECIMENS.map(({ id, name, category, context, fix, Icon, Demo }) => (
            <article key={id} className={`fg-card fg-card--${id}`} aria-labelledby={`fg-${id}`}>
              <div className="fg-card-heading"><span className="fg-category"><Icon aria-hidden="true" />{category}</span></div>
              <h3 id={`fg-${id}`}>{name}</h3>
              <p className="fg-context">{context}</p>
              <div className="fg-visual"><Demo /></div>
              <div className="fg-repair"><FiCornerDownRight aria-hidden="true" /><span>{fix}</span></div>
            </article>
          ))}
        </div>

        <div className="fg-footer"><p>Understand the pattern. Verify it in your code.</p><Link href="/docs/bug-catching">Inside the verification engine <FiArrowUpRight aria-hidden="true" /></Link></div>
      </div>
    </section>
  );
}
