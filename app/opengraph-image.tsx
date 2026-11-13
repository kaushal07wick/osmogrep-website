import { ImageResponse } from 'next/og';

export const alt = 'Osmogrep - Intelligent Code Watchdog';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 56,
          color: '#f8fafc',
          background: 'linear-gradient(120deg, #0f172a 0%, #111827 42%, #0b1324 100%)',
          fontFamily: 'JetBrains Mono, Menlo, Monaco, monospace',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 82% 18%, rgba(6,182,212,0.28), transparent 38%), radial-gradient(circle at 14% 82%, rgba(16,185,129,0.2), transparent 34%)',
          }}
        />

        <div style={{ display: 'flex', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 40, fontWeight: 700 }}>
            <svg width="55" height="50" viewBox="0 0 11 10" shapeRendering="crispEdges">
              <path d="M3 0h5v1h-5zM1 1h9v1h-9zM1 2h2v1h-2zM8 2h2v1h-2zM0 3h2v1h-2zM9 3h2v1h-2zM0 4h2v1h-2zM0 5h2v1h-2zM0 6h2v1h-2zM9 6h2v1h-2zM1 7h2v1h-2zM8 7h2v1h-2zM1 8h9v1h-9zM3 9h5v1h-5z" fill="#FFFFFF" />
              <rect x="9" y="4" width="2" height="2" fill="#EA580C" />
            </svg>
            osmogrep
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 78, fontWeight: 800, lineHeight: 1.02 }}>Intelligent Code Watchdog</div>
          <div style={{ fontSize: 34, color: '#cbd5e1', maxWidth: 930, lineHeight: 1.22 }}>
            Proactive runtime analysis for high-velocity teams.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            position: 'relative',
            zIndex: 1,
            color: '#94a3b8',
            fontSize: 26,
            letterSpacing: 0.3,
          }}
        >
          osmogrep.com
        </div>
      </div>
    ),
    size
  );
}
