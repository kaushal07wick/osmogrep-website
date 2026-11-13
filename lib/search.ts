import { getAllPostsMeta, getPostBySlug } from './blog';
import { majorUpdates } from './changelog';
import { features } from './features';

export type SearchDoc = { kind: 'page' | 'docs' | 'feature' | 'blog' | 'changelog'; title: string; href: string; text: string };

// ponytail: pages and docs sections are listed by hand; add an entry when a page or docs section is added.
const pages: SearchDoc[] = [
  { kind: 'page', title: 'Home', href: '/', text: 'Catch the bug. Ship the fix. Osmogrep runs your code, reproduces the failure, and patches the source, with your own tests as proof.' },
  { kind: 'page', title: 'Install the CLI', href: '/docs#quickstart', text: 'curl -fsSL https://osmogrep.com/install.sh | sh. cargo install osmogrep. Build from source. macOS Linux Windows.' },
  { kind: 'page', title: 'Pricing', href: '/pricing', text: 'Plans: Solo $2/mo, Solo Pro $10/mo, Teams $200/mo, Enterprise custom. Deployment advice and contact.' },
  { kind: 'page', title: 'Docs', href: '/docs', text: 'Guides and command reference for the Osmogrep CLI.' },
  { kind: 'page', title: 'Blog', href: '/blog', text: 'Notes from the team.' },
  { kind: 'page', title: 'Changelog', href: '/changelog', text: 'Major product updates, version by version.' },
  { kind: 'page', title: 'About', href: '/about', text: 'A terminal-native agent for real engineering work. Who builds Osmogrep.' },
  { kind: 'page', title: 'Get started', href: '/get-started', text: 'Install Osmogrep and run your first session.' },
  { kind: 'docs', title: 'Quickstart', href: '/docs#quickstart', text: 'Install and launch inside any git repository.' },
  { kind: 'docs', title: 'MCP + skills for coding agents', href: '/docs#coding-agents', text: 'Connect Codex or Claude Code to OsmoGrep sandboxes with the osmogrep-verify skill. Reproduce, repair and verify runtime regressions.' },
  { kind: 'docs', title: 'Agent interaction', href: '/docs#interaction', text: 'Type naturally to ask Osmogrep to inspect code, write patches, generate tests, and explain decisions.' },
  { kind: 'docs', title: 'Shell commands (!)', href: '/docs#shell', text: 'Prefix with ! to run shell commands directly from Osmogrep, like !git status or !cargo test.' },
  { kind: 'docs', title: 'Slash commands (/)', href: '/docs#slash', text: 'Session control with /help, /clear and /quit.' },
  { kind: 'docs', title: 'FAQ', href: '/docs#faq', text: 'Can I type normal instructions? How do I run shell commands in-session? Which slash commands are available?' },
];

const stripMarkdown = (md: string) => md.replace(/```[\s\S]*?```/g, ' ').replace(/[#>*_`[\]()-]/g, ' ').replace(/\s+/g, ' ').trim();

export function buildSearchIndex(): SearchDoc[] {
  return [
    ...pages,
    ...features.map((f): SearchDoc => ({ kind: 'feature', title: f.title, href: f.href, text: f.desc })),
    ...majorUpdates.map((u): SearchDoc => ({ kind: 'changelog', title: `${u.version}: ${u.title}`, href: '/changelog', text: `${u.date}. ${u.summary}` })),
    ...getAllPostsMeta().map((m): SearchDoc => ({
      kind: 'blog',
      title: m.title,
      href: `/blog/${m.slug}`,
      text: `${m.excerpt} ${stripMarkdown(getPostBySlug(m.slug)?.content ?? '')}`,
    })),
  ];
}
