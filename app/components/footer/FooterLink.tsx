'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { PixelArrow } from '../ui/icons';

const GL = '!<>-_/[]{}=+*^?#%&';

/** Footer link: orange pixel marker grows in, the label scrambles back into place, an arrow slides in. */
export default function FooterLink({ href, children }: { href: string; children: string }) {
  const [text, setText] = useState(children);
  const busy = useRef(false);
  const scramble = () => {
    if (busy.current) return;
    busy.current = true;
    let n = 0;
    const id = setInterval(() => {
      n += 0.45;
      setText(children.split('').map((c, i) => (i < n || c === ' ' ? c : GL[(Math.random() * GL.length) | 0])).join(''));
      if (n >= children.length) { clearInterval(id); setText(children); busy.current = false; }
    }, 28);
  };
  const cls = 'group flex w-fit items-center py-2 text-[15px] text-[#b7b2a9] transition-colors hover:text-white';
  const inner = (
    <>
      <span className="h-2 w-0 bg-accent transition-[width,margin] duration-150 group-hover:mr-2.5 group-hover:w-2" />
      <span aria-label={children}>{text}</span>
      <span className="ml-0 flex w-0 overflow-hidden text-accent transition-[width,margin] duration-300 group-hover:ml-2.5 group-hover:w-3.5"><PixelArrow /></span>
    </>
  );
  return href.startsWith('http') ? (
    <a href={href} target="_blank" rel="noopener noreferrer" onMouseEnter={scramble} className={cls}>{inner}</a>
  ) : (
    <Link href={href} onMouseEnter={scramble} className={cls}>{inner}</Link>
  );
}
