import assert from 'node:assert/strict';
import { getAllPostsMeta, getPostBySlug, markdownToHtml, readingTime } from '../lib/blog.ts';
import { docs } from '../lib/docs.ts';
import { dedupeBug, dedupeFix, dedupeRepro } from '../lib/docs-examples.ts';
import vm from 'node:vm';
assert.equal(new Set(docs.map(doc => doc.slug)).size, docs.length);
for (const post of getAllPostsMeta()) {
  const article = getPostBySlug(post.slug);
  assert(article);
  assert(post.readingMinutes >= 1);
  assert(!article.html.includes('<h1>'), 'The page header owns the single article h1.');
  assert(!article.content.includes('--autoloop'), 'Do not advertise unverified CLI flags.');
}
assert.equal(getPostBySlug('../../README'), null);
assert.equal(getPostBySlug('does-not-exist'), null);
assert.equal(readingTime(''), 1);
assert.equal(readingTime(Array(201).fill('word').join(' ')), 2);
const html = markdownToHtml('[link](/docs" onclick="alert(1))\n![image" onerror="x](/image.png)\n<script>alert(1)</script>');
assert(!html.includes(' onclick="'));
assert(!html.includes(' onerror="'));
assert(!html.includes('<script>'));
assert(markdownToHtml('```sh\nnode example.js\n```').includes('<pre><code>node example.js</code></pre>'));
const table = markdownToHtml('| Check | Result |\n| --- | --- |\n| Repro | **Failed** |\n| HTML | <script>bad</script> |');
assert(table.includes('<th scope="col">Check</th>'));
assert(table.includes('<td><strong>Failed</strong></td>'));
assert(!table.includes('<script>'));
assert(markdownToHtml('1. Inspect\n2. Reproduce\n\n- Preserve tests').includes('</ol>\n<ul>'));
assert(markdownToHtml('> Scoped evidence').includes('<blockquote><p>Scoped evidence</p></blockquote>'));
const headings = markdownToHtml('## Results\n## Results\n```text\n## Not a heading\n```');
assert(headings.includes('id="results"'));
assert(headings.includes('id="results-2"'));
const article = getPostBySlug('runtime-loop-from-lint-to-soak');
assert(article.sections.length >= 8);
for (const section of article.sections) assert(article.html.includes(`id="${section.id}"`));
const trial = JSON.parse((await import('node:fs')).readFileSync('public/blog/runtime-trial.json', 'utf8'));
assert.deepEqual(trial.snapshots.map(row => [row.urlsAdded, row.replayExitCode]), [[3, 0], [0, 1], [3, 0]]);
console.log('Content checks passed: post loading, reading time, single article headings, slug confinement, and HTML attribute escaping.');

for (const [source, expected] of [[dedupeBug, false], [dedupeFix, true]]) {
  const exported = {};
  const context = vm.createContext({ exports: exported, URL, require: name => name === './tabs.cjs' ? exported : name === 'node:assert/strict' ? assert : (() => { throw Error('Unexpected module'); })(), console: { log() {} } });
  vm.runInContext(source, context);
  const run = () => vm.runInContext(dedupeRepro, context);
  if (expected) run(); else assert.throws(run, /Distinct URLs/);
}
console.log('Documentation example: same reproducer fails before the fix and passes afterward.');
