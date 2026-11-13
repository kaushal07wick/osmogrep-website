'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { prefersReducedMotion } from '../../../lib/motion';

/** True once the element has scrolled into view (stays true). */
export function useInView<T extends Element>(threshold = 0.2): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setSeen(true);
        io.disconnect();
      }
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen];
}

/**
 * Scroll progress of an element through the viewport: 0 when its top meets the bottom of the
 * screen, 1 when its bottom meets the top. Reduced motion pins it at 1 (final state).
 */
export function useScrollProgress<T extends Element>(): [RefObject<T | null>, number] {
  const ref = useRef<T>(null);
  const [p, setP] = useState(0.5);
  useEffect(() => {
    if (prefersReducedMotion()) return setP(1);
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height + innerHeight;
      setP(Math.min(1, Math.max(0, (innerHeight - r.top) / total)));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    return () => {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return [ref, p];
}

/** Clamp-map `p` from [a, b] to [0, 1]. */
export const range = (p: number, a: number, b: number) => Math.min(1, Math.max(0, (p - a) / (b - a)));

/** Steps 0..n-1 every `ms` while mounted (looping). Reduced motion holds at `still` (default: last step). */
export function useTick(n: number, ms: number, still = n - 1) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion()) return setI(still);
    const id = setInterval(() => setI((v) => (v + 1) % n), ms);
    return () => clearInterval(id);
  }, [n, ms, still]);
  return i;
}
