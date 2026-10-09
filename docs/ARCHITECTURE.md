# Architecture

A **prerendered multi-page site** built with Angular 22: every URL is a static HTML file generated at build time and then hydrated in the browser. There is no router, no backend and no runtime dependency beyond Angular. Everything is a standalone `OnPush` component; change detection is **zoneless** and driven entirely by signals.

```
            ┌──────────────── data/ (pure TS) ────────────────┐
            │  profile.ts  → career content (EN/IT/FA)        │
            │  ui.ts       → interface copy (EN/IT/FA)        │
            └───────────────┬─────────────────────────────────┘
                            │ imported
   ┌───────────── core/ ────▼───────────────┐      ┌──── layout/ ─────┐
   │ I18nService   lang · dir · ui()        │◄─────│ Nav · Footer     │
   │ ThemeService  theme                    │      │ CommandPalette   │
   │ ScrollService progress · active        │      │ Terminal (+shell)│
   │ CommandsService paletteOpen · terminal │      └──────────────────┘
   │ PageService · SeoService · SiteNav     │      ┌──── sections/ ───┐
   └────────────────────────────────────────┘◄─────│ Hero · About ·   │
                                                   │ SignalGraph ·    │
                                                   │ Experience · ... │
                                                   └──────────────────┘
```

## Pages, prerendering and hydration

| URL | Page | Count |
| --- | --- | --- |
| `/`, `/it`, `/fa` | `HomePage` (the one-page portfolio) | 3 |
| `/projects`, `/it/projects`, `/fa/projects` | `ProjectsPage` | 3 |
| `/projects/:id` (+ `/it`, `/fa`) | `ProjectPage`, one per project | 21 |
| `/404` → `404.html` | `NotFoundPage` (noindex) | 1 |

- `tools/routes.mjs` writes `routes.txt` from the project ids in `profile.ts`; the builder prerenders exactly those URLs (`prerender.routesFile`), so a new project gets its three pages automatically.
- **No client router.** `PageService.resolveRoute()` maps the URL the document was loaded with to a page, identically on the server and in the browser. Links between pages are ordinary `<a href>` page loads of static files; back/forward and `#anchors` are native. This removed ~95 kB of router code.
- Each page is its own lazy chunk (`@defer (on immediate; hydrate on immediate)` in `app.html`), and below-the-fold home sections hydrate only when scrolled into view (`hydrate on viewport`, incremental hydration). The command palette and terminal load the first time they are opened.
- `SeoService` writes the per-page `<head>` during prerendering: title, description, robots, canonical, `hreflang` alternates, Open Graph/Twitter and one JSON-LD `@graph` (built in `core/schema.ts`: WebSite, ProfilePage, Person, ProfessionalService, CollectionPage, WebPage, CreativeWork/SoftwareSourceCode, BreadcrumbList).
- `tools/postbuild.mjs` turns `/404` into `404.html` and generates `sitemap.xml` (with alternates and images), `llms.txt` and `llms-full.txt` from the prerendered pages themselves.
- `tools/seo-check.mjs` audits the output like a crawler (titles, descriptions, one h1, heading order, canonical/hreflang reciprocity, JSON-LD, breadcrumbs, alt text, every internal link and `#fragment`, sitemap coverage, robots, favicons, llms.txt, `.htaccess` rules). CI and the deploy fail on any error.

## State: signals only

| Signal | Owner | Read by |
| --- | --- | --- |
| `lang`, `dir`, `ui` | `I18nService` | every component |
| `theme` | `ThemeService` | nav, particle canvas, halftone portrait |
| `progress`, `scrolled`, `active` | `ScrollService` | nav (progress bar, scroll-spy) |
| `paletteOpen`, `terminalOpen` | `CommandsService` | app shortcuts, palette, terminal |
| `selected`, `hovered` → `focus` → `litSkills` / `litRoles` / `wires` | `SignalGraph` | its own template |

Components only *read* shared signals and call service methods to change them. Side effects that touch the DOM (`<html lang dir>`, `data-theme`, `<title>`, meta description) live in `effect`s inside the owning service, so one write updates everything.

## Internationalisation

- `data/ui.ts` is a tree of `{ en, it, fa }` leaves. `I18nService.ui()` is a `computed` that resolves the whole tree for the current language, so templates write `i18n.ui().hero.lead`, typed end to end via the `Resolve<T>` mapped type.
- Content in `data/profile.ts` uses the same `Localized` shape and is read with `i18n.t(value)`.
- The language is part of the URL: English at `/`, Italian at `/it`, Persian at `/fa`. Each language is its own prerendered page, so all three are indexable. Old `?lang=` links are 301-redirected by the host.
- Persian: `dir="rtl"` on `<html>`, Vazirmatn font, Persian digits through `i18n.num()`, and the **Gregorian** calendar (`Intl` with `calendar: 'gregory'`) so dates match the CV.
- Layout uses logical properties (`inset-inline-start`, `margin-inline-*`, `padding-inline-*`), so RTL needs very few overrides (mostly mirroring arrows and the merge curve).
- A unit test walks the whole `UI` tree and fails if any key is missing in any language.

## The interactive pieces

### Signal graph (`sections/skills`)
Edges are derived once from `EXPERIENCES[].stack`. Which nodes and wires are lit is pure `computed` logic. Wire geometry comes from measuring each node's inner edge (the side facing the other column) relative to the graph, re-measured by a `ResizeObserver`, an `IntersectionObserver`, `document.fonts.ready` and language changes. Wires are cubic Béziers in an absolutely positioned SVG; the "signal" is an animated `stroke-dashoffset`.

### Career git graph (`sections/experience`)
`buildRows()` turns experiences into `head → turin commits → merge → tehran commits → init` rows. Each row says which lane segments to draw (`full | top | bottom | none`); the gutter is pure CSS with lane positions in custom properties. Commit hashes are FNV-1a hashes of the role id, so they are stable. Expanding a commit animates `grid-template-rows: 0fr → 1fr` (no JS height measuring).

### Particle monogram (`sections/hero/particle-monogram.ts`)
Targets are sampled along the logo strokes (in its 64-unit viewBox) plus a disk for the sun. Each particle springs toward its target and is pushed away from the pointer. The loop runs only while the canvas is visible, is capped at 2× DPR, caches colour mixes, and draws a single still frame under `prefers-reduced-motion`.

### Halftone portrait (`sections/about/halftone-portrait.ts`)
The photo is downsampled to a 46×46 grid; each cell's luminance becomes a dot radius, filled with the brand gradient in one path. It is redrawn only when the theme changes.

### Command palette & terminal (`layout/`)
Both are native `<dialog>`s opened with `showModal()` from an `effect` on `CommandsService`, which gives a top layer, focus containment and Esc for free. The palette's `fuzzyScore` and `rank` are exported pure functions. The terminal's interpreter (`terminal/shell.ts`) is a pure `runShell(input, ctx) → { lines, effect }` with no Angular imports; the component only applies effects (`goto`, `lang`, `theme`, `open`, `clear`, `exit`).

## Styling

- `styles.scss` holds design tokens (`--c-*`, `--f-*`, easing, radii) for both themes, plus shared utilities (`.section`, `.kicker`, `.btn`, `.card`, `.chip`, `.reveal`).
- Components style themselves with those tokens only, so the light theme and print are just token overrides.
- `_print.scss` hides the chrome, expands every commit and prints link targets, so the site works as a CV.
- The theme is applied by an inline script in `index.html` before Angular boots, to avoid a flash.

## Performance

- Zoneless + `OnPush` + signals means change detection runs only where a signal changed.
- Canvas loops stop off-screen; ambient effects are CSS-only.
- Google Fonts load with `media="print"` → `all`, so they never block bootstrap.
- Content is in the HTML: first paint and LCP never wait for JavaScript.
- No router and no third-party runtime: ~83 kB gzip of shared JS, plus a 1–7 kB chunk for the page you are on; home sections below the fold (~38 kB raw) load only when scrolled to.

## Testing

`npm test` runs Vitest in jsdom via `@angular/build:unit-test`. `src/test-setup.ts` stubs what jsdom lacks (`IntersectionObserver`, `ResizeObserver`, `dialog.showModal`, canvas). The suites cover data integrity and translation completeness, URLs and page routing, the SEO head and JSON-LD, dates, i18n, the shell, palette ranking, signal-graph propagation and the app shell's shortcuts. `npm run seo:check` then audits the built HTML.
