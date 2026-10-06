import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { formatDuration, formatMonth, monthsBetween } from '../../core/dates';
import { I18nService } from '../../core/i18n.service';
import { Experience as Job } from '../../core/models';
import { EXPERIENCES, SKILLS } from '../../data/profile';
import { Icon } from '../../shared/icon';
import { Reveal } from '../../shared/reveal.directive';

type Line = 'full' | 'top' | 'bottom' | 'none';

interface Row {
  key: string;
  kind: 'head' | 'commit' | 'merge' | 'init';
  lane: 0 | 1;
  hash: string;
  /** Vertical line segments drawn in each lane's gutter for this row. */
  lines: [Line, Line];
  job?: Job;
}

/** The year Amir moved from Tehran to Turin — where the two branches merge. */
const MERGE_AT = '2022-09';

/** Deterministic 7-char "commit hash" so the same role always shows the same sha. */
function sha(input: string): string {
  let h = 0x811c9dc5;
  for (const ch of input) h = Math.imul(h ^ ch.charCodeAt(0), 0x01000193);
  return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7);
}

/** Builds the `git log --graph` rows: HEAD, Turin commits, the merge, Tehran commits, the initial commit. */
function buildRows(): Row[] {
  const turin = EXPERIENCES.filter((e) => e.branch === 'turin');
  const tehran = EXPERIENCES.filter((e) => e.branch === 'tehran');
  return [
    { key: 'head', kind: 'head', lane: 0, hash: 'HEAD', lines: ['bottom', 'none'] },
    ...turin.map((job): Row => ({
      key: job.id,
      kind: 'commit',
      lane: 0,
      hash: sha(job.id),
      lines: ['full', 'none'],
      job,
    })),
    {
      key: 'merge',
      kind: 'merge',
      lane: 0,
      hash: sha('merge' + MERGE_AT),
      lines: ['top', 'bottom'],
    },
    ...tehran.map((job): Row => ({
      key: job.id,
      kind: 'commit',
      lane: 1,
      hash: sha(job.id),
      lines: ['none', 'full'],
      job,
    })),
    { key: 'init', kind: 'init', lane: 1, hash: sha('init'), lines: ['none', 'top'] },
  ];
}

@Component({
  selector: 'app-experience',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
})
export class ExperienceSection {
  protected readonly i18n = inject(I18nService);
  protected readonly rows = buildRows();
  /** The two most recent roles start expanded. */
  protected readonly expanded = signal(new Set(EXPERIENCES.slice(0, 2).map((e) => e.id)));

  protected readonly mergeDate = computed(() => formatMonth(MERGE_AT, this.i18n.lang()));
  protected readonly initDate = computed(() =>
    formatMonth(EXPERIENCES.at(-1)!.start, this.i18n.lang()),
  );

  protected toggle(id: string): void {
    this.expanded.update((set) => {
      const next = new Set(set);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  }

  protected range(job: Job): string {
    const lang = this.i18n.lang();
    const end = job.end ? formatMonth(job.end, lang) : this.i18n.ui().common.present;
    return `${formatMonth(job.start, lang)} — ${end}`;
  }

  protected duration(job: Job): string {
    const ui = this.i18n.ui().experience;
    return formatDuration(monthsBetween(job.start, job.end), ui, (n) => this.i18n.num(n));
  }

  protected skill(id: string): string {
    return SKILLS.find((s) => s.id === id)?.label ?? id;
  }
}
