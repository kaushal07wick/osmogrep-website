import { consoleUrl } from '../../lib/console';
import LogoMark from './LogoMark';
import FooterLink from './footer/FooterLink';
import FooterScene from './footer/FooterScene';

const COLUMNS = [
  { title: 'product/', links: [['CLI', '/docs#quickstart'], ['Web console', consoleUrl], ['Pricing', '/pricing'], ['Changelog', '/changelog']] },
  { title: 'learn/', links: [['Docs', '/docs'], ['Install', '/docs#quickstart'], ['Blog', '/blog']] },
  { title: 'company/', links: [['About', '/about'], ['GitHub', 'https://github.com/kaushal07wick/OsmoGrep']] },
];

/** Dark footer: brand and link columns over the animated ASCII landscape (lib/footer/scene.js). */
export default function Footer() {
  return (
    <footer className="footer-speckle relative mt-auto w-full overflow-hidden text-white">
      <div className="relative z-10 grid grid-cols-2 gap-8 px-[4.5vw] pt-11 md:grid-cols-[1.45fr_1fr_1fr_1fr] md:pt-16">
        <div className="col-span-2 md:col-span-1">
          <p className="flex items-center gap-4 font-mono text-[26px] font-bold">
            <LogoMark className="h-8" ring="#fff" />
            osmogrep
          </p>
          <p className="mt-5 max-w-[25em] text-[15px] leading-[1.75] text-[#9b968d]">
            Runtime bug catching for teams that ship every day. Run it, catch it, fix it, with proof.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="mb-5 font-mono text-[13px] text-accent">{col.title}</p>
            {col.links.map(([label, href]) => <FooterLink key={label} href={href}>{label}</FooterLink>)}
          </div>
        ))}
      </div>
      {/* the scene runs to the bottom edge; copyright and back-to-top sit on the lowest ridge */}
      <div className="relative">
        <FooterScene />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-between px-[4.5vw] pb-5 font-mono text-[13px] text-[#8b867e]">
          <span>© 2026 Osmogrep</span>
          <a href="#top" className="group pointer-events-auto flex items-center gap-2.5 text-[#a9a49b] hover:text-white">
            back to top <span className="inline-block transition-transform duration-200 group-hover:-translate-y-1 group-hover:text-accent">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
