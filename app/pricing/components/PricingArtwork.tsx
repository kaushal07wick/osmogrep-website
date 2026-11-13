'use client';

import type { PointerEvent } from 'react';

export default function PricingArtwork({ kind }: { kind: 'solo' | 'pro' | 'teams' | 'enterprise' }) {
  const move = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--art-x', `${((event.clientX - rect.left) / rect.width - .5) * 6}px`);
    event.currentTarget.style.setProperty('--art-y', `${((event.clientY - rect.top) / rect.height - .5) * 4}px`);
  };
  const reset = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--art-x', '0px');
    event.currentTarget.style.setProperty('--art-y', '0px');
  };
  return <div className="pricing-plan-art" onPointerMove={move} onPointerLeave={reset} aria-hidden="true">
    <img src={`/pricing/${kind}-dither.webp`} alt="" width="640" height="427" />
  </div>;
}
