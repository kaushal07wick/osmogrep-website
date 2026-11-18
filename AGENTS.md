# Public changelog

Only substantial user-facing features, important fixes and releases belong in the public changelog. Routine docs edits, visual polish, tests, refactors and maintenance do not need an entry.

For a major website or terminal announcement, add one concise entry to `public/changelog.json` and mark the PR `changelog:major` or include a standalone `Changelog: major` line in the commit message. Breaking-change commits also require a new note. Do not create one entry per commit; group one delivered capability into one entry.

Validate with `node scripts/changelog.check.mjs`. Dates use YYYY-MM-DD. Only describe shipped, verified behavior; no secrets, private source, unsupported metrics or claims that unreleased CLI commands are already available. Cloud notes are owned by osmogrep-web and loaded from its deployed public feed. See `docs/changelog-pipeline.md`.
