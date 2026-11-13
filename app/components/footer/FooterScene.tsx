'use client';

import { useEffect, useRef, useState } from 'react';
import { createFooterScene, type FooterScene as Scene } from '../../../lib/footer/scene';
import { prefersReducedMotion } from '../../../lib/motion';
import FooterBug from './FooterBug';

/** Canvas host for the footer ASCII landscape, plus the bug that walks its ridges. Waits for Space Mono (the wordmark is built from it). */
export default function FooterScene() {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [scene, setScene] = useState<Scene | null>(null);
  useEffect(() => {
    let started: Scene | null = null;
    let gone = false;
    document.fonts.ready.then(() => {
      if (gone) return;
      started = createFooterScene(canvas.current!, host.current!, { reduced: prefersReducedMotion() });
      setScene(started);
    });
    return () => {
      gone = true;
      started?.cleanup();
    };
  }, []);
  return (
    <div ref={host} className="relative -mt-32 h-[clamp(420px,40vw,520px)] overflow-hidden">
      <canvas ref={canvas} className="pointer-events-none absolute inset-0 block h-full w-full" role="img" aria-label="ASCII landscape: the sun by day or a half moon by night, its light falling across layered ridges." />
      <FooterBug scene={scene} host={host} />
    </div>
  );
}
