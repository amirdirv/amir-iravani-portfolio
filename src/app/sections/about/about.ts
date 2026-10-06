import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { I18nService } from '../../core/i18n.service';
import { PERSON } from '../../data/profile';
import { Icon, IconName } from '../../shared/icon';
import { Reveal } from '../../shared/reveal.directive';
import { HalftonePortrait } from './halftone-portrait';

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HalftonePortrait, Icon, Reveal],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  protected readonly i18n = inject(I18nService);
  protected readonly person = PERSON;

  protected readonly facts = computed(() => {
    const ui = this.i18n.ui().about;
    const facts: { icon: IconName; label: string; value: string }[] = [
      { icon: 'pin', label: ui.factBased, value: this.i18n.t(PERSON.location) },
      { icon: 'cap', label: ui.factStudy, value: ui.factStudyValue },
      { icon: 'briefcase', label: ui.factWork, value: ui.factWorkValue },
      { icon: 'users', label: ui.factCommunity, value: ui.factCommunityValue },
    ];
    return facts;
  });
}
