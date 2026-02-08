import fs from 'node:fs';
import path from 'node:path';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export type BlogPostMeta = {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  cover: string;
};

export type BlogPost = BlogPostMeta & {
  content: string;
  html: string;
};

type Frontmatter = Omit<BlogPostMeta, 'slug'>;

const defaultMeta: Frontmatter = {
  title: 'Untitled Post',
  date: '2026-01-01',
  author: 'Osmogrep Team',
  excerpt: 'No excerpt provided.',
  cover: '/osmogrep.png',
};

function parseFrontmatter(raw: string): { meta: Frontmatter; content: string } {
  if (!raw.startsWith('---')) {
    return { meta: defaultMeta, content: raw.trim() };
  }

  const endIndex = raw.indexOf('\n---', 3);
  if (endIndex === -1) {
    return { meta: defaultMeta, content: raw.trim() };
  }

  const fmRaw = raw.slice(3, endIndex).trim();
  const content = raw.slice(endIndex + 4).trim();
  const meta: Frontmatter = { ...defaultMeta };

  fmRaw.split('\n').forEach((line) => {
    const idx = line.indexOf(':');
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim().replace(/^"(.*)"$/, '$1');
    if (key === 'title') meta.title = value;
    if (key === 'date') meta.date = value;
    if (key === 'author') meta.author = value;
    if (key === 'excerpt') meta.excerpt = value;
    if (key === 'cover') meta.cover = value;
  });

  return { meta, content };
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function safeUrl(raw: string): string {
  const url = raw.trim();

  if (
    url.startsWith('/') ||
    url.startsWith('#') ||
    /^https?:\/\//i.test(url) ||
    /^mailto:/i.test(url)
  ) {
    return url;
  }

  return '#';
}

function formatInline(input: string): string {
  const escaped = escapeHtml(input);
  return escaped
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label: string, href: string) => {
      const safeHref = safeUrl(href);
      const external = /^https?:\/\//i.test(safeHref);
      const attrs = external
        ? ' target="_blank" rel="noopener noreferrer"'
        : '';
      return `<a href="${safeHref}"${attrs}>${label}</a>`;
    });
}

export function markdownToHtml(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const html: string[] = [];
  let inList = false;
  let inCode = false;
  let codeBuffer: string[] = [];

  const flushList = () => {
    if (inList) {
      html.push('</ul>');
      inList = false;
    }
  };

  const flushCode = () => {
    if (inCode) {
      html.push(`<pre><code>${escapeHtml(codeBuffer.join('\n'))}</code></pre>`);
      inCode = false;
      codeBuffer = [];
    }
  };

  for (const line of lines) {
    if (line.startsWith('```')) {
      if (inCode) {
        flushCode();
      } else {
        flushList();
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      codeBuffer.push(line);
      continue;
    }

    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      continue;
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushList();
      const level = heading[1].length;
      html.push(`<h${level}>${formatInline(heading[2])}</h${level}>`);
      continue;
    }

    const image = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) {
      flushList();
      const src = safeUrl(image[2]);
      html.push(`<figure><img src="${src}" alt="${escapeHtml(image[1])}" /><figcaption>${escapeHtml(image[1])}</figcaption></figure>`);
      continue;
    }

    const list = trimmed.match(/^- (.+)$/);
    if (list) {
      if (!inList) {
        html.push('<ul>');
        inList = true;
      }
      html.push(`<li>${formatInline(list[1])}</li>`);
      continue;
    }

    flushList();
    html.push(`<p>${formatInline(trimmed)}</p>`);
  }

  flushList();
  flushCode();
  return html.join('\n');
}

export function getAllPostsMeta(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith('.md'));

  return files
    .map((file) => {
      const slug = file.replace(/\.md$/, '');
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
      const { meta } = parseFrontmatter(raw);
      return { ...meta, slug };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf8');
  const { meta, content } = parseFrontmatter(raw);

  return {
    ...meta,
    slug,
    content,
    html: markdownToHtml(content),
  };
}
