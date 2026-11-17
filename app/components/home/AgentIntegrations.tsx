import Link from 'next/link';
import { SiClaude, SiGithubcopilot, SiGooglegemini, SiOpenai } from 'react-icons/si';
import { FiArrowUpRight } from 'react-icons/fi';
import { consoleUrl } from '../../../lib/console';
import Reveal from '../motion/Reveal';
import './agent-integrations.css';

export default function AgentIntegrations() {
  return (
    <section id="coding-agents" aria-labelledby="agents-title" className="agent-integrations">
      <Reveal>
        <h2 id="agents-title">Your workflow. Your choice.</h2>
        <div className="agent-brands" aria-label="Coding agent integrations">
          <span><SiOpenai aria-hidden="true" />Codex</span><span><SiClaude aria-hidden="true" />Claude Code</span><span><SiGooglegemini aria-hidden="true" />Gemini CLI</span><span><SiGithubcopilot aria-hidden="true" />VS Code</span>
        </div>
        <div className="agent-actions"><a href={consoleUrl}>Review a PR <FiArrowUpRight aria-hidden="true" /></a><Link href="/docs/coding-agents">Connect your agent <FiArrowUpRight aria-hidden="true" /></Link><Link href="/docs/cli">Terminal CLI <FiArrowUpRight aria-hidden="true" /></Link></div>
      </Reveal>
    </section>
  );
}
