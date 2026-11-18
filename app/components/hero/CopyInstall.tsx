'use client';

import { useState } from 'react';
import CopyCommandBlock from '../CopyCommandBlock';
import { SiNpm, SiPnpm, SiRust, SiGithub } from 'react-icons/si';
import { LuTerminal } from 'react-icons/lu';
import styles from './CopyInstall.module.css';

const METHODS = [
  { id: 'npm', icon: SiNpm, cmd: 'npm install -g osmogrep', note: 'Node.js 22.19+ · macOS, Linux & Windows' },
  { id: 'pnpm', icon: SiPnpm, cmd: 'pnpm add -g osmogrep', note: 'Node.js 22.19+ · macOS, Linux & Windows' },
  { id: 'curl', icon: LuTerminal, cmd: 'curl -fsSL https://osmogrep.com/install.sh | sh', note: 'macOS & Linux' },
  { id: 'cargo', icon: SiRust, cmd: 'cargo install --git https://github.com/kaushal07wick/OsmoGrep --locked', note: 'Rust 1.89+ · build from current source' },
  { id: 'source', icon: SiGithub, cmd: 'git clone https://github.com/kaushal07wick/OsmoGrep && cd OsmoGrep && cargo install --path . --locked', note: 'Clone, inspect & build · Rust 1.89+' },
];

export default function CopyInstall() {
  const [method, setMethod] = useState(0);
  const m = METHODS[method];

  return (
    <div className={`copy-install ${styles.frame}`}>
      <div className={styles.tabs} role="group" aria-label="Install method">
        {METHODS.map((x, i) => (
          <button
            key={x.id}
            type="button"
            aria-pressed={i === method}
            onClick={() => setMethod(i)}
            className={styles.tab}
            data-method={x.id}
          >
            <x.icon aria-hidden="true" />
            {x.id}
          </button>
        ))}
      </div>

      <div key={m.id} className={styles.commandArea}><span className={styles.prompt} aria-hidden="true">$</span><CopyCommandBlock className={styles.command} code={m.cmd} /></div>
      <div className={styles.foot}><span><SiRust aria-hidden="true" /> Native Rust</span><span>{m.note}</span></div>
    </div>
  );
}
