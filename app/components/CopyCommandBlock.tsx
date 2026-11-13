'use client';

import { useState } from 'react';

type CopyCommandBlockProps = {
  code: string;
  className?: string;
};

export default function CopyCommandBlock({ code, className = '' }: CopyCommandBlockProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={`frame relative flex items-stretch font-mono text-sm ${className}`}>
      <pre className="min-w-0 flex-1 overflow-x-auto whitespace-pre-wrap px-5 py-4 leading-relaxed text-ink">{code}</pre>
      <button
        type="button"
        onClick={onCopy}
        className={`w-16 shrink-0 border-l border-dashed border-grid text-[11px] transition-colors ${copied ? 'bg-pass text-white' : 'text-ink-light hover:bg-ink hover:text-white'}`}
      >
        {copied ? '✓' : 'copy'}
      </button>
    </div>
  );
}
