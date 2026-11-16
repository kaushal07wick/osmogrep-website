"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { docs, docHref } from "../../lib/docs";

const groups = [...new Set(docs.map(doc => doc.group))];
export default function DocsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [headings, setHeadings] = useState<{ id: string; text: string }[]>([]);
  useEffect(() => {
    document.querySelector('.docs-desktop-nav [aria-current="page"]')?.scrollIntoView({ block: "nearest" });
    setHeadings(Array.from(document.querySelectorAll(".docs-prose > section[id]")).map(section => ({ id: section.id, text: section.querySelector("h2")?.textContent || "" })).filter(item => item.text));
  }, [pathname, children]);
  useEffect(()=>{
    const timelines=document.querySelectorAll<HTMLOListElement>(".docs-steps-timeline");
    if(!timelines.length||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
    const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){(entry.target as HTMLElement).dataset.stepsVisible="true";observer.unobserve(entry.target);}},{threshold:0.12});
    timelines.forEach(list=>{Array.from(list.children).forEach((step,index)=>(step as HTMLElement).style.setProperty("--step-index",String(index)));observer.observe(list);});
    return()=>observer.disconnect();
  },[pathname,children]);
  return <main className={`docs-shell${(pathname==="/docs/architecture"||pathname==="/docs/cli")?" docs-shell-engineering":""}`}>
    <aside className="docs-sidebar">
      <Link className="docs-wordmark" href="/docs"><span aria-hidden="true">[ ]</span> Documentation</Link>
      <label className="docs-mobile-nav">Browse the docs
        <select value={pathname.replace(/\/$/, "")} onChange={event => router.push(event.target.value)}>
          {groups.map(group => <optgroup key={group} label={group}>{docs.filter(doc => doc.group === group).map(doc => <option key={doc.slug} value={docHref(doc.slug)}>{doc.title}</option>)}</optgroup>)}
        </select>
      </label>
      <nav aria-label="Documentation" className="docs-desktop-nav">
        {groups.map(group => <div key={group}>
          <h2 className="docs-nav-heading">{group}</h2>
          {docs.filter(doc => doc.group === group).map(doc => <Link key={doc.slug} href={docHref(doc.slug)} aria-current={pathname === docHref(doc.slug) ? "page" : undefined}>{doc.title}<span aria-hidden="true">›</span></Link>)}
        </div>)}
      </nav>
      <a className="docs-source" href="https://github.com/kaushal07wick/OsmoGrep/issues">Report an issue <span aria-hidden="true">↗</span></a>
    </aside>
    <div className="docs-main">{children}</div>
    <aside className="docs-on-this-page"><nav aria-label="On this page"><p>On this page</p>{headings.map(heading => <a key={heading.id} href={`#${heading.id}`}>{heading.text}</a>)}</nav><Link href="/changelog">Changelog ↗</Link></aside>
  </main>;
}
