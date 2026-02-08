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
    <div className={`relative bg-white border border-grid text-ink p-4 rounded-sm font-mono text-sm overflow-x-auto ${className}`}>
      <button
        type="button"
        onClick={onCopy}
        className="absolute top-2 right-2 text-[10px] px-2 py-1 border border-grid rounded-sm bg-white/90 hover:border-accent hover:text-accent hover:bg-accent/5 active:bg-accent/10 transition-colors"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
      <pre className="pr-14 whitespace-pre-wrap leading-relaxed">{code}</pre>
    </div>
  );
}
