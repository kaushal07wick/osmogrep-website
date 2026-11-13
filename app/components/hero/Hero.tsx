import type { CSSProperties, ReactNode } from 'react';
import WoodpeckerHero from './WoodpeckerHero';
import CatchingTicker from './CatchingTicker';
import CopyInstall from './CopyInstall';
import ScrollDepth from '../motion/ScrollDepth';
import './hero.css';

/* Headline words rise from behind a mask one after another; matched words then get an
   orange grep-style highlight that wipes in. All CSS (hero-rise / hero-hit in globals.css). */
const delay = (s: number) => ({ animationDelay: `${s}s` }) as CSSProperties;

function Word({ children, at, hit }: { children: ReactNode; at: number; hit?: number }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
      <span className="hero-rise relative inline-block" style={delay(at)}>
        {hit !== undefined && <span className="hero-hit absolute inset-x-[-0.08em] inset-y-[0.1em] bg-accent" style={delay(hit)} aria-hidden="true" />}
        <span className={`relative ${hit !== undefined ? 'hero-hit-text' : ''}`} style={hit !== undefined ? delay(hit + 0.15) : undefined}>
          {children}
        </span>
      </span>
    </span>
  );
}

export default function Hero() {
  return (
    <section className="home-hero relative w-full overflow-hidden pb-6 pt-10 md:pb-8 md:pt-14">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-12 px-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="relative z-10">
          <CatchingTicker />
          <h1 className="mt-6 text-5xl font-bold leading-[1.1] tracking-tight text-ink md:text-6xl" aria-label="Catch the bug. Ship the fix.">
            <span aria-hidden="true">
              <Word at={0.1}>Catch</Word> <Word at={0.2}>the</Word> <Word at={0.3} hit={1.0}>bug.</Word>
              <br />
              <Word at={0.45}>Ship</Word> <Word at={0.55}>the</Word> <Word at={0.65} hit={1.35}>fix.</Word>
            </span>
          </h1>
          <p className="hero-fade mt-6 max-w-md text-lg text-ink-light" style={delay(0.9)}>
            Osmogrep runs your code, reproduces the failure, and patches the source, with your own tests as proof.
          </p>
          <div className="hero-fade mt-8" style={delay(1.1)}>
            <CopyInstall />
          </div>
        </div>
        <ScrollDepth travel={240}><WoodpeckerHero /></ScrollDepth>
      </div>
    </section>
  );
}
