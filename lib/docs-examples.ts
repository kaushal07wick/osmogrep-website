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

export const nodeRecipe = JSON.stringify({ install: "npm ci --ignore-scripts", test: "npm test" }, null, 2);
export const pythonRecipe = JSON.stringify({ install: "python3 -m venv .venv && .venv/bin/pip install -r requirements.txt", test: ".venv/bin/python -m pytest -q" }, null, 2);
export const monorepoRecipe = JSON.stringify({ install: "pnpm install --ignore-scripts", test: "pnpm --filter api test" }, null, 2);
