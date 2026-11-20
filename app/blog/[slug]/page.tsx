import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAllPostsMeta, getPostBySlug } from "../../../lib/blog";
import PostMeta from "../../components/blog/PostMeta";
import RuntimeFigure from "../../components/blog/RuntimeFigure";
import TinygradFigure, { type TinygradFigureKind } from "../../components/blog/TinygradFigure";
import "../../components/blog/article-cover.css";

type PageProps = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return getAllPostsMeta().map(post => ({ slug: post.slug })); }
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const socialCover = post && !post.cover.endsWith(".svg") ? post.cover : "/opengraph-image";
  return { title: post?.title || "Note not found", description: post?.excerpt, alternates: { canonical: post ? `/blog/${post.slug}` : "/blog" }, ...(post ? {
    openGraph: { type: "article", url: `/blog/${post.slug}`, title: post.title, description: post.excerpt, publishedTime: post.date, modifiedTime: post.updated || post.date, authors: [post.author], images: [{ url: socialCover, alt: post.title }] },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt, images: [socialCover] },
  } : {}) };
}
export default async function BlogPostPage({ params }: PageProps) {
  const post = getPostBySlug((await params).slug);
  if (!post) notFound();
  const url = `https://osmogrep.com/blog/${post.slug}`;
  const socialCover = post.cover.endsWith(".svg") ? "/opengraph-image" : post.cover;
  const structuredData = { "@context": "https://schema.org", "@graph": [
    { "@type": "BlogPosting", "@id": `${url}#article`, mainEntityOfPage: url, url, headline: post.title, description: post.excerpt, articleSection: post.category, datePublished: post.date, dateModified: post.updated || post.date, image: new URL(socialCover, "https://osmogrep.com").href, author: { "@type": "Organization", name: post.author, url: "https://osmogrep.com/about" }, publisher: { "@type": "Organization", name: "OsmoGrep", url: "https://osmogrep.com" }, inLanguage: "en" },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Engineering notes", item: "https://osmogrep.com/blog" }, { "@type": "ListItem", position: 2, name: post.title, item: url }] },
  ] };
  return <main className={`journal-article-page${post.slug === 'from-pull-request-to-runtime-regression' ? ' journal-runtime-article' : post.slug === 'tinygrad-jit-input-rebinding' ? ' journal-tinygrad-article' : ''}`}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <Link className="journal-back" href="/blog">← All engineering notes</Link>
    <article>
      <header className="journal-article-header"><p className="editorial-kicker">Engineering / {post.category}</p><h1>{post.title}</h1><p className="journal-deck">{post.excerpt}</p><PostMeta {...post} /></header>
      {post.cover.startsWith("/blog/") && <figure className="journal-article-cover">{post.card ? <Image src={post.cover} alt={post.coverAlt || "Conceptual illustration of a changed component feeding connected resource chambers, with one accumulating unreleased capacity."} width={1672} height={941} sizes="(max-width: 900px) 94vw, 840px" priority /> : <img src={post.cover} alt={post.title} width="1200" height="630" fetchPriority="high" />}</figure>}
      <details className="journal-contents"><summary>In this article <span>{post.sections.length} sections</span></summary><nav aria-label="Article contents"><ol>{post.sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ol></nav></details>
      <div className="journal-body">{post.html.split(/(<div data-(?:runtime|tinygrad)-figure="(?:causal|experiment|compute|summary|binding|results)"><\/div>)/g).map((part, index) => {
        const figure = part.match(/^<div data-(runtime|tinygrad)-figure="([a-z]+)"><\/div>$/);
        if (figure?.[1] === 'runtime') return <RuntimeFigure key={index} kind={figure[2] as 'causal' | 'experiment' | 'compute'} />;
        if (figure?.[1] === 'tinygrad') return <TinygradFigure key={index} kind={figure[2] as TinygradFigureKind} />;
        return <div key={index} dangerouslySetInnerHTML={{ __html: part }} />;
      })}</div>
    </article>
    <footer className="journal-article-footer"><div><p className="editorial-kicker">Continue exploring</p><Link href="/docs/evidence">What counts as a verified repair? ↗</Link></div><Link href="/blog">Back to the journal →</Link></footer>
  </main>;
}
