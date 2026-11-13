import type { CSSProperties } from 'react';

/** Delay index for staggered reveal children: style={stagger(2)}. Plain module, usable from server components. */
export const stagger = (i: number) => ({ ['--i' as string]: i }) as CSSProperties;
