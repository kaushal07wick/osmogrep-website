'use client';

import { useEffect, useState } from 'react';
import Bug, { type Mood } from '../bug/Bug';

const SCENES: { message: string; mood: Mood; motion: string }[] = [
  { message: 'just one tiny change…', mood: 'curious', motion: 'peek' },
  { message: 'it worked on my machine.', mood: 'walk', motion: 'scuttle' },
  { message: 'wait. that’s undefined.', mood: 'scared', motion: 'hop' },
  { message: 'nobody saw that retry.', mood: 'walk', motion: 'scuttle' },
  { message: 'I can explain the deadlock.', mood: 'curious', motion: 'peek' },
  { message: 'okay. you caught me.', mood: 'caught', motion: 'wobble' },
  { message: 'fine. keep the tests.', mood: 'happy', motion: 'bounce' },
];

export default function CatchingTicker() {
  const [index, setIndex] = useState(0);
  const [startled, setStartled] = useState(false);
  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const timer = setInterval(() => { if (!document.hidden && !motion.matches) setIndex(value => (value + 1) % SCENES.length); }, 3600);
    return () => clearInterval(timer);
  }, []);
  const scene = SCENES[index];
  return <div className="hero-ticker hero-fade" aria-hidden="true" data-mood={startled ? 'scared' : scene.mood}>
    <span className="hero-ticker-bug" onPointerEnter={() => setStartled(true)} onPointerLeave={() => setStartled(false)}>
      <span key={`${index}-${startled}`} className="hero-ticker-body" data-motion={startled ? 'hop' : scene.motion}><Bug mood={startled ? 'scared' : scene.mood} className="h-7 w-10 text-ink" /></span>
    </span>
    <span key={`${index}-${startled}`} className="hero-ticker-message" data-kind={!startled && scene.mood === 'curious' ? 'thought' : 'speech'}><span>{startled ? 'hey. personal space.' : scene.message}</span></span>
  </div>;
}
