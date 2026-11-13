import Link from 'next/link';
import { FiArrowUpRight, FiCheck, FiGitBranch, FiGitPullRequest, FiShield } from 'react-icons/fi';
import { exampleUrl } from '../../lib/console';

export default function Hero() {
  return <section className="relative w-full overflow-hidden py-12 sm:py-16 md:py-20">
    <div className="container relative mx-auto max-w-[1200px] px-4 sm:px-6">
      <div className="grid items-center gap-10 md:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div className="animate-slide-up">
          <span className="page-chip mb-6">Your code. Under review.</span>
          <h1 className="font-mono text-[3.5rem] font-bold leading-[0.97] tracking-tight text-accent sm:text-7xl lg:text-8xl">Build.<br />Break.<br /><span className="text-ink">Fix.</span></h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-light md:text-base">Find what breaks. Understand why.<br />Review your code with the checks to back it up.</p>
          <div className="mt-7 flex flex-wrap items-center gap-3"><Link href="/web" className="btn-primary gap-3 px-5 py-3 text-xs sm:text-sm">Open Web Console<FiArrowUpRight /></Link><Link href="#install" className="btn-outline px-5 py-3 text-xs sm:text-sm">Get the CLI</Link></div>
          <p className="mt-4 text-[11px] leading-relaxed text-ink-light">GitHub sign-in · isolated checks · inspectable changes</p>
        </div>
        <div className="rounded-lg border border-grid bg-surface shadow-xl shadow-stone-200/40">
          <div className="flex items-center justify-between gap-3 border-b border-grid px-4 py-4 sm:px-6"><span className="flex items-center gap-2 text-xs text-ink-light"><FiGitPullRequest className="text-accent" />checkout-demo</span><span className="rounded border border-grid px-2 py-1 text-[11px] text-ink-light">Recorded example</span></div>
          <div className="p-5 sm:p-7"><div className="mb-4 flex items-center gap-2 text-[11px] text-ink-light"><FiGitBranch />main<span className="mx-1 text-grid">/</span>Repository review</div><h2 className="text-2xl font-semibold leading-snug text-ink sm:text-3xl">One request.<br />Two orders.</h2><p className="mt-3 text-xs leading-relaxed text-ink-light">Retrying checkout creates a duplicate order and reduces stock again.</p>
            <div className="mt-6 flex items-center gap-3 rounded border border-fail/25 bg-fail/5 px-4 py-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-fail/40 text-xs text-fail">!</span><div><strong className="block text-xs font-semibold text-ink">Failure reproduced</strong><span className="text-[11px] text-ink-light">Original test suite · checkout.test.js</span></div></div>
            <div className="mt-5 grid grid-cols-2 divide-x divide-grid border-y border-grid py-4"><div><span className="block text-[11px] uppercase tracking-wider text-ink-light">Original source</span><strong className="mt-2 block text-xs font-medium text-fail">3 passed · 1 failed</strong></div><div className="pl-5"><span className="block text-[11px] uppercase tracking-wider text-ink-light">After source fix</span><strong className="mt-2 block text-xs font-medium text-pass">4 passed · 0 failed</strong></div></div>
            <div className="mt-4 flex items-center gap-2 text-[11px] text-ink-light"><FiShield className="text-pass" />Original tests unchanged<FiCheck className="ml-auto text-pass" /></div>
            <a href={exampleUrl} className="mt-6 flex items-center justify-between border-t border-grid pt-4 text-xs text-accent hover:underline">Run this example<FiArrowUpRight /></a>
          </div><p className="border-t border-grid px-5 py-3 text-[11px] leading-relaxed text-ink-light sm:px-7">Actual local execution. Source fix applied manually.</p>
        </div>
      </div>
    </div>
  </section>;
}
