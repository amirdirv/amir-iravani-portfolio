// Audits the built site the way a crawler sees it. Fails (exit 1) on any error.
//   npm run build && npm run seo:check
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';
import { OUT, SITE, loadPages } from './site-pages.mjs';

const errors = [];
const warnings = [];
const fail = (page, msg) => errors.push(`${page}: ${msg}`);
const warn = (page, msg) => warnings.push(`${page}: ${msg}`);

const pages = loadPages();
const byPath = new Map(pages.map((p) => [p.path, p]));
const langOf = (path) => /^\/(it|fa)(\/|$)/.exec(path)?.[1] ?? 'en';
const expectedCanonical = (path) => SITE + (path === '/' ? '/' : path);
const isAsset = (path) => existsSync(join(OUT, decodeURIComponent(path.replace(/^\//, ''))));

const REQUIRED_SCHEMA = {
  home: ['WebSite', 'ProfilePage', 'Person', 'ProfessionalService'],
  projects: ['CollectionPage', 'BreadcrumbList'],
  project: ['WebPage', 'BreadcrumbList'],
};
const kindOf = (path) => {
  const rest = path.replace(/^\/(it|fa)(?=\/|$)/, '') || '/';
  if (rest === '/') return 'home';
  if (rest === '/projects') return 'projects';
  if (rest.startsWith('/projects/')) return 'project';
  return 'other';
};

for (const page of pages) {
  const { path, doc } = page;
  const is404 = path === '/404.html';

  // 3 · title
  if (!page.title) fail(path, 'missing <title>');
  else if (page.title.length > 65)
    fail(path, `title too long (${page.title.length}): ${page.title}`);
  if (doc.querySelectorAll('title').length !== 1) fail(path, 'must have exactly one <title>');

  // 4 · meta description
  const d = page.description ?? '';
  if (!d) fail(path, 'missing meta description');
  else if (d.length < 50 || d.length > 160)
    fail(path, `description length ${d.length} (want 50–160)`);
  if (doc.querySelectorAll('meta[name="description"]').length !== 1)
    fail(path, 'duplicate meta description');

  // language attributes
  const lang = langOf(path);
  if (!is404 && page.lang !== lang) fail(path, `<html lang="${page.lang}"> but URL is ${lang}`);
  if (!is404 && (lang === 'fa') !== (page.dir === 'rtl'))
    fail(path, `dir="${page.dir}" wrong for ${lang}`);

  // 6 · headings: one h1, no skipped levels, no empty headings
  const headings = [
    ...doc.querySelectorAll('main h1, main h2, main h3, main h4, main h5, main h6'),
  ];
  const h1s = doc.querySelectorAll('h1');
  if (h1s.length !== 1) fail(path, `expected 1 <h1>, found ${h1s.length}`);
  let prev = 0;
  for (const h of headings) {
    const level = +h.tagName[1];
    if (!h.textContent.trim()) fail(path, `empty <${h.tagName.toLowerCase()}>`);
    if (prev && level > prev + 1)
      fail(path, `heading jumps h${prev} → h${level} ("${h.textContent.trim().slice(0, 40)}")`);
    prev = level;
  }

  // 5 · canonical + hreflang (indexable pages), robots
  if (is404) {
    if (!page.noindex) fail(path, '404 page must be noindex');
    if (page.canonical) fail(path, '404 page must not declare a canonical');
  } else {
    if (page.noindex) fail(path, 'indexable page marked noindex');
    if (page.canonical !== expectedCanonical(path))
      fail(path, `canonical ${page.canonical} ≠ ${expectedCanonical(path)}`);
    if (doc.querySelectorAll('link[rel="canonical"]').length !== 1)
      fail(path, 'must have exactly one canonical');
    for (const l of ['en', 'it', 'fa', 'x-default']) {
      const href = page.alternates[l];
      if (!href) fail(path, `missing hreflang="${l}"`);
      else {
        const target = byPath.get(href.replace(SITE, '').replace(/^$/, '/') || '/');
        if (!target) fail(path, `hreflang ${l} → ${href} has no page`);
        else if (l !== 'x-default' && target.alternates[lang] !== page.canonical)
          fail(path, `hreflang ${l} → ${href} is not reciprocal`);
      }
    }
    const ogUrl = doc.querySelector('meta[property="og:url"]')?.getAttribute('content');
    if (ogUrl !== page.canonical) fail(path, `og:url ${ogUrl} ≠ canonical`);
  }

  // Open Graph image exists
  const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
  if (!ogImage?.startsWith(SITE)) fail(path, `og:image must be absolute on ${SITE}`);
  else if (!isAsset(ogImage.replace(SITE, '')))
    fail(path, `og:image ${ogImage} not found in build`);

  // 10 / 11 · structured data
  const types = new Set();
  const nodes = [];
  for (const raw of page.jsonLd) {
    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      fail(path, `invalid JSON-LD: ${e.message}`);
      continue;
    }
    if (data['@context'] !== 'https://schema.org')
      fail(path, 'JSON-LD @context must be https://schema.org');
    for (const node of data['@graph'] ?? [data]) {
      if (!node['@type']) fail(path, 'JSON-LD node without @type');
      types.add(node['@type']);
      nodes.push(node);
    }
  }
  for (const t of REQUIRED_SCHEMA[kindOf(path)] ?? []) {
    if (!types.has(t)) fail(path, `missing schema.org ${t}`);
  }
  if (kindOf(path) === 'project' && !types.has('CreativeWork') && !types.has('SoftwareSourceCode'))
    fail(path, 'project page needs CreativeWork or SoftwareSourceCode');

  // 8 · breadcrumbs: visible trail matches the BreadcrumbList
  if (['projects', 'project'].includes(kindOf(path))) {
    const visible = [...doc.querySelectorAll('nav.crumbs li')].map((li) => li.textContent.trim());
    const ld = nodes.find((n) => n['@type'] === 'BreadcrumbList');
    const names = ld?.itemListElement.map((i) => i.name) ?? [];
    if (!visible.length) fail(path, 'no visible breadcrumbs');
    if (visible.join('|') !== names.join('|'))
      fail(path, `breadcrumbs differ: [${visible}] vs JSON-LD [${names}]`);
  }

  // 16 · alt text
  for (const img of doc.querySelectorAll('img')) {
    const decorative =
      img.getAttribute('role') === 'presentation' || img.closest('[aria-hidden="true"]');
    if (!img.hasAttribute('alt')) fail(path, `<img src="${img.getAttribute('src')}"> has no alt`);
    else if (!decorative && !img.getAttribute('alt').trim())
      fail(path, `<img src="${img.getAttribute('src')}"> has empty alt but is not decorative`);
  }

  // 7 · internal links resolve (pages, assets and #fragments)
  for (const a of doc.querySelectorAll('a[href]')) {
    const href = a.getAttribute('href');
    if (/^(https?:|mailto:|tel:)/.test(href) && !href.startsWith(SITE)) continue;
    const url = new URL(href, SITE + (path === '/404.html' ? '/' : path));
    if (url.origin !== SITE) continue;
    const target = byPath.get(url.pathname) ?? null;
    if (!target && !isAsset(url.pathname)) {
      fail(path, `broken internal link ${href}`);
      continue;
    }
    if (target && url.hash && !target.doc.getElementById(decodeURIComponent(url.hash.slice(1))))
      fail(path, `link ${href} points to a missing #${url.hash.slice(1)}`);
    if (url.pathname !== '/' && url.pathname.endsWith('/'))
      warn(path, `link with trailing slash ${href}`);
  }
  const internalOut = [...doc.querySelectorAll('a[href^="/"]')].length;
  if (!is404 && internalOut < 5) warn(path, `only ${internalOut} internal links`);
}

// uniqueness of titles / descriptions / h1 within each language
for (const field of ['title', 'description']) {
  const seen = new Map();
  for (const p of pages.filter((p) => !p.noindex)) {
    const key = p[field];
    if (seen.has(key)) fail(p.path, `duplicate ${field} with ${seen.get(key)}`);
    seen.set(key, p.path);
  }
}
for (const lang of ['en', 'it', 'fa']) {
  const seen = new Map();
  for (const p of pages.filter((p) => !p.noindex && langOf(p.path) === lang)) {
    const h1 = p.doc.querySelector('h1')?.textContent.replace(/\s+/g, ' ').trim();
    if (seen.has(h1)) fail(p.path, `duplicate h1 "${h1}" with ${seen.get(h1)}`);
    seen.set(h1, p.path);
  }
}

// 2 · 404 page
if (!byPath.has('/404.html')) fail('/404.html', 'missing');

// 9 · robots.txt
const robots = existsSync(join(OUT, 'robots.txt'))
  ? readFileSync(join(OUT, 'robots.txt'), 'utf8')
  : '';
if (!robots) fail('/robots.txt', 'missing');
if (!robots.split(/\r?\n/).some((l) => l.trim() === `Sitemap: ${SITE}/sitemap.xml`))
  fail('/robots.txt', 'missing Sitemap line');
if (/^Disallow:\s*\/\s*$/m.test(robots)) fail('/robots.txt', 'blocks the whole site');

// 12 · sitemap.xml covers exactly the indexable pages
const sitemapFile = join(OUT, 'sitemap.xml');
if (!existsSync(sitemapFile)) fail('/sitemap.xml', 'missing');
else {
  const sm = new JSDOM(readFileSync(sitemapFile, 'utf8'), { contentType: 'text/xml' }).window
    .document;
  const locs = [...sm.getElementsByTagName('loc')].map((l) => l.textContent);
  const expected = pages
    .filter((p) => !p.noindex)
    .map((p) => p.canonical)
    .sort();
  if (locs.slice().sort().join() !== expected.join())
    fail('/sitemap.xml', `URLs differ from indexable pages (${locs.length} vs ${expected.length})`);
  for (const loc of locs) if (!loc.startsWith(SITE)) fail('/sitemap.xml', `foreign URL ${loc}`);
}

// 13 · favicons
for (const f of [
  'favicon.ico',
  'favicon.svg',
  'apple-touch-icon.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'manifest.webmanifest',
])
  if (!existsSync(join(OUT, f))) fail('/' + f, 'missing');

// 14 · llms.txt
const llms = existsSync(join(OUT, 'llms.txt')) ? readFileSync(join(OUT, 'llms.txt'), 'utf8') : '';
if (!llms.startsWith('# ')) fail('/llms.txt', 'missing or has no H1');
if (!/^> /m.test(llms)) fail('/llms.txt', 'missing the > summary line');
for (const [, url] of llms.matchAll(/\]\((https:\/\/amir-iravani\.it[^)]*)\)/g)) {
  const p = url.replace(SITE, '') || '/';
  if (!byPath.has(p) && !isAsset(p)) fail('/llms.txt', `broken link ${url}`);
}
if (!existsSync(join(OUT, 'llms-full.txt'))) fail('/llms-full.txt', 'missing');

// 1 · host config for the custom domain
const htaccess = existsSync(join(OUT, '.htaccess'))
  ? readFileSync(join(OUT, '.htaccess'), 'utf8')
  : '';
for (const rule of [
  'ErrorDocument 404 /404.html',
  'RewriteRule ^ /404.php',
  'DirectorySlash Off',
  '\\.git',
])
  if (!htaccess.includes(rule)) fail('/.htaccess', `missing "${rule}"`);
// The host ignores ErrorDocument, so missing URLs are routed to this script.
if (!existsSync(join(OUT, '404.php'))) fail('/404.php', 'missing');

// ---- report ----------------------------------------------------------------
console.log(
  `seo:check — ${pages.length} pages, ${pages.filter((p) => !p.noindex).length} indexable`,
);
for (const w of warnings) console.log('  warn ', w);
for (const e of errors) console.log('  ERROR', e);
if (errors.length) {
  console.log(`\n✗ ${errors.length} error(s)`);
  process.exit(1);
}
console.log('✓ all checks passed');
