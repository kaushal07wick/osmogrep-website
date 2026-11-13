/** True when the visitor asked the OS for less motion. Animations should render their still state. */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
