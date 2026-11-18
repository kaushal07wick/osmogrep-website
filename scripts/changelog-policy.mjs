import assert from 'node:assert/strict';

export function validateNotes(notes, product) {
  assert(Array.isArray(notes) && notes.length <= 200, 'Use an array of at most 200 public updates.');
  const ids = new Set();
  const text = (value, max) => typeof value === 'string' && value.trim().length > 0 && value.length <= max;
  for (const note of notes) {
    assert(note && typeof note === 'object' && !Array.isArray(note), 'Invalid update.');
    assert(Object.keys(note).every(key => ['id', 'product', 'version', 'date', 'title', 'summary', 'changes', 'commits', 'link'].includes(key)), 'Unexpected update field.');
    assert(text(note.id, 100) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(note.id) && !ids.has(note.id), 'Update IDs must be unique slugs.'); ids.add(note.id);
    assert(['Cloud', 'Terminal', 'Website'].includes(note.product) && (!product || note.product === product), 'Unexpected product.');
    assert(text(note.date, 10) && /^\d{4}-\d{2}-\d{2}$/.test(note.date) && new Date(note.date).toISOString().slice(0, 10) === note.date, 'Use an ISO publication date.');
    assert(text(note.version, 80) && text(note.title, 140) && text(note.summary, 600), 'Add a concise version label, title and summary.');
    assert(Array.isArray(note.changes) && note.changes.length >= 1 && note.changes.length <= 8 && note.changes.every(line => text(line, 500)), 'Use one to eight public-facing change bullets.');
    assert(Array.isArray(note.commits) && note.commits.length <= 12 && note.commits.every(hash => /^[a-f0-9]{7,40}$/.test(hash)), 'Use real commit hashes or an empty reference list.');
    if (note.link) {
      assert(Object.keys(note.link).every(key => ['label', 'href'].includes(key)) && text(note.link.label, 100) && text(note.link.href, 500), 'Invalid guide link.');
      const url = new URL(note.link.href, 'https://osmogrep.com');
      assert(!/[\\\x00-\x20]/.test(note.link.href) && !note.link.href.startsWith('//') && url.protocol === 'https:' && !url.username && !url.password && ['osmogrep.com', 'app.osmogrep.com', 'github.com'].includes(url.hostname), 'Use an OsmoGrep or GitHub HTTPS link.');
    }
    assert(!/(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_|xox[baprs]-|sk-(?:proj-)?[A-Za-z0-9_-]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY-----|\/Users\/|\/home\/)/.test(JSON.stringify(note)), 'Public notes must not contain credentials or private local paths.');
  }
  return notes;
}

export function requireMajorNote(notes, previous, { marked = false, messages = '' } = {}) {
  const major = marked || /^Changelog:\s*major\s*$/im.test(messages) || /^\w+(?:\([^\n)]*\))?!:/m.test(messages) || /^BREAKING[ -]CHANGE:/m.test(messages);
  if (!major) return false;
  const existing = new Set(previous.map(note => note.id));
  assert(notes.some(note => !existing.has(note.id)), 'This major update needs a new public/changelog.json entry. Ordinary commits do not need an entry.');
  return true;
}
