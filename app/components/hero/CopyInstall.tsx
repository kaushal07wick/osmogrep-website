'use client';

import { useState } from 'react';
import CopyCommandBlock from '../CopyCommandBlock';

/* Only methods that work today. npm, bun or brew would need a published npm wrapper / Homebrew tap first. */
const METHODS = [
  { id: 'curl', cmd: 'curl -fsSL https://osmogrep.com/install.sh | sh', note: 'macOS · Linux' },
  { id: 'cargo', cmd: 'cargo install osmogrep', note: 'any OS with Rust' },
  { id: 'source', cmd: 'git clone https://github.com/kaushal07wick/OsmoGrep && cd OsmoGrep && cargo install --path .', note: 'build it yourself' },
];

export default function CopyInstall() {
  const [method, setMethod] = useState(0);
  const m = METHODS[method];

  return (
    <div className="copy-install w-full max-w-[520px] font-mono">
      <div className="flex items-end gap-5 border-b border-grid px-5" role="group" aria-label="Install method">
        {METHODS.map((x, i) => (
          <button
            key={x.id}
            type="button"
            aria-pressed={i === method}
            onClick={() => setMethod(i)}
            className={`relative py-3 text-[13px] transition-colors duration-100 ${i === method ? 'text-accent' : 'text-ink-light hover:text-ink'}`}
          >
            {x.id}
            <span className={`absolute inset-x-0 -bottom-px h-[2px] origin-left bg-accent transition-transform duration-150 ${i === method ? 'scale-x-100' : 'scale-x-0'}`} />
          </button>
        ))}
        <span className="ml-auto pb-3 text-[11px] text-ink-light">{m.note}</span>
      </div>

      <CopyCommandBlock key={m.id} code={m.cmd} />
    </div>
  );
}
