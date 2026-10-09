import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { clip } from '../pages/project-page';
import { SeoService } from './seo.service';

describe('SeoService', () => {
  const head = () => TestBed.inject(DOCUMENT).head;
  const attr = (sel: string, name = 'content') => head().querySelector(sel)?.getAttribute(name);

  it('writes a complete, self-consistent head for a page', () => {
    TestBed.inject(SeoService).apply({
      lang: 'it',
      path: '/projects/diar',
      title: 'DIAR Media — progetto di Amir Iravani',
      description:
        'Una piattaforma di notizie partecipativa con una redazione AI sempre attiva e dieci lingue.',
      breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'DIAR Media' }],
      schema: [{ '@type': 'WebPage' }],
    });

    expect(TestBed.inject(DOCUMENT).title).toBe('DIAR Media — progetto di Amir Iravani');
    expect(attr('meta[name="description"]')).toContain('piattaforma');
    expect(attr('meta[name="robots"]')).toContain('index, follow');
    expect(attr('link[rel="canonical"]', 'href')).toBe('https://amir-iravani.it/it/projects/diar');
    expect(attr('link[hreflang="en"]', 'href')).toBe('https://amir-iravani.it/projects/diar');
    expect(attr('link[hreflang="fa"]', 'href')).toBe('https://amir-iravani.it/fa/projects/diar');
    expect(attr('link[hreflang="x-default"]', 'href')).toBe(
      'https://amir-iravani.it/projects/diar',
    );
    expect(attr('meta[property="og:url"]')).toBe('https://amir-iravani.it/it/projects/diar');
    expect(attr('meta[property="og:locale"]')).toBe('it_IT');
    expect(attr('meta[property="og:image"]')).toBe('https://amir-iravani.it/og-image.png');

    const ld = JSON.parse(head().querySelector('script[type="application/ld+json"]')!.textContent!);
    const crumbs = ld['@graph'].find((n: { '@type': string }) => n['@type'] === 'BreadcrumbList');
    expect(crumbs.itemListElement.map((i: { item: string }) => i.item)).toEqual([
      'https://amir-iravani.it/it',
      'https://amir-iravani.it/it/projects/diar',
    ]);
  });

  it('replaces the previous page’s tags instead of duplicating them', () => {
    const seo = TestBed.inject(SeoService);
    const page = { lang: 'en' as const, title: 'A title for test', description: 'x'.repeat(60) };
    seo.apply({ ...page, path: '/', schema: [{ '@type': 'WebSite' }] });
    seo.apply({ ...page, path: '/projects', schema: [{ '@type': 'CollectionPage' }] });

    expect(head().querySelectorAll('link[rel="canonical"]').length).toBe(1);
    expect(head().querySelectorAll('link[hreflang]').length).toBe(4);
    expect(head().querySelectorAll('script[type="application/ld+json"]').length).toBe(1);
    expect(head().querySelectorAll('meta[name="description"]').length).toBe(1);
  });

  it('keeps noindex pages out of the index graph', () => {
    TestBed.inject(SeoService).apply({
      lang: 'en',
      path: '/nope',
      title: 'Page not found',
      description: 'y'.repeat(60),
      noindex: true,
    });
    expect(attr('meta[name="robots"]')).toBe('noindex, follow');
    expect(head().querySelector('link[rel="canonical"]')).toBeNull();
    expect(head().querySelector('link[hreflang]')).toBeNull();
  });

  it('never lets JSON-LD close its script tag', () => {
    TestBed.inject(SeoService).apply({
      lang: 'en',
      path: '/',
      title: 't',
      description: 'd',
      schema: [{ '@type': 'Thing', name: '</script><script>alert(1)</script>' }],
    });
    expect(head().querySelector('script[type="application/ld+json"]')!.textContent).not.toContain(
      '</script>',
    );
  });
});

describe('clip (meta descriptions)', () => {
  it('keeps short text and cuts long text on a word boundary with an ellipsis', () => {
    expect(clip('Short text.')).toBe('Short text.');
    const long = 'word '.repeat(60).trim();
    const out = clip(long);
    expect(out.length).toBeLessThanOrEqual(155);
    expect(out.endsWith('word…')).toBe(true);
  });
});
