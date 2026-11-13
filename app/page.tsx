import Hero from './components/hero/Hero';
import TerminalSection from './components/home/TerminalSection';
import FieldGuide from './components/home/fieldGuide/FieldGuide';
import HowItWorks from './components/home/HowItWorks';
import ConsoleSection from './components/home/ConsoleSection';
import AgentIntegrations from './components/home/AgentIntegrations';
import Platforms from './components/home/Platforms';
import SectionDivider from './components/ui/SectionDivider';

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <Hero />
      <SectionDivider index={1} label="run" />
      <TerminalSection />
      <SectionDivider index={2} label="field guide" dir={-1} />
      <FieldGuide />
      <SectionDivider index={3} label="how it works" />
      <HowItWorks />
      <SectionDivider index={4} label="web console" dir={-1} />
      <ConsoleSection />
      <SectionDivider index={5} label="mcp + skills" />
      <AgentIntegrations />
      <SectionDivider index={6} label="platforms" dir={-1} />
      <Platforms />
    </main>
  );
}
