'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import type { IconType } from 'react-icons';
import { SiClaude, SiGithubcopilot, SiGooglegemini, SiOpenai } from 'react-icons/si';
import { prefersReducedMotion } from '../../../lib/motion';
import { useInView } from '../motion/hooks';
import Reveal from '../motion/Reveal';
import { stagger } from '../motion/stagger';
import { PixelArrow } from '../ui/icons';
import CopyCommandBlock from '../CopyCommandBlock';
import ScrollDepth from '../motion/ScrollDepth';
import './agent-integrations.css';

const REPO = 'https://github.com/kaushal07wick/osmogrep-mcp';
const DOWNLOAD = `git clone ${REPO}.git &&\n  cd osmogrep-mcp &&\n  npm ci`;
const CursorIcon: IconType = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 1.5 21.1 6.75v10.5L12 22.5 2.9 17.25V6.75Z" opacity=".35" />
    <path d="M12 1.5 21.1 6.75 12 12 2.9 6.75Z" opacity=".7" />
    <path d="M21.1 6.75 12 22.5V12Z" />
  </svg>
);

type Client = { id: string; name: string; Icon: IconType; call: string; file?: string };
const CLIENTS: Client[] = [
  { id: 'codex', name: 'Codex', Icon: SiOpenai, call: '$osmogrep-verify' },
  { id: 'claude', name: 'Claude Code', Icon: SiClaude, call: '/osmogrep-verify' },
  { id: 'cursor', name: 'Cursor', Icon: CursorIcon, call: 'Use the OsmoGrep tools to', file: '~/.cursor/mcp.json' },
  { id: 'gemini', name: 'Gemini CLI', Icon: SiGooglegemini, call: 'Use the OsmoGrep tools to', file: '~/.gemini/settings.json' },
  { id: 'vscode', name: 'VS Code', Icon: SiGithubcopilot, call: 'Use the OsmoGrep tools to', file: '.vscode/mcp.json' },
];
const config = (id: string) => JSON.stringify({ [id === 'vscode' ? 'servers' : 'mcpServers']: { osmogrep: { ...(id === 'vscode' ? { type: 'stdio' } : {}), command: 'node', args: ['/absolute/path/to/osmogrep-mcp/cli/mcp.mjs'] } } }, null, 2);
const STEPS = [
  { name: 'Reproduce', detail: 'Capture the failing behavior.', mark: '↻' },
  { name: 'Repair', detail: 'Propose a focused source change.', mark: '↳' },
  { name: 'Verify', detail: 'Rerun the check. Save the evidence.', mark: '✓' },
];

export default function AgentIntegrations() {
  const [client, setClient] = useState(0);
  const [shown, setShown] = useState(0);
  const [viewRef, seen] = useInView<HTMLDivElement>(0.3);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const c = CLIENTS[client];
  const Icon = c.Icon;
  const install = c.file ? config(c.id) : `node scripts/install.mjs ${c.id}`;

  useEffect(() => {
    if (!seen) return;
    if (prefersReducedMotion()) return setShown(STEPS.length);
    setShown(0);
    const timers = STEPS.map((_, index) => setTimeout(() => setShown(index + 1), 550 + index * 700));
    return () => timers.forEach(clearTimeout);
  }, [seen, client]);

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number;
    if (event.key === 'ArrowRight') next = (index + 1) % CLIENTS.length;
    else if (event.key === 'ArrowLeft') next = (index + CLIENTS.length - 1) % CLIENTS.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = CLIENTS.length - 1;
    else return;
    event.preventDefault();
    setClient(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="coding-agents" className="agent-integrations w-full scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-[1280px] px-6">
        <Reveal className="agent-section-heading">
          <div>
            <p data-stagger style={stagger(0)} className="font-mono text-[12px] text-accent">mcp + skills</p>
            <h2 data-stagger style={stagger(1)}>Your agent.<br />With a sandbox.</h2>
          </div>
          <p data-stagger style={stagger(2)}>Connect your coding agent to OsmoGrep.<br />Reproduce, repair, and verify in your own workflow.</p>
        </Reveal>

        <Reveal className="agent-workbench">
          <div className="agent-client-tabs" role="tablist" aria-label="Choose coding agent">
            {CLIENTS.map(({ id: clientId, name, Icon: ClientIcon }, index) => (
              <button ref={element => { tabs.current[index] = element; }} key={clientId} id={`${id}-${clientId}`} type="button" role="tab" aria-selected={client === index} aria-controls={`${id}-setup`} tabIndex={client === index ? 0 : -1} onKeyDown={event => onTabKey(event, index)} onClick={() => setClient(index)}>
                <ClientIcon aria-hidden="true" />{name}
              </button>
            ))}
          </div>
          <div className="agent-workbench-body" id={`${id}-setup`} role="tabpanel" aria-labelledby={`${id}-${c.id}`}>
            <div className="agent-setup">
              <div className="agent-install-step"><h3><span>01</span>Get the connector</h3><CopyCommandBlock code={DOWNLOAD} /></div>
              <div className="agent-install-step"><h3><span>02</span>{c.file ? 'Add the server configuration' : `Connect ${c.name}`}</h3>
                {c.file && <p className="agent-config-path">{c.file}</p>}
                <CopyCommandBlock key={c.id} code={install} />
              </div>
              <p className="agent-setup-note">{c.file ? 'Merge this entry into your config and replace the absolute path. MCP tools only.' : 'Installs the MCP tools and verification skill. Open a new agent session.'}</p>
              <p className="agent-prerequisites">Node.js 22.18+ · Running OsmoGrep runtime service</p>
            </div>

            <div className="agent-session-wrap"><ScrollDepth travel={100}><div data-stagger className="scroll-scene"><div ref={viewRef} className="agent-session" aria-label={`${c.name} illustrative verification session`}>
              <div className="agent-session-bar"><span><Icon aria-hidden="true" />{c.name}</span><span>EXAMPLE SESSION</span></div>
              <div className="agent-session-content">
                <p className="agent-session-prompt"><span aria-hidden="true">›</span><span><strong>{c.call}</strong><br />Investigate the failing checkout.</span></p>
                <ol className="agent-session-steps">
                  {STEPS.map(({ name, detail, mark }, index) => <li key={`${c.id}-${name}`} data-visible={index < shown}>
                    <span className="agent-step-mark" aria-hidden="true">{mark}</span><span><strong>{name}</strong><span>{detail}</span></span>
                  </li>)}
                </ol>
                <div className="agent-session-artifacts" data-visible={shown === STEPS.length}><span>fix.patch</span><span>result.json</span><span>replay.json</span></div>
              </div>
            </div></div></ScrollDepth></div>
          </div>
          <div className="agent-workbench-footer"><span>{c.file ? 'MCP tools' : 'MCP tools + verification skill'}</span><div><a href={REPO} target="_blank" rel="noopener noreferrer">View source <PixelArrow /></a><a href="/docs/coding-agents">Setup guide <PixelArrow /></a></div></div>
        </Reveal>
      </div>
    </section>
  );
}
