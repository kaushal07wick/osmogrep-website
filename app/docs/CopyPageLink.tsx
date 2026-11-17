'use client';

import { useEffect, useRef, useState } from 'react';
import { LuCheck, LuLink } from 'react-icons/lu';

export default function CopyPageLink() {
  const [status, setStatus] = useState('Copy link');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  return <button className="docs-copy-link" type="button" aria-label={status} onClick={async () => {
    try {
      await navigator.clipboard.writeText(`${location.origin}${location.pathname}${location.hash}`);
      setStatus('Link copied');
    } catch { setStatus('Try copying again'); }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus('Copy link'), 2000);
  }}>{status === 'Link copied' ? <LuCheck aria-hidden="true" /> : <LuLink aria-hidden="true" />}<span role="status">{status}</span></button>;
}
