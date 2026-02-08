import Link from 'next/link';

export default function Hero() {
  const statusItems = [
    ['[agent]', 'patch candidate generated'],
    ['[runner]', 'parallel tests: 124/124 passed'],
    ['[stress]', 'no regressions'],
  ];

  return (
    <section className="relative overflow-hidden py-14 md:py-24">
      <svg className="pointer-events-none absolute -left-10 top-0 -z-10 h-[440px] w-[440px] opacity-25" viewBox="0 0 440 440" fill="none" aria-hidden="true">
        <circle cx="220" cy="220" r="180" fill="url(#hero-fade)" className="float-y" />
        <defs>
          <radialGradient id="hero-fade">
            <stop offset="0%" stopColor="#EA580C" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      <div className="container relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="grid items-center gap-7 lg:grid-cols-12 lg:gap-8">
          <div className="animate-slide-up lg:col-span-5" style={{ animationDelay: '100ms' }}>
            <div className="page-chip">Live Runtime Agent</div>
            <h1 className="hero-title-fade text-[2.6rem] font-bold leading-[0.98] tracking-tight text-accent sm:text-5xl md:text-7xl">
              Build.
              <br />
              Break.
              <br />
              Fix.
            </h1>

            <p className="hero-sub-fade mt-4 max-w-xl text-base leading-relaxed text-ink-light md:text-lg">
              Talk to Osmogrep, inspect your repo, patch risky paths, run tests, and ship with verification in one flow.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-sm border border-grid bg-white/75 p-4">
                <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-ink-light">Session Mode</div>
                <div className="text-sm text-accent">Interactive + Streaming</div>
              </div>
              <div className="rounded-sm border border-grid bg-white/75 p-4">
                <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-ink-light">Command Modes</div>
                <div className="text-sm text-accent">Chat • !Shell • / Control</div>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/get-started" className="btn-primary w-full px-8 py-3.5 font-medium sm:w-auto">
                Get Started
              </Link>
              <Link href="/docs" className="btn-outline w-full px-8 py-3.5 font-medium sm:w-auto">
                Read the Docs
              </Link>
            </div>
            <p className="mt-4 text-sm tracking-wide text-ink-light">No credit card required • Free local install</p>
          </div>

          <div className="animate-slide-up lg:col-span-7" style={{ animationDelay: '200ms' }}>
            <div className="mb-3 overflow-hidden rounded-sm border border-grid/70 bg-white/65 px-3 py-2">
              <div className="ticker-track flex w-max items-center gap-5 whitespace-nowrap text-[11px] text-ink-light">
                {[...statusItems, ...statusItems].map(([tag, text], idx) => (
                  <div key={`${tag}-${idx}`} className="inline-flex items-center gap-2">
                    <span className={tag === '[agent]' ? 'font-bold text-accent' : 'text-slate-500'}>{tag}</span>
                    <span className="text-ink">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-grid bg-[#13151b] shadow-2xl">
              <div className="flex h-11 items-center justify-between border-b border-[#2d2d30] bg-[#22242b] px-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  <span className="ml-2 text-xs text-slate-300">agent://osmogrep-runtime</span>
                </div>
                <span className="text-xs text-slate-500">runtime monitor</span>
              </div>

              <div className="grid min-h-[300px] grid-cols-1 border-t border-[#1d1f25] md:min-h-[360px] md:grid-cols-[190px_1fr]">
                <div className="hidden border-r border-[#2d2d30] bg-[#1b1d24] p-3 text-xs text-slate-400 md:block">
                  <div className="mb-3 text-[10px] uppercase tracking-widest text-slate-500">Explorer</div>
                  <div className="space-y-1">
                    <div className="text-slate-300">src/</div>
                    <div className="pl-3 text-accent">auth_service.ts</div>
                    <div className="pl-3">middleware.ts</div>
                    <div className="pl-3">types.d.ts</div>
                  </div>
                </div>

                <div className="space-y-2 p-4 text-sm text-slate-100 sm:p-5 sm:text-base md:text-lg">
                  <p className="break-all"><span className="text-green-400">$</span> osmogrep watch --project ./backend --fix</p>
                  <p className="text-slate-400">[engine] runtime hooks initialized</p>
                  <p>[watch] auth.ts changed</p>
                  <p>[analyze] runtime trace graph updated</p>
                  <p className="text-yellow-300">[risk] sql_injection_vector score=0.82</p>
                  <p className="pt-3 text-green-400 blink-caret">_</p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-sm border border-grid bg-white/80 p-3 transition-colors hover:border-accent/50">
                <div className="mb-1 text-[9px] font-bold uppercase tracking-widest text-ink-light">Avg Patch Loop</div>
                <div className="text-lg font-bold text-accent">18s</div>
              </div>
              <div className="rounded-sm border border-grid bg-white/80 p-3 transition-colors hover:border-accent/50">
                <div className="mb-1 text-[9px] font-bold uppercase tracking-widest text-ink-light">Parallel Jobs</div>
                <div className="text-lg font-bold text-accent">32</div>
              </div>
              <div className="rounded-sm border border-grid bg-white/80 p-3 transition-colors hover:border-accent/50">
                <div className="mb-1 text-[9px] font-bold uppercase tracking-widest text-ink-light">Session Visibility</div>
                <div className="text-lg font-bold text-accent">100%</div>
              </div>
              <div className="rounded-sm border border-grid bg-white/80 p-3 transition-colors hover:border-accent/50">
                <div className="mb-1 text-[9px] font-bold uppercase tracking-widest text-ink-light">Command Latency</div>
                <div className="text-lg font-bold text-accent">{'<100ms'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
