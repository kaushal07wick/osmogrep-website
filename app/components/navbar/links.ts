import { consoleUrl } from '../../../lib/console';

export const REPO = 'kaushal07wick/OsmoGrep';
export const REPO_URL = `https://github.com/${REPO}`;

export type NavItem = { cmd: string; href: string; desc: string };

/** Cells shown in the bar (md and up). `features` is its own cell and opens FeaturesPanel. */
export const barLinks: NavItem[] = [
  { cmd: 'pricing', href: '/pricing', desc: 'Find a plan for your workflow' },
  { cmd: 'docs', href: '/docs', desc: 'Guides and command reference' },
  { cmd: 'blog', href: '/blog', desc: 'Notes from the team' },
];

/** Rows in the search menu before anything is typed. Also the whole menu on mobile. */
export const menuLinks: NavItem[] = [
  { cmd: 'install', href: '/docs/cli#install', desc: 'Get the CLI for macOS, Linux and Windows' },
  { cmd: 'integrations', href: '/#coding-agents', desc: 'Connect Codex or Claude Code with MCP and skills' },
  ...barLinks,
  { cmd: 'changelog', href: '/changelog', desc: 'What shipped, version by version' },
  { cmd: 'about', href: '/about', desc: 'Who builds Osmogrep' },
  { cmd: 'sign-in', href: consoleUrl, desc: 'Sign in with GitHub to open the console' },
];
