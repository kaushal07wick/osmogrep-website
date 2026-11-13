import type { Metadata } from 'next';
import Link from 'next/link';
import { consoleUrl } from '../../lib/console';
import AboutHero from '../components/about/AboutHero';
import IncidentLog from '../components/about/IncidentLog';
import Principles from '../components/about/Principles';
import CopyInstall from '../components/hero/CopyInstall';
import LogoMark from '../components/LogoMark';
import Reveal from '../components/motion/Reveal';
import { stagger } from '../components/motion/stagger';
import { GithubIcon, PixelArrow } from '../components/ui/icons';
import SectionDivider from '../components/ui/SectionDivider';

export const metadata: Metadata = {
  title: 'About',
  description: 'Why Osmogrep exists: catching the runtime bugs that pass review and CI, with a fix and proof.',
};

const REPO = 'https://github.com/kaushal07wick/OsmoGrep';

/* The three ways to use the same engine. */
const SURFACES = [
  { name: 'CLI', line: 'A terminal agent inside your repo.', href: '/docs#quickstart', cta: 'Install' },
  { name: 'Web console', line: 'Paste a PR, get the evidence.', href: consoleUrl, cta: 'Open' },
  { name: 'MCP + skills', line: 'Codex and Claude Code, with a sandbox.', href: '/#coding-agents', cta: 'Connect' },
];

export default function About() {
  return (
    <main className="w-full">
      <AboutHero />
      <SectionDivider index={1} label="why" />
      <IncidentLog />
      <SectionDivider index={2} label="principles" dir={-1} />
      <Principles />
      <SectionDivider index={3} label="one engine" />

      <section className="w-full py-24 md:py-28">
        <div className="mx-auto max-w-[1280px] px-6">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p data-stagger style={stagger(0)} className="font-mono text-[12px] text-accent">one engine, three doors</p>
              <h2 data-stagger style={stagger(1)} className="mt-3 text-4xl font-bold leading-tight tracking-tight text-ink md:text-5xl">Use it where you work.</h2>
            </div>
            <p data-stagger style={stagger(2)} className="max-w-sm text-ink-light">The same run, catch and fix loop behind every surface.</p>
          </Reveal>
          <Reveal className="mt-12 grid gap-4 md:grid-cols-3">
            {SURFACES.map((s, i) => (
              <Link key={s.name} href={s.href} data-stagger style={stagger(i)} className="frame group flex min-h-[200px] flex-col bg-surface p-7">
                <span className="font-mono text-[12px] text-ink-light">0{i + 1}</span>
                <span className="mt-3 text-2xl font-bold tracking-tight text-ink group-hover:text-accent">{s.name}</span>
                <span className="mt-2 text-ink-light">{s.line}</span>
                <span className="mt-auto inline-flex items-center gap-2 pt-6 font-mono text-[13px] text-ink group-hover:text-accent">
                  {s.cta} <span className="transition-transform group-hover:translate-x-1"><PixelArrow /></span>
                </span>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      <SectionDivider index={4} label="open source" dir={-1} />

      <section className="zone zone-dither w-full py-24 md:py-28">
        <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-6 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <p data-stagger style={stagger(0)} className="font-mono text-[12px] text-accent">open source</p>
            <h2 data-stagger style={stagger(1)} className="mt-3 text-4xl font-bold leading-tight tracking-tight text-ink md:text-5xl">Read every line.</h2>
            <p data-stagger style={stagger(2)} className="mt-5 max-w-md text-lg text-ink-light">
              A tool that changes your code should be one you can audit. The CLI and the MCP server are open source.
            </p>
            <div data-stagger style={stagger(3)} className="mt-8 flex flex-wrap gap-4">
              <a href={REPO} target="_blank" rel="noopener noreferrer" className="btn-primary"><GithubIcon className="h-4 w-4" /> OsmoGrep</a>
              <a href="https://github.com/kaushal07wick/osmogrep-mcp" target="_blank" rel="noopener noreferrer" className="frame btn-outline"><GithubIcon className="h-4 w-4" /> osmogrep-mcp</a>
            </div>
          </Reveal>
          <Reveal>
            <div data-stagger className="flex items-center justify-center py-6">
              <LogoMark className="h-40" />
            </div>
          </Reveal>
        </div>
      </section>

      <SectionDivider index={5} label="start" />

      <section className="w-full py-24 md:py-28">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start gap-8 px-6">
          <h2 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-ink md:text-5xl">Catch the next one before your users do.</h2>
          <CopyInstall />
          <a href={consoleUrl} className="group inline-flex items-center gap-2 font-mono text-[13px] text-ink-light hover:text-accent">
            or open the web console <span className="transition-transform group-hover:translate-x-1"><PixelArrow /></span>
          </a>
        </div>
      </section>
    </main>
  );
}
