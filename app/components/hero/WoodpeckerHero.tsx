'use client';

import { useEffect, useRef } from 'react';
import { Woodpecker as W } from '../../../lib/woodpecker/scene';
import { prefersReducedMotion } from '../../../lib/motion';

/*
 * Hero animation: an ASCII woodpecker taps a tree (each tap is a test run), a pixel bug crawls
 * out of the hollow, the bird catches it and an error card types out. 10 second loop; the eye
 * follows the pointer over the canvas. Engine: lib/woodpecker/scene.js.
 *
 * Canvas is sized to its box at devicePixelRatio (max 2), redrawn on resize, capped at 30fps,
 * paused offscreen, and shows a still frame (t = 7.8) for reduced motion.
 */
const STILL_T = 7.8;
const FRAME_MS = 33; // ~30fps
const POINTER_MS = 2500; // the eye follows the pointer this long after it last moved

/** Read a design token from :root so the canvas uses the same colors as the page. */
const token = (name: string, fallback: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

export default function WoodpeckerHero() {
  const stage = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    W.PAL[1] = token('--color-ink', W.PAL[1]);
    W.PAL[3] = token('--color-accent', W.PAL[3]);
    W.PAL[6] = token('--color-ink-light', W.PAL[6]);
    // The real Space Mono family name next/font assigned (font-inter resolves to it).
    const family = getComputedStyle(canvas).fontFamily;

    let cssW = 0, cssH = 0, tNow = STILL_T, raf = 0, last = 0, visible = true;
    let ptr: { x: number; y: number } | null = null;
    let ptrAt = -Infinity;
    const reduce = prefersReducedMotion();

    const size = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const r = canvas.getBoundingClientRect();
      cssW = r.width;
      cssH = r.height;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const paint = (t: number) => {
      tNow = t;
      W.frame(t, performance.now() - ptrAt < POINTER_MS ? ptr : null);
      W.draw(ctx, cssW, cssH, family);
    };

    const ro = new ResizeObserver(() => {
      size();
      paint(tNow);
    });
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    const onPointer = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      ptr = { x: ((e.clientX - r.left) / r.width) * W.WORLD_W, y: ((e.clientY - r.top) / r.height) * W.WORLD_H };
      ptrAt = performance.now();
    };

    let cancelled = false;
    const start = () => {
      if (cancelled) return;
      size();
      ro.observe(canvas);
      // ?t=SECONDS freezes a frame (handy for reviewing the art); reduced motion shows STILL_T.
      const pinned = new URLSearchParams(location.search).get('t');
      if (pinned !== null || reduce) return paint(pinned !== null ? Number(pinned) : STILL_T);
      io.observe(stage.current!);
      canvas.addEventListener('pointermove', onPointer);
      const t0 = performance.now();
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop);
        if (!visible || now - last < FRAME_MS) return;
        last = now;
        // rAF timestamps can precede t0 on the first frame; the engine expects t >= 0.
        paint(Math.max(0, now - t0) / 1000);
      };
      raf = requestAnimationFrame(loop);
    };
    // Canvas text needs the font loaded first, or the first frames render in a fallback.
    document.fonts.ready.then(start, start);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener('pointermove', onPointer);
    };
  }, []);

  return (
    <div
      ref={stage}
      className="min-w-0"
      role="img"
      aria-label="ASCII animation: a woodpecker taps a tree, one tap sounds hollow, and a small bug crawls out. The woodpecker catches it in its beak."
    >
      {/* The art fills the right ~55% of the scene; widen the canvas leftward so the bird sits centered in the column. */}
      <canvas ref={canvasRef} className="block aspect-[45.6/38] w-full font-inter lg:-ml-[22%] lg:w-[122%]" />
    </div>
  );
}
