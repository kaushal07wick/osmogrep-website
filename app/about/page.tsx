import Link from 'next/link';

export default function About() {
  return (
    <main className="min-h-screen pt-28 pb-24">
      <section className="container mx-auto max-w-[1200px] px-6">
        <div className="max-w-4xl animate-slide-up opacity-0 delay-100">
          <div className="page-chip mb-4">
            About
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-accent mb-6">A Terminal-Native Agent For Real Engineering Work</h1>
          <p className="max-w-3xl text-lg text-ink-light leading-relaxed">
            Osmogrep is built for teams that want AI assistance without losing control. It runs inside your repository,
            keeps execution transparent, and treats every action as auditable engineering work instead of a black box.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          <article className="border border-grid rounded-sm bg-white/65 p-6 animate-slide-up opacity-0 delay-200">
            <h2 className="text-xl font-semibold text-accent">Mission</h2>
            <p className="mt-3 text-sm text-ink-light leading-relaxed">
              Help engineers ship faster with fewer regressions by combining autonomous code actions with visible, human-reviewable execution.
            </p>
          </article>

          <article className="border border-grid rounded-sm bg-white/65 p-6 animate-slide-up opacity-0 delay-300">
            <h2 className="text-xl font-semibold text-accent">Approach</h2>
            <p className="mt-3 text-sm text-ink-light leading-relaxed">
              Start from the terminal, operate on real files, run real commands, and keep a clear activity trail that teams can inspect anytime.
            </p>
          </article>

          <article className="border border-grid rounded-sm bg-white/65 p-6 animate-slide-up opacity-0 delay-300">
            <h2 className="text-xl font-semibold text-accent">Outcome</h2>
            <p className="mt-3 text-sm text-ink-light leading-relaxed">
              Faster debugging, better test reliability, and safer merges through iterative write, run, verify loops.
            </p>
          </article>
        </div>

        <section className="mt-10 border border-grid rounded-sm bg-white/70 p-6 md:p-8 animate-slide-up opacity-0 delay-300">
          <h2 className="text-2xl font-semibold text-accent">What Makes Osmogrep Different</h2>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            <ul className="text-sm text-ink-light space-y-2">
              <li>Interactive agent loop with streaming responses and tool calls.</li>
              <li>Shell execution in-context using `!` prefix commands.</li>
              <li>Slash controls like `/help`, `/clear`, and `/quit` for session management.</li>
              <li>Repository-aware edits with explicit diffs and command output.</li>
            </ul>
            <ul className="text-sm text-ink-light space-y-2">
              <li>Supports OpenAI-compatible backends, including local model setups.</li>
              <li>Built for code review, bug-fixing, and test-generation workflows.</li>
              <li>Designed for local-first usage with clear operational boundaries.</li>
              <li>Optimized for engineers who prefer terminal-native velocity.</li>
            </ul>
          </div>
        </section>

        <section className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-4 animate-slide-up opacity-0 delay-300">
          {[
            { step: '01', title: 'Prompt', text: 'Describe your task or issue in plain language.' },
            { step: '02', title: 'Execute', text: 'Run tools and shell commands inside the session.' },
            { step: '03', title: 'Verify', text: 'Inspect changes, tests, and command output.' },
            { step: '04', title: 'Ship', text: 'Merge with confidence after review and validation.' },
          ].map((item) => (
            <article key={item.step} className="border border-grid rounded-sm bg-white/65 p-4">
              <div className="text-xs font-mono text-accent">{item.step}</div>
              <h3 className="mt-2 text-base font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-xs text-ink-light leading-relaxed">{item.text}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 border border-grid rounded-sm bg-white/75 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-slide-up opacity-0 delay-300">
          <div>
            <h2 className="text-xl font-semibold text-accent">Ready to try it in your repository?</h2>
            <p className="mt-2 text-sm text-ink-light">
              Install Osmogrep locally and start with a live session in under a minute.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/install" className="btn-primary px-5 py-2.5">Install</Link>
            <Link href="/docs" className="btn-outline px-5 py-2.5">Read Docs</Link>
          </div>
        </section>
      </section>
    </main>
  );
}
