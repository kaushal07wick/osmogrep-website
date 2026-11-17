import { getAllPostsMeta, getPostBySlug } from './blog.ts';
import { majorUpdates } from './changelog.ts';
import { features } from './features.ts';
import { docs, docHref } from './docs.ts';
import { searchShortcuts } from './searchShortcuts.ts';

export type SearchDoc = { kind: 'workspace' | 'page' | 'docs' | 'feature' | 'blog' | 'changelog'; title: string; href: string; text: string };

const pages: SearchDoc[] = [
  { kind: 'page', title: 'Home', href: '/', text: 'Catch the bug. Ship the fix. Osmogrep runs your code, reproduces the failure, and patches the source, with your own tests as proof.' },
  { kind: 'page', title: 'Get started', href: '/get-started', text: 'Install Osmogrep and run your first session.' },
];

const stripMarkdown = (md: string) => md.replace(/<!--[\s\S]*?-->/g, ' ').replace(/```[\s\S]*?```/g, ' ').replace(/[#>*_`[\]()-]/g, ' ').replace(/\s+/g, ' ').trim();

export function buildSearchIndex(): SearchDoc[] {
  const index: SearchDoc[] = [
    ...pages,
    ...searchShortcuts,
    ...docs.map(doc => ({ kind: 'docs' as const, title: doc.title, href: docHref(doc.slug), text: `${doc.description} ${'keywords' in doc ? doc.keywords : ''}`.trim() })),
    ...features.map((f): SearchDoc => ({ kind: 'feature', title: f.title, href: f.href, text: f.desc })),
    ...majorUpdates.map((u): SearchDoc => ({ kind: 'changelog', title: `${u.version}: ${u.title}`, href: `/changelog#${u.id}`, text: `${u.product}. ${u.date}. ${u.summary} ${u.changes.join(' ')}` })),
    ...getAllPostsMeta().map((m): SearchDoc => ({
      kind: 'blog',
      title: m.title,
      href: `/blog/${m.slug}`,
      text: `${m.excerpt} ${stripMarkdown(getPostBySlug(m.slug)?.content ?? '')}`,
    })),
  ];
  return [...new Map(index.map(doc => [doc.href, doc])).values()];
}
