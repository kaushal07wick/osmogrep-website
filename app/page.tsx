import Hero from './components/Hero';
import FeatureCard from './components/FeatureCard';
import TerminalDemo from './components/TerminalDemo';
import InsightsShowcase from './components/InsightsShowcase';
import { FaApple, FaLinux, FaWindows } from 'react-icons/fa6';
import { SiGnuemacs, SiIntellijidea, SiNeovim } from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';

const runtimeTargets = [
  {
    name: 'Windows',
    icon: <FaWindows className="w-5 h-5" aria-hidden="true" />,
  },
  {
    name: 'macOS',
    icon: <FaApple className="w-5 h-5" aria-hidden="true" />,
  },
  {
    name: 'Linux',
    icon: <FaLinux className="w-5 h-5" aria-hidden="true" />,
  },
  {
    name: 'VS Code',
    icon: <VscVscode className="w-5 h-5" aria-hidden="true" />,
  },
  {
    name: 'Neovim',
    icon: <SiNeovim className="w-5 h-5" aria-hidden="true" />,
  },
  {
    name: 'Emacs',
    icon: <SiGnuemacs className="w-5 h-5" aria-hidden="true" />,
  },
  {
    name: 'IntelliJ',
    icon: <SiIntellijidea className="w-5 h-5" aria-hidden="true" />,
  },
];

export default function Home() {
  return (
    <main className="flex flex-col items-center pb-32">

      <Hero />

      {/* Primary Features - Glass Cards */}
      <section className="w-full py-24 bg-white/30 border-y border-grid/40">
        <div className="container mx-auto max-w-[1200px] px-6">
          <div className="max-w-3xl mb-10 md:mb-10">
            <div className="page-chip mb-4">
              Core Agent Loop
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-accent mb-4">
              From prompt to patch to verification.
            </h2>
            <p className="text-ink-light text-base md:text-lg leading-relaxed">
              Osmogrep runs as a local terminal agent with explicit tools. It inspects code, proposes edits,
              executes commands, and validates changes with tests before you ship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-6">
            <FeatureCard className="bg-white/70 backdrop-blur-sm border border-grid shadow-sm hover:shadow-md transition-all hover:bg-white/85" title="Interactive TUI Session" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L3 19l1.1-3.3A6.963 6.963 0 013 12c0-3.866 3.582-7 8-7s8 3.134 8 7z" /></svg>}>
              Stream agent responses and tool logs in one place with clear separation between input, execution, and output.
            </FeatureCard>

            <FeatureCard className="bg-white/70 backdrop-blur-sm border border-grid shadow-sm hover:shadow-md transition-all hover:bg-white/85" title="Tool-Driven Editing" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}>
              Use explicit tools like `read_file`, `search`, and `write_file` so every edit path stays auditable and reproducible.
            </FeatureCard>

            <FeatureCard className="bg-white/70 backdrop-blur-sm border border-grid shadow-sm hover:shadow-md transition-all hover:bg-white/85" title="Command + Control" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z" /></svg>}>
              Run shell directly with <span className="font-mono text-accent">!</span> and manage execution with slash commands like <span className="font-mono text-accent">/help</span> and <span className="font-mono text-accent">/quit</span>.
            </FeatureCard>
          </div>
        </div>
      </section>

      <InsightsShowcase />

      {/* Deep Inspection Section */}
      <section className="w-full py-24 bg-white/35 border-y border-grid/40">
        <div className="container mx-auto max-w-[1200px] px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-8 animate-slide-up opacity-0 delay-300">
              <div className="page-chip">
                Runtime Inspection
              </div>
              <h2 className="text-4xl text-accent font-bold leading-tight font-space text-balance">
                See what changed, <br /><span className="text-accent underline decoration-grid underline-offset-4">not just what compiled.</span>
              </h2>
              <p className="text-ink-light text-lg leading-relaxed font-inter">
                The agent watches changed files, surfaces risky paths, proposes targeted patches, then validates with real command output.
              </p>

              <ul className="space-y-4 pt-4">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">✓</div>
                  <span className="text-ink font-medium">Patch candidates with clear diffs</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">✓</div>
                  <span className="text-ink font-medium">Parallel test and failure replay</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">✓</div>
                  <span className="text-ink font-medium">Stress validation before release</span>
                </li>
              </ul>
            </div>

            <div className="flex-1 w-full animate-scale-in opacity-0 delay-500">
              <TerminalDemo />
            </div>
          </div>
        </div>
      </section>

      {/* Integration Grid */}
      <section className="w-full py-24 bg-white/18 border-y border-grid/40">
        <div className="container mx-auto max-w-[1200px] px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold font-space text-accent mb-4">Works where you work</h2>
            <p className="max-w-xl text-ink-light text-sm mb-6">
              Built as a terminal-first runtime tool that runs cleanly across operating systems and editor workflows.
            </p>
            <div className="inline-flex items-center gap-3 text-xs text-ink-light border border-grid rounded-full px-3 py-1 bg-white/40 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-accent"></span>
              Terminal-first and cross-platform
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {runtimeTargets.map((target) => (
              <div key={target.name} className="p-4 rounded-sm border border-grid bg-white/25 backdrop-blur-sm hover:border-accent hover:bg-white/45 transition-all cursor-default group">
                <div className="flex items-center gap-2 text-ink-light group-hover:text-accent">
                  <span className="inline-flex items-center justify-center h-8 w-8 border border-grid bg-white/70 text-ink-light group-hover:text-accent group-hover:border-accent">
                    {target.icon}
                  </span>
                  <span className="font-space font-medium">{target.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
