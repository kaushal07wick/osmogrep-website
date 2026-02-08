import Link from 'next/link';

const majorUpdates = [
  {
    version: 'v0.2.1',
    date: 'January 19, 2026',
    title: 'Context-aware execution and indexing improvements',
    summary:
      'Improved prompt context handling, added codebase indexing, and enabled copy behavior in terminal output for faster workflows.',
    commits: ['5e6d2bf', '16d4705'],
  },
  {
    version: 'v0.2.0',
    date: 'January 18, 2026',
    title: 'Major UX release with multiline input support',
    summary:
      'Shipped the v0.2.0 release with a refined UX, multiline input support, and UI improvements across the agent interface.',
    commits: ['8bd43ee', '07e3f7c', '87dc6ea', 'ffc56c9'],
  },
  {
    version: 'v0.1.x',
    date: 'January 17-18, 2026',
    title: 'Stability fixes and agentic refactor',
    summary:
      'Applied foundational fixes, refactored agent flows, and cleaned supporting docs and versioning for smoother iterations.',
    commits: ['9ce92c4', '68d0010', 'e44ba00', '6a5770b'],
  },
];

export default function Changelog() {
  return (
    <main className="min-h-screen pt-28 pb-24">
      <section className="container mx-auto max-w-[1200px] px-6">
        <div className="max-w-3xl">
          <div className="page-chip mb-4">
            Changelog
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-accent">Major Product Updates</h1>
          <p className="mt-4 text-lg text-ink-light">
            A curated record of meaningful releases and platform improvements.
          </p>
        </div>

        <div className="mt-10 space-y-5">
          {majorUpdates.map((update) => (
            <article key={update.version} className="border border-grid rounded-sm bg-white/72 backdrop-blur-sm p-5 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="text-[11px] tracking-wider uppercase font-bold text-accent">{update.version}</p>
                  <h2 className="text-xl md:text-2xl font-bold text-ink mt-1">{update.title}</h2>
                </div>
                <p className="text-xs text-ink-light font-mono">{update.date}</p>
              </div>
              <p className="mt-3 text-sm text-ink-light leading-relaxed">{update.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {update.commits.map((hash) => (
                  <a
                    key={hash}
                    href={`https://github.com/kaushal07wick/OsmoGrep/commit/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono px-2.5 py-1 rounded-sm border border-grid bg-white/70 text-accent hover:border-accent hover:underline underline-offset-4"
                  >
                    {hash}
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8">
          <Link href="/blog" className="text-sm text-accent hover:underline underline-offset-4">
            Read engineering updates in the blog
          </Link>
        </div>
      </section>
    </main>
  );
}
