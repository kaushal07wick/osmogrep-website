import type { MetadataRoute } from 'next';
import { getAllPostsMeta } from '../lib/blog';
import { docs, docHref } from '../lib/docs';

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = 'https://osmogrep.com';
  return [
    ...['/', '/about', '/blog', '/pricing', '/changelog', ...docs.map(doc => docHref(doc.slug))].map(path => ({ url: `${origin}${path}` })),
    ...getAllPostsMeta().map(post => ({ url: `${origin}/blog/${post.slug}`, lastModified: post.updated || post.date })),
  ];
}
