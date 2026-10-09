import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  afterNextRender,
  computed,
  inject,
} from '@angular/core';
import { CommandsService } from './core/commands.service';
import { I18nService } from './core/i18n.service';
import { PageService } from './core/page.service';
import { ScrollService } from './core/scroll.service';
import { SeoService } from './core/seo.service';
import { isLang, localizedPath } from './core/site';
import { ThemeService } from './core/theme.service';
import { CommandPalette } from './layout/command-palette';
import { Footer } from './layout/footer';
import { Nav } from './layout/nav';
import { Terminal } from './layout/terminal/terminal';
import { HomePage } from './pages/home-page';
import { NotFoundPage } from './pages/not-found-page';
import { ProjectPage } from './pages/project-page';
import { ProjectsPage } from './pages/projects-page';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Nav,
    Footer,
    CommandPalette,
    Terminal,
    HomePage,
    ProjectsPage,
    ProjectPage,
    NotFoundPage,
  ],
  host: { '(document:keydown)': 'onKeydown($event)' },
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly i18n = inject(I18nService);
  // Injected eagerly so the theme effect runs before first paint.
  protected readonly theme = inject(ThemeService);
  protected readonly commands = inject(CommandsService);
  private readonly scroll = inject(ScrollService);
  private readonly seo = inject(SeoService);
  protected readonly page = inject(PageService);
  private readonly document = inject(DOCUMENT);

  /** `<base href="/">` would turn a bare `#main` into a link to the homepage. */
  protected readonly skipHref = computed(() => {
    const page = this.seo.page();
    return (page ? localizedPath(page.lang, page.path) : '/') + '#main';
  });

  constructor() {
    afterNextRender(() => {
      this.redirectLegacyLangQuery();
      this.scroll.start();
    });
  }

  protected skipToMain(event: Event): void {
    event.preventDefault();
    this.document.getElementById('main')?.focus();
  }

  /** Old links used `?lang=it`; languages now have their own URLs (the host also 301s these). */
  private redirectLegacyLangQuery(): void {
    const location = this.document.defaultView?.location;
    if (!location) return;
    const lang = new URLSearchParams(location.search).get('lang');
    if (!isLang(lang)) return;
    location.replace(localizedPath(lang, this.page.route.path) + location.hash);
  }

  /** Global shortcuts: Cmd/Ctrl+K (or /) for the palette, ` for the terminal. */
  protected onKeydown(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (this.commands.paletteOpen()) this.commands.closeAll();
      else this.commands.openPalette();
      return;
    }
    // The target can be the document itself (nothing focused), which has no `closest`.
    const target = event.target;
    const typing =
      target instanceof Element &&
      !!target.closest('input, textarea, select, [contenteditable="true"]');
    if (typing || event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key === '`' || event.code === 'Backquote') {
      event.preventDefault();
      this.commands.openTerminal();
    } else if (event.key === '/') {
      event.preventDefault();
      this.commands.openPalette();
    }
  }
}
