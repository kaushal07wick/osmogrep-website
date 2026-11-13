import { notFound } from "next/navigation";
import { docs, docHref } from "../../../lib/docs";
import { DocArticle, guides } from "../content";
export function generateStaticParams() { return docs.filter(doc => doc.slug).map(doc => ({ slug: doc.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = docs.find(item => item.slug === slug);
  return { title: doc ? `${doc.title} — Docs` : "Documentation", description: doc?.description, alternates: { canonical: doc ? docHref(doc.slug) : "/docs" } };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!Object.prototype.hasOwnProperty.call(guides, slug)) notFound();
  return <DocArticle slug={slug}>{guides[slug]}</DocArticle>;
}
