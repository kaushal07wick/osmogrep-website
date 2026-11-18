"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { LuArrowUpRight, LuBookOpen, LuChevronDown, LuCircleHelp } from "react-icons/lu";
import { docs, docHref } from "../../lib/docs";
import { docIcons } from "./docIcons";

const groups = [...new Set(docs.map(doc => doc.group))];
function Navigation({ pathname, className, onNavigate }: { pathname: string; className: string; onNavigate?: () => void }) {
  return <nav aria-label="Documentation" className={`docs-nav ${className}`}>
    {groups.map(group => <div key={group}><p className="docs-nav-group">{group}</p>{docs.filter(doc => doc.group === group).map(doc => {
      const Icon = docIcons[doc.slug];
      return <Link key={doc.slug} href={docHref(doc.slug)} aria-current={pathname === docHref(doc.slug) ? "page" : undefined} onClick={onNavigate}><Icon aria-hidden="true" /><span>{doc.title}</span></Link>;
    })}</div>)}
  </nav>;
}

export default function DocsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const sidebar = useRef<HTMLElement>(null);
  const mobile = useRef<HTMLDetailsElement>(null);
  const [headings, setHeadings] = useState<{ id: string; text: string }[]>([]);
  const [active, setActive] = useState("");
  const current = docs.find(doc => pathname === docHref(doc.slug));
  const closeMobile = () => { if (mobile.current) mobile.current.open = false; };
  useEffect(() => {
    if (mobile.current) mobile.current.open = false;
    const container = sidebar.current?.querySelector<HTMLElement>('.docs-desktop-nav');
    const link = container?.querySelector<HTMLElement>('.docs-desktop-nav [aria-current="page"]');
    if (container && link && !matchMedia('(max-width: 900px)').matches) {
      const box = container.getBoundingClientRect(), selected = link.getBoundingClientRect();
      if (selected.top < box.top || selected.bottom > box.bottom) container.scrollTop += selected.top - box.top - container.clientHeight / 2;
    }
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".docs-prose > section[id]"));
    setHeadings(sections.map(section => ({ id: section.id, text: (section.querySelector("h2")?.textContent || "").replace(/\.$/, "") })).filter(item => item.text));
    let frame = 0;
    const sync = () => {
      frame = 0;
      let id = sections[0]?.id || "";
      for (const section of sections) if (section.getBoundingClientRect().top <= 136) id = section.id;
      setActive(id);
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(sync); };
    sync();
    addEventListener('scroll', scroll, { passive: true }); addEventListener('resize', scroll);
    return () => { cancelAnimationFrame(frame); removeEventListener('scroll', scroll); removeEventListener('resize', scroll); };
  }, [pathname, children]);
  useEffect(()=>{
    const timelines=document.querySelectorAll<HTMLOListElement>(".docs-steps-timeline");
    if(!timelines.length||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
    const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){(entry.target as HTMLElement).dataset.stepsVisible="true";observer.unobserve(entry.target);}},{threshold:0.12});
    timelines.forEach(list=>{Array.from(list.children).forEach((step,index)=>(step as HTMLElement).style.setProperty("--step-index",String(index)));observer.observe(list);});
    return()=>observer.disconnect();
  },[pathname,children]);
  return <main className="docs-shell">
    <aside ref={sidebar} className="docs-sidebar">
      <p className="docs-wordmark"><LuBookOpen aria-hidden="true" />Documentation</p>
      <details ref={mobile} className="docs-mobile-nav">
        <summary><LuBookOpen aria-hidden="true" /><span>Browse docs<small>{current?.title}</small></span><LuChevronDown aria-hidden="true" /></summary>
        <div className="docs-mobile-panel">
          <nav aria-label="Page sections" className="docs-mobile-sections"><p>On this page</p>{headings.map(heading => <a key={heading.id} href={`#${heading.id}`} onClick={closeMobile}>{heading.text}</a>)}</nav>
          <Navigation pathname={pathname} className="docs-mobile-links" onNavigate={closeMobile} />
        </div>
      </details>
      <Navigation pathname={pathname} className="docs-desktop-nav" />
      <Link className="docs-source" href="/changelog">Changelog<LuArrowUpRight aria-hidden="true" /></Link>
    </aside>
    <div className="docs-main">{children}</div>
    <aside className="docs-on-this-page"><nav aria-label="On this page"><p>On this page</p><ol>{headings.map(heading => <li key={heading.id}><a href={`#${heading.id}`} aria-current={active === heading.id ? 'location' : undefined}>{heading.text}</a></li>)}</ol></nav><a className="docs-help-link" href="https://github.com/kaushal07wick/OsmoGrep/issues"><LuCircleHelp aria-hidden="true" />Report a problem<LuArrowUpRight aria-hidden="true" /></a></aside>
  </main>;
}
