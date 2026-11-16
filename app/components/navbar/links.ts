export const REPO = 'kaushal07wick/OsmoGrep';
export const REPO_URL = `https://github.com/${REPO}`;

export type NavItem = { cmd: string; href: string; desc: string };

/** Cells shown in the bar (md and up). `features` is its own cell and opens FeaturesPanel. */
export const barLinks: NavItem[] = [
  { cmd: 'pricing', href: '/pricing', desc: 'Find a plan for your workflow' },
  { cmd: 'docs', href: '/docs', desc: 'Guides and command reference' },
  { cmd: 'blog', href: '/blog', desc: 'Experiments and engineering articles' },
];
