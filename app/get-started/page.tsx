import Link from 'next/link';
import CopyCommandBlock from '../components/CopyCommandBlock';

export default function GetStarted() {
  return (
    <main className="min-h-screen pt-28 pb-24">
      <section className="container mx-auto px-6">
        <div className="max-w-4xl">
          <div className="page-chip">Get Started</div>
          <h1 className="text-4xl md:text-5xl font-bold font-space text-accent mb-4">Install Osmogrep</h1>
          <p className="text-lg text-ink-light max-w-2xl">
            Osmogrep runs locally in your terminal. Install with Cargo or the shell script, then run
            `osmogrep` to open the interactive TUI and start sending input.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-xl border border-grid bg-white/60 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-space font-bold text-ink mb-3">Install (Cargo)</h2>
            <CopyCommandBlock code="cargo install osmogrep" />
          </div>
          <div className="rounded-xl border border-grid bg-white/60 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-space font-bold text-ink mb-3">Install (.sh)</h2>
            <CopyCommandBlock code="curl -fsSL https://osmogrep.com/install.sh | sh" />
          </div>
          <div className="rounded-xl border border-grid bg-white/60 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-space font-bold text-ink mb-3">Run (Opens TUI)</h2>
            <CopyCommandBlock code="osmogrep" />
          </div>
        </div>

        <aside className="lg:col-span-4">
          <div className="rounded-xl border border-grid bg-white/60 backdrop-blur-sm p-6">
            <h3 className="font-space text-sm font-semibold text-ink mb-3">Next</h3>
            <ul className="text-sm text-ink-light space-y-2">
              <li><Link href="/docs" className="hover:text-accent transition-colors">Read Docs</Link></li>
              <li><Link href="/install" className="hover:text-accent transition-colors">Install Page</Link></li>
              <li><Link href="/web" className="hover:text-accent transition-colors">Web Shell</Link></li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}
