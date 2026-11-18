import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { validateNotes, requireMajorNote } from './changelog-policy.mjs';

const raw = readFileSync('public/changelog.json', 'utf8');
assert(Buffer.byteLength(raw) <= 256_000, 'Keep the public changelog feed under 256 KB.');
const notes = validateNotes(JSON.parse(raw), process.env.CHANGELOG_PRODUCT || undefined);
const base = process.env.CHANGELOG_BASE_SHA;
let previous = [], messages = '';
if (base && /^[a-f0-9]{40}$/.test(base) && !/^0+$/.test(base)) {
  execFileSync('git', ['cat-file', '-e', `${base}^{commit}`]);
  const files = execFileSync('git', ['ls-tree', '--name-only', base, '--', 'public/changelog.json'], { encoding: 'utf8' });
  if (files.trim()) previous = validateNotes(JSON.parse(execFileSync('git', ['show', `${base}:public/changelog.json`], { encoding: 'utf8' })));
  messages = execFileSync('git', ['log', '--format=%B', `${base}..HEAD`], { encoding: 'utf8', maxBuffer: 2_000_000 });
}
const currentIds = new Set(notes.map(note => note.id));
assert(previous.every(note => currentIds.has(note.id)), 'Keep published update IDs in the changelog history.');
const major = requireMajorNote(notes, previous, { marked: process.env.CHANGELOG_MAJOR === 'true', messages });
console.log(`Public changelog: ${notes.length} valid updates; ${major ? 'major-change note present' : 'ordinary change: no new entry required'}.`);
