import Link from 'next/link';
import { getAllPostsMeta } from '../../lib/blog';

export default function BlogPage() {
  const posts = getAllPostsMeta();

  return (
    <main className="min-h-screen pt-24 pb-28">
      <section className="container mx-auto max-w-[1200px] px-6">
        <div className="max-w-3xl mb-12">
          <div className="page-chip mb-4">
            Blog
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-space text-accent leading-tight">
            Engineering Notes
          </h1>
          <p className="mt-4 text-lg text-ink-light">
            Runtime reliability, test automation, and practical workflows from the Osmogrep team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group border border-grid bg-white/65 rounded-sm overflow-hidden hover:border-accent transition-colors">
              <img src={post.cover} alt={post.title} className="w-full h-56 object-cover border-b border-grid" />
              <div className="p-5">
                <div className="text-xs font-mono text-ink-light">{post.date} • {post.author}</div>
                <h2 className="mt-2 text-2xl font-bold text-accent leading-tight group-hover:underline underline-offset-4 decoration-accent">
                  {post.title}
                </h2>
                <p className="mt-3 text-sm text-ink-light leading-relaxed">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
