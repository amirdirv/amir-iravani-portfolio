import { DOCUMENT, Injectable, computed, effect, inject, signal } from '@angular/core';
import { Lang, Localized } from './models';
import { ResolvedUi, UI } from '../data/ui';
import { parsePath } from './site';

export const LANGS: readonly { code: Lang; label: string; native: string }[] = [
  { code: 'en', label: 'EN', native: 'English' },
  { code: 'it', label: 'IT', native: 'Italiano' },
  { code: 'fa', label: 'FA', native: 'فارسی' },
];

/** Walks the `UI` tree and replaces every localized leaf with the string for `lang`. */
function resolve(node: unknown, lang: Lang): unknown {
  if (node && typeof node === 'object' && !Array.isArray(node)) {
    const record = node as Record<string, unknown>;
    if (lang in record && 'en' in record) return record[lang];
    return Object.fromEntries(Object.entries(record).map(([k, v]) => [k, resolve(v, lang)]));
  }
  return node;
}

/**
 * Signal-based i18n. The language is part of the URL (`/`, `/it`, `/fa`), so
 * each language is a separate, indexable page. It is read from the URL the
 * document was loaded with, and `<html lang dir>` follows it — on the
 * server during prerendering as well as in the browser.
 */
@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly document = inject(DOCUMENT);

  readonly lang = signal<Lang>(this.langFromLocation());
  readonly dir = computed(() => (this.lang() === 'fa' ? 'rtl' : 'ltr'));
  readonly ui = computed(() => resolve(UI, this.lang()) as ResolvedUi);

  constructor() {
    effect(() => {
      const html = this.document.documentElement;
      html.lang = this.lang();
      html.dir = this.dir();
    });
  }

  /** Picks the active language out of a `Localized` record. */
  t(value: Localized): string {
    return value[this.lang()];
  }

  set(lang: Lang): void {
    this.lang.set(lang);
  }

  /** Formats digits with Persian numerals when the page is in Persian. */
  num(value: number | string): string {
    const text = String(value);
    return this.lang() === 'fa' ? text.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d]) : text;
  }

  /** First paint (and prerender) must already be in the right language. */
  private langFromLocation(): Lang {
    const pathname = this.document.location?.pathname ?? '/';
    return parsePath(pathname).lang;
  }
}
