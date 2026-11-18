import assert from 'node:assert/strict';
import { test } from 'node:test';
import { requireMajorNote, validateNotes } from './changelog-policy.mjs';
const note = { id: 'account-login', product: 'Cloud', version: 'Account login', date: '2026-11-18', title: 'Connect an account', summary: 'Explicit browser consent connects compatible terminal builds.', changes: ['Account credentials remain separate from GitHub credentials.'], commits: ['e8d712f'], link: { label: 'Guide', href: '/docs/cli' } };
test('ordinary commits never require or manufacture changelog entries', () => {
  for (const messages of ['fix(docs): remove a toolbar', 'feat(internal): add a helper', 'chore: update dependencies', 'test: improve coverage']) assert.equal(requireMajorNote([], [], { messages }), false);
  assert.deepEqual(validateNotes([]), []);
});
test('explicit major markers and breaking changes require a new note', () => {
  for (const options of [{ marked: true }, { messages: 'feat: connect accounts\n\nChangelog: major' }, { messages: 'feat(api)!: change access' }, { messages: 'BREAKING CHANGE: new API' }]) {
    assert.throws(() => requireMajorNote([], [], options), /new public/);
    assert.throws(() => requireMajorNote([note], [note], options), /new public/);
    assert.equal(requireMajorNote([note], [], options), true);
  }
});
test('public note schema rejects duplicates, secrets, invalid dates and unsafe links', () => {
  assert.equal(validateNotes([note], 'Cloud').length, 1);
  for (const notes of [[note, note], [{ ...note, date: '2026-02-30' }], [{ ...note, summary: 'github_pat_never-publish-me' }], [{ ...note, link: { label: 'Bad', href: 'javascript:alert(1)' } }], [{ ...note, link: { label: 'Bad', href: '//evil.example' } }], [{ ...note, internalPayload: 'private' }]]) assert.throws(() => validateNotes(notes));
  assert.throws(() => validateNotes([note], 'Website'));
});
