import { Lang } from './models';

/** Production origin. Canonical URLs, hreflang, Open Graph and the sitemap all derive from it. */
export const SITE_URL = 'https://amir-iravani.it';

export const LANG_CODES: readonly Lang[] = ['en', 'it', 'fa'];

/** Open Graph locale per language. */
export const OG_LOCALE: Record<Lang, string> = { en: 'en_GB', it: 'it_IT', fa: 'fa_IR' };

export function isLang(value: unknown): value is Lang {
  return value === 'en' || value === 'it' || value === 'fa';
}

/**
 * Turns a language-neutral path (`/`, `/projects/diar`) into the URL path for
 * a language. English lives at the root; Italian and Persian under `/it` and `/fa`.
 * No trailing slashes, except the root itself.
 */
export function localizedPath(lang: Lang, path: string): string {
  const clean = path === '/' ? '' : path.replace(/\/+$/, '');
  if (lang === 'en') return clean || '/';
  return `/${lang}${clean}`;
}

/** Absolute URL for a language-neutral path. */
export function absoluteUrl(lang: Lang, path: string): string {
  const local = localizedPath(lang, path);
  return SITE_URL + (local === '/' ? '/' : local);
}

/** Splits a URL path into its language and the language-neutral rest. */
export function parsePath(urlPath: string): { lang: Lang; path: string } {
  const pathname = urlPath.split(/[?#]/)[0] || '/';
  const [, first = '', ...rest] = pathname.split('/');
  if (isLang(first) && first !== 'en') {
    return { lang: first, path: '/' + rest.join('/') };
  }
  return { lang: 'en', path: pathname || '/' };
}
