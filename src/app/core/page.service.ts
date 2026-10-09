import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Lang } from './models';
import { parsePath } from './site';

export type PageKind = 'home' | 'projects' | 'project' | 'not-found';

export interface Route {
  lang: Lang;
  /** Language-neutral path, e.g. `/projects/diar`. */
  path: string;
  kind: PageKind;
  /** Project id for `kind: 'project'`. */
  id?: string;
}

/** Maps a URL path to the page that renders it. Pure, so it is unit-tested directly. */
export function resolveRoute(urlPath: string): Route {
  const { lang, path } = parsePath(urlPath);
  const clean = path.replace(/\/+$/, '') || '/';
  if (clean === '/') return { lang, path: '/', kind: 'home' };
  if (clean === '/projects') return { lang, path: clean, kind: 'projects' };
  const project = /^\/projects\/([a-z0-9-]+)$/.exec(clean);
  if (project) return { lang, path: clean, kind: 'project', id: project[1] };
  return { lang, path: clean, kind: 'not-found' };
}

/**
 * The site is a set of prerendered static pages, not a single-page app:
 * every link is a real page load, so there is no client router at all
 * (≈95 kB less JavaScript). The page is decided once, from the URL the
 * document was loaded with — the same on the server and in the browser.
 */
@Injectable({ providedIn: 'root' })
export class PageService {
  readonly route: Route = resolveRoute(inject(DOCUMENT).location?.pathname ?? '/');
}
