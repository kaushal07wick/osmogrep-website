import fs from 'node:fs';
import path from 'node:path';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export type BlogPostMeta = {
  slug: string;
  title: string;
  date: string;
  updated?: string;
  author: string;
  excerpt: string;
  cover: string;
  category: string;
  readingMinutes: number;
};

export type BlogPost = BlogPostMeta & {
  content: string;
  html: string;
  sections: { id: string; title: string }[];
};

type Frontmatter = Omit<BlogPostMeta, 'slug' | 'readingMinutes'>;

const defaultMeta: Frontmatter = {
  title: 'Untitled Post',
  date: '2026-01-01',
  author: 'Osmogrep Team',
  excerpt: 'No excerpt provided.',
  cover: '/osmogrep.png',
  category: 'Runtime verification',
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
    if (key === 'updated') meta.updated = value;
    if (key === 'author') meta.author = value;
    if (key === 'excerpt') meta.excerpt = value;
    if (key === 'cover') meta.cover = value;
    if (key === 'category') meta.category = value;
  });

  return { meta, content };
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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

function renderMarkdown(markdown: string) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const html: string[] = [];
  let inList: 'ul' | 'ol' | null = null;
  const sections: { id: string; title: string }[] = [];
  const headingCounts = new Map<string, number>();
  let inCode = false;
  let codeBuffer: string[] = [];

  const flushList = () => {
    if (inList) {
      html.push(`</${inList}>`);
      inList = null;
    }
  };

  const flushCode = () => {
    if (inCode) {
      html.push(`<pre><code>${escapeHtml(codeBuffer.join('\n'))}</code></pre>`);
      inCode = false;
      codeBuffer = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
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
      const stem = heading[2].toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-') || 'section';
      const count = (headingCounts.get(stem) || 0) + 1;
      headingCounts.set(stem, count);
      const id = count === 1 ? stem : `${stem}-${count}`;
      if (level === 2) sections.push({ id, title: heading[2] });
      html.push(`<h${level} id="${id}">${formatInline(heading[2])}</h${level}>`);
      continue;
    }

    if (trimmed.includes('|') && /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test((lines[i + 1] || '').trim())) {
      flushList();
      const cells = (row: string) => row.trim().replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map(cell => formatInline(cell.trim().replace(/\\\|/g, '|')));
      const headers = cells(trimmed);
      html.push(`<div class="journal-table-scroll" tabindex="0" role="region" aria-label="Article data table"><table><thead><tr>${headers.map(cell => `<th scope="col">${cell}</th>`).join('')}</tr></thead><tbody>`);
      i++;
      while ((lines[i + 1] || '').trim().includes('|') && (lines[i + 1] || '').trim()) {
        const row = cells(lines[++i]);
        html.push(`<tr>${headers.map((_, column) => `<td>${row[column] || ''}</td>`).join('')}</tr>`);
      }
      html.push('</tbody></table></div>');
      continue;
    }

    if (trimmed.startsWith('> ')) {
      flushList();
      html.push(`<blockquote><p>${formatInline(trimmed.slice(2))}</p></blockquote>`);
      continue;
    }

    const image = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) {
      flushList();
      const src = safeUrl(image[2]);
      html.push(`<figure tabindex="0"><img src="${src}" alt="${escapeHtml(image[1])}" /><figcaption>${escapeHtml(image[1])}</figcaption></figure>`);
      continue;
    }

    const list = trimmed.match(/^(-|\d+\.) (.+)$/);
    if (list) {
      const kind = list[1] === '-' ? 'ul' : 'ol';
      if (inList !== kind) {
        flushList();
        html.push(`<${kind}>`);
        inList = kind;
      }
      html.push(`<li>${formatInline(list[2])}</li>`);
      continue;
    }

    flushList();
    html.push(`<p>${formatInline(trimmed)}</p>`);
  }

  flushList();
  flushCode();
  return { html: html.join('\n'), sections };
}

export function markdownToHtml(markdown: string): string { return renderMarkdown(markdown).html; }

export function readingTime(content: string) {
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).filter(Boolean).length / 200));
}

export function getAllPostsMeta(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith('.md'));

  return files
    .map((file) => {
      const slug = file.replace(/\.md$/, '');
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
      const { meta, content } = parseFrontmatter(raw);
      return { ...meta, slug, readingMinutes: readingTime(content) };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | null {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf8');
  const { meta, content } = parseFrontmatter(raw);

  return {
    ...meta,
    slug,
    content,
    readingMinutes: readingTime(content),
    ...renderMarkdown(content),
  };
}
