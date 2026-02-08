'use client';

import { useEffect, useState } from 'react';

const steps = [
  { title: 'write_patch', desc: 'Generate targeted code patch from runtime trace.' },
  { title: 'run_tests', desc: 'Run unit + integration suites on updated branch.' },
  { title: 'gen_tests', desc: 'Create missing tests for uncovered execution paths.' },
  { title: 'parallelize', desc: 'Shard test matrix across workers and environments.' },
  { title: 'stress', desc: 'Execute soak/load validation before shipping.' },
];

export default function AgentLoop() {
  const [activeStep, setActiveStep] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
      setTick((prev) => prev + 1);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full border border-grid bg-white/75 rounded-sm p-4 md:p-5">
      <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-4">
        <aside className="border border-grid bg-white/80 rounded-sm p-3">
          <div className="text-[11px] font-mono uppercase tracking-widest text-ink-light mb-3">Loop Steps</div>
          <div className="space-y-2">
            {steps.map((step, index) => {
              const active = index === activeStep;
              const done = index < activeStep;
              return (
                <div key={step.title} className={`border rounded-sm p-2.5 ${active ? 'border-accent bg-accent/5' : 'border-grid bg-white/70'}`}>
                  <div className="flex items-start gap-2">
                    <div className={`h-5 w-5 shrink-0 border rounded-sm text-[10px] font-mono flex items-center justify-center ${active ? 'border-accent text-accent' : done ? 'border-accent/40 text-accent/80' : 'border-ink-light text-ink-light'}`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-xs md:text-sm font-semibold text-ink leading-tight font-mono">{step.title}</div>
                      <div className="text-[11px] md:text-xs text-ink-light mt-1 leading-relaxed">{step.desc}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        <section className="border border-grid rounded-sm bg-[#0f0f10] text-slate-200 overflow-hidden">
          <div className="h-10 border-b border-white/10 px-3 flex items-center justify-between">
            <div className="text-sm font-mono text-accent tracking-wide">OSMOGREP</div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-white/60">runtime loop</div>
          </div>

          <div className="p-3 font-mono text-xs space-y-1.5 min-h-[270px]">
            <div className="text-green-400">$ osmogrep run --autoloop --parallel --stress</div>
            <pre className="text-[10px] leading-3 text-white/70 text-center py-2 border-y border-white/10 whitespace-pre">
{`  ___  ____  __  ___   ___  ____  ____  ____ 
 / _ \\/ ___|/  |/  /  / _ \\/ ___||  _ \\|  _ \\
| | | \\___ \\| /|_/|  | | | \\___ \\| |_) | |_) |
| |_| |___) | |   |  | |_| |___) |  _ <|  __/
 \\___/|____/|_|   |_|  \\___/|____/|_| \\_\\_|   `}
            </pre>
            <div className="text-white/75">[engine] initializing runtime graph...</div>
            <div className="text-accent">[step] {steps[activeStep].title}</div>
            <div className="text-white/65">[info] {steps[activeStep].desc}</div>
            <div className="text-white/65">[tests] unit {133 + (tick % 2)}/134 | integration {44 + (tick % 2)}/45</div>
            <div className="text-white/65">[parallel] workers=8 queue={Math.max(0, 5 - (tick % 6))}</div>
            <div className="text-white/65">[stress] p95={74 + (tick % 7)}ms errors=0.{tick % 3}%</div>

            <div className="pt-2 space-y-1.5">
              {steps.map((_, idx) => (
                <div key={idx} className="h-1.5 bg-white/10 rounded-sm overflow-hidden">
                  <div className={`h-full transition-all duration-500 ${idx < activeStep ? 'w-full bg-accent/75' : idx === activeStep ? 'w-2/3 bg-accent' : 'w-0 bg-accent/60'}`} />
                </div>
              ))}
            </div>

            <div className="text-green-400 pt-1">_</div>
          </div>
        </section>
      </div>
    </div>
  );
}
