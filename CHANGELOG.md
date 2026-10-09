# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.1.0] — 2026-10-09

Technical SEO and performance release.

### Added
- Every page prerendered to static HTML: 3 languages × (home, projects list, 7 project pages) + 404
- Language URLs `/`, `/it`, `/fa` with `hreflang` alternates (old `?lang=` links 301-redirect)
- Project detail pages and a projects index, with visible breadcrumbs and BreadcrumbList JSON-LD
- Per-page title, meta description, canonical, Open Graph/Twitter cards and a share image per project
- schema.org graph: WebSite, ProfilePage, Person, ProfessionalService (local business), CollectionPage, WebPage, CreativeWork / SoftwareSourceCode
- Custom 404 page served with a real 404 status
- Generated `sitemap.xml` (alternates + images), `llms.txt`, `llms-full.txt`; updated `robots.txt`
- `npm run seo:check`: crawler-style audit run in CI and before every deploy
- `npm run serve:dist`: serve the build locally like the host
- Footer site links and internal links between projects, roles and sections

### Changed
- Removed the client router (≈95 kB) and `@angular/forms`; each page and every below-the-fold section loads and hydrates on demand
- Hero stats are real numbers in the HTML; reveal animations never hide prerendered content
- h1 and section headings read correctly as text ("Hi, I’m Amir Iravani")
- Descriptive alt text on the portrait; complete favicon set
- GitHub Pages now redirects to amir-iravani.it

## [1.0.0] — 2026-10-06

First public release.

### Added
- Ai monogram brand: SVG logo component, favicon, PWA icons, generated OG image
- Runtime EN / IT / FA internationalisation with RTL, Persian digits and Gregorian dates
- Dark and light themes with no flash on load
- Hero with particle monogram, kinetic name, role typewriter and count-up stats
- About with halftone portrait and fact cards
- Skills as a live signal graph with time-in-production readout
- Experience as a `git log --graph` timeline with Tehran → Turin merge
- Projects with seeded generative covers, 3D tilt and spotlight
- Education and CEFR language meters
- Backend-free contact composer and social links
- Command palette (Ctrl/⌘ K) and interactive terminal (`)
- Print-as-CV stylesheet
- Open Graph, Twitter card, JSON-LD Person, robots.txt and sitemap
- 27 unit tests; CI and GitHub Pages deployment workflows
- Documentation: architecture, content guide, deployment, brand, Persian guide
