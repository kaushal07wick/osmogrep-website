import { consoleUrl } from './console';

/* Feature copy, shared by the navbar features panel and site search. */
export const features = [
  { slug: 'runtime-checks', title: 'Runtime checks', desc: 'Your tests, run in isolation', href: '/docs#quickstart', cta: 'How checks run' },
  { slug: 'failure-replay', title: 'Failure replay', desc: 'Reproduce the bug first', href: '/docs#interaction', cta: 'See a replay' },
  { slug: 'patch-verify', title: 'Patch + verify', desc: 'Fixes proven by tests', href: '/docs#interaction', cta: 'How patches are verified' },
  { slug: 'repo-context', title: 'Repo context', desc: 'Symbols, imports, call paths', href: '/docs#quickstart', cta: 'Read about indexing' },
  { slug: 'terminal-agent', title: 'Terminal agent', desc: 'Ask in plain language', href: '/#install', cta: 'Install the CLI' },
  { slug: 'shell-commands', title: 'Shell + slash commands', desc: '! for shell, / for controls', href: '/docs#shell', cta: 'Command reference' },
  { slug: 'web-console', title: 'Web console', desc: 'Review repos in the browser', href: consoleUrl, cta: 'Sign in with GitHub' },
  { slug: 'everywhere', title: 'Works everywhere', desc: 'macOS, Linux, Windows', href: '/#install', cta: 'Install the CLI' },
];
