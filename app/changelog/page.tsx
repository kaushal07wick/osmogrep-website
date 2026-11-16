import Link from 'next/link';
import { LuArrowUpRight, LuCpu, LuGlobe, LuTerminal } from 'react-icons/lu';
import { majorUpdates } from '../../lib/changelog';
import styles from './Changelog.module.css';

const icons = { Cloud: LuCpu, Terminal: LuTerminal, Website: LuGlobe };
const repositories = { Terminal: 'OsmoGrep', Website: 'osmogrep-website' };

export default function Changelog() {
  return <main className={styles.page}>
    <header className={styles.header}>
      <span className={styles.eyebrow}>CHANGELOG</span>
      <h1>What changed.</h1>
      <p>Major updates to the terminal, cloud engine and console.</p>
      <nav aria-label="Changelog products"><a href="#team-workspaces"><LuCpu aria-hidden="true"/>Cloud</a><a href="#terminal-0-3-16"><LuTerminal aria-hidden="true"/>Terminal</a><a href="#engineering-docs"><LuGlobe aria-hidden="true"/>Website</a></nav>
    </header>
    <div className={styles.timeline}>
      {majorUpdates.map(update => {
        const Icon = icons[update.product];
        return <article key={update.id} id={update.id} className={styles.entry}>
          <div className={styles.date}><span>{update.date}</span><span><Icon aria-hidden="true"/>{update.product}</span></div>
          <div className={styles.body}>
            <span className={styles.version}>{update.version}</span>
            <h2>{update.title}</h2>
            <p>{update.summary}</p>
            {update.changes.length > 0 && <ul>{update.changes.map(change => <li key={change}>{change}</li>)}</ul>}
            {update.link && <Link className={styles.guide} href={update.link.href}>{update.link.label}<LuArrowUpRight aria-hidden="true"/></Link>}
            {update.commits.length > 0 && <details className={styles.commits}><summary>{update.commits.length} commit references</summary><div>{update.commits.map(hash => update.product === 'Cloud' ? <code key={hash}>{hash}</code> : <a key={hash} href={`https://github.com/kaushal07wick/${repositories[update.product]}/commit/${hash}`} target="_blank" rel="noopener noreferrer">{hash}<LuArrowUpRight aria-hidden="true"/></a>)}</div>{update.product === 'Cloud' && <small>Build references from the private cloud repository.</small>}</details>}
          </div>
        </article>;
      })}
    </div>
    <Link className={styles.footer} href="/blog">Engineering articles<LuArrowUpRight aria-hidden="true"/></Link>
  </main>;
}
