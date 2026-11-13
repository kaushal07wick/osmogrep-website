'use client';

import Link from 'next/link';
import { features } from '../../../lib/features';
import { previews } from './featurePreviews';

export default function FeaturesPanel() {
  return (
    <div className="feat-drop tx-dither border-b border-grid shadow-2xl shadow-black/10">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-3 p-5 lg:grid-cols-3">
        {features.map((f) => (
          <Link key={f.slug} href={f.href} className="frame group">
            <span className="flex h-full flex-col">
              <span className="px-4 pt-3.5">
                <span className="block font-medium text-ink transition-colors group-hover:text-accent">{f.title}</span>
                <span className="mt-0.5 block font-mono text-[11px] text-ink-light">{f.desc}</span>
              </span>
              <span className="mx-3 mb-3 mt-3 flex h-[132px] items-center justify-center overflow-hidden bg-paper bg-[radial-gradient(circle_at_1px_1px,rgba(24,24,27,0.09)_1px,transparent_0)] bg-[size:8px_8px]">
                <span className="scale-[0.92]">{previews[f.slug]}</span>
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
