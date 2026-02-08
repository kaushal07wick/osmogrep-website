import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-grid bg-white/40 backdrop-blur-sm mt-auto relative overflow-hidden">
      <div className="absolute inset-x-0 bottom-0 h-44 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1200 280" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="ogMountA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(234,88,12,0.22)" />
              <stop offset="100%" stopColor="rgba(234,88,12,0.06)" />
            </linearGradient>
            <linearGradient id="ogMountB" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(234,88,12,0.34)" />
              <stop offset="100%" stopColor="rgba(234,88,12,0.12)" />
            </linearGradient>
            <pattern id="ogNoise" width="120" height="120" patternUnits="userSpaceOnUse">
              <rect width="120" height="120" fill="transparent" />
              <path d="M18 30h2M44 72h2M80 42h2M102 92h2M30 100h2M62 18h2" stroke="rgba(24,24,27,0.12)" strokeWidth="1" />
              <path d="M10 58h1M58 95h1M92 12h1M116 64h1M36 16h1M72 108h1" stroke="rgba(24,24,27,0.08)" strokeWidth="1" />
            </pattern>
          </defs>
          <path d="M0,235 C110,180 170,212 250,165 C330,120 390,180 470,145 C550,110 620,168 700,135 C780,102 860,162 940,130 C1020,100 1110,150 1200,125 L1200,280 L0,280 Z" fill="url(#ogMountA)" />
          <path d="M0,255 C120,225 195,245 280,210 C365,176 455,226 540,192 C625,158 710,212 795,180 C880,150 965,198 1050,170 C1130,145 1170,168 1200,155 L1200,280 L0,280 Z" fill="url(#ogMountB)" />
          <rect width="1200" height="280" fill="url(#ogNoise)" opacity="0.45" />
        </svg>
      </div>

      <div className="container mx-auto max-w-[1200px] px-6 pt-10 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-mono font-bold tracking-[0.14em] text-accent">OSMOGREP</h3>
            <p className="mt-3 max-w-md text-sm text-ink-light leading-relaxed">
              Runtime-first code safety for teams that ship continuously.
              Detect regressions early, repair confidently, and keep production stable.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-accent mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-ink-light">
              <li><Link href="/install" className="hover:text-accent transition-colors">TUI</Link></li>
              <li><Link href="/web" className="hover:text-accent transition-colors">Web Shell</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-accent mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-ink-light">
              <li><Link href="/docs" className="hover:text-accent transition-colors">Documentation</Link></li>
              <li><Link href="/install" className="hover:text-accent transition-colors">Install Guide</Link></li>
              <li><Link href="/blog" className="hover:text-accent transition-colors">Blog</Link></li>
              <li><Link href="/changelog" className="hover:text-accent transition-colors">Changelog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-accent mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-ink-light">
              <li><Link href="/about" className="hover:text-accent transition-colors">About</Link></li>
              <li><Link href="/pricing" className="hover:text-accent transition-colors">Plans</Link></li>
              <li>
                <a href="https://github.com/kaushal07wick/OsmoGrep" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-grid flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-ink-light">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center gap-2 text-[11px] text-ink-light border border-grid rounded-sm px-3 py-1 bg-white/75">
              <span className="w-2 h-2 rounded-[2px] bg-green-500 animate-pulse" />
              All Systems Operational
            </div>
          </div>
          <span>&copy; 2026 Osmogrep Inc.</span>
        </div>
      </div>
    </footer>
  );
}
