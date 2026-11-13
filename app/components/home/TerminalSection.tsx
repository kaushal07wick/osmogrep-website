import Reveal from '../motion/Reveal';
import { stagger } from '../motion/stagger';
import CatchScene from './CatchScene';

/** Second section: heading and short copy on the left, the run → catch → fix terminal session on the right. */
export default function TerminalSection() {
  return (
    <section className="zone zone-engraved w-full pb-24 pt-6 md:pb-32 md:pt-10">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-12 px-6 lg:grid-cols-[0.95fr_1.25fr]">
        <Reveal>
          <p data-stagger style={stagger(0)} className="font-mono text-[12px] text-accent">
            osmogrep run · osmogrep fix
          </p>
          <h2 data-stagger style={stagger(1)} className="mt-3 text-4xl font-bold leading-tight tracking-tight text-ink md:text-[44px]">
            From failing test<br className="hidden lg:block" /> to verified fix.
          </h2>
          <p data-stagger style={stagger(2)} className="mt-5 max-w-md text-lg text-ink-light">
            Run it in your repo. It finds the line that breaks at runtime, patches it, and reruns your own tests to prove it.
          </p>
        </Reveal>
        <div className="min-w-0">
          <CatchScene />
        </div>
      </div>
    </section>
  );
}
