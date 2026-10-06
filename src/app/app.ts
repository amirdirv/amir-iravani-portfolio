import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';
import { I18nService } from './core/i18n.service';
import { ScrollService } from './core/scroll.service';
import { ThemeService } from './core/theme.service';
import { Footer } from './layout/footer';
import { Nav } from './layout/nav';
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
  imports: [Nav, Hero, About, SignalGraph, ExperienceSection, Projects, EducationSection, Contact, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly i18n = inject(I18nService);
  // Injected eagerly so the theme effect runs before first paint.
  protected readonly theme = inject(ThemeService);
  private readonly scroll = inject(ScrollService);

  constructor() {
    afterNextRender(() => this.scroll.start());
  }
}
