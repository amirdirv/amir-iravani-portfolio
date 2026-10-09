import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { I18nService } from '../../core/i18n.service';
import { SiteNav } from '../../core/site-nav.service';
import { PROJECTS, SKILLS } from '../../data/profile';
import { Icon } from '../../shared/icon';
import { Reveal } from '../../shared/reveal.directive';
import { Tilt } from '../../shared/tilt.directive';
import { ProjectCover } from './project-cover';

/**
 * Project cards. On the homepage it is a section with its own h2 and a link
 * to the projects page; with `asPage` it is that page's list (cards become h2s
 * under the page h1).
 */
@Component({
  selector: 'app-projects',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProjectCover, Icon, Reveal, Tilt],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
  readonly asPage = input(false);

  protected readonly i18n = inject(I18nService);
  protected readonly nav = inject(SiteNav);
  protected readonly projects = PROJECTS;

  protected skill(id: string): string {
    return SKILLS.find((s) => s.id === id)?.label ?? id;
  }
}
