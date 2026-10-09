// Runs after `ng build`: turns the prerendered pages into a deployable site.
//   - 404.html for the host's ErrorDocument (and drops the /404 route)
//   - sitemap.xml with hreflang alternates and images, from the real pages
//   - llms.txt (index for AI assistants) and llms-full.txt (full text)
import { cpSync, existsSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { OUT, SITE, loadPages, mainToMarkdown } from './site-pages.mjs';

// Idempotent: a second run (without a new build) finds 404.html already in place.
if (existsSync(join(OUT, '404/index.html'))) {
  cpSync(join(OUT, '404/index.html'), join(OUT, '404.html'));
  rmSync(join(OUT, '404'), { recursive: true });
}
if (!existsSync(join(OUT, '404.html'))) throw new Error('404 page was not prerendered');
// Client-render fallback shell: every URL is prerendered, so it is unused.
rmSync(join(OUT, 'index.csr.html'), { force: true });

const pages = loadPages();
const indexable = pages.filter((p) => !p.noindex && p.canonical);
const today = new Date().toISOString().slice(0, 10);
const xml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

// ---- sitemap.xml ---------------------------------------------------------
const isHome = (page) => ['/', '/it', '/fa'].includes(page.path);
const imageFor = (page) => {
  const og = page.doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
  return [og, isHome(page) ? `${SITE}/images/amir-iravani.jpg` : null].filter(Boolean);
};
const entries = indexable.map((page) => {
  const alts = Object.entries(page.alternates)
    .map(
      ([lang, href]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${xml(href)}" />`,
    )
    .join('\n');
  const images = imageFor(page)
    .map((src) => `    <image:image><image:loc>${xml(src)}</image:loc></image:image>`)
    .join('\n');
  const home = isHome(page);
  return [
    '  <url>',
    `    <loc>${xml(page.canonical)}</loc>`,
    `    <lastmod>${today}</lastmod>`,
    `    <changefreq>${home ? 'weekly' : 'monthly'}</changefreq>`,
    `    <priority>${home ? '1.0' : page.path.endsWith('/projects') ? '0.8' : '0.7'}</priority>`,
    alts,
    images,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');
});
writeFileSync(
  join(OUT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join('\n')}
</urlset>
`,
);

// ---- llms.txt / llms-full.txt (https://llmstxt.org) -----------------------
const english = indexable.filter((p) => p.lang === 'en');
const home = english.find((p) => p.path === '/');
const list = english.find((p) => p.path === '/projects');
const projects = english.filter((p) => p.path.startsWith('/projects/'));
const name = (p) => p.doc.querySelector('h1')?.textContent.replace(/\s+/g, ' ').trim() ?? p.title;

const llms = `# Amir Iravani

> ${home.description}

Amir Mohammad Iravani is a front-end engineer based in Turin (Torino), Italy, with over ten years of experience building web interfaces, mainly with Angular, as well as React and Vue. He has worked as a sole front-end developer on a B2B marketplace, as a CTO, and as co-founder of a web agency, and now builds startup MVPs. He speaks Persian (native), English (C1) and Italian (B1), and holds an unrestricted Italian work permit for full-time roles.

The site is available in English (root), Italian (/it) and Persian (/fa). Contact: amirmohammad76@yahoo.com.

## Pages

- [Home](${home.canonical}): ${home.description}
- [Projects](${list.canonical}): ${list.description}

## Projects

${projects.map((p) => `- [${name(p)}](${p.canonical}): ${p.description}`).join('\n')}

## Other languages

- [Italiano](${SITE}/it): versione italiana del sito
- [فارسی](${SITE}/fa): نسخهٔ فارسی سایت

## Optional

- [Full text of every English page](${SITE}/llms-full.txt)
- [LinkedIn](https://www.linkedin.com/in/amirmohammad-iravani/)
- [GitHub](https://github.com/amirdirv)
- [Source code of this site](https://github.com/amirdirv/amir-iravani-portfolio)
`;
writeFileSync(join(OUT, 'llms.txt'), llms);

const full = [
  `# Amir Iravani — full site text\n\nGenerated from the prerendered English pages of ${SITE} on ${today}.`,
  ...[home, list, ...projects].map(
    (p) => `---\n\nURL: ${p.canonical}\nTitle: ${p.title}\n\n${mainToMarkdown(p.doc)}`,
  ),
].join('\n\n');
writeFileSync(join(OUT, 'llms-full.txt'), full + '\n');

console.log(
  `postbuild: 404.html · sitemap.xml (${indexable.length} URLs) · llms.txt · llms-full.txt (${Math.round(full.length / 1024)} kB)`,
);
