'use client';

import { useEffect, useState } from 'react';
import { JetBrains_Mono } from 'next/font/google';

const mono = JetBrains_Mono({ subsets: ['latin'] });

const logSequence = [
  '[watch] auth.ts changed',
  '[analyze] runtime trace graph updated',
  '[risk] sql_injection_vector score=0.82',
  '[patch] generated safe query parameterization',
  '[verify] unit=134/134 integration=45/45',
  '[status] patch accepted and staged',
];

export default function TerminalDemo() {
  const [lineCount, setLineCount] = useState(2);

  useEffect(() => {
    const timer = setInterval(() => {
      setLineCount((prev) => (prev >= logSequence.length ? 2 : prev + 1));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  const visible = logSequence.slice(0, lineCount);

  return (
    <div className={`w-full max-w-3xl mx-auto border border-[#2d2d30] bg-[#0f0f10] shadow-2xl shadow-black/40 ${mono.className}`}>
      <div className="h-10 border-b border-[#222327] px-4 flex items-center justify-between">
        <div className="text-sm tracking-wide text-accent font-mono">OSMOGREP</div>
        <div className="text-[10px] uppercase tracking-widest text-slate-500">runtime monitor</div>
      </div>

      <div className="p-4 min-h-[340px] text-xs md:text-sm font-mono text-slate-300 space-y-1.5">
        <div className="text-green-400">$ osmogrep watch --project ./backend --fix</div>
        <div className="text-slate-500">[engine] runtime hooks initialized</div>
        {visible.map((line) => (
          <div
            key={line}
            className={
              line.startsWith('[risk]')
                ? 'text-yellow-300'
                : line.startsWith('[patch]') || line.startsWith('[status]')
                  ? 'text-accent'
                  : 'text-slate-300'
            }
          >
            {line}
          </div>
        ))}
        <div className="text-green-400">_</div>
      </div>
    </div>
  );
}
