import { DOCUMENT, Injectable, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Lang } from './models';
import { LANG_CODES, OG_LOCALE, SITE_URL, absoluteUrl } from './site';

export interface Crumb {
  name: string;
  /** Language-neutral path; omitted for the current page. */
  path?: string;
}

export interface PageSeo {
  lang: Lang;
  /** Language-neutral path of the page, e.g. `/projects/diar`. */
  path: string;
  title: string;
  description: string;
  /** Absolute or site-relative image for social cards. */
  image?: string;
  imageAlt?: string;
  ogType?: 'website' | 'profile' | 'article';
  /** Pages like the 404 are rendered but kept out of search results. */
  noindex?: boolean;
  breadcrumbs?: Crumb[];
  /** schema.org nodes; wrapped in one `@graph` script. */
  schema?: object[];
}

const DEFAULT_IMAGE = '/og-image.png';
const MANAGED = 'data-seo';

/**
 * Owns everything in <head> that differs per page: title, description,
 * robots, canonical, hreflang alternates, Open Graph / Twitter cards and
 * JSON-LD. Runs during prerendering, so every static HTML file ships with
 * its own complete head.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  /** Current page, for the language switcher and breadcrumbs UI. */
  readonly page = signal<PageSeo | null>(null);

  apply(page: PageSeo): void {
    this.page.set(page);
    const url = absoluteUrl(page.lang, page.path);
    const image = toAbsolute(page.image ?? DEFAULT_IMAGE);

    this.title.setTitle(page.title);
    this.setMeta('name', 'description', page.description);
    this.setMeta(
      'name',
      'robots',
      page.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large',
    );

    this.setMeta('property', 'og:type', page.ogType ?? 'website');
    this.setMeta('property', 'og:title', page.title);
    this.setMeta('property', 'og:description', page.description);
    this.setMeta('property', 'og:url', url);
    this.setMeta('property', 'og:image', image);
    this.setMeta('property', 'og:image:alt', page.imageAlt ?? page.title);
    this.setMeta('property', 'og:locale', OG_LOCALE[page.lang]);
    this.setMeta('name', 'twitter:title', page.title);
    this.setMeta('name', 'twitter:description', page.description);
    this.setMeta('name', 'twitter:image', image);

    this.clearManaged();
    if (!page.noindex) {
      this.addLink({ rel: 'canonical', href: url });
      for (const lang of LANG_CODES) {
        this.addLink({ rel: 'alternate', hreflang: lang, href: absoluteUrl(lang, page.path) });
      }
      this.addLink({ rel: 'alternate', hreflang: 'x-default', href: absoluteUrl('en', page.path) });
      for (const lang of LANG_CODES.filter((l) => l !== page.lang)) {
        this.addMeta('property', 'og:locale:alternate', OG_LOCALE[lang]);
      }
    }

    const graph = [...(page.schema ?? [])];
    if (page.breadcrumbs?.length)
      graph.push(breadcrumbSchema(page.lang, page.path, page.breadcrumbs));
    if (graph.length) this.addJsonLd({ '@context': 'https://schema.org', '@graph': graph });
  }

  private setMeta(attr: 'name' | 'property', key: string, content: string): void {
    this.meta.updateTag({ [attr]: key, content }, `${attr}="${key}"`);
  }

  private addMeta(attr: 'name' | 'property', key: string, content: string): void {
    const el = this.document.createElement('meta');
    el.setAttribute(attr, key);
    el.setAttribute('content', content);
    el.setAttribute(MANAGED, '');
    this.document.head.appendChild(el);
  }

  private addLink(attrs: Record<string, string>): void {
    const el = this.document.createElement('link');
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    el.setAttribute(MANAGED, '');
    this.document.head.appendChild(el);
  }

  private addJsonLd(data: object): void {
    const el = this.document.createElement('script');
    el.setAttribute('type', 'application/ld+json');
    el.setAttribute(MANAGED, '');
    // `<` is escaped so content can never close the script element.
    el.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
    this.document.head.appendChild(el);
  }

  /** Removes per-page tags from the previous page (and any static duplicates). */
  private clearManaged(): void {
    const head = this.document.head;
    head
      .querySelectorAll(
        `[${MANAGED}], link[rel="canonical"], link[rel="alternate"][hreflang], meta[property="og:locale:alternate"], script[type="application/ld+json"]`,
      )
      .forEach((el) => el.remove());
  }
}

function toAbsolute(src: string): string {
  return /^https?:/.test(src) ? src : SITE_URL + (src.startsWith('/') ? src : '/' + src);
}

function breadcrumbSchema(lang: Lang, path: string, crumbs: Crumb[]): object {
  return {
    '@type': 'BreadcrumbList',
    '@id': absoluteUrl(lang, path) + '#breadcrumb',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(lang, c.path ?? path),
    })),
  };
}
