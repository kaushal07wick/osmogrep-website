'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useScrollProgress } from './hooks';

/** The untransformed outer box keeps scroll measurements stable as the artwork drifts. */
export default function ScrollDepth({ children, travel = 140 }: { children: ReactNode; travel?: number }) {
  const [ref, progress] = useScrollProgress<HTMLDivElement>();
  return <div ref={ref} className="scroll-depth"><div className="scroll-depth-layer" style={{ '--depth-y': `${(progress - .5) * travel}px`, '--depth-tilt': `${(.5 - progress) * 5}deg` } as CSSProperties}>{children}</div></div>;
}
