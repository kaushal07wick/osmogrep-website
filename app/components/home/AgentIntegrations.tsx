'use client';

import { useEffect, useState } from 'react';
import type { IconType } from 'react-icons';
import { SiClaude, SiGithubcopilot, SiGooglegemini, SiOpenai } from 'react-icons/si';
import { prefersReducedMotion } from '../../../lib/motion';
import { useInView } from '../motion/hooks';
import Reveal from '../motion/Reveal';
import { stagger } from '../motion/stagger';
import { PixelArrow } from '../ui/icons';

/* MCP + skills: pitch and install on the left; one quiet agent session on the right that types
   the skill call and ticks through the tool calls. */
const REPO = 'https://github.com/kaushal07wick/osmogrep-mcp';
/* Codex and Claude Code get the server and the skill from the installer. Other MCP clients add the
   stdio server by hand (tools only, no skill) using the same command the installer registers. */
/* Cursor's mark (a hexagonal cube with one bright facet); react-icons has no Cursor icon. */
const CursorIcon: IconType = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 1.5 21.1 6.75v10.5L12 22.5 2.9 17.25V6.75Z" opacity=".35" />
    <path d="M12 1.5 21.1 6.75 12 12 2.9 6.75Z" opacity=".7" />
    <path d="M21.1 6.75 12 22.5V12Z" />
  </svg>
);

type Client = { id: string; name: string; Icon: IconType; call: string; install?: string; config?: string };
const mcpJson = (key: string) => `{ "${key}": { "osmogrep": { "command": "node", "args": ["/path/to/osmogrep-mcp/cli/mcp.mjs"] } } }`;
const CLIENTS: Client[] = [
  { id: 'codex', name: 'Codex', Icon: SiOpenai, call: '$osmogrep-verify' },
  { id: 'claude', name: 'Claude Code', Icon: SiClaude, call: '/osmogrep-verify' },
  { id: 'cursor', name: 'Cursor', Icon: CursorIcon, call: 'use the osmogrep tools to', config: `~/.cursor/mcp.json  ${mcpJson('mcpServers')}` },
  { id: 'gemini', name: 'Gemini CLI', Icon: SiGooglegemini, call: 'use the osmogrep tools to', config: `~/.gemini/settings.json  ${mcpJson('mcpServers')}` },
  { id: 'vscode', name: 'VS Code', Icon: SiGithubcopilot, call: 'use the osmogrep tools to', config: `.vscode/mcp.json  ${mcpJson('servers')}` },
];
const STEPS: [string, string][] = [
  ['reproduce', 'text-white/55'],
  ['repair', 'text-white/55'],
  ['verify', 'text-[#7DD69A]'],
];

export default function AgentIntegrations() {
  const [client, setClient] = useState(0);
  const [copied, setCopied] = useState(false);
  const [shown, setShown] = useState(0);
  const [viewRef, seen] = useInView<HTMLDivElement>(0.3);
  const c = CLIENTS[client];
  const install = c.config ?? `git clone ${REPO}.git && cd osmogrep-mcp && node scripts/install.mjs ${c.id}`;

  useEffect(() => {
    if (!seen) return;
    if (prefersReducedMotion()) return setShown(STEPS.length);
    setShown(0);
    const ids = STEPS.map((_, i) => setTimeout(() => setShown(i + 1), 700 + i * 700));
    return () => ids.forEach(clearTimeout);
  }, [seen, client]);

  const copy = () => navigator.clipboard.writeText(install).then(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  });

  return (
    <section id="coding-agents" className="w-full scroll-mt-20 py-24 md:py-32">
      <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-6 lg:grid-cols-2">
        <Reveal>
          <p data-stagger style={stagger(0)} className="font-mono text-[12px] text-accent">mcp + skills</p>
          <h2 data-stagger style={stagger(1)} className="mt-3 text-4xl font-bold leading-tight tracking-tight text-ink md:text-5xl">
            Your coding agent,
            <br />
            with a sandbox.
          </h2>
          <p data-stagger style={stagger(2)} className="mt-5 max-w-md text-lg text-ink-light">
            Stay in Codex or Claude Code. One skill lets your agent reproduce a bug, repair it and prove the fix.
          </p>

          <div data-stagger style={stagger(3)} className="mt-8 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[13px]" role="tablist" aria-label="Choose coding agent">
            {CLIENTS.map(({ id, name, Icon }, i) => (
              <button key={id} type="button" role="tab" aria-selected={client === i} onClick={() => setClient(i)} className={`relative flex items-center gap-2 pb-1.5 transition-colors ${client === i ? 'text-ink' : 'text-ink-light hover:text-ink'}`}>
                <Icon className="h-3.5 w-3.5" aria-hidden="true" /> {name}
                <span className={`absolute inset-x-0 bottom-0 h-[2px] origin-left bg-accent transition-transform duration-200 ${client === i ? 'scale-x-100' : 'scale-x-0'}`} />
              </button>
            ))}
          </div>
          <div data-stagger style={stagger(4)} onClick={copy} title="Click to copy" className="group mt-3 flex cursor-copy items-stretch border border-dashed border-grid font-mono text-[12.5px] transition-colors hover:border-accent">
            <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap px-4 py-3 text-accent [scrollbar-width:none]">{install}</code>
            <span className={`flex w-16 shrink-0 items-center justify-center border-l border-dashed border-grid text-[11px] transition-colors ${copied ? 'bg-pass text-white' : 'text-ink-light group-hover:bg-ink group-hover:text-white'}`}>
              {copied ? 'copied' : 'copy'}
            </span>
          </div>
          {c.config && <p className="mt-2 font-mono text-[11px] text-ink-light">Clone the repo first, then add this server. Tools only; the skill installs for Codex and Claude Code.</p>}
          <div data-stagger style={stagger(5)} className="mt-5 flex gap-6 font-mono text-[12px] text-ink-light">
            <a href={REPO} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 hover:text-accent">source <PixelArrow /></a>
            <a href="/docs#coding-agents" className="group inline-flex items-center gap-2 hover:text-accent">setup and limits <PixelArrow /></a>
          </div>
        </Reveal>

        <div ref={viewRef} className="bg-ink p-6 font-mono text-[13px] leading-[26px] text-white/85 shadow-[0_30px_60px_-30px_rgba(0,0,0,.5)]">
          <p className="mb-4 text-[11px] text-white/40">{c.name.toLowerCase()}</p>
          <p><span className="text-accent">›</span> <span className="text-accent">{c.call}</span> fix the failing checkout</p>
          {STEPS.slice(0, shown).map(([s, tone], i) => (
            <p key={s + client} className={`term-in ${tone}`}>
              {'  '}osmogrep.{s} {i === 0 ? <span className="text-[#FF8A6B]">✗ base</span> : i === 1 ? <span className="text-accent">notify.ts:3</span> : '✓ 4/4'}
            </p>
          ))}
          <p className={`mt-4 text-[11px] transition-opacity duration-500 ${shown === STEPS.length ? 'text-white/50 opacity-100' : 'opacity-0'}`}>patch.diff · run.log saved</p>
        </div>
      </div>
    </section>
  );
}
