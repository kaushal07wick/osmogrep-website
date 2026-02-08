import Link from 'next/link';
import WebShellPreview from '../components/WebShellPreview';
import WaitlistForm from '../components/WaitlistForm';

const features = [
  {
    title: 'Zero Setup Runtime Checks',
    text: 'Launch full runtime analysis in the browser without local installation.',
  },
  {
    title: 'Secure Workspace Sessions',
    text: 'Ephemeral isolated environments for safe review and patch workflows.',
  },
  {
    title: 'Parallel Test Execution',
    text: 'Run broad test matrices and stress profiles from one unified interface.',
  },
  {
    title: 'Patch + Verify Loop',
    text: 'Generate candidate fixes and validate them immediately against your suite.',
  },
  {
    title: 'Team Collaboration',
    text: 'Share session snapshots and findings across engineering and security teams.',
  },
  {
    title: 'Audit Trails',
    text: 'Track every run, generated patch, and decision with reproducible logs.',
  },
];

export default function WebShellPage() {
  return (
    <main className="min-h-screen pt-24 pb-24">
      <section className="container mx-auto max-w-[1200px] px-6">
        <div className="page-chip">
          Coming Soon
        </div>
        <h1 className="text-4xl md:text-6xl font-bold font-space text-accent max-w-4xl leading-tight">
          Osmogrep Web Shell
        </h1>
        <p className="mt-5 text-lg text-ink-light max-w-3xl leading-relaxed">
          A hosted runtime engineering workspace where your team can run inspections,
          validate patches, and collaborate on reliability decisions without local setup.
        </p>
      </section>

      <section className="container mx-auto max-w-[1200px] px-6 mt-10">
        <div className="rounded-xl overflow-hidden border border-grid shadow-sm bg-white/55">
          <WebShellPreview />
        </div>
      </section>

      <section className="container mx-auto max-w-[1200px] px-6 mt-16">
        <div className="rounded-xl border border-grid bg-white/60 p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-space font-bold text-accent">What You’ll Get</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature) => (
              <article key={feature.title} className="p-5 rounded-lg border border-grid bg-white/65">
                <h3 className="text-lg font-semibold text-ink">{feature.title}</h3>
                <p className="mt-2 text-sm text-ink-light leading-relaxed">{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-[1200px] px-6 mt-16">
        <div className="rounded-xl border border-grid bg-white/60 p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-space font-bold text-accent">Early Access</h2>
          <p className="mt-3 text-ink-light max-w-2xl">
            Join the release list to get invited when Web Shell private beta opens.
          </p>
          <WaitlistForm source="web-shell" />
          <div className="mt-6">
            <Link href="/install" className="text-sm font-medium text-accent hover:underline">
              Need it today? Use Osmogrep locally now.
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
