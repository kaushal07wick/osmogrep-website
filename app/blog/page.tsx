import Link from 'next/link';
import { getAllPostsMeta } from '../../lib/blog';

export default function BlogPage() {
  const posts = getAllPostsMeta();
  const latest = posts[0];

  return (
    <main className="min-h-screen pt-20 pb-32">
      <section className="container mx-auto max-w-[1200px] px-6 space-y-8">
        <header className="border border-grid bg-white/58">
          <div className="px-6 md:px-8 py-7 md:py-8 border-b border-grid">
            <div className="page-chip mb-3">Engineering Notes</div>
            <h1 className="text-3xl md:text-5xl leading-[0.95] font-bold text-accent blog-title-rise">
              Blog posts from real runtime sessions.
            </h1>
            <p className="mt-3 text-base text-ink-light max-w-3xl">
              Product decisions, debugging traces, and engineering write-ups from a local-first TUI workflow.
            </p>
          </div>
          <div className="px-4 py-3 text-xs text-ink-light border-b border-grid">
            Posts: <span className="text-accent font-bold">{posts.length}</span>
          </div>
        </header>

        {latest ? (
          <section className="border border-grid bg-white/55 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-grid">
              <p className="text-[11px] uppercase tracking-[0.18em] text-accent font-bold">Latest Entry</p>
              <h2 className="mt-3 text-2xl md:text-4xl leading-[1] font-bold text-ink">{latest.title}</h2>
              <p className="mt-3 text-base text-ink-light max-w-[46ch]">{latest.excerpt}</p>
              <p className="mt-6 text-xs font-mono text-ink-light">{latest.date} • {latest.author}</p>
              <Link href={`/blog/${latest.slug}`} className="btn-outline mt-6 px-6 py-3">
                Open Entry
              </Link>
            </div>
            <div className="p-5 md:p-6">
              <div className="border border-grid bg-white/80 h-full min-h-[190px] overflow-hidden relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(234,88,12,0.15)_1px,transparent_0)] bg-[size:12px_12px]" />
                <div className="relative h-full flex items-center justify-center">
                  <svg viewBox="0 0 260 180" className="w-[78%] h-[78%]" fill="none" aria-hidden="true">
                    <g className="blog-wire-spin" stroke="#EA580C" strokeOpacity="0.34" strokeWidth="1">
                      <ellipse cx="130" cy="90" rx="74" ry="36" />
                      <ellipse cx="130" cy="90" rx="74" ry="36" transform="rotate(18 130 90)" />
                      <ellipse cx="130" cy="90" rx="74" ry="36" transform="rotate(36 130 90)" />
                      <ellipse cx="130" cy="90" rx="74" ry="36" transform="rotate(54 130 90)" />
                      <ellipse cx="130" cy="90" rx="74" ry="36" transform="rotate(72 130 90)" />
                      <ellipse cx="130" cy="90" rx="74" ry="36" transform="rotate(90 130 90)" />
                    </g>
                    <circle cx="130" cy="90" r="4.2" fill="#EA580C" className="index-node-breathe" />
                  </svg>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <section className="border border-grid bg-white/52">
          <div className="px-6 md:px-8 py-5 md:py-6 border-b border-grid bg-accent/8 flex items-center justify-between gap-4">
            <h3 className="text-2xl md:text-3xl font-bold text-accent">All Posts</h3>
          </div>

          <div>
            {posts.map((post, idx) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={`group grid grid-cols-1 items-start gap-3 border-b border-grid px-6 py-4 transition-colors hover:bg-white/80 last:border-b-0 md:grid-cols-[96px_1fr_220px] md:items-start md:gap-5 md:px-8 md:py-5 blog-link-row ${idx % 2 === 0 ? 'bg-white/40' : 'bg-white/55'}`}
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="hidden md:flex items-center pt-1">
                  <div className="flex items-center">
                    <div className="blog-orb">
                      <span className="blog-orb-core" />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-ink transition-colors group-hover:text-accent md:text-2xl">{post.title}</h4>
                  <p className="mt-1 text-sm text-ink-light">{post.excerpt}</p>
                </div>
                <div className="flex flex-col items-start text-xs font-mono md:h-full md:items-end md:justify-between md:text-right">
                  <div className="flex items-center gap-2 text-accent">
                    <span>by {post.author}</span>
                    <span className="blog-link-arrow">↗</span>
                  </div>
                  <div className="mt-1 text-ink-light md:mt-0">{post.date}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
