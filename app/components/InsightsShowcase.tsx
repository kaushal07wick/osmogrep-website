export default function InsightsShowcase() {
  return (
    <section className="w-full py-24 border-y border-grid/45 bg-white/20">
      <div className="container mx-auto max-w-[1200px] px-6">
        <div className="border border-grid bg-white/58 p-7 md:p-8 grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-6 items-center">
          <div className="border border-grid bg-white/80 overflow-hidden">
            <div className="px-4 py-2 text-[11px] uppercase tracking-[0.18em] border-b border-grid text-accent font-bold">
              index://graph-build
            </div>
            <div className="relative p-4 h-[238px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(234,88,12,0.14)_1px,transparent_0)] bg-[size:12px_12px]" />
              <div className="relative h-full border border-grid bg-white/75 overflow-hidden">
                <svg viewBox="0 0 340 210" className="absolute inset-0 w-full h-full" fill="none" aria-hidden="true">
                  <defs>
                    <path id="idx-1" d="M170 104L84 58" />
                    <path id="idx-2" d="M170 104L250 60" />
                    <path id="idx-3" d="M170 104L84 152" />
                    <path id="idx-4" d="M170 104L250 152" />
                    <path id="idx-5" d="M84 58L64 24" />
                    <path id="idx-6" d="M250 60L278 28" />
                    <path id="idx-7" d="M84 152L56 184" />
                    <path id="idx-8" d="M250 152L278 184" />
                  </defs>
                  <circle cx="170" cy="104" r="38" stroke="#EA580C" strokeOpacity="0.28" strokeWidth="1.4" className="index-scan-ring" />
                  <circle cx="170" cy="104" r="56" stroke="#EA580C" strokeOpacity="0.2" strokeWidth="1" className="index-scan-ring [animation-delay:380ms]" />
                  <g stroke="#EA580C" strokeOpacity="0.26" strokeWidth="1.2">
                    <use href="#idx-1" />
                    <use href="#idx-2" />
                    <use href="#idx-3" />
                    <use href="#idx-4" />
                    <use href="#idx-5" />
                    <use href="#idx-6" />
                    <use href="#idx-7" />
                    <use href="#idx-8" />
                  </g>
                  <g stroke="#EA580C" strokeOpacity="0.75" strokeWidth="1.8">
                    <use href="#idx-1" className="index-edge-flow" />
                    <use href="#idx-2" className="index-edge-flow [animation-delay:120ms]" />
                    <use href="#idx-3" className="index-edge-flow [animation-delay:240ms]" />
                    <use href="#idx-4" className="index-edge-flow [animation-delay:360ms]" />
                    <use href="#idx-5" className="index-edge-flow [animation-delay:480ms]" />
                    <use href="#idx-6" className="index-edge-flow [animation-delay:600ms]" />
                    <use href="#idx-7" className="index-edge-flow [animation-delay:720ms]" />
                    <use href="#idx-8" className="index-edge-flow [animation-delay:840ms]" />
                  </g>
                  <g>
                    <circle cx="170" cy="104" r="6.2" fill="#EA580C" className="index-node-breathe" />
                    <circle cx="84" cy="58" r="4.4" fill="#EA580C" className="index-node-breathe [animation-delay:120ms]" />
                    <circle cx="250" cy="60" r="4.4" fill="#EA580C" className="index-node-breathe [animation-delay:220ms]" />
                    <circle cx="84" cy="152" r="4.4" fill="#EA580C" className="index-node-breathe [animation-delay:320ms]" />
                    <circle cx="250" cy="152" r="4.4" fill="#EA580C" className="index-node-breathe [animation-delay:420ms]" />
                    <rect x="55" y="20" width="17" height="7" fill="#EA580C" className="index-node-breathe [animation-delay:520ms]" />
                    <rect x="270" y="24" width="17" height="7" fill="#EA580C" className="index-node-breathe [animation-delay:620ms]" />
                    <rect x="47" y="180" width="17" height="7" fill="#EA580C" className="index-node-breathe [animation-delay:720ms]" />
                    <rect x="270" y="180" width="17" height="7" fill="#EA580C" className="index-node-breathe [animation-delay:820ms]" />
                  </g>
                  <g fill="#EA580C">
                    <circle r="2.5" className="index-packet">
                      <animateMotion dur="3.6s" repeatCount="indefinite" rotate="auto">
                        <mpath href="#idx-1" />
                      </animateMotion>
                    </circle>
                    <circle r="2.5" className="index-packet" opacity="0.85">
                      <animateMotion dur="3.2s" begin="0.5s" repeatCount="indefinite" rotate="auto">
                        <mpath href="#idx-2" />
                      </animateMotion>
                    </circle>
                    <circle r="2.5" className="index-packet" opacity="0.8">
                      <animateMotion dur="3.9s" begin="0.9s" repeatCount="indefinite" rotate="auto">
                        <mpath href="#idx-7" />
                      </animateMotion>
                    </circle>
                    <circle r="2.5" className="index-packet" opacity="0.9">
                      <animateMotion dur="3.4s" begin="1.2s" repeatCount="indefinite" rotate="auto">
                        <mpath href="#idx-6" />
                      </animateMotion>
                    </circle>
                  </g>
                </svg>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-accent font-bold">First Launch Indexing</p>
            <h3 className="mt-2 text-2xl md:text-4xl leading-[1.02] font-bold text-ink">
              Osmogrep builds repository context before any edit loop starts.
            </h3>
            <p className="mt-3 text-base text-ink-light max-w-[48ch]">
              On first run, Osmogrep scans your workspace and builds a relation graph for files, symbols, imports,
              and call paths. That context is cached and reused so patch generation and test execution stay grounded
              in real dependencies instead of guesswork.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="text-xs border border-accent/35 bg-accent/8 text-accent px-2.5 py-1">symbols</span>
              <span className="text-xs border border-accent/35 bg-accent/8 text-accent px-2.5 py-1">imports</span>
              <span className="text-xs border border-accent/35 bg-accent/8 text-accent px-2.5 py-1">call paths</span>
              <span className="text-xs border border-accent/35 bg-accent/8 text-accent px-2.5 py-1">.context.json</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
