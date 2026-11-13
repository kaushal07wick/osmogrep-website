'use client';

import { useEffect, useRef, useState } from 'react';
import Bug, { type Mood } from '../bug/Bug';

export default function AboutHero() {
  const lane = useRef<HTMLDivElement>(null);
  const [mood, setMood] = useState<Mood>('walk');
  useEffect(() => {
    const element = lane.current!;
    const runner = element.querySelector('.about-walk-runner')!;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = true;
    const update = () => {
      element.dataset.paused = String(!visible || document.hidden);
      if (motion.matches) return setMood('caught');
      if (!visible || document.hidden) return;
      const time = Number(runner.getAnimations()[0]?.currentTime || 0) % 9450;
      setMood(time >= 7000 ? 'caught' : time > 5950 ? 'scared' : 'walk');
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    observer.observe(element);
    update();
    const timer = setInterval(update, 200);
    document.addEventListener('visibilitychange', update);
    motion.addEventListener('change', update);
    return () => { clearInterval(timer); observer.disconnect(); document.removeEventListener('visibilitychange', update); motion.removeEventListener('change', update); };
  }, []);
  const caught = mood === 'caught';
  return <section className="about-original-hero zone zone-engraved w-full pb-16 pt-20 md:pt-28">
    <div className="mx-auto max-w-[1280px] px-6">
      <h1 className="max-w-5xl text-5xl font-bold leading-[1.05] tracking-tight text-ink md:text-7xl">Code compiles. Tests pass. <span className="bg-accent px-2 text-white">Prod</span> still breaks.</h1>
      <p className="hero-fade mt-8 max-w-2xl text-lg leading-relaxed text-ink-light" style={{ animationDelay: '0.2s' }}>Osmogrep exists for the gap between “it works on my machine” and what happens at runtime. Inspect the change, reproduce a concrete failure, and review a proposed fix with its evidence.</p>
      <div ref={lane} className="about-walk-lane relative mt-14 h-14" data-mood={mood} aria-hidden="true">
        <div className="absolute inset-x-0 bottom-2 h-px bg-grid" />
        <div className="about-walk-trail absolute bottom-2 left-0 h-px w-full bg-accent" />
        <div className="about-walk-runner"><div className="relative w-10"><Bug mood={mood} className="h-7 w-10 text-ink" />{caught && <span className="reticle-lock absolute -inset-1">{['left-0 top-0 border-l-2 border-t-2', 'right-0 top-0 border-r-2 border-t-2', 'bottom-0 left-0 border-b-2 border-l-2', 'bottom-0 right-0 border-b-2 border-r-2'].map(corner => <span key={corner} className={`absolute h-2 w-2 border-accent ${corner}`} />)}</span>}</div></div>
        <span className={`absolute bottom-8 right-0 font-mono text-[11px] text-accent transition-opacity ${caught ? 'opacity-100' : 'opacity-0'}`}>reproduce first</span>
      </div>
    </div>
  </section>;
}
