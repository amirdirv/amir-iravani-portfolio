import { DOCUMENT, Injectable, computed, effect, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Lang, Localized } from './models';
import { ResolvedUi, UI } from '../data/ui';
import { readStorage, writeStorage } from './storage';

export const LANGS: readonly { code: Lang; label: string; native: string }[] = [
  { code: 'en', label: 'EN', native: 'English' },
  { code: 'it', label: 'IT', native: 'Italiano' },
  { code: 'fa', label: 'FA', native: 'فارسی' },
];

const STORAGE_KEY = 'ai.lang';

function isLang(value: unknown): value is Lang {
  return value === 'en' || value === 'it' || value === 'fa';
}

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
 * Runtime, signal-based i18n. Switching language re-renders instantly with no
 * reload, flips `dir` for Persian and keeps `<title>`/meta description in sync.
 *
 * Initial language: `?lang=` → saved choice → browser language → English.
 */
@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly document = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  readonly lang = signal<Lang>(this.initialLang());
  readonly dir = computed(() => (this.lang() === 'fa' ? 'rtl' : 'ltr'));
  readonly ui = computed(() => resolve(UI, this.lang()) as ResolvedUi);

  constructor() {
    effect(() => {
      const lang = this.lang();
      const html = this.document.documentElement;
      html.lang = lang;
      html.dir = this.dir();
      writeStorage(STORAGE_KEY, lang);
      this.title.setTitle(this.ui().meta.title);
      this.meta.updateTag({ name: 'description', content: this.ui().meta.description });
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

  private initialLang(): Lang {
    const view = this.document.defaultView;
    const fromQuery = view ? new URLSearchParams(view.location.search).get('lang') : null;
    if (isLang(fromQuery)) return fromQuery;
    const saved = readStorage(STORAGE_KEY);
    if (isLang(saved)) return saved;
    const browser = view?.navigator.language.slice(0, 2);
    return isLang(browser) ? browser : 'en';
  }
}
