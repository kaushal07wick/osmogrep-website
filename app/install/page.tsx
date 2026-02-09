import Link from 'next/link';
import CopyCommandBlock from '../components/CopyCommandBlock';

const runtimeFeatures = [
  'Interactive agent loop with streaming terminal output',
  'Shell execution via `!` commands inside the session',
  'Slash controls like `/help`, `/clear`, and `/quit`',
  'Runtime trace inspection with risk surfacing',
  'Patch suggestions with test-and-verify flow',
  'Stress-style validation loops for reliability checks',
];

const platformFeatures = [
  'Hosted web workspace for browser-based runtime sessions',
  'Team projects with shared execution history',
  'Pull request risk summaries and change tracking',
  'Parallel execution controls for larger repos',
  'Enterprise deployment options and private environments',
  'Custom integration hooks for internal tooling',
];

export default function InstallPage() {
  return (
    <main className="min-h-screen pt-24 pb-20">
      <section className="container mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="page-chip mb-4">
              Osmogrep
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-space text-accent leading-tight">
              Install Osmogrep
            </h1>
            <p className="mt-5 text-lg text-ink-light leading-relaxed max-w-xl">
              A fast Rust-powered terminal experience for runtime checks, repair loops,
              and production-focused reliability workflows inside your repo.
            </p>
            <div className="mt-8">
              <p className="font-mono text-xs text-ink-light mb-2 uppercase tracking-wider">Install from crates.io</p>
              <CopyCommandBlock code="cargo install osmogrep" />
            </div>
            <div className="mt-4">
              <p className="font-mono text-xs text-ink-light mb-2 uppercase tracking-wider">Install with Curl</p>
              <CopyCommandBlock code="curl -fsSL https://osmogrep.com/install.sh | sh" />
            </div>
            <div className="mt-4">
              <p className="font-mono text-xs text-ink-light mb-2 uppercase tracking-wider">Build from Source</p>
              <CopyCommandBlock code="git clone https://github.com/kaushal07wick/OsmoGrep.git && cd OsmoGrep && cargo install --path ." />
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/docs" className="btn-primary">
                Read Docs
              </Link>
              <a
                href="https://github.com/kaushal07wick/OsmoGrep"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                View on GitHub
              </a>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-grid bg-white/60 shadow-sm">
            <img src="/osmogrep.gif" alt="Osmogrep in action" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-[1200px] px-6 mt-20">
        <h2 className="text-3xl md:text-4xl font-space font-bold text-accent mb-8">Osmogrep Features</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <article className="p-6 rounded-lg border border-grid bg-white/55">
            <h3 className="text-lg font-semibold text-ink">Runtime Engine Features</h3>
            <ul className="mt-4 space-y-2 text-sm text-ink-light leading-relaxed">
              {runtimeFeatures.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-[5px] h-1.5 w-1.5 rounded-[2px] bg-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="p-6 rounded-lg border border-grid bg-white/55">
            <h3 className="text-lg font-semibold text-ink">Platform Features</h3>
            <ul className="mt-4 space-y-2 text-sm text-ink-light leading-relaxed">
              {platformFeatures.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-[5px] h-1.5 w-1.5 rounded-[2px] bg-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="container mx-auto max-w-[1200px] px-6 mt-20">
        <div className="rounded-xl border border-grid bg-white/55 p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-space font-bold text-accent">How Sessions Work</h2>
          <p className="mt-4 text-ink-light leading-relaxed max-w-3xl">
            Osmogrep is interactive by default. You can chat with the agent, run shell commands with a `!` prefix,
            and use slash commands for controls. Every tool call and output stream is visible in the same session.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <article className="border border-grid rounded-sm bg-white/70 p-4">
              <h3 className="text-sm font-semibold text-accent">Type Instructions</h3>
              <p className="mt-2 text-xs text-ink-light leading-relaxed">
                Ask for code changes, debugging, test generation, or runtime investigations in plain language.
              </p>
            </article>
            <article className="border border-grid rounded-sm bg-white/70 p-4">
              <h3 className="text-sm font-semibold text-accent">Run Shell with `!`</h3>
              <p className="mt-2 text-xs text-ink-light leading-relaxed">
                Execute commands like `!git status` or `!cargo test` directly without leaving the interface.
              </p>
            </article>
            <article className="border border-grid rounded-sm bg-white/70 p-4">
              <h3 className="text-sm font-semibold text-accent">Control with `/`</h3>
              <p className="mt-2 text-xs text-ink-light leading-relaxed">
                Use commands such as `/help`, `/clear`, and `/quit` to manage session flow and output.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
