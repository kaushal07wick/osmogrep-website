import { consoleUrl } from './console';

/* Feature copy, shared by the navbar features panel and site search. */
export const features = [
  { slug: 'runtime-checks', title: 'Runtime checks', desc: 'Your tests, run in isolation', href: '/docs#quickstart', cta: 'How checks run' },
  { slug: 'failure-replay', title: 'Failure replay', desc: 'Reproduce the bug first', href: '/docs#interaction', cta: 'See a replay' },
  { slug: 'patch-verify', title: 'Patch + verify', desc: 'Fixes proven by tests', href: '/docs#interaction', cta: 'How patches are verified' },
  { slug: 'terminal-agent', title: 'Terminal agent', desc: 'Ask in plain language', href: '/docs#quickstart', cta: 'Install the CLI' },
  { slug: 'mcp-skills', title: 'MCP + skills', desc: 'Codex and Claude Code, verified', href: '/#coding-agents', cta: 'Connect your agent' },
  { slug: 'web-console', title: 'Web console', desc: 'Review repos in the browser', href: consoleUrl, cta: 'Sign in with GitHub' },
];
