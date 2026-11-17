import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildSearchIndex } from './search.ts';
import { docs, docHref } from './docs.ts';
import { getAllPostsMeta } from './blog.ts';
import { majorUpdates } from './changelog.ts';
import { searchShortcuts } from './searchShortcuts.ts';
import { searchDocs } from './searchQuery.ts';

const index = buildSearchIndex();
test('search includes each public guide, article, release and shortcut without duplicate targets', () => {
  assert.equal(new Set(index.map(doc => doc.href)).size, index.length);
  for (const href of [...docs.map(doc => docHref(doc.slug)), ...getAllPostsMeta().map(post => `/blog/${post.slug}`), ...majorUpdates.map(update => `/changelog#${update.id}`), ...searchShortcuts.map(doc => doc.href)]) {
    assert(index.some(doc => doc.href === href), href);
  }
  assert.equal(new Set(searchShortcuts.map(doc => doc.href)).size, searchShortcuts.length);
});

test('new workflows and recorded evidence are discoverable', () => {
  for (const [query, path] of [['Slack memory','/dashboard/memory'],['invite roles','/dashboard/settings'],['architecture','/docs/architecture'],['Prisma','/blog/from-pull-request-to-runtime-regression']]) {
    assert(searchDocs(index, query, 10).some(doc => new URL(doc.href, 'https://osmogrep.com').pathname === path), query);
  }
  for (const doc of index) assert(!/runtime.figure:|<!--|```/.test(doc.text), doc.href);
});

test('documentation search resolves commands and engineering concepts to their actual guides', () => {
  const guides = index.filter(doc => doc.kind === 'docs');
  for (const [query, href] of [['/key', '/docs/cli'], ['model budget', '/docs/architecture'], ['retention', '/docs/memory']]) {
    assert(searchDocs(guides, query).some(doc => doc.href === href), query);
  }
});
