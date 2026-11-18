'use client';

import { useState } from 'react';
import CopyCommandBlock from '../CopyCommandBlock';
import { SiNpm, SiPnpm } from 'react-icons/si';
import styles from './CopyInstall.module.css';

const METHODS = [
  { id: 'npm', icon: SiNpm, cmd: 'npm install -g osmogrep', note: 'Node.js 22.19+' },
  { id: 'pnpm', icon: SiPnpm, cmd: 'pnpm add -g osmogrep', note: 'Node.js 22.19+' },
  { id: 'curl', icon: null, cmd: 'curl -fsSL https://osmogrep.com/install.sh | sh', note: 'macOS · Linux' },
  { id: 'cargo', icon: null, cmd: 'cargo install --git https://github.com/kaushal07wick/OsmoGrep --locked', note: 'Rust 1.89+' },
  { id: 'source', icon: null, cmd: 'git clone https://github.com/kaushal07wick/OsmoGrep && cd OsmoGrep && cargo install --path . --locked', note: 'Rust 1.89+' },
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
            {x.icon && <x.icon aria-hidden="true" />}
            {x.id}
          </button>
        ))}
        <span className={styles.note}>{m.note}</span>
      </div>

      <CopyCommandBlock key={m.id} className={styles.command} code={m.cmd} />
    </div>
  );
}
