import type { Metadata } from 'next';
import Link from 'next/link';
import { FiArrowUpRight } from 'react-icons/fi';
import { consoleUrl } from '../../lib/console';
import PricingArtwork from './components/PricingArtwork';
import PricingHint from './components/PricingHint';
import './pricing.css';

export const metadata: Metadata = {
  title: 'Pricing — plans for your workflow',
  description: 'Compare OsmoGrep plans for individual developers, runtime investigations, teams and custom deployment requirements.',
  alternates: { canonical: '/pricing' },
};

const plans = [
  { art: 'solo' as const, name: 'Solo', price: '2', note: 'A place to begin.', detail: 'For a developer exploring the local workflow.', features: ['Individual development', 'Local CLI workflow', 'Your provider setup'], href: '/docs/cli#install', action: 'Start with the CLI', tooltip: 'The Rust CLI is a local application. Model credentials and provider usage are configured separately.' },
  { art: 'pro' as const, name: 'Solo Pro', price: '10', note: 'Follow the question further.', detail: 'For deeper investigations, from a concern to evidence.', features: ['Focused reproduction', 'Repair and replay workflow', 'Codex + Claude Code through MCP'], href: '/docs/coding-agents', action: 'Explore verification', tooltip: 'Connect Codex or Claude Code through MCP. Follow one investigation from reproduction to a candidate patch and verification evidence.' },
  { art: 'teams' as const, name: 'Teams', price: '200', note: 'Keep the context together.', detail: 'For a shared review process across repositories.', features: ['PR and dashboard workflow', 'Shared investigation context', 'Execution and usage boundaries'], href: '/docs/github', action: 'See the team workflow', tooltip: 'Keep pull request context, investigation results and execution boundaries together. Read the GitHub guide for the review workflow.' },
  { art: 'enterprise' as const, name: 'Enterprise', price: null, note: 'Make room for your constraints.', detail: 'For teams with their own deployment requirements.', features: ['Deployment requirements', 'Identity and repository needs', 'Operational boundaries'], href: '/docs/architecture', action: 'Read the architecture', tooltip: 'Scope a deployment around your repository access, infrastructure and operational requirements. The architecture guide explains the system boundaries.' },
];

export default function PricingPage() {
  return <main className="pricing-page">
    <section className="pricing-hero zone zone-dither">
      <div className="pricing-hero-inner">
        <div className="pricing-intro">
          <p className="pricing-eyebrow"><span /> PRICING / BUILT AROUND YOUR WORK</p>
          <h1>Keep shipping.<br /><span>Leave less to chance.</span></h1>
          <p className="pricing-deck">A starting point for every kind of builder.<br />One repository, a deeper question, or a whole team.</p>
          <Link className="pricing-hero-link" href={consoleUrl}>Explore the console <FiArrowUpRight aria-hidden="true" /></Link>
        </div>
      </div>
    </section>

    <section className="pricing-offerings" aria-labelledby="plans-title">
      <div className="pricing-section-caption"><h2 id="plans-title">Find your pace.</h2><span>MONTHLY PLANS / USD</span></div>
      <div className="pricing-ledger">
        {plans.map(({ art, name, price, note, detail, features, href, action, tooltip }, index) => <article className={`pricing-plan ${index === 1 ? 'pricing-plan-featured' : ''}`} key={name}>
          <div className="pricing-plan-top"><span>0{index + 1}</span><span>{index < 2 ? "INDIVIDUAL" : index === 2 ? "SHARED WORK" : "YOUR INFRASTRUCTURE"}</span></div>
          <h3>{name}</h3><p className="pricing-plan-note">{note}</p>
          <PricingArtwork kind={art} />
          <div className="pricing-price">{price ? <><span className="pricing-currency">$</span><strong>{price}</strong><span className="pricing-period">/ month</span></> : <strong className="pricing-custom">Let’s talk.</strong>}</div>
          <p className="pricing-plan-detail">{detail}</p>
          <div className="pricing-scope"><span>THE WORKFLOW</span><PricingHint name={name} text={tooltip} id={`plan-note-${index}`} /></div>
          <ul>{features.map(feature => <li key={feature}><span aria-hidden="true">↳</span>{feature}</li>)}</ul>
          <Link className="pricing-plan-link" href={href}>{action}<FiArrowUpRight aria-hidden="true" /></Link>
        </article>)}
      </div>
    </section>

    <section className="pricing-local" aria-labelledby="local-title">
      <div className="pricing-local-symbol" aria-hidden="true">{`{ }`}</div>
      <div><p className="pricing-eyebrow">BUILT IN THE OPEN</p><h2 id="local-title">Open source.<br />Room to explore.</h2><p>The Rust CLI and MCP connector are public. Read the code, set up your local environment, and try a concrete investigation.</p></div>
      <div className="pricing-local-links"><Link href="/docs/cli#install">Install the CLI <FiArrowUpRight aria-hidden="true" /></Link><Link href="/docs/coding-agents">Connect your coding agent <FiArrowUpRight aria-hidden="true" /></Link><a href="https://github.com/kaushal07wick/OsmoGrep" target="_blank" rel="noreferrer">View the source <FiArrowUpRight aria-hidden="true" /></a></div>
    </section>

    <section className="pricing-faq" aria-labelledby="pricing-questions"><div><p className="pricing-eyebrow">A FEW THINGS TO KNOW</p><h2 id="pricing-questions">Before you begin.</h2></div><div>
      <details><summary>Which workflow should I start with?<span aria-hidden="true">+</span></summary><p>Start with the CLI for work in your terminal, or connect Codex or Claude Code through MCP. Use the console to browse repositories and pull requests. Each plan links to its workflow guide.</p></details>
      <details><summary>Can I use OsmoGrep with my coding agent?<span aria-hidden="true">+</span></summary><p>Yes. The MCP connector and verification skill connect OsmoGrep to Codex and Claude Code. Follow the setup guide to connect a runtime service and configure access to your repository.</p></details>
      <details><summary>Does every PR need a runtime?<span aria-hidden="true">+</span></summary><p>No. Read-only source review and runtime execution are separate jobs. A sandbox run should answer a concrete behavioral question and stay within its execution limits.</p></details>
      <details><summary>Are model and VM costs included?<span aria-hidden="true">+</span></summary><p>For the local workflow, you configure your model and runtime providers and pay for their usage directly. Keep execution budgets and time limits explicit; a plan price does not imply unlimited model or VM usage.</p></details>
    </div></section>
  </main>;
}
