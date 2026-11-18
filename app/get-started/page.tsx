import Link from 'next/link';
import CopyCommandBlock from '../components/CopyCommandBlock';

export default function GetStarted() {
  return (
    <main className="min-h-screen pt-28 pb-24">
      <section className="zone zone-engraved container mx-auto px-6">
        <div className="max-w-4xl">
          <div className="page-chip">Get Started</div>
          <h1 className="text-4xl md:text-5xl font-bold text-ink mb-4">Install Osmogrep</h1>
          <p className="text-lg text-ink-light max-w-2xl">
            Install with npm or pnpm, then run <code>osmogrep</code> inside your project. The launcher downloads the native Rust binary on first launch. Node.js 22.19+ is required.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="install-step">
            <h2 className="text-2xl font-bold text-ink mb-3">Install with npm or pnpm</h2>
            <CopyCommandBlock code="npm install -g osmogrep" />
            <CopyCommandBlock code="pnpm add -g osmogrep" />
          </div>
          <div className="install-step">
            <h2 className="text-2xl font-bold text-ink mb-3">Other installation methods</h2>
            <CopyCommandBlock code="curl -fsSL https://osmogrep.com/install.sh | sh" />
            <CopyCommandBlock code="cargo install --git https://github.com/kaushal07wick/OsmoGrep --locked" />
          </div>
          <div className="install-step">
            <h2 className="text-2xl font-bold text-ink mb-3">Run (Opens TUI)</h2>
            <CopyCommandBlock code="osmogrep" />
          </div>
        </div>

        <aside className="lg:col-span-4">
          <div className="install-step">
            <h3 className="text-sm font-semibold text-ink mb-3">Next</h3>
            <ul className="text-sm text-ink-light space-y-2">
              <li><Link href="/docs" className="hover:text-accent transition-colors">Read Docs</Link></li>
              <li><Link href="/web" className="hover:text-accent transition-colors">Web Shell</Link></li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}
