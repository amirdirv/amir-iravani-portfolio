import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';
import { CommandsService } from './core/commands.service';
import { I18nService } from './core/i18n.service';
import { ScrollService } from './core/scroll.service';
import { ThemeService } from './core/theme.service';
import { CommandPalette } from './layout/command-palette';
import { Footer } from './layout/footer';
import { Nav } from './layout/nav';
import { Terminal } from './layout/terminal/terminal';
import { About } from './sections/about/about';
import { Contact } from './sections/contact/contact';
import { EducationSection } from './sections/education/education';
import { ExperienceSection } from './sections/experience/experience';
import { Hero } from './sections/hero/hero';
import { Projects } from './sections/projects/projects';
import { SignalGraph } from './sections/skills/signal-graph';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Nav,
    Hero,
    About,
    SignalGraph,
    ExperienceSection,
    Projects,
    EducationSection,
    Contact,
    Footer,
    CommandPalette,
    Terminal,
  ],
  host: { '(document:keydown)': 'onKeydown($event)' },
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly i18n = inject(I18nService);
  // Injected eagerly so the theme effect runs before first paint.
  protected readonly theme = inject(ThemeService);
  private readonly scroll = inject(ScrollService);
  private readonly commands = inject(CommandsService);

  constructor() {
    afterNextRender(() => this.scroll.start());
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
