'use client';

import { useEffect, useState } from 'react';

/* Only methods that work today. npm, bun or brew would need a published npm wrapper / Homebrew tap first. */
const METHODS = [
  { id: 'curl', cmd: 'curl -fsSL https://osmogrep.com/install.sh | sh', note: 'macOS · Linux' },
  { id: 'cargo', cmd: 'cargo install osmogrep', note: 'any OS with Rust' },
  { id: 'source', cmd: 'git clone https://github.com/kaushal07wick/OsmoGrep && cd OsmoGrep && cargo install --path .', note: 'build it yourself' },
];

/* 8x8 pixel "copy" icon: two sheets; the front one lifts off on hover. */
const CopyIcon = () => (
  <svg viewBox="-1 -1 10 10" shapeRendering="crispEdges" className="h-4 w-4 overflow-visible" aria-hidden="true">
    <path d="M2 0h6v1H2zM7 1h1v5H7zM2 1h1v1H2z" fill="currentColor" opacity="0.5" />
    <path className="copy-front" d="M0 2h6v1H0zM0 3h1v5H0zM5 3h1v5H5zM1 7h4v1H1z" fill="currentColor" />
  </svg>
);

/**
 * Install box: method tabs on top, `~$ command` below. The command is shown in full instantly,
 * is selectable text, and clicking the row (or the copy cell) copies it.
 */
export default function CopyInstall() {
  const [method, setMethod] = useState(0);
  const [copied, setCopied] = useState(0); // a counter, so each copy replays the flash
  const m = METHODS[method];

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(0), 1400);
    return () => clearTimeout(id);
  }, [copied]);

  const copy = () => {
    // Don't hijack a drag-selection of part of the command.
    if (window.getSelection()?.toString()) return;
    navigator.clipboard.writeText(m.cmd).then(() => setCopied((c) => c + 1));
  };

  return (
    <div className="frame w-full max-w-[520px] font-mono">
      <div className="flex items-end gap-5 border-b border-dashed border-grid px-5" role="tablist" aria-label="Install method">
        {METHODS.map((x, i) => (
          <button
            key={x.id}
            type="button"
            role="tab"
            aria-selected={i === method}
            onClick={() => { setMethod(i); setCopied(0); }}
            className={`relative py-3 text-[13px] transition-colors duration-100 ${i === method ? 'text-accent' : 'text-ink-light hover:text-ink'}`}
          >
            {x.id}
            <span className={`absolute inset-x-0 -bottom-px h-[2px] origin-left bg-accent transition-transform duration-150 ${i === method ? 'scale-x-100' : 'scale-x-0'}`} />
          </button>
        ))}
        <span className="ml-auto pb-3 text-[11px] text-ink-light">{m.note}</span>
      </div>

      <div onClick={copy} className="group/copy relative flex cursor-copy items-stretch transition-colors duration-100 hover:bg-accent/[0.04]" title="Click to copy">
        <code key={m.id} className="install-cmd flex min-w-0 flex-1 items-center gap-3 px-5 py-4 text-[13.5px]">
          <span className="shrink-0 select-none text-ink">~$</span>
          <span className="overflow-x-auto whitespace-nowrap text-accent [scrollbar-width:none] selection:bg-accent selection:text-white">{m.cmd}</span>
        </code>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(m.cmd).then(() => setCopied((c) => c + 1)); }}
          aria-label={copied ? 'Copied' : `Copy: ${m.cmd}`}
          className={`relative flex w-20 shrink-0 items-center justify-center gap-1.5 border-l border-dashed border-grid text-[11px] transition-colors duration-100 active:scale-95 ${copied ? 'bg-pass text-white' : 'text-ink-light group-hover/copy:bg-ink group-hover/copy:text-white'}`}
        >
          {copied ? <span key={copied} className="copy-pop">copied</span> : <><CopyIcon /> copy</>}
        </button>
        {/* a quick flash across the row confirms the copy */}
        {copied > 0 && <span key={copied} className="copy-flash pointer-events-none absolute inset-0 bg-pass/15" aria-hidden="true" />}
      </div>
    </div>
  );
}
