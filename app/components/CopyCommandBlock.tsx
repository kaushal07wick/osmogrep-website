'use client';

import { useEffect, useId, useRef, useState, type MouseEvent } from 'react';
import { CopyIcon } from './ui/icons';

type CopyCommandBlockProps = {
  code: string;
  className?: string;
};

export default function CopyCommandBlock({ code, className = '' }: CopyCommandBlockProps) {
  const codeId = useId();
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const onCopy = async (event: MouseEvent<HTMLButtonElement>) => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed && event.currentTarget.contains(selection.anchorNode)) return;
    let next: 'copied' | 'error' = 'copied';
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      next = 'error';
    }
    if (timer.current) clearTimeout(timer.current);
    setStatus(next);
    timer.current = setTimeout(() => setStatus('idle'), 1800);
  };

  return (
    <button type="button" onClick={onCopy} className={`copy-command ${className}`} data-copy-state={status} aria-label="Copy to clipboard" aria-describedby={codeId} title="Click anywhere to copy">
      <code id={codeId} className="copy-command-code">{code}</code>
      <span className="copy-command-status" role="status" aria-live="polite">{status === 'copied' ? <>✓ Copied</> : status === 'error' ? 'Retry copy' : <><CopyIcon /><span>Copy</span></>}</span>
    </button>
  );
}
