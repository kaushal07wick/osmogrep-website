'use client';

import { useEffect, useState } from 'react';
import CopyCommandBlock from '../components/CopyCommandBlock';

export default function Docs() {
  const [activeSection, setActiveSection] = useState('quickstart');

  const sections = [
    { id: 'quickstart', label: 'Quickstart' },
    { id: 'interaction', label: 'Agent Interaction' },
    { id: 'shell', label: 'Shell Commands (!)' },
    { id: 'slash', label: 'Slash Commands (/)' },
    { id: 'faq', label: 'FAQ' },
  ];

  const quickstartCmd = `$ cargo install osmogrep\n$ cd your-repo\n$ osmogrep`;
  const interactionCmd = `Find risky code paths around auth token refresh.
Generate tests for the changed files and run them.
Patch the flaky test and explain what changed.`;
  const shellCmd = `!git status
!rg "TODO|FIXME" src
!cargo test -q`;
  const slashCmd = `/help
/clear
/key
/quit
/q
/exit`;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0.2, 0.5, 0.8] },
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen pt-28 pb-24">
      <section className="container mx-auto max-w-[1200px] px-6">
        <div className="max-w-4xl">
          <div className="page-chip mb-6">Docs</div>
          <h1 className="text-4xl md:text-5xl font-bold font-space text-accent mb-4">Osmogrep Documentation</h1>
          <p className="text-lg text-ink-light max-w-2xl">
            Osmogrep is an interactive terminal experience where you can type prompts, review generated code,
            run shell commands, and iterate with the agent in real time.
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-[1200px] px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3">
          <div className="lg:sticky lg:top-24 rounded-sm border border-grid bg-white/75 backdrop-blur-sm p-4">
            <h3 className="font-space text-sm font-semibold text-accent mb-3">On This Page</h3>
            <ul className="text-sm text-ink-light grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className={`block px-2.5 py-1.5 rounded-sm border transition-colors ${
                      activeSection === section.id
                        ? 'text-accent border-accent bg-accent/5'
                        : 'border-transparent hover:text-accent hover:bg-accent/5'
                    }`}
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="lg:col-span-9 space-y-10">
          <section id="quickstart" className="rounded-sm border border-grid bg-white/70 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-space font-bold text-accent mb-3">Quickstart</h2>
            <p className="text-ink-light mb-4">Install and launch inside any git repository:</p>
            <CopyCommandBlock code={quickstartCmd} />
          </section>

          <section id="interaction" className="rounded-sm border border-grid bg-white/70 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-space font-bold text-accent mb-3">Agent Interaction</h2>
            <p className="text-ink-light mb-4">
              Type naturally to ask Osmogrep to inspect code, write patches, generate tests, and explain decisions.
              You can converse with it directly and watch output stream in the terminal UI.
            </p>
            <CopyCommandBlock code={interactionCmd} />
          </section>

          <section id="shell" className="rounded-sm border border-grid bg-white/70 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-space font-bold text-accent mb-3">Shell Commands (!)</h2>
            <p className="text-ink-light mb-4">
              Prefix with <span className="font-mono text-ink">!</span> to run shell commands directly from Osmogrep.
            </p>
            <CopyCommandBlock code={shellCmd} />
          </section>

          <section id="slash" className="rounded-sm border border-grid bg-white/70 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-space font-bold text-accent mb-3">Slash Commands (/)</h2>
            <p className="text-ink-light mb-4">
              Osmogrep supports explicit slash commands for session control and utility actions.
            </p>
            <CopyCommandBlock code={slashCmd} />
          </section>

          <section id="faq" className="rounded-sm border border-grid bg-white/70 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-space font-bold text-accent mb-4">FAQ</h2>
            <div className="space-y-4 text-ink-light text-sm">
              <div>
                <div className="font-semibold text-ink mb-1">Can I just type normal instructions?</div>
                <div>Yes. Anything that is not a slash command is treated as input to the agent conversation.</div>
              </div>
              <div>
                <div className="font-semibold text-ink mb-1">How do I run shell commands in-session?</div>
                <div>Use the <span className="font-mono text-ink">!</span> prefix to execute shell commands directly.</div>
              </div>
              <div>
                <div className="font-semibold text-ink mb-1">Which slash commands are available?</div>
                <div>Use <span className="font-mono text-ink">/help</span> to see all commands including clear, key, quit, and exit controls.</div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
