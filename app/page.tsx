import Hero from './components/Hero';
import FeatureCard from './components/FeatureCard';
import TerminalDemo from './components/TerminalDemo';
import AgentLoop from './components/AgentLoop';
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
      <section className="w-full py-28">
        <div className="container mx-auto max-w-[1200px] px-6">
          <div className="max-w-3xl mb-12 md:mb-14">
            <div className="page-chip mb-4">
              Core Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-accent mb-4">
              Ship faster with runtime-aware guardrails
            </h2>
            <p className="text-ink-light text-base md:text-lg leading-relaxed">
              Osmogrep continuously observes live execution, identifies risky behavior, and helps your team fix issues before they become incidents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-8">
            <FeatureCard className="bg-white/55 backdrop-blur-md border border-grid shadow-sm hover:shadow-md transition-all hover:bg-white/70" title="Runtime Monitoring" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}>
              Track memory, requests, and execution flow in real time to catch regressions and instability early.
            </FeatureCard>

            <FeatureCard className="bg-white/55 backdrop-blur-md border border-grid shadow-sm hover:shadow-md transition-all hover:bg-white/70" title="Automated Remediation" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}>
              Generate targeted fixes and validation checks when failures are detected, reducing manual debugging time.
            </FeatureCard>

            <FeatureCard className="bg-white/55 backdrop-blur-md border border-grid shadow-sm hover:shadow-md transition-all hover:bg-white/70" title="Risk Prediction" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}>
              Surface high-risk changes during development so teams can prevent production issues before deployment.
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* How It Works - Agent Loop */}
      <section className="w-full py-28 border-y border-grid/50 bg-white/20 backdrop-blur-sm">
        <div className="container mx-auto max-w-[1200px] px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-space text-accent mb-6">The Osmogrep Runtime Loop</h2>
          <p className="max-w-3xl mx-auto text-ink-light text-lg mb-14">
            Osmogrep writes and patches code, executes tests, generates missing coverage, parallelizes suites, and runs stress tests
            so production changes are validated end to end.
          </p>
          <div className="max-w-6xl mx-auto mb-10">
            <AgentLoop />
          </div>
          <p className="max-w-2xl mx-auto text-ink-light text-lg">
            Every iteration tightens quality: code generation, test execution, failure repair, parallel verification, and full soak
            testing before deployment.
          </p>
        </div>
      </section>

      {/* Deep Inspection Section */}
      <section className="w-full py-28">
        <div className="container mx-auto max-w-[1200px] px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8 animate-slide-up opacity-0 delay-300">
              <div className="page-chip">
                Deep Inspection
              </div>
              <h2 className="text-4xl text-accent font-bold leading-tight font-space text-balance">
                See what your code <br /><span className="text-accent underline decoration-grid underline-offset-4">actually does.</span>
              </h2>
              <p className="text-ink-light text-lg leading-relaxed font-inter">
                Static analysis only guesses. Osmogrep watches your code execute, building a dynamic graph of object lifecycles and thread interactions.
              </p>

              <ul className="space-y-4 pt-4">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">✓</div>
                  <span className="text-ink font-medium">Real-time Heap Snapshots</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">✓</div>
                  <span className="text-ink font-medium">Deadlock Detection</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">✓</div>
                  <span className="text-ink font-medium">Automated AST Rewrites</span>
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
      <section className="w-full py-28 border-t border-grid/50 bg-white/10 backdrop-blur-sm">
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
