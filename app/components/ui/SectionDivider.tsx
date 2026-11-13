/* Divider between sections: one faint hairline with a small orange dot drifting along it.
   `dir` alternates the drift so consecutive dividers don't move in lockstep. The props
   `index` and `label` are kept for callers but no longer rendered. */
export default function SectionDivider({ dir = 1 }: { index?: number; label?: string; dir?: 1 | -1 }) {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-6" aria-hidden="true">
      <div className="relative h-px bg-grid/70">
        <span className={`divider-dot absolute -top-[1.5px] h-1 w-1 bg-accent ${dir < 0 ? 'divider-dot-reverse' : ''}`} />
      </div>
    </div>
  );
}
