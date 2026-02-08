import Link from 'next/link';
import WebShellPreview from './WebShellPreview';

export default function Hero() {
  return (
    <section className="relative pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-16 -left-24 w-72 h-72 border border-accent/20 bg-accent/5 rotate-12 bob-soft" />
        <div className="absolute top-28 right-0 w-56 h-56 border border-grid bg-white/40 -rotate-12" />
        <div className="absolute inset-x-0 top-[62%] h-px bg-grid/70" />
      </div>

      <div className="container mx-auto max-w-[1200px] px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <div className="page-chip mb-5 animate-slide-up opacity-0 delay-100">
              Live Runtime Agent
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-accent text-balance font-mono animate-slide-up opacity-0 delay-100">
              Build.
              <br />
              Break.
              <br />
              Fix.
              <br />
              <span className="inline-flex items-center gap-2">
                Ship.
                <span className="h-10 w-px bg-accent blink-caret" />
              </span>
            </h1>

            <p className="text-lg md:text-xl text-ink-light max-w-xl mt-6 mb-8 leading-relaxed animate-slide-up opacity-0 delay-200">
              Talk to Osmogrep, watch it inspect your repo, patch risky paths, run tests, and report results in one interactive flow.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 animate-slide-up opacity-0 delay-300">
              <div className="border border-grid bg-white/70 p-3 rounded-sm">
                <p className="text-[10px] uppercase tracking-widest text-ink-light">Session Mode</p>
                <p className="text-sm font-semibold text-accent mt-1">Interactive + Streaming</p>
              </div>
              <div className="border border-grid bg-white/70 p-3 rounded-sm">
                <p className="text-[10px] uppercase tracking-widest text-ink-light">Command Modes</p>
                <p className="text-sm font-semibold text-accent mt-1">Chat • !Shell • /Control</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-4 animate-slide-up opacity-0 delay-300">
              <Link href="/get-started" className="btn-primary px-8 py-3.5 font-medium shadow-md transform hover:-translate-y-0.5 active:translate-y-0">
                Get Started
              </Link>
              <Link href="/docs" className="btn-outline px-8 py-3.5 font-medium shadow-sm">
                Read the Docs
              </Link>
            </div>
            <p className="mt-4 text-sm text-ink-light font-mono tracking-wide animate-slide-up opacity-0 delay-300">
              No credit card required • Free local install
            </p>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="border border-grid bg-white/65 rounded-sm overflow-hidden animate-slide-up opacity-0 delay-200">
              <div className="h-9 border-b border-grid flex items-center overflow-hidden whitespace-nowrap">
                <div className="ticker-track flex items-center min-w-[200%] text-xs text-ink-light">
                  <span className="px-4">[session] analyzing changed files</span>
                  <span className="px-4 text-accent wiggle-soft">[agent] patch candidate generated</span>
                  <span className="px-4">[runner] parallel tests: 124/124 passed</span>
                  <span className="px-4">[stress] no leaks detected after soak run</span>
                  <span className="px-4">[session] analyzing changed files</span>
                  <span className="px-4 text-accent wiggle-soft">[agent] patch candidate generated</span>
                  <span className="px-4">[runner] parallel tests: 124/124 passed</span>
                  <span className="px-4">[stress] no leaks detected after soak run</span>
                </div>
              </div>
              <div className="p-2 bg-paper/40">
                <div className="relative">
                  <div className="absolute top-3 left-3 z-10 border border-grid bg-white/90 px-2 py-1 text-[10px] text-ink-light rounded-sm">
                    agent://osmogrep-runtime
                  </div>
                  <div className="float-y">
                    <WebShellPreview />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { k: 'Avg patch loop', v: '18s' },
                { k: 'Parallel jobs', v: '32' },
                { k: 'Session visibility', v: '100%' },
                { k: 'Command latency', v: '<100ms' },
              ].map((item) => (
                <div key={item.k} className="border border-grid bg-white/65 rounded-sm p-3 bob-soft">
                  <p className="text-[10px] uppercase tracking-wider text-ink-light">{item.k}</p>
                  <p className="mt-1 text-sm font-semibold text-accent">{item.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-paper pointer-events-none -z-10" />
    </section>
  );
}
