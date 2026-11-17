import Hero from './components/hero/Hero';
import MeasuredRuns from './components/home/MeasuredRuns';
import HowItWorks from './components/home/HowItWorks';
import AgentIntegrations from './components/home/AgentIntegrations';

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <Hero />
      <HowItWorks />
      <MeasuredRuns />
      <AgentIntegrations />
    </main>
  );
}
