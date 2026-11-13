# osmogrep.com

Marketing site for [Osmogrep](https://github.com/kaushal07wick/OsmoGrep). Next.js 15 (App Router), React 19, Tailwind CSS 4. No UI library.

```sh
pnpm install
pnpm dev      # http://localhost:3000
pnpm test     # node --test lib/  (Node 22.18+ runs the TypeScript tests directly)
pnpm build
```

The web console lives at `app.osmogrep.com` in a separate repo. `NEXT_PUBLIC_CONSOLE_URL` points this site at it (see `.env.example`).

## Where things are

| Path | What |
| --- | --- |
| `app/` | Pages (one folder per route) and API routes (`app/api/*`) |
| `app/components/navbar/` | The header: bar cells, features panel, search menu, GitHub stars, sign-in |
| `app/components/LogoMark.tsx` | Animated logo (orbiting flaw + trailing blink). `still` renders the static mark |
| `app/components/FooterBug.tsx` | Pixel bug that walks the footer ridge |
| `app/globals.css` | Color tokens, the `.frame` box style, and every keyframe animation |
| `lib/` | Plain data and logic, no React: features copy, changelog, blog loader, search index and ranking |
| `public/brand/` | Logo files: `osmogrep-mark-light.svg`, `osmogrep-mark-dark.svg` |

## Common changes

- **Nav links** – `app/components/navbar/links.ts`. `barLinks` are the cells in the bar; `menuLinks` are the rows in the search menu (and the mobile menu).
- **Feature names and one-liners** – `lib/features.ts`. Used by the features panel and by site search. Each feature's animated preview is in `app/components/navbar/FeaturesPanel.tsx`, keyed by `slug`.
- **Changelog entries** – `lib/changelog.ts`.
- **Blog posts** – add a Markdown file to `content/blog/`. It shows up on `/blog` and in search automatically.
- **New page or docs section** – also add one line to `pages` in `lib/search.ts` so search can find it.
- **Logo timing** – `ORBIT` and `BLINK` at the top of `LogoMark.tsx`.

## Design rules

- **Colors** come from the tokens in `@theme` in `globals.css` (`paper`, `surface`, `grid`, `ink`, `ink-light`, `accent`, `pass`, `fail`). Use them as Tailwind classes (`bg-accent`, `text-ink-light`). Don't hard-code hex values in components; SVGs use `currentColor` or `fill-*` classes.
- **Boxes** use `.frame`: a pixel-stitch dashed border with corner ticks that grow and turn orange on hover (on links). Add the class to any card, panel or tooltip; it needs no extra markup.
- **Pixel art** (logo, icons, bug, star) is drawn on small grids with `shapeRendering="crispEdges"`. Keep it on whole pixels.
- **Motion** respects `prefers-reduced-motion`: CSS animations are switched off globally, and JS animations check `prefersReducedMotion()` from `lib/motion.ts` and render their still state.
- **Fonts**: Bricolage Grotesque for headings, Hanken Grotesk for body, JetBrains Mono for code and terminal-style UI.
