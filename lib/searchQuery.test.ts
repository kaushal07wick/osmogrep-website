// Run with: node --test lib/  (Node 22.18+/23.6+ runs TypeScript directly)
import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { SearchDoc } from './search.ts';
import { searchDocs, snippet } from './searchQuery.ts';

const doc = (title: string, text: string): SearchDoc => ({ kind: 'page', title, href: `/${title}`, text });
const index = [
  doc('Blog', 'Notes about pricing changes.'),
  doc('Pricing', 'Plans: Solo $2/mo.'),
  doc('Docs', 'Slash commands like /help and /quit.'),
];

test('title matches outrank text matches', () => {
  assert.deepEqual(searchDocs(index, 'pricing').map((d) => d.title), ['Pricing', 'Blog']);
});

test('every term must match', () => {
  assert.deepEqual(searchDocs(index, 'pricing solo').map((d) => d.title), ['Pricing']);
  assert.deepEqual(searchDocs(index, 'pricing nonexistent'), []);
});

test('empty query returns nothing', () => {
  assert.deepEqual(searchDocs(index, '   '), []);
});

test('snippet starts at the text when the match is only in the title', () => {
  assert.equal(snippet('Plans: Solo $2/mo.', ['pricing']), 'Plans: Solo $2/mo.');
});

test('snippet trims long text around the first hit', () => {
  const s = snippet(`${'x'.repeat(100)} needle ${'y'.repeat(100)}`, ['needle']);
  assert.ok(s.startsWith('…') && s.endsWith('…') && s.includes('needle'));
});
