import React from 'react';

export default function Logo({ className = "h-8 w-auto", color = "#EA580C" }: { className?: string, color?: string }) {
  return (
    <svg viewBox="0 0 320 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <g transform="translate(2,2)">
        <polygon points="30,4 54,18 54,46 30,60 6,46 6,18" stroke={color} strokeWidth="3.5" />
        <circle cx="30" cy="32" r="6.5" fill={color} />
        <path d="M30 10v10M30 44v10M10 32h10M40 32h10" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <path d="M14 20l7 4M39 40l7 4M14 44l7-4M39 24l7-4" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="10" cy="32" r="3" fill={color} />
        <circle cx="50" cy="32" r="3" fill={color} />
      </g>
      <text x="78" y="45" fill={color} fontFamily="var(--font-space)" fontSize="34" fontWeight="700" letterSpacing="-1.5">
        OSMOGREP
      </text>
    </svg>
  );
}
