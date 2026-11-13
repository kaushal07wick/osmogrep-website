'use client';

import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../../../lib/motion';

/** Shared look of a bar cell: hairline on the left, mono label, orange fill that steps up on hover. */
export const cellClass = 'group relative hidden items-center gap-2 overflow-hidden border-l border-grid px-6 font-mono md:flex';

/**
 * The fill + label inside a cell. `active` marks the current page with an orange underline;
 * `open` is for a cell whose panel is open (already filled orange, so the label is white).
 */
export function CellLabel({ text, hovered, active = false, open = false }: { text: string; hovered: boolean; active?: boolean; open?: boolean }) {
  return (
    <>
      <span className="nav-step-fill absolute inset-0 origin-bottom scale-y-0 bg-accent group-hover:scale-y-100 group-focus-visible:scale-y-100" />
      {active && <span className="absolute inset-x-0 bottom-0 h-[3px] bg-accent" />}
      <span className={`relative group-hover:text-white group-focus-visible:text-white ${open ? 'text-white' : active ? 'text-ink' : 'text-ink-light'}`}>
        <Scramble text={text} active={hovered} />
      </span>
    </>
  );
}

/** Text that decodes from glyph noise while `active`. */
const GLYPHS = '!<>-_/[]{}=+*^?#01';
function Scramble({ text, active }: { text: string; active: boolean }) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (!active || prefersReducedMotion()) return setOut(text);
    let frame = 0;
    const id = setInterval(() => {
      frame++;
      setOut(text.split('').map((c, i) => (i < frame / 2 ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join(''));
      if (frame / 2 >= text.length) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, [active, text]);
  return <>{out}</>;
}
