import assert from 'node:assert/strict';
import { getAllPostsMeta, getPostBySlug, markdownToHtml, readingTime } from '../lib/blog.ts';
import { docs } from '../lib/docs.ts';
import { dedupeBug, dedupeFix, dedupeRepro, nodeRecipe, pythonRecipe, monorepoRecipe } from '../lib/docs-examples.ts';
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

const evidence=JSON.parse((await import('node:fs')).readFileSync('public/data/catcher-acceptance.json','utf8'));
assert.equal(evidence.controlledFixture,true);
assert.equal(evidence.tokens.total,evidence.tokens.input+evidence.tokens.output);
assert(evidence.tokens.cachedInput<=evidence.tokens.input);
assert.equal(evidence.stages.reduce((sum,stage)=>sum+stage.tokens,0),evidence.tokens.total);
assert.deepEqual(evidence.observations.map(row=>[row.phase,row.exitCode,row.originalSuite,row.testsUnchanged]),[['base',0,'passed',true],['candidate',1,'passed',true],['repair',0,'passed',true]]);
assert(evidence.sandboxes.every(row=>row.cleanupConfirmed));
assert(evidence.verificationScope.includes('production job store'));
assert.equal(evidence.agentNarrativeSaved,true);
assert(evidence.limitations.length>0);
console.log('Architecture evidence checked: scoped controlled case, consistent measured tokens, differential exits, original tests and cleanup; limitations retained.');

const interaction=JSON.parse((await import('node:fs')).readFileSync('public/data/pr-interaction.json','utf8'));
const {createHash:interactionHash}=await import('node:crypto');
assert.equal(interaction.controlledFixture,true);
assert.equal(interaction.metrics.totalTokens,interaction.metrics.inputTokens+interaction.metrics.outputTokens);
assert.equal(interactionHash('sha256').update(interaction.experiment.source).digest('hex'),interaction.experiment.sourceHash);
assert.deepEqual(interaction.observations.map(row=>[row.phase,row.exitCode]),[['base',0],['left',0],['right',0],['combined',1]]);
assert(interaction.observations.every(row=>row.sourceHash===interaction.experiment.sourceHash&&row.testsUnchanged&&row.originalSuite==='passed'));
assert.equal(interaction.decision.verifiedFix,false);
assert.equal(interaction.metrics.allSandboxesClosed,true);
assert(interaction.verificationScope.includes('local test-database'));
const pairPost=getPostBySlug('two-passing-prs-one-runtime-failure');
assert(pairPost&&pairPost.content.includes(interaction.experiment.sourceHash));
assert(pairPost.content.includes('17,008'));
assert(pairPost.content.includes('116.287'));
console.log('Interaction evidence checked: immutable test, four outcomes, exact totals and explicit scope.');

const {majorUpdates}=await import('../lib/changelog.ts');
assert.equal(new Set(majorUpdates.map(update=>update.id)).size,majorUpdates.length);
for(const update of majorUpdates){
  assert(['Cloud','Terminal','Website'].includes(update.product));
  assert(update.title&&update.summary&&update.date&&update.version);
  assert(update.commits.every(hash=>/^[a-f0-9]{7,40}$/.test(hash)));
  if(update.link)assert(update.link.href.startsWith('/')||update.link.href.startsWith('https://'));
}
assert(majorUpdates.some(update=>update.id==='team-workspaces'));
assert(majorUpdates.some(update=>update.id==='differential-catcher'));
assert(majorUpdates.some(update=>update.version==='v0.3.16'));
assert(!docs.some(doc=>doc.slug==='design-system'));
console.log(`Changelog checked: ${majorUpdates.length} distinct entries, valid commit references and product links.`);

for(const recipe of [nodeRecipe,pythonRecipe,monorepoRecipe]){
  const parsed=JSON.parse(recipe);
  assert.deepEqual(Object.keys(parsed).sort(),['install','test']);
  for(const value of Object.values(parsed))assert(typeof value==='string'&&value.trim()&&value.length<=4000&&!value.includes('\0'));
}
assert(docs.some(doc=>doc.slug==='memory'));
assert(docs.some(doc=>doc.slug==='teams'));
console.log('Product documentation checked: channel memory, team access and valid setup examples.');

const runtimePost = getPostBySlug('from-pull-request-to-runtime-regression');
assert(runtimePost && runtimePost.sections.length >= 12);
assert.equal(runtimePost.card, '/blog/runtime-regression-card.png');
for (const figure of ['causal', 'experiment', 'compute']) assert.equal(runtimePost.html.split(`data-runtime-figure="${figure}"`).length - 1, 1);
assert(!markdownToHtml('<!-- runtime-figure:<script> -->').includes('<script>'));
assert(markdownToHtml('```text\n<!-- runtime-figure:causal -->\n```').includes('&lt;!-- runtime-figure:causal --&gt;'));
const diff = markdownToHtml('```diff\n- old <script>\n+ new\n```');
assert(diff.includes('code-diff-added') && diff.includes('code-diff-removed') && !diff.includes('<script>'));
const { readFileSync, existsSync } = await import('node:fs');
const { createHash } = await import('node:crypto');
const runtimeEvidence = JSON.parse(readFileSync('public/blog/runtime-regression-evidence.json', 'utf8'));
assert.equal(runtimeEvidence.controlledFixture, true);
assert.deepEqual(Object.values(runtimeEvidence.publicContext), [false, false, false]);
assert.equal(createHash('sha256').update(runtimeEvidence.experiment.source).digest('hex'), runtimeEvidence.experiment.sourceHash);
assert.deepEqual(runtimeEvidence.observations.map(row => row.exitCode), [0, 1, 0]);
assert(runtimeEvidence.observations.every(row => row.sourceHash === runtimeEvidence.experiment.sourceHash && row.originalSuite.status === 'passed' && row.originalSuite.originalTests === 'unchanged'));
assert.equal(runtimeEvidence.modelCalls.length, evidence.modelCalls);
for (const [summaryKey, callKey] of [['input','inputTokens'],['output','outputTokens'],['cachedInput','cachedInputTokens'],['total','totalTokens']]) assert.equal(runtimeEvidence.modelCalls.reduce((sum, row) => sum + row[callKey], 0), evidence.tokens[summaryKey]);
for (const stage of evidence.stages) assert.equal(runtimeEvidence.modelCalls.filter(row => row.stage === stage.name).reduce((sum, row) => sum + row.totalTokens, 0), stage.tokens);
assert.equal(runtimeEvidence.decision.patchApplied, false);
assert(runtimeEvidence.limits.length >= 4);
for (const asset of [runtimePost.cover, runtimePost.card]) assert(existsSync(`public${asset}`));
console.log('Runtime article checked: safe figure markers/diff rendering, real source hash, three outcomes, usage sums, original-suite preservation, limits and artwork.');

const tinygradPost=getPostBySlug('tinygrad-jit-input-rebinding');
const tinygrad=JSON.parse(readFileSync('public/data/tinygrad-jit-verification.json','utf8'));
assert(tinygradPost?.coverAlt && tinygradPost.sections.length>=7);
assert.equal(tinygrad.results.suite.total,94);
for(const counts of [tinygrad.results.suite.withoutFix,tinygrad.results.suite.withFix])assert.equal(counts.passed+counts.failed+counts.skipped,tinygrad.results.suite.total);
assert.equal(tinygrad.results.suite.identicalFileBlobs.length,3);
assert.equal(tinygrad.results.extraCases.writtenAfterRepair,true);
assert.equal(tinygrad.runs.length,10);
const tinygradCalls=tinygrad.runs.flatMap(run=>run.modelCalls);
assert.equal(tinygradCalls.length,tinygrad.usage.modelCalls);
assert.equal(tinygradCalls.reduce((sum,call)=>sum+call.totalTokens,0),tinygrad.usage.reportedTokens);
assert(tinygrad.runs.filter(run=>run.kind==='runtime_check').every(run=>run.modelCalls.length===0));
assert(tinygrad.runs.some(run=>run.outcome.includes('Stale'))&&tinygrad.runs.some(run=>run.outcome.includes('Blocked')));
assert(tinygrad.runs.every(run=>/^https:\/\/github.com\/kaushal07wick\/tinygrad\//.test(run.githubReport)));
for(const asset of [tinygradPost.cover,tinygradPost.card,'/blog/tinygrad-jit-binding.svg'])assert(existsSync('public'+asset));
assert(tinygradPost.content.includes('Claude Code authored the repair. OsmoGrep executed the verification.'));
assert(tinygradPost.content.includes('Gradient state is not carried'));
assert(tinygradPost.content.includes('45,183'));
console.log('Tinygrad article checked: attributed repair, exact counts, identical test blobs, complete attempt ledger, model usage, post-repair checks and scope.');

for (const kind of ['summary','binding','results','sources']) assert.equal(tinygradPost.html.split(`data-tinygrad-figure="${kind}"`).length-1,1);
assert(!markdownToHtml('<!-- tinygrad-figure:<script> -->').includes('<script>'));
assert(markdownToHtml('```text\n<!-- tinygrad-figure:binding -->\n```').includes('&lt;!-- tinygrad-figure:binding --&gt;'));
assert(existsSync('public/blog/tinygrad-logo.svg'));
console.log('Tinygrad figures checked: three explicit typed markers, escaped invalid markers and official logo asset.');
