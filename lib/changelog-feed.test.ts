import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadUpdates, mergeUpdates, updateDate } from './changelog-feed.ts';
import { majorUpdates, type ProductUpdate } from './changelog.ts';
import { buildSearchIndex } from './search.ts';
const note: ProductUpdate = { id: 'feed-fixture', product: 'Cloud', version: 'Accounts', date: '2026-11-18', title: 'Explicit account connections', summary: 'Approve connections with an existing signed-in account.', changes: ['Workspace access is checked on reads.'], commits: [] };
test('deployed cloud notes merge once, sort by publication and enter search', async () => {
  const updates = await loadUpdates(async () => Response.json([note]));
  assert.equal(updates.filter(update => update.id === note.id).length, 1);
  assert(updates.findIndex(update => update.id === note.id) < updates.findIndex(update => update.id === 'engineering-docs'));
  assert(buildSearchIndex(updates).some(doc => doc.href === '/changelog#feed-fixture'));
  assert.equal(mergeUpdates([note], [{ ...note, title: 'Corrected published title' }])[0].title, 'Corrected published title');
  assert.equal(updateDate(note.date), 'November 18, 2026');
});
test('unavailable, unsafe, conflicting and oversized feeds preserve bundled history', async () => {
  const expected = mergeUpdates(majorUpdates, []);
  const originalWarn = console.warn; console.warn = () => {};
  try {
    for (const response of [new Response('offline', { status: 503 }), Response.json([{ ...note, product: 'Website' }]), Response.json([{ ...note, id: 'engineering-docs' }]), Response.json([{ ...note, link: { label: 'Bad', href: 'javascript:alert(1)' } }]), new Response('x'.repeat(256_001), { headers: { 'content-type': 'application/json' } })]) {
      assert.deepEqual(await loadUpdates(async () => response), expected);
    }
  } finally { console.warn = originalWarn; }
});
