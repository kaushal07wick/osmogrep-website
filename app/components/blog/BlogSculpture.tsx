'use client';

import { useEffect, useRef } from 'react';
import { MOODS } from '../bug/Bug';

type Point = [number, number, number];
const curve = (t: number): Point => [(1 + .32 * Math.cos(3 * t)) * Math.cos(2 * t), (1 + .32 * Math.cos(3 * t)) * Math.sin(2 * t), .55 * Math.sin(3 * t)];
const unit = (v: Point): Point => { const length = Math.hypot(...v) || 1; return v.map(value => value / length) as Point; };
const cross = (a: Point, b: Point): Point => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const rings = Array.from({ length: 72 }, (_, i) => {
  const t = i * Math.PI * 2 / 72, center = curve(t), before = curve(t - .001), after = curve(t + .001);
  const tangent = unit(after.map((value, axis) => value - before[axis]) as Point);
  const normal = unit(cross(tangent, Math.abs(tangent[2]) > .9 ? [0, 1, 0] : [0, 0, 1]));
  const binormal = cross(tangent, normal);
  return Array.from({ length: 12 }, (_, j) => {
    const angle = j * Math.PI * 2 / 12;
    return center.map((value, axis) => value + .17 * (normal[axis] * Math.cos(angle) + binormal[axis] * Math.sin(angle))) as Point;
  });
});

export default function BlogSculpture({ variant = 'knot' }: { variant?: 'knot' | 'field' }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = canvas.current!;
    const context = element.getContext('2d');
    if (!context) return;
    const ctx = context;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0, height = 0, frame = 0, last = 0, visible = true, pointerX = 0, pointerY = 0, x = 0, y = 0;
    function draw(time: number) {
      const t = motion.matches ? 0 : time / 1000;
      x += ((motion.matches ? 0 : pointerX) - x) * .07;
      y += ((motion.matches ? 0 : pointerY) - y) * .07;
      ctx.clearRect(0, 0, width, height);
      if (variant === 'field') {
        const scale = Math.min(width / 480, height / 310);
        const bugX = Math.sin(t * .19) * 8, bugY = Math.cos(t * .23) * 3;
        const point = (col: number, row: number) => {
          const wave = Math.sin(col * .16 + t * .45) * Math.cos(row * .21 + t * .18) * 19;
          return [width / 2 + col * 9 * scale + x * 14, height / 2 + (row * 8 + wave) * scale + y * 10];
        };
        ctx.font = `${Math.max(8, 10 * scale)}px monospace`;
        ctx.textAlign = 'center';
        const sweep = Math.sin(t * .27) * 23;
        for (let row = -14; row <= 14; row++) for (let col = -24; col <= 24; col++) {
          const [px, py] = point(col, row);
          const edge = Math.max(0, 1 - Math.pow(Math.abs(col) / 25, 4)) * Math.max(0, 1 - Math.pow(Math.abs(row) / 15, 4));
          const density = (Math.sin(col * .28 + row * .34 + t * .25) + 1) / 2;
          ctx.fillStyle = Math.abs(col - sweep) < 1.1 ? `rgba(234,88,12,${edge * .55})` : `rgba(24,24,27,${edge * (.12 + density * .32)})`;
          ctx.fillText('·:+*'[Math.min(3, Math.floor(density * 4))], px, py);
        }
        const [bx, by] = point(bugX, bugY), pixel = 3 * scale;
        const sprite = MOODS.curious.frames[Math.floor(t * 3) % MOODS.curious.frames.length];
        for (let row = 0; row < sprite.length; row++) for (let col = 0; col < sprite[row].length; col++) {
          const cell = sprite[row][col];
          if (cell === '.') continue;
          ctx.fillStyle = cell === 'o' ? '#ea580c' : cell === 'd' ? '#c2410c' : cell === 's' ? '#18181b22' : '#18181b';
          ctx.fillRect(Math.round(bx + (col - 7) * pixel), Math.round(by + (row - 5) * pixel), Math.ceil(pixel), Math.ceil(pixel));
        }
        return;
      }
      const ax = -.6 + Math.sin(t * .12) * .18 + y * .3, ay = .45 + t * .16 + x * .4;
      const cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
      const scale = Math.min(width, height) * .28;
      const points = rings.map(ring => ring.map(([px, py, pz]) => {
        const ry = py * cx - pz * sx, rz = py * sx + pz * cx;
        const rx = px * cy + rz * sy, depth = -px * sy + rz * cy;
        const perspective = 4.8 / (4.8 + depth);
        return [width / 2 + rx * scale * perspective, height / 2 + ry * scale * perspective, depth];
      }));
      const accent = Math.floor(t * 4) % rings.length;
      for (const i of points.map((_, i) => i).sort((a, b) => points[b][0][2] - points[a][0][2])) {
        const ring = points[i];
        ctx.beginPath(); ring.forEach(([px, py], j) => j ? ctx.lineTo(px, py) : ctx.moveTo(px, py)); ctx.closePath();
        const alpha = .14 + Math.max(0, 1 - (ring[0][2] + 1.5) / 3) * .36;
        ctx.strokeStyle = i === accent || i === (accent + 1) % rings.length ? 'rgba(234,88,12,.85)' : `rgba(24,24,27,${alpha})`;
        ctx.lineWidth = .65; ctx.stroke();
      }
      for (let j = 0; j < 12; j += 2) {
        ctx.beginPath(); points.forEach((ring, i) => i ? ctx.lineTo(ring[j][0], ring[j][1]) : ctx.moveTo(ring[j][0], ring[j][1]));ctx.closePath();
        ctx.strokeStyle = 'rgba(24,24,27,.13)';ctx.lineWidth = .5;ctx.stroke();
      }
    }
    function tick(time: number) {
      if (!visible || document.hidden || motion.matches) { frame = 0; return; }
      if (time - last >= 1000 / 30) { draw(time); last = time; }
      frame = requestAnimationFrame(tick);
    }
    function sync() {
      cancelAnimationFrame(frame); frame = 0;
      if (visible && !document.hidden && !motion.matches) frame = requestAnimationFrame(tick);
      else draw(0);
    }
    const resize = new ResizeObserver(() => {
      const bounds = element.getBoundingClientRect(), ratio = Math.min(devicePixelRatio || 1, 2);
      width = bounds.width; height = bounds.height;
      element.width = Math.round(width * ratio); element.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0); draw(0); sync();
    });
    resize.observe(element);
    const view = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });view.observe(element);
    const move = (event: PointerEvent) => { const bounds = element.getBoundingClientRect(); pointerX = (event.clientX - bounds.left) / bounds.width - .5; pointerY = (event.clientY - bounds.top) / bounds.height - .5; };
    const leave = () => { pointerX = pointerY = 0; };
    element.addEventListener('pointermove', move); element.addEventListener('pointerleave', leave);
    document.addEventListener('visibilitychange', sync);motion.addEventListener('change', sync);
    return () => { cancelAnimationFrame(frame);resize.disconnect();view.disconnect();element.removeEventListener('pointermove', move);element.removeEventListener('pointerleave', leave);document.removeEventListener('visibilitychange', sync);motion.removeEventListener('change', sync); };
  }, [variant]);
  return <div className="journal-sculpture" data-art={variant} aria-hidden="true"><canvas ref={canvas} /><span className="sculpture-tick top-left" /><span className="sculpture-tick bottom-right" /></div>;
}
