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
            <div className="hidden md:block h-14 w-28 border border-grid bg-white/60">
              <svg viewBox="0 0 140 70" className="w-full h-full" fill="none" aria-hidden="true">
                <g className="blog-wire-spin" stroke="#EA580C" strokeOpacity="0.32" strokeWidth="0.9">
                  <ellipse cx="98" cy="35" rx="34" ry="15" />
                  <ellipse cx="98" cy="35" rx="34" ry="15" transform="rotate(20 98 35)" />
                  <ellipse cx="98" cy="35" rx="34" ry="15" transform="rotate(40 98 35)" />
                  <ellipse cx="98" cy="35" rx="34" ry="15" transform="rotate(60 98 35)" />
                  <ellipse cx="98" cy="35" rx="34" ry="15" transform="rotate(80 98 35)" />
                </g>
              </svg>
            </div>
          </div>

          <div>
            {posts.map((post, idx) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={`group grid grid-cols-1 md:grid-cols-[180px_1fr_auto] gap-3 md:gap-6 px-6 md:px-8 py-5 border-b border-grid last:border-b-0 hover:bg-white/80 transition-colors blog-link-row ${idx % 2 === 0 ? 'bg-white/40' : 'bg-white/55'}`}
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="space-y-3">
                  <div className="text-xs font-mono text-ink-light">{post.date}</div>
                  <div className="w-[104px] h-[46px] border border-grid bg-white/70 px-2 py-1.5">
                    <svg viewBox="0 0 90 34" className="w-full h-full" fill="none" aria-hidden="true">
                      <path d="M6 26C16 20 20 24 29 18C37 13 43 20 51 15C59 10 65 16 73 13C79 11 83 13 86 12" stroke="#EA580C" strokeOpacity="0.45" strokeWidth="1.2" />
                      <circle cx="18" cy="19" r="1.8" fill="#EA580C" />
                      <circle cx="34" cy="16" r="1.6" fill="#EA580C" />
                      <circle cx="52" cy="14" r="1.7" fill="#EA580C" />
                      <circle cx="70" cy="13" r="1.6" fill="#EA580C" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="text-xl md:text-2xl font-bold text-ink group-hover:text-accent transition-colors">{post.title}</h4>
                  <p className="mt-1 text-sm text-ink-light">{post.excerpt}</p>
                </div>
                <div className="text-xs font-mono text-accent md:text-right flex items-center md:justify-end gap-2">
                  <span>by {post.author}</span>
                  <span className="blog-link-arrow">↗</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
