import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPostsMeta, getPostBySlug } from "../../../lib/blog";
import PostMeta from "../../components/blog/PostMeta";
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
  return <main className="journal-article-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <Link className="journal-back" href="/blog">← All engineering notes</Link>
    <article>
      <header className="journal-article-header"><p className="editorial-kicker">Engineering / {post.category}</p><h1>{post.title}</h1><p className="journal-deck">{post.excerpt}</p><PostMeta {...post} /></header>
      {post.cover.startsWith("/blog/") && <figure className="journal-article-cover"><img src={post.cover} alt={post.title} width="1200" height="630" fetchPriority="high" /></figure>}
      <details className="journal-contents"><summary>In this article <span>{post.sections.length} sections</span></summary><nav aria-label="Article contents"><ol>{post.sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ol></nav></details>
      <div className="journal-body" dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
    <footer className="journal-article-footer"><div><p className="editorial-kicker">Continue exploring</p><Link href="/docs/evidence">What counts as a verified repair? ↗</Link></div><Link href="/blog">Back to the journal →</Link></footer>
  </main>;
}
