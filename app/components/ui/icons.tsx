/* Small icons used by the navbar. Pixel icons are drawn on a tiny grid with crisp edges. */

export const CopyIcon = () => (
  <svg viewBox="-1 -1 10 10" shapeRendering="crispEdges" className="h-4 w-4 overflow-visible" aria-hidden="true">
    <path d="M2 0h6v1H2zM7 1h1v5H7zM2 1h1v1H2z" fill="currentColor" opacity="0.5" />
    <path className="copy-front" d="M0 2h6v1H0zM0 3h1v5H0zM5 3h1v5H5zM1 7h4v1H1z" fill="currentColor" />
  </svg>
);

export const GithubIcon = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.67 0 8.2c0 3.63 2.29 6.7 5.47 7.79.4.08.55-.18.55-.39 0-.2-.01-.72-.01-1.42-2.01.38-2.53-.5-2.69-.96-.09-.24-.48-.96-.82-1.15-.28-.16-.68-.56-.01-.57.63-.01 1.08.59 1.23.84.72 1.24 1.87.89 2.33.68.07-.53.28-.89.51-1.1-1.78-.21-3.64-.92-3.64-4.1 0-.91.32-1.66.84-2.24-.08-.21-.37-1.06.08-2.2 0 0 .69-.23 2.26.86A7.6 7.6 0 0 1 8 3.8c.68 0 1.37.09 2.01.27 1.57-1.09 2.26-.86 2.26-.86.45 1.14.16 1.99.08 2.2.52.58.84 1.33.84 2.24 0 3.19-1.87 3.89-3.65 4.1.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.14.47.55.39A8.24 8.24 0 0 0 16 8.2C16 3.67 12.42 0 8 0Z" />
  </svg>
);

/** 7x7 pixel magnifier. */
export const SearchIcon = () => (
  <svg viewBox="0 0 7 7" shapeRendering="crispEdges" className="h-4 w-4" aria-hidden="true">
    <path d="M1 0h3v1H1zM0 1h1v3H0zM4 1h1v3H4zM1 4h3v1H1zM4 4h1v1H4zM5 5h1v1H5zM6 6h1v1H6z" fill="currentColor" />
  </svg>
);

/** 9x7 pixel star. Unlit, its pixels turn orange one by one in scattered order when a parent `.group` is hovered. */
const STAR = ['....x....', '...xxx...', 'xxxxxxxxx', '.xxxxxxx.', '..xxxxx..', '..xx.xx..', '.xx...xx.'];
export const PixelStar = ({ className = 'h-3 w-[15px]', lit = false }: { className?: string; lit?: boolean }) => (
  <svg viewBox="0 0 9 7" shapeRendering="crispEdges" className={className} aria-hidden="true">
    {STAR.flatMap((row, y) =>
      row.split('').map((c, x) =>
        c === 'x' ? (
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width="1"
            height="1"
            className={lit ? 'fill-accent' : 'nav-star-px'}
            style={{ transitionDelay: `${((x * 7 + y * 5) % 11) * 28}ms` }}
          />
        ) : null,
      ),
    )}
  </svg>
);

/** 7x5 pixel arrow pointing right; inherits the text color. */
export const PixelArrow = ({ className = 'h-2.5 w-3.5' }: { className?: string }) => (
  <svg viewBox="0 0 7 5" shapeRendering="crispEdges" className={className} aria-hidden="true">
    <path d="M0 2h6v1H0zM4 0h1v1H4zM5 1h1v1H5zM5 3h1v1H5zM4 4h1v1H4z" fill="currentColor" />
  </svg>
);
