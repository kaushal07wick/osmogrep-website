import type { IconType } from 'react-icons';
import { FaApple, FaLinux, FaWindows } from 'react-icons/fa6';
import {
  SiBun, SiClaude, SiGithubactions, SiGnuemacs, SiGo, SiIntellijidea, SiJest, SiNeovim, SiNodedotjs,
  SiOpenai, SiPytest, SiPython, SiRust, SiTypescript, SiVitest, SiZedindustries,
} from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';
import Reveal from '../motion/Reveal';
import { stagger } from '../motion/stagger';

type Item = { name: string; Icon: IconType; note?: string };

/* Row 1: where you work. Row 2: test commands it drives (it runs your own test command in a shell). */
const WHERE: Item[] = [
  { name: 'macOS', Icon: FaApple }, { name: 'Linux', Icon: FaLinux }, { name: 'Windows', Icon: FaWindows },
  { name: 'VS Code', Icon: VscVscode }, { name: 'Neovim', Icon: SiNeovim }, { name: 'Zed', Icon: SiZedindustries },
  { name: 'Emacs', Icon: SiGnuemacs }, { name: 'IntelliJ', Icon: SiIntellijidea },
  { name: 'Codex', Icon: SiOpenai, note: 'mcp' }, { name: 'Claude Code', Icon: SiClaude, note: 'mcp' },
];
const RUNS: Item[] = [
  { name: 'npm test', Icon: SiNodedotjs }, { name: 'vitest', Icon: SiVitest }, { name: 'jest', Icon: SiJest },
  { name: 'tsc', Icon: SiTypescript }, { name: 'bun test', Icon: SiBun }, { name: 'pytest', Icon: SiPytest },
  { name: 'python -m', Icon: SiPython }, { name: 'cargo test', Icon: SiRust }, { name: 'go test', Icon: SiGo },
  { name: 'CI logs', Icon: SiGithubactions },
];

/** One endless row. The list renders twice and the track slides by half its width; it never pauses. */
function Row({ items, reverse = false, seconds, chip = false }: { items: Item[]; reverse?: boolean; seconds: number; chip?: boolean }) {
  return (
    <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)]">
      <div className={`marquee-track flex w-max ${reverse ? 'marquee-reverse' : ''}`} style={{ animationDuration: `${seconds}s` }}>
        {[...items, ...items].map(({ name, Icon, note }, i) => (
          <span
            key={i}
            aria-hidden={i >= items.length}
            className={`group flex shrink-0 items-center gap-3 border-r border-dashed border-grid transition-colors hover:text-accent ${chip ? 'h-16 px-7 font-mono text-[15px] text-ink-light' : 'h-24 px-10 text-xl font-bold tracking-tight text-ink/80'}`}
          >
            <Icon className={`transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-125 ${chip ? 'h-4 w-4' : 'h-6 w-6'}`} aria-hidden="true" />
            {chip && <span className="text-accent">$</span>}
            {name}
            {note && <span className="border border-accent px-1 text-[10px] font-normal text-accent">{note}</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Platforms() {
  return (
    <section className="w-full pb-14 pt-12">
      <Reveal className="mx-auto flex max-w-[1280px] flex-wrap items-end justify-between gap-6 px-6">
        <div>
          <p data-stagger style={stagger(0)} className="font-mono text-[12px] text-accent">platforms</p>
          <h2 data-stagger style={stagger(1)} className="mt-3 text-3xl font-bold leading-tight tracking-tight text-ink md:text-4xl">Works where you already work.</h2>
        </div>
        <p data-stagger style={stagger(2)} className="max-w-sm text-ink-light">Any OS, any editor, any agent. If it runs in your shell, Osmogrep can run it and watch it.</p>
      </Reveal>
      <div className="tx-film mt-10 border-y border-dashed border-grid">
        <Row items={WHERE} seconds={38} />
        <div className="border-t border-dashed border-grid">
          <Row items={RUNS} seconds={30} reverse chip />
        </div>
      </div>
    </section>
  );
}
