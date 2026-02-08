import Link from 'next/link';
import WebShellPreview from './WebShellPreview';

export default function Hero() {
  return (
    <section className="relative pt-16 pb-10 overflow-hidden">
      <div className="container mx-auto max-w-[1200px] px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-6 items-start lg:items-end">
          <div className="lg:col-span-5 relative rounded-sm lg:pt-14 flex flex-col justify-end lg:min-h-[440px]">
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="absolute -left-10 top-0 h-[180px] w-[120%] opacity-25"
                style={{
                  background:
                    'repeating-linear-gradient(98deg, rgba(234,88,12,0.14) 0px, rgba(234,88,12,0.14) 1px, transparent 1px, transparent 220px)',
                }}
              />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-accent font-mono animate-slide-up opacity-0 delay-100">
              Osmogrep
            </h1>

            <div className="mt-3 h-16 md:h-20 overflow-hidden border border-grid bg-white/70 rounded-sm">
              <div className="word-rotator">
                {['Inspect.', 'Patch.', 'Test.', 'Stress.'].map((word) => (
                  <div key={word} className="h-16 md:h-20 px-4 flex items-center text-3xl md:text-5xl font-bold text-ink">
                    {word}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-sm text-ink-light font-mono tracking-wide mb-8 animate-slide-up opacity-0 delay-300">
              For engineering teams shipping production code every day.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4 animate-slide-up opacity-0 delay-300">
              <Link href="/get-started" className="btn-primary px-8 py-3.5 font-medium">
                Get Started
              </Link>
              <Link href="/docs" className="btn-outline px-8 py-3.5 font-medium">
                Read the Docs
              </Link>
            </div>
            <p className="mt-4 text-sm text-ink-light font-mono tracking-wide animate-slide-up opacity-0 delay-300">
              No credit card required • Free local install
            </p>
          </div>

          <div className="lg:col-span-7 animate-slide-up opacity-0 delay-200">
            <WebShellPreview />
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-paper pointer-events-none -z-10" />
    </section>
  );
}
