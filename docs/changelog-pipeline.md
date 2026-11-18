# Major product updates

The changelog publishes intentional product updates, not a commit log. Small fixes, visual polish, routine docs, dependency updates, refactors and tests do not need an entry and do not generate one.

## Publish a major update

1. Add one entry to `public/changelog.json` in the repository delivering the capability. Group related implementation commits into one announcement.
2. Mark the PR `changelog:major`, or put a standalone `Changelog: major` line in its commit message. Breaking-change commits also require a new entry. Ordinary `feat` and `fix` commits do not automatically become announcements.
3. CI checks the public-note schema and requires a new entry for marked major work. The existing deployment publishes the note. The website refreshes deployed Cloud notes through its five-minute cache; no second website edit is needed.

The website owns Website and curated Terminal announcements. `osmogrep-web/public/changelog.json` owns Cloud announcements and is served at `https://app.osmogrep.com/changelog.json`. No private repository API, credential, model call, scheduler or new service is needed. The Rust repository is not modified by this pipeline.

```json
{
  "id": "stable-capability-slug",
  "product": "Website",
  "version": "Product update label",
  "date": "2026-11-18",
  "title": "What users can now do",
  "summary": "One short description of the delivered behavior and its scope.",
  "changes": ["One to eight concrete user-facing changes."],
  "commits": [],
  "link": { "label": "Read the guide", "href": "/docs" }
}
```

Commit references are optional; never invent a version or hash. Dates use YYYY-MM-DD. Keep historical entries and stable IDs; corrections can update an existing entry but do not count as a new major announcement. Cloud commit references remain opaque on the public page. Do not publish private source, customer data, credentials, local paths or unexecuted validation claims.

## Delivery and failure handling

- Bundled website notes and curated history ship with the website. Cloud notes appear only from the deployed Cloud feed, not an unmerged PR or the private repository's HEAD.
- The changelog and global search use the same merged notes. IDs are deduplicated, updates are sorted by publication date, and product links point to their latest entry.
- Invalid notes fail validation before either project builds. Feeds have a 256 KB limit and at most 200 updates; archive/paginate before exceeding those bounds. Keep older published updates when updating the file.
- Remote reads have a four-second timeout and schema/link/product validation. If the Cloud feed is unavailable or invalid, the website serves bundled history; Next's data cache revalidates deployed notes periodically.
- There are no generated summaries, per-commit entries or model charges. The major marker expresses human judgment about product significance. Unmarked work is not automatically classified as major.

Both repositories have a small `Major changelog policy` Actions workflow with read-only permissions. It runs on pushes, PR changes and major-label changes. Build validation checks the note file even outside Actions. Marked-major policy depends on the workflow being run; repository branch protection should require that check where merges are protected.

Run `pnpm check:changelog` in the website or `npm run check:changelog` in the backend. To check a marked change against a base locally:

```sh
CHANGELOG_BASE_SHA=<base-commit-sha> CHANGELOG_MAJOR=true node scripts/changelog.check.mjs
```
