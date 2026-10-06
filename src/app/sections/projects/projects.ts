import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n.service';
import { PROJECTS, SKILLS } from '../../data/profile';
import { Icon } from '../../shared/icon';
import { Reveal } from '../../shared/reveal.directive';
import { Tilt } from '../../shared/tilt.directive';
import { ProjectCover } from './project-cover';

@Component({
  selector: 'app-projects',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProjectCover, Icon, Reveal, Tilt],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
  protected readonly i18n = inject(I18nService);
  protected readonly projects = PROJECTS;

  protected skill(id: string): string {
    return SKILLS.find((s) => s.id === id)?.label ?? id;
  }
}
