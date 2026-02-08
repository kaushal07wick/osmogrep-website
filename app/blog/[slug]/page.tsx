import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllPostsMeta, getPostBySlug } from '../../../lib/blog';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPostsMeta().map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  return (
    <main className="min-h-screen pt-20 pb-32">
      <article className="container mx-auto max-w-[1200px] px-6 space-y-8">
        <header className="border border-grid bg-white/58">
          <div className="px-6 md:px-8 py-6 border-b border-grid">
            <Link href="/blog" className="text-[11px] uppercase tracking-[0.18em] text-accent font-bold hover:underline underline-offset-4">
              ← Back to Engineering Notes
            </Link>
            <p className="mt-4 text-xs font-mono text-ink-light">{post.date} • {post.author}</p>
            <h1 className="mt-3 text-3xl md:text-5xl leading-[0.95] font-bold text-accent blog-title-rise">{post.title}</h1>
            <p className="mt-3 text-base md:text-lg text-ink-light max-w-3xl">{post.excerpt}</p>
          </div>
          <div className="px-6 md:px-8 py-3 text-[11px] uppercase tracking-[0.16em] text-ink-light border-b border-grid">
            entry://{post.slug}
          </div>
          <div className="relative h-14 border-b border-grid bg-white/72 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(234,88,12,0.12)_1px,transparent_0)] bg-[size:12px_12px]" />
            <div className="absolute inset-0 flex items-center justify-between px-4 text-xs md:text-sm font-mono text-ink-light">
              <span>[notes] engineering write-up</span>
              <svg viewBox="0 0 80 28" className="h-5 w-16" fill="none" aria-hidden="true">
                <g className="blog-wire-spin" stroke="#EA580C" strokeOpacity="0.35" strokeWidth="0.8">
                  <ellipse cx="54" cy="14" rx="14" ry="6.2" />
                  <ellipse cx="54" cy="14" rx="14" ry="6.2" transform="rotate(24 54 14)" />
                  <ellipse cx="54" cy="14" rx="14" ry="6.2" transform="rotate(48 54 14)" />
                  <ellipse cx="54" cy="14" rx="14" ry="6.2" transform="rotate(72 54 14)" />
                </g>
              </svg>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6 items-start">
          <div
            className="
              border border-grid bg-white/55 px-6 md:px-8 py-7 text-ink leading-relaxed
              [&_h1]:text-3xl [&_h1]:text-accent [&_h1]:font-bold [&_h1]:mt-10 [&_h1]:mb-4
              [&_h2]:text-2xl [&_h2]:text-accent [&_h2]:font-bold [&_h2]:mt-9 [&_h2]:mb-3
              [&_h3]:text-xl [&_h3]:text-accent [&_h3]:font-bold [&_h3]:mt-8 [&_h3]:mb-3
              [&_p]:text-base [&_p]:text-ink-light [&_p]:my-4
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4 [&_ul]:text-ink-light
              [&_li]:my-1.5
              [&_pre]:bg-[#0f0f10] [&_pre]:text-slate-200 [&_pre]:border [&_pre]:border-grid [&_pre]:p-4 [&_pre]:rounded-sm [&_pre]:overflow-x-auto [&_pre]:my-6
              [&_code]:font-mono
              [&_a]:text-accent [&_a]:underline
              [&_figure]:my-8
              [&_figure_img]:w-full [&_figure_img]:border [&_figure_img]:border-grid [&_figure_img]:rounded-sm
              [&_figcaption]:text-xs [&_figcaption]:text-ink-light [&_figcaption]:mt-2
              [&_blockquote]:border-l-2 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:text-ink-light [&_blockquote]:my-5
            "
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          <aside className="border border-grid bg-white/62 p-4 lg:sticky lg:top-24">
            <p className="text-[10px] uppercase tracking-[0.16em] text-accent font-bold">Entry Meta</p>
            <div className="mt-3 space-y-2 text-xs text-ink-light">
              <div className="border border-grid bg-white px-2 py-1.5">author: {post.author}</div>
              <div className="border border-grid bg-white px-2 py-1.5">date: {post.date}</div>
            </div>
            <Link href="/blog" className="btn-outline mt-4 w-full py-2.5">
              More Entries
            </Link>
          </aside>
        </div>
      </article>
    </main>
  );
}
