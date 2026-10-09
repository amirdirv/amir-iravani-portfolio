// Shared helpers for the post-build scripts: find the prerendered pages and
// read what search engines will read from each one.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
// SITE_OUT lets the checker run against a copy (used to prove it catches breakage).
export const OUT = process.env.SITE_OUT ?? join(ROOT, 'dist/amir-iravani-portfolio/browser');
export const SITE = 'https://amir-iravani.it';

/** URL path for a built file: `it/projects/diar/index.html` → `/it/projects/diar`. */
export function urlPathFor(file) {
  const rel = relative(OUT, file).split(sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return '/' + rel.slice(0, -'/index.html'.length);
  return '/' + rel;
}

function walk(dir, found = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, found);
    else if (name === 'index.html' || name === '404.html') found.push(full);
  }
  return found;
}

/** Every prerendered HTML page with the facts the SEO tooling needs. */
export function loadPages() {
  return walk(OUT)
    .sort()
    .map((file) => {
      const html = readFileSync(file, 'utf8');
      const doc = new JSDOM(html).window.document;
      const meta = (sel) => doc.querySelector(sel)?.getAttribute('content') ?? null;
      const path = urlPathFor(file);
      return {
        file,
        path,
        html,
        doc,
        lang: doc.documentElement.getAttribute('lang'),
        dir: doc.documentElement.getAttribute('dir'),
        title: doc.title.trim(),
        description: meta('meta[name="description"]'),
        robots: meta('meta[name="robots"]') ?? '',
        canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null,
        alternates: Object.fromEntries(
          [...doc.querySelectorAll('link[rel="alternate"][hreflang]')].map((l) => [
            l.getAttribute('hreflang'),
            l.getAttribute('href'),
          ]),
        ),
        noindex: /noindex/.test(meta('meta[name="robots"]') ?? ''),
        jsonLd: [...doc.querySelectorAll('script[type="application/ld+json"]')].map(
          (s) => s.textContent ?? '',
        ),
      };
    });
}

/** Turns a page's <main> into compact Markdown for llms-full.txt. */
export function mainToMarkdown(doc) {
  const main = doc.querySelector('main');
  if (!main) return '';
  const skip = (el) =>
    el.getAttribute?.('aria-hidden') === 'true' ||
    ['SCRIPT', 'STYLE', 'SVG', 'CANVAS', 'TEMPLATE', 'BUTTON', 'FORM'].includes(el.tagName);
  const lines = [];
  const text = (el) => el.textContent.replace(/\s+/g, ' ').trim();
  const visit = (el) => {
    for (const child of el.children) {
      if (skip(child)) continue;
      const tag = child.tagName;
      if (/^H[1-4]$/.test(tag)) lines.push('', '#'.repeat(+tag[1]) + ' ' + text(child), '');
      else if (tag === 'P' || tag === 'DD' || tag === 'FIGCAPTION') {
        const t = text(child);
        if (t) lines.push(t, '');
      } else if (tag === 'LI') {
        const t = text(child);
        if (t) lines.push('- ' + t);
      } else if (tag === 'DT') lines.push('**' + text(child) + '**');
      else visit(child);
    }
  };
  visit(main);
  return lines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
