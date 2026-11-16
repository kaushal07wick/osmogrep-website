import { consoleUrl, dashboardUrl } from './console.ts';
import type { SearchDoc } from './search.ts';

export const searchShortcuts: SearchDoc[] = [
  { kind: 'workspace', title: 'Dashboard', href: dashboardUrl, text: 'Open your workspace and recent activity.' },
  { kind: 'workspace', title: 'Repositories', href: new URL('/dashboard/repositories', consoleUrl).toString(), text: 'Connect repositories and browse pull requests.' },
  { kind: 'workspace', title: 'Reviews', href: new URL('/dashboard/reviews', consoleUrl).toString(), text: 'Follow running reviews, test results and proposed fixes.' },
  { kind: 'workspace', title: 'Memory', href: new URL('/dashboard/memory', consoleUrl).toString(), text: 'Manage Slack and Discord connections and selected channels.' },
  { kind: 'workspace', title: 'Team settings', href: new URL('/dashboard/settings', consoleUrl).toString(), text: 'Switch workspaces, invite teammates and manage roles.' },
  { kind: 'docs', title: 'First PR review', href: '/docs', text: 'Connect GitHub and request your first review.' },
  { kind: 'docs', title: 'Install the terminal', href: '/docs/cli#install', text: 'Install the local Rust coding agent with npm or the shell installer.' },
  { kind: 'docs', title: 'Runtime checks', href: '/docs/runtime', text: 'Run isolated tests and investigate changed behavior.' },
  { kind: 'docs', title: 'Verification evidence', href: '/docs/evidence', text: 'Compare base, PR and repair; inspect logs and patches.' },
  { kind: 'docs', title: 'Architecture', href: '/docs/architecture', text: 'Context, investigator/advisor roles, sandbox execution and measured usage.' },
  { kind: 'docs', title: 'Codex & Claude Code', href: '/docs/coding-agents', text: 'Connect MCP tools and the runtime verification skill.' },
  { kind: 'docs', title: 'Project setup', href: '/docs/configuration', text: 'Configure dependencies and test commands in .osmogrep.json.' },
  { kind: 'page', title: 'Engineering articles', href: '/blog', text: 'Real experiments, runtime regressions and agent engineering.' },
  { kind: 'page', title: 'Changelog', href: '/changelog', text: 'Major cloud, terminal and website updates.' },
  { kind: 'page', title: 'Planned pricing', href: '/pricing', text: 'Beta plans for individuals and teams.' },
  { kind: 'page', title: 'About', href: '/about', text: 'Who builds OsmoGrep.' },
];
