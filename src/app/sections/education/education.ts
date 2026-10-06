import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { formatMonth } from '../../core/dates';
import { I18nService } from '../../core/i18n.service';
import { Cefr, Education as School } from '../../core/models';
import { EDUCATION, SPOKEN_LANGUAGES } from '../../data/profile';
import { Icon } from '../../shared/icon';
import { Reveal } from '../../shared/reveal.directive';

const CEFR_SCALE: readonly Cefr[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

@Component({
  selector: 'app-education',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal],
  templateUrl: './education.html',
  styleUrl: './education.scss',
})
export class EducationSection {
  protected readonly i18n = inject(I18nService);
  protected readonly schools = EDUCATION;
  protected readonly languages = SPOKEN_LANGUAGES;
  protected readonly scale = CEFR_SCALE;

  protected range(school: School): string {
    const lang = this.i18n.lang();
    const end = school.end ? formatMonth(school.end, lang) : this.i18n.ui().education.ongoing;
    return `${formatMonth(school.start, lang)} — ${end}`;
  }

  /** 1–6 position on the CEFR scale (native = full). */
  protected level(level: Cefr): number {
    return level === 'native' ? 6 : CEFR_SCALE.indexOf(level) + 1;
  }

  protected host(url: string): string {
    return url.replace(/^https?:\/\/(www\.)?/, '');
  }
}
