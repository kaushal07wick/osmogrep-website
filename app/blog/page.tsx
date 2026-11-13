import type { Metadata } from "next";
import Link from "next/link";
import { getAllPostsMeta } from "../../lib/blog";
import PostMeta from "../components/blog/PostMeta";
import BlogSculpture from "../components/blog/BlogSculpture";

export const metadata: Metadata = { title: "Engineering notes", alternates: { canonical: "/blog" }, description: "Notes on building OsmoGrep: runtime verification, debugging, and the evidence behind a repair." };

export default function BlogPage() {
  const posts = getAllPostsMeta();
  return <main className="journal-page">
    <header className="journal-header"><div><p className="editorial-kicker">The osmogrep journal</p><h1>Engineering notes.</h1><p>What we’re building. What broke. What the tests showed.</p></div><span className="journal-index">ENTRIES / {String(posts.length).padStart(2, "0")}</span></header>
    {posts.length ? <section className="journal-entries" aria-label="Engineering articles">
      {posts.map((post, index) => <Link key={post.slug} className="journal-feature frame" href={`/blog/${post.slug}`}>
        <div className="journal-feature-copy"><p className="editorial-kicker">{index === 0 ? 'Latest' : 'Article'} / {post.category}</p><h2>{post.title}</h2><p className="journal-excerpt">{post.excerpt}</p><PostMeta {...post} /><span className="journal-read">Read the note <span aria-hidden="true">↗</span></span></div>
        <BlogSculpture variant={post.category === 'Agent engineering' ? 'field' : 'knot'} />
      </Link>)}
    </section> : <p className="journal-empty editorial-inset">The first engineering note is on its way.</p>}
    <footer className="journal-footer"><span>Notes on building osmogrep.</span><Link href="/docs/evidence">Read the verification guide <span aria-hidden="true">↗</span></Link></footer>
  </main>;
}
