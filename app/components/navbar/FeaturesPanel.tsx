'use client';

import Link from 'next/link';
import { features } from '../../../lib/features';
import { previews } from './featurePreviews';
import './features.css';

export default function FeaturesPanel() {
  return (
    <div className="feat-drop tx-dither border-b border-grid shadow-2xl shadow-black/10">
      <div className="feature-grid">
        {features.map((f) => (
          <Link key={f.slug} href={f.href} className="feature-card frame">
            <span className="feature-heading">{f.title}<span className="feature-arrow" aria-hidden="true">↗</span></span>
            <span className="feature-caption">{f.desc}</span>
            <span className="feature-art" aria-hidden="true" data-preview={f.slug}>{previews[f.slug]}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
