export type ProductUpdate = {
  id: string;
  product: 'Cloud' | 'Terminal' | 'Website';
  version: string;
  date: string;
  title: string;
  summary: string;
  changes: string[];
  commits: string[];
  link?: { label: string; href: string };
};

export const majorUpdates: ProductUpdate[] = [
  {
    id: 'engineering-docs', product: 'Website', version: 'Documentation', date: 'November 17, 2026',
    title: 'Product docs, from first review to verification',
    summary: 'Reworked guides cover GitHub reviews, team workspaces, channel memory, project setup and verification evidence.',
    changes: ['Step-by-step guides for GitHub reviews, runtime checks, applying patches and troubleshooting.', 'Dedicated team and channel memory guides covering roles, connection setup and stored context.', 'Guided terminal quick start and a silent demo with viewport-aware playback.', 'Interactive architecture map and a measured production verification record.', 'Compact docs footer, clearer tables and copyable commands; removed operator setup notes.'],
    commits: ['5823218', '0e2560c', 'b3ade48', '53c9cc9'], link: { label: 'Explore the architecture', href: '/docs/architecture' },
  },
  {
    id: 'team-workspaces', product: 'Cloud', version: 'Team workspaces', date: 'November 16, 2026',
    title: 'A shared workspace, with individual identities',
    summary: 'Create a team, invite specific GitHub users and switch between personal and company workspaces.',
    changes: ['Identity-bound invitations with explicit acceptance and expiry.', 'Owner, Admin and Member permissions, checked on protected requests.', 'Separate repositories, reviews and memory for each workspace.', 'Team onboarding and member management in Settings; existing personal workspaces stay intact.'],
    commits: ['afbc381', 'e6d3304'], link: { label: 'Workspace settings', href: 'https://app.osmogrep.com/dashboard/settings' },
  },
  {
    id: 'memory-connections', product: 'Cloud', version: 'Memory connections', date: 'November 16, 2026',
    title: 'Selected channel context, with visible provenance',
    summary: 'Memory guides account connection, channel selection and inspection of retained conversations.',
    changes: ['Multiple Slack workspaces or Discord servers per user, with connection-scoped credentials and cleanup.', 'Connection identity, selected channels and retained activity in the dashboard.', 'Repository mapping and opt-in review context; direct messages are excluded.', 'Slack OAuth exercised on the live console. Discord still requires platform app configuration.'],
    commits: ['a67a0a4', 'b2d89d4', '82f0c05', '8bcf8f0'], link: { label: 'Open Memory', href: 'https://app.osmogrep.com/dashboard/memory' },
  },
  {
    id: 'advisor-investigations', product: 'Cloud', version: 'Catcher advisors', date: 'November 16, 2026',
    title: 'A second assessment before an expensive experiment',
    summary: 'Investigator and advisor roles challenge causal reasoning and test validity while sharing one enforced budget.',
    changes: ['Pinned context prioritizes consumers, behavioral expectations, manifests and tests.', 'Structured stages and compact handoffs preserve assumptions, counterevidence and blocked results.', 'Generated test syntax and the execution contract are checked before running an experiment.', 'One controlled production case completed ten calls, 70,873 reported tokens and base-pass / candidate-fail / repair-pass proof. Both target VMs closed. This is not an accuracy benchmark.'],
    commits: ['5ac5b6b', 'a04485b', 'f96cc44', '2d043dd', 'c28ebba', '4bb1282', '0e501bb'], link: { label: 'Inspect the measured record', href: '/docs/architecture#recorded-acceptance' },
  },
  {
    id: 'review-history', product: 'Cloud', version: 'Review continuity', date: 'November 16, 2026',
    title: 'One review to follow, from request to repair',
    summary: 'Progress, verification and bounded recovery stay under a stable review identity.',
    changes: ['Live activity and working animation, retaining individual attempt evidence.', 'Complete 20-item pagination with newest-first and oldest-first ordering, including closely timed reviews.', 'Guided GitHub App installation, repository-access checks and a copyable review command.', 'Improved code-selection contrast and the original white mark on GitHub repair actions.'],
    commits: ['bd8ff3c', 'a83bba1', 'da01115', '91faf0d', '09763d0'], link: { label: 'Browse reviews', href: 'https://app.osmogrep.com/dashboard/reviews' },
  },
  {
    id: 'terminal-0-3-16', product: 'Terminal', version: 'v0.3.16', date: 'November 16, 2026',
    title: 'Install, resume and follow work locally',
    summary: 'Recent terminal releases improve installation, live editing and session controls without coupling ordinary coding to the cloud pipeline.',
    changes: ['Published npm/pnpm installation and shell-readiness checks.', 'Live file following, editor chat and stale-diff cleanup.', 'Native device workspaces, image observations and safer configuration.', 'Interrupt controls, context handoffs and local coding evaluation tools.'],
    commits: ['8cf8ae3', 'eeb0e0c', '759c48a', '45e082c', 'b6be7a1', '3c040ca', '4fdc6e9'], link: { label: 'Release v0.3.16', href: 'https://github.com/kaushal07wick/OsmoGrep/releases/tag/v0.3.16' },
  },
  {
    id: 'differential-catcher', product: 'Cloud', version: 'Catcher engine', date: 'November 15, 2026',
    title: 'Verify changed behavior across captured revisions',
    summary: 'The cloud engine builds bounded context and submits focused hypotheses to the existing execution harness.',
    changes: ['Conservative screening avoids model calls for clear, trusted documentation-only cases.', 'Immutable GitHub snapshots, persisted context and shared paid-call reservations.', 'Frozen generated reproducers compare base, candidate and repair while preserving original tests.', 'Revision-scoped syntax relationships and causal history; explicit related-PR pair analysis checks individual and combined revisions.'],
    commits: ['8526107', '80133bd', 'a5f05de', '3d346b5', 'be0795a', '3100ed2', 'f7d0660', '2119d19'], link: { label: 'How verification works', href: '/docs/evidence' },
  },
  {
    id: 'bounded-cloud-execution', product: 'Cloud', version: 'Cloud execution', date: 'November 15, 2026',
    title: 'On-demand workers and bounded sandbox lifetimes',
    summary: 'Allocation, dependency setup and cleanup have explicit ownership and resource boundaries.',
    changes: ['Short-lived E2B coordinators wake for queued work and stop when idle.', 'Renewable target leases, resource measurements and abandoned-sandbox reclamation.', 'Equivalent image/resource cohorts and narrowly scoped dependency reuse.', 'Admission limits, transfer integrity checks and setup-failure handling before paid repair work.'],
    commits: ['9a8e3d9', '926464b', 'a1ae071', 'c04370b', 'f86aaa3', '54c59eb', 'c0ac3d5', '9bd474b'], link: { label: 'Runtime boundaries', href: '/docs/runtime' },
  },
  {
    id: 'inspectable-reviews', product: 'Cloud', version: 'Review evidence', date: 'November 15, 2026',
    title: 'Show what ran, what changed and why',
    summary: 'Reports put recorded facts ahead of generic completion messages.',
    changes: ['Captured PR titles, test/file counts, command times and revision details.', 'A branching map connects the issue, proposed change and verification.', 'Saved agent explanations, execution mode and inspectable patches.', 'Simplified GitHub comments, links to live repairs and sticky console navigation.'],
    commits: ['0c959c9', '9a72879', '346f890', '671bfaa', '9ad898a', '53a56e0', '1275574'], link: { label: 'Reading a report', href: '/docs/findings' },
  },
  {
    id: 'terminal-sessions', product: 'Terminal', version: 'v0.3.5–v0.3.7', date: 'November 15, 2026',
    title: 'Sessions, supervision and local agent teams',
    summary: 'Terminal updates make ongoing work easier to resume, inspect and control.',
    changes: ['Session center, local agent teams and durable budgeted task supervision.', 'Fresh sessions, editor controls and compact command/status surfaces.', 'Copying improvements, release notices and addressable completed commands.'],
    commits: ['0def2ec', 'd975660', '853aa31', 'fec5bf9', '5dd56d8', '529ec15', '8688fcf'], link: { label: 'Terminal guide', href: '/docs/cli' },
  },
  {
    id: 'hosted-review-workflow', product: 'Cloud', version: 'Hosted reviews', date: 'November 14, 2026',
    title: 'From a GitHub mention to a saved review',
    summary: 'GitHub App mentions and publication were exercised with real hosted review jobs.',
    changes: ['Findings anchored to changed lines, with failures retained in bot comments.', 'Cloud repair actions, saved sign-in returns and readable code views.', 'Client-side console navigation, local timestamps and refreshed activity charts.', 'Initial selected-channel Memory storage and OAuth handoffs.'],
    commits: ['29aeed4', '8cc6b0c', '51da1fd', 'bde72a5', '32b42bf', 'fa0c0cf', 'acc7cfc'], link: { label: 'GitHub integration', href: '/docs/github' },
  },
  {
    id: 'console-launch', product: 'Cloud', version: 'Repository console', date: 'November 13, 2026',
    title: 'GitHub sign-in and durable repository workspaces',
    summary: 'The console gained persistent accounts, repository selection and saved onboarding.',
    changes: ['Repository dashboard and dedicated Settings routes.', 'Daily analytics from recorded activity, with honest empty states.', 'Shared paper, ink and orange styling across onboarding and the console.'],
    commits: ['78be564', 'e1dd22d', 'c615d94', '64b5039'], link: { label: 'Console guide', href: '/docs/console' },
  },
  {
    id: 'website-guides', product: 'Website', version: 'Product guides', date: 'November 13–16, 2026',
    title: 'A clearer path into the product',
    summary: 'Reworked navigation, workflow guides and planned pricing for the beta.',
    changes: ['One signed-in Dashboard entry, mobile navigation and agent integration instructions.', 'New docs, engineering articles and workflow pages.', 'Planned pricing is labeled as beta; no active checkout is implied.'],
    commits: ['198dc63', 'ae4ea23', 'e055413', '0294b31', 'ea3098f', '38e4683'], link: { label: 'Planned pricing', href: '/pricing' },
  },
  {
    id: 'terminal-0-2-1', product: 'Terminal', changes: [],
    version: 'v0.2.1',
    date: 'January 19, 2026',
    title: 'Context-aware execution and indexing improvements',
    summary:
      'Improved prompt context handling, added codebase indexing, and enabled copy behavior in terminal output for faster workflows.',
    commits: ['5e6d2bf', '16d4705'],
  },
  {
    id: 'terminal-0-2-0', product: 'Terminal', changes: [],
    version: 'v0.2.0',
    date: 'January 18, 2026',
    title: 'Major UX release with multiline input support',
    summary:
      'Shipped the v0.2.0 release with a refined UX, multiline input support, and UI improvements across the agent interface.',
    commits: ['8bd43ee', '07e3f7c', '87dc6ea', 'ffc56c9'],
  },
  {
    id: 'terminal-0-1', product: 'Terminal', changes: [],
    version: 'v0.1.x',
    date: 'January 17-18, 2026',
    title: 'Stability fixes and agentic refactor',
    summary:
      'Applied foundational fixes, refactored agent flows, and cleaned supporting docs and versioning for smoother iterations.',
    commits: ['9ce92c4', '68d0010', 'e44ba00', '6a5770b'],
  },
];
