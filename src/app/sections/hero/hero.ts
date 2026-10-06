import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { I18nService } from '../../core/i18n.service';
import { ScrollService } from '../../core/scroll.service';
import { EXPERIENCES, PERSON, SPOKEN_LANGUAGES } from '../../data/profile';
import { Icon } from '../../shared/icon';
import { ParticleMonogram } from './particle-monogram';

const TYPE_MS = 55;
const ERASE_MS = 28;
const HOLD_MS = 1800;

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ParticleMonogram, Icon],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  protected readonly i18n = inject(I18nService);
  private readonly scroll = inject(ScrollService);
  private readonly destroyRef = inject(DestroyRef);

  /** Text currently shown by the role typewriter. */
  protected readonly typed = signal('');
  /** 0 → 1 progress of the stat counters. */
  private readonly countUp = signal(0);

  private readonly stats = [
    { value: new Date().getFullYear() - PERSON.careerStart, suffix: '+', key: 'statYears' },
    { value: EXPERIENCES.length, suffix: '', key: 'statRoles' },
    { value: 3, suffix: '', key: 'statFrameworks' },
    { value: SPOKEN_LANGUAGES.length, suffix: '', key: 'statLanguages' },
  ] as const;

  protected readonly statView = computed(() => {
    const ui = this.i18n.ui().hero;
    const k = this.countUp();
    return this.stats.map((s) => ({
      value: this.i18n.num(Math.round(s.value * k)) + s.suffix,
      label: ui[s.key],
    }));
  });

  /** The name split into letters for the staggered entrance. */
  protected readonly letters = computed(() => {
    const ui = this.i18n.ui().hero;
    // Persian letters must stay joined, so the name animates as whole words there.
    const split = (word: string) => (this.i18n.lang() === 'fa' ? [word] : [...word]);
    return { first: split(ui.firstName), last: split(ui.lastName) };
  });

  constructor() {
    afterNextRender(() => {
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.animateCounters(reduced);
      if (reduced) this.typed.set(this.i18n.ui().hero.roles[0] ?? '');
    });

    // Restart the typewriter whenever the language changes.
    effect((onCleanup) => {
      const roles = this.i18n.ui().hero.roles;
      if (typeof window === 'undefined' || matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this.typed.set(roles[0] ?? '');
        return;
      }
      let timer = 0;
      let index = 0;
      let chars = 0;
      let erasing = false;
      const tick = () => {
        const word = roles[index % roles.length] ?? '';
        if (!erasing) {
          chars++;
          this.typed.set(word.slice(0, chars));
          if (chars >= word.length) {
            erasing = true;
            timer = window.setTimeout(tick, HOLD_MS);
            return;
          }
          timer = window.setTimeout(tick, TYPE_MS);
        } else {
          chars--;
          this.typed.set(word.slice(0, chars));
          if (chars <= 0) {
            erasing = false;
            index++;
          }
          timer = window.setTimeout(tick, ERASE_MS);
        }
      };
      this.typed.set('');
      timer = window.setTimeout(tick, 600);
      onCleanup(() => clearTimeout(timer));
    });
  }

  protected go(id: string, event: Event): void {
    event.preventDefault();
    this.scroll.scrollTo(id);
  }

  private animateCounters(reduced: boolean): void {
    if (reduced) {
      this.countUp.set(1);
      return;
    }
    const start = performance.now() + 700;
    const duration = 1600;
    let frame = 0;
    const step = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / duration));
      this.countUp.set(1 - Math.pow(1 - t, 4));
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    this.destroyRef.onDestroy(() => cancelAnimationFrame(frame));
  }
}
