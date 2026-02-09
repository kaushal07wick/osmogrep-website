import Link from 'next/link';

export default function Hero() {
  const statusItems = [
    ['[agent]', 'patch candidate generated'],
    ['[runner]', 'parallel tests: 124/124 passed'],
    ['[stress]', 'no regressions'],
  ];

  return (
    <section className="relative overflow-hidden py-8 sm:py-12 md:py-24">
      <svg
        className="pointer-events-none absolute -left-20 top-0 -z-10 h-[320px] w-[320px] opacity-18 sm:-left-10 sm:h-[440px] sm:w-[440px] sm:opacity-25"
        viewBox="0 0 440 440"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="220" cy="220" r="180" fill="url(#hero-fade)" className="float-y" />
        <defs>
          <radialGradient id="hero-fade">
            <stop offset="0%" stopColor="#EA580C" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      <div className="container relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="grid grid-cols-1 items-start gap-6 sm:gap-7 md:grid-cols-2 lg:gap-8">
          <div className="animate-slide-up md:pr-2" style={{ animationDelay: '100ms' }}>
            <div className="page-chip">Live Runtime Agent</div>
            <h1 className="hero-title-fade text-[2rem] font-bold leading-[0.98] tracking-tight text-accent sm:text-5xl md:text-6xl lg:text-7xl">
              Build.
              <br />
              Break.
              <br />
              Fix.
            </h1>

            <p className="hero-sub-fade mt-3 max-w-xl text-sm leading-relaxed text-ink-light sm:mt-4 sm:text-base md:text-lg">
              Talk to Osmogrep, inspect your repo, patch risky paths, run tests, and ship with verification in one flow.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 md:gap-3">
              <div className="rounded-sm border border-grid bg-white p-3 md:bg-white/75 md:p-4">
                <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-ink-light">Session Mode</div>
                <div className="text-xs text-accent md:text-sm">Interactive + Streaming</div>
              </div>
              <div className="rounded-sm border border-grid bg-white p-3 md:bg-white/75 md:p-4">
                <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-ink-light">Command Modes</div>
                <div className="text-xs text-accent md:text-sm">Chat • !Shell • / Control</div>
              </div>
            </div>

            <div className="mt-5 hidden gap-3 md:flex md:flex-row md:items-center">
              <Link href="/get-started" className="btn-primary w-auto px-6 py-2.5 text-sm font-medium md:px-8 md:py-3.5 md:text-base">
                Get Started
              </Link>
              <Link href="/docs" className="btn-outline w-auto px-6 py-2.5 text-sm font-medium md:px-8 md:py-3.5 md:text-base">
                Read the Docs
              </Link>
            </div>
            <p className="mt-3 text-xs tracking-wide text-ink-light md:mt-4 md:text-sm">No credit card required • Free local install</p>
          </div>

          <div className="animate-slide-up w-full md:justify-self-end md:max-w-[520px] lg:max-w-[560px]" style={{ animationDelay: '200ms' }}>
            <div className="overflow-hidden rounded-lg border border-grid bg-[#13151b] shadow-2xl">
              <div className="flex h-9 items-center justify-between border-b border-[#2d2d30] bg-[#22242b] px-3 sm:h-11 sm:px-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#ff5f57] sm:h-2.5 sm:w-2.5" />
                  <span className="h-2 w-2 rounded-full bg-[#febc2e] sm:h-2.5 sm:w-2.5" />
                  <span className="h-2 w-2 rounded-full bg-[#28c840] sm:h-2.5 sm:w-2.5" />
                  <span className="ml-1 text-[10px] text-slate-300 sm:ml-2 sm:text-xs">agent://osmogrep-runtime</span>
                </div>
                <span className="hidden text-xs text-slate-500 sm:inline">runtime monitor</span>
              </div>

              <div className="grid min-h-[150px] grid-cols-1 border-t border-[#1d1f25] sm:min-h-[220px] md:min-h-[260px] md:grid-cols-[150px_1fr] lg:min-h-[320px] lg:grid-cols-[190px_1fr]">
                <div className="hidden border-r border-[#2d2d30] bg-[#1b1d24] p-3 text-xs text-slate-400 md:block">
                  <div className="mb-3 text-[10px] uppercase tracking-widest text-slate-500">Explorer</div>
                  <div className="space-y-1">
                    <div className="text-slate-300">src/</div>
                    <div className="pl-3 text-accent">auth_service.ts</div>
                    <div className="pl-3">middleware.ts</div>
                    <div className="pl-3">types.d.ts</div>
                  </div>
                </div>

                <div className="space-y-1.5 p-3 text-[10px] text-slate-100 sm:p-4 sm:text-sm md:text-[13px] lg:p-5 lg:text-base">
                  <p className="break-all"><span className="text-green-400">$</span> osmogrep watch --project ./backend --fix</p>
                  <p className="text-slate-400">[engine] runtime hooks initialized</p>
                  <p>[watch] auth.ts changed</p>
                  <p>[analyze] runtime trace graph updated</p>
                  <p className="text-yellow-300">[risk] sql_injection_vector score=0.82</p>
                  <p className="pt-2 text-green-400 blink-caret">_</p>
                </div>
              </div>
            </div>

            <div className="mt-2 overflow-hidden rounded-sm border border-grid/70 bg-white/75 px-2 py-1 md:px-2.5 md:py-1.5">
              <div className="ticker-track flex w-max items-center gap-2 whitespace-nowrap text-[9px] text-ink-light md:gap-3 md:text-[10px]">
                {[...statusItems, ...statusItems].map(([tag, text], idx) => (
                  <div key={`${tag}-${idx}`} className="inline-flex items-center gap-1">
                    <span className={tag === '[agent]' ? 'font-bold text-accent' : 'text-slate-500'}>{tag}</span>
                    <span className="text-ink">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-2 lg:grid-cols-4">
              <div className="hidden rounded-sm border border-grid bg-white p-2 transition-colors hover:border-accent/50 md:block md:bg-white/80 md:p-2.5">
                <div className="mb-1 text-[9px] font-bold uppercase tracking-widest text-ink-light">Avg Patch Loop</div>
                <div className="text-xs font-bold text-accent md:text-base">18s</div>
              </div>
              <div className="rounded-sm border border-grid bg-white p-2 transition-colors hover:border-accent/50 md:bg-white/80 md:p-2.5">
                <div className="mb-1 text-[9px] font-bold uppercase tracking-widest text-ink-light">Parallel Jobs</div>
                <div className="text-xs font-bold text-accent md:text-base">32</div>
              </div>
              <div className="hidden rounded-sm border border-grid bg-white p-2 transition-colors hover:border-accent/50 md:block md:bg-white/80 md:p-2.5">
                <div className="mb-1 text-[9px] font-bold uppercase tracking-widest text-ink-light">Session Visibility</div>
                <div className="text-xs font-bold text-accent md:text-base">100%</div>
              </div>
              <div className="rounded-sm border border-grid bg-white p-2 transition-colors hover:border-accent/50 md:bg-white/80 md:p-2.5">
                <div className="mb-1 text-[9px] font-bold uppercase tracking-widest text-ink-light">Command Latency</div>
                <div className="text-xs font-bold text-accent md:text-base">{'<100ms'}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 md:hidden">
          <Link href="/get-started" className="btn-primary w-full px-3 py-2 text-xs font-medium">
            Get Started
          </Link>
          <Link href="/docs" className="btn-outline w-full px-3 py-2 text-xs font-medium">
            Read the Docs
          </Link>
        </div>
      </div>
    </section>
  );
}
