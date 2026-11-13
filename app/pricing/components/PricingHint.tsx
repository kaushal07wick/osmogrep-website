'use client';

import { useState } from 'react';

export default function PricingHint({ name, text, id }: { name: string; text: string; id: string }) {
  const [open, setOpen] = useState(false);
  return <span className="pricing-help" data-open={open} onPointerEnter={() => setOpen(true)} onPointerLeave={() => setOpen(false)} onBlur={() => setOpen(false)}>
    <button type="button" aria-label={`About ${name}`} aria-describedby={id} onFocus={() => setOpen(true)} onClick={() => setOpen(true)} onKeyDown={event => { if (event.key === 'Escape') { setOpen(false); event.stopPropagation(); } }}>i</button>
    <span role="tooltip" id={id}>{text}</span>
  </span>;
}
