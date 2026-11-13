'use client';

import type { ReactNode } from 'react';
import { useInView } from './hooks';

/**
 * Fades and lifts its children in when scrolled into view. Direct children marked with
 * `data-stagger` come in one after another.
 */
export { stagger } from './stagger';

export default function Reveal({ children, className = '', as: Tag = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'section' }) {
  const [ref, seen] = useInView<HTMLDivElement>(0.15);
  return (
    <Tag ref={ref} className={`reveal ${seen ? 'is-in' : ''} ${className}`}>
      {children}
    </Tag>
  );
}

