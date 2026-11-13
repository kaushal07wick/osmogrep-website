export const dedupeBug = `exports.dedupe = tabs => [...new Map(
  tabs.map(tab => [new URL(tab.url).origin, tab])
).values()];`;
export const dedupeFix = `exports.dedupe = tabs => [...new Map(
  tabs.map(tab => [tab.url, tab])
).values()];`;
export const dedupeRepro = `const assert = require('node:assert/strict');
const { dedupe } = require('./tabs.cjs');
const first = { url: 'https://example.com/docs' };
const second = { url: 'https://example.com/pricing' };

assert.deepEqual(dedupe([first, second]), [first, second],
  'Distinct URLs on the same origin must survive');
assert.deepEqual(dedupe([first, first]), [first],
  'An exact duplicate should be collapsed');
console.log('URL behavior preserved');`;
