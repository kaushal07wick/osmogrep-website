'use client';

import { useState } from 'react';
import Bug from '../../bug/Bug';
import Reveal from '../../motion/Reveal';
import { stagger } from '../../motion/stagger';
import { PixelIcon, SPECIMENS, type Specimen } from './specimens';

/* A field guide to runtime bugs, laid out like an entomology display case. Each card shows the
   bug happening (a small looping demo); hover, focus or tap lifts the pinned bug off the board
   and flips the tag to the fix. Specimen data and demos live in specimens.tsx. */

function DangerMeter({ level }: { level: number }) {
  return (
    <span className="flex items-center gap-[3px]" aria-label={`danger ${level} of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`h-2.5 w-1.5 ${i < level ? (level >= 5 ? 'bg-fail' : 'bg-accent') : 'bg-grid'}`} />
      ))}
    </span>
  );
}

function Card({ s, i }: { s: Specimen; i: number }) {
  const [open, setOpen] = useState(false);
  const tilt = ((i * 37) % 21) - 10; // a different pin angle per specimen
  return (
    <button
      type="button"
      data-stagger
      style={stagger(i)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
      aria-expanded={open}
      className={`group relative flex min-w-0 flex-col border border-dashed bg-surface p-5 text-left transition-[border-color,transform,box-shadow] duration-300 ${open ? '-translate-y-1 border-accent shadow-[0_18px_40px_-24px_rgba(0,0,0,.35)]' : 'border-grid'}`}
    >
      {/* header: number, icon, danger */}
      <span className="flex items-center gap-2.5">
        <span className="font-mono text-[10px] text-ink-light">no. {String(i + 1).padStart(3, '0')}</span>
        <span className={`flex h-7 w-7 items-center justify-center border transition-colors ${open ? 'border-accent text-accent' : 'border-grid text-ink'}`}>
          <PixelIcon name={s.icon} className="h-4 w-4" />
        </span>
        <span className="ml-auto flex items-center gap-2 font-mono text-[10px] text-ink-light">
          danger <DangerMeter level={s.danger} />
        </span>
      </span>

      {/* the pinned specimen; lifts and panics when opened */}
      <span className="relative my-4 flex h-16 items-center justify-center">
        <span className="relative z-10 transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)]" style={{ transform: open ? 'translateY(-8px) rotate(0deg) scale(1.1)' : `rotate(${tilt}deg)` }}>
          <Bug mood={open ? 'scared' : 'walk'} className="h-10 w-14 text-ink" />
        </span>
        <span className={`absolute left-1/2 top-1/2 z-20 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink transition-opacity duration-300 ${open ? 'opacity-0' : ''}`} aria-hidden="true" />
        <span className="absolute left-1/2 top-1/2 h-2 w-12 -translate-x-1/2 rounded-full bg-ink/10 blur-[3px] transition-transform duration-500" style={{ transform: `translate(-50%, ${open ? 28 : 22}px) scaleX(${open ? 0.75 : 1})` }} aria-hidden="true" />
        <span className={`absolute right-0 top-0 bg-ink px-1.5 py-0.5 font-mono text-[10px] text-white transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}>caught</span>
      </span>

      {/* the bug in action */}
      <s.Demo />

      {/* the tag */}
      <span className="mt-4 border-t border-dashed border-grid pt-3">
        <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <span className="font-inter text-[15px] italic text-ink">{s.latin}</span>
          <span className="whitespace-nowrap font-mono text-[10px] text-ink-light">missed by {s.missedBy}</span>
        </span>
        <span className="mt-0.5 block font-mono text-[11px] text-accent">{s.name}</span>
        <span className="relative mt-3 block h-10 overflow-hidden font-mono text-[12px]">
          <span className={`absolute inset-0 transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)] ${open ? '-translate-y-full' : ''}`}>
            <span className="block text-ink-light">habitat: {s.habitat}</span>
            <span className="block truncate text-ink">{s.before}</span>
          </span>
          <span className={`absolute inset-0 transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)] ${open ? '' : 'translate-y-full'}`}>
            <span className="block text-pass">✓ osmogrep fix</span>
            <span className="block truncate text-ink">{s.after}</span>
          </span>
        </span>
      </span>
    </button>
  );
}

export default function FieldGuide() {
  return (
    <section className="zone zone-pinstripe w-full py-24 md:py-32">
      <div className="mx-auto max-w-[1280px] px-6">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p data-stagger style={stagger(0)} className="font-mono text-[12px] text-accent">field guide</p>
            <h2 data-stagger style={stagger(1)} className="mt-3 text-4xl font-bold leading-tight tracking-tight text-ink md:text-5xl">
              Runtime bugs, identified.
            </h2>
          </div>
          <p data-stagger style={stagger(2)} className="max-w-sm text-ink-light">
            Nine species that ship past code review, from AI agents and new engineers alike. Hover one to see the fix.
          </p>
        </Reveal>
        <Reveal className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SPECIMENS.map((s, i) => (
            <Card key={s.name} s={s} i={i} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
