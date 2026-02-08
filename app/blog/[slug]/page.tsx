import { notFound } from 'next/navigation';
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
    <main className="min-h-screen pt-24 pb-28">
      <article className="container mx-auto max-w-[900px] px-6">
        <p className="text-xs font-mono text-ink-light uppercase tracking-wider">{post.date} • {post.author}</p>
        <h1 className="text-4xl md:text-6xl font-bold text-accent mt-3 leading-tight">{post.title}</h1>
        <p className="mt-4 text-lg text-ink-light">{post.excerpt}</p>

        <img src={post.cover} alt={post.title} className="w-full mt-8 border border-grid rounded-sm object-cover max-h-[420px]" />

        <div
          className="
            mt-10 text-ink leading-relaxed
            [&_h1]:text-3xl [&_h1]:text-accent [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4
            [&_h2]:text-2xl [&_h2]:text-accent [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3
            [&_h3]:text-xl [&_h3]:text-accent [&_h3]:font-bold [&_h3]:mt-7 [&_h3]:mb-3
            [&_p]:text-base [&_p]:text-ink-light [&_p]:my-3
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3 [&_ul]:text-ink-light
            [&_li]:my-1
            [&_pre]:bg-[#0f0f10] [&_pre]:text-slate-200 [&_pre]:border [&_pre]:border-grid [&_pre]:p-4 [&_pre]:rounded-sm [&_pre]:overflow-x-auto [&_pre]:my-5
            [&_code]:font-mono
            [&_a]:text-accent [&_a]:underline
            [&_figure]:my-8
            [&_figure_img]:w-full [&_figure_img]:border [&_figure_img]:border-grid [&_figure_img]:rounded-sm
            [&_figcaption]:text-xs [&_figcaption]:text-ink-light [&_figcaption]:mt-2
          "
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>
    </main>
  );
}
