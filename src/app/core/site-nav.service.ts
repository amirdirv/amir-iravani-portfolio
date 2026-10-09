import { DOCUMENT, Injectable, computed, inject } from '@angular/core';
import { I18nService } from './i18n.service';
import { Lang } from './models';
import { PageService } from './page.service';
import { ScrollService, SectionId } from './scroll.service';
import { SeoService } from './seo.service';
import { localizedPath } from './site';

/**
 * Language-aware URLs for templates (`[href]="nav.project('diar')"`) and
 * navigation for imperative callers (palette, terminal). Links between
 * pages are ordinary page loads of prerendered HTML.
 */
@Injectable({ providedIn: 'root' })
export class SiteNav {
  private readonly document = inject(DOCUMENT);
  private readonly i18n = inject(I18nService);
  private readonly page = inject(PageService);
  private readonly seo = inject(SeoService);
  private readonly scroll = inject(ScrollService);

  readonly home = computed(() => localizedPath(this.i18n.lang(), '/'));
  readonly projects = computed(() => localizedPath(this.i18n.lang(), '/projects'));
  readonly isHome = this.page.route.kind === 'home';

  link(path: string, lang: Lang = this.i18n.lang()): string {
    return localizedPath(lang, path);
  }

  project(id: string, lang: Lang = this.i18n.lang()): string {
    return localizedPath(lang, `/projects/${id}`);
  }

  /** `/#about`-style link to a homepage section in the current language. */
  section(id: SectionId): string {
    return `${this.home()}#${id}`;
  }

  /** Same page in another language. Pages that don't exist (404) fall back to that language's home. */
  langLink(lang: Lang): string {
    const page = this.seo.page();
    return localizedPath(lang, page && !page.noindex ? page.path : '/');
  }

  goToSection(id: SectionId | 'top'): void {
    if (this.isHome) {
      this.scroll.scrollTo(id);
      if (id !== 'top') this.document.defaultView?.history.replaceState(null, '', `#${id}`);
    } else {
      this.go(id === 'top' ? this.home() : this.section(id));
    }
  }

  /** Switch language, landing on the same homepage section the visitor was reading. */
  switchLang(lang: Lang): void {
    const active = this.isHome ? this.scroll.active() : null;
    this.go(this.langLink(lang) + (active ? `#${active}` : ''));
  }

  /** Click handler for language links: carries the current section across. */
  onLangClick(event: MouseEvent, lang: Lang): void {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    this.switchLang(lang);
  }

  go(url: string): void {
    this.document.defaultView?.location.assign(url);
  }
}
