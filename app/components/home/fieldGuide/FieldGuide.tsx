'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import Bug from '../../bug/Bug';
import Reveal from '../../motion/Reveal';
import { stagger } from '../../motion/stagger';
import { PixelIcon, SPECIMENS } from './specimens';
import './field-guide.css';

export default function FieldGuide() {
  const [selected, setSelected] = useState(0);
  const detailId = useId();
  const specimen = SPECIMENS[selected];
  return (
    <section id="field-guide" className="field-guide zone zone-pinstripe w-full py-20 md:py-28" aria-labelledby="field-guide-title">
      <div className="mx-auto max-w-[1280px] px-6">
        <Reveal className="field-guide-heading">
          <div>
            <p data-stagger style={stagger(0)} className="font-mono text-[12px] text-accent">the bug collection</p>
            <h2 id="field-guide-title" data-stagger style={stagger(1)}>Small bugs.<br />Real consequences.</h2>
          </div>
          <p data-stagger style={stagger(2)} className="field-guide-intro">Nine failure patterns worth a closer look.<br />Choose one to explore.</p>
        </Reveal>
        <Reveal className="field-guide-spread">
          <div className="field-guide-index" role="group" aria-label="Choose a failure pattern">
            {SPECIMENS.map((item, index) => <button
              key={item.name}
              type="button"
              aria-pressed={selected === index}
              aria-controls={detailId}
              onClick={() => setSelected(index)}
              className="field-guide-choice"
            >
              <span className="field-guide-number" aria-hidden="true">0{index + 1}</span>
              <PixelIcon name={item.icon} />
              <span>{item.name}</span>
              <span className="field-guide-choice-arrow" aria-hidden="true">↗</span>
            </button>)}
          </div>
          <article id={detailId} className="field-guide-detail" aria-label={`${specimen.name} example`}>
            <div key={specimen.name} className="field-guide-example">
              <div className="field-guide-detail-top"><span className="field-guide-label">PATTERN / 0{selected + 1}</span><span className="field-guide-label">ILLUSTRATIVE EXAMPLE</span></div>
              <h3>{specimen.name}</h3>
              <p className="field-guide-context">{specimen.context}</p>
              <div className="field-guide-observation">
                <span className="field-guide-mascot" aria-hidden="true"><Bug mood="curious" className="h-10 w-14 text-ink" /><span>{specimen.message}</span></span>
                <specimen.Demo />
              </div>
              <div className="field-guide-comparison">
                <div><span className="field-guide-label">THE CAUSE</span><code>{specimen.before}</code></div>
                <div><span className="field-guide-label">REPAIR DIRECTION <span className="text-accent" aria-hidden="true">↳</span></span><code>{specimen.after}</code></div>
              </div>
            </div>
            <footer className="field-guide-footer"><span>Check the behavior. Keep the evidence.</span><Link href="/docs/bug-catching">How verification works <span aria-hidden="true">↗</span></Link></footer>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
