import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CommandsService } from '../core/commands.service';
import { I18nService, LANGS } from '../core/i18n.service';
import { SECTION_IDS, ScrollService } from '../core/scroll.service';
import { ThemeService } from '../core/theme.service';
import { PERSON, SOCIALS } from '../data/profile';
import { copyText } from '../shared/clipboard';
import { Icon, IconName } from '../shared/icon';

interface Command {
  id: string;
  group: string;
  label: string;
  icon: IconName;
  hint?: string;
  run: () => void;
}

/**
 * Scores `query` as a subsequence of `text` (case-insensitive). Consecutive
 * and word-start matches score higher; -1 means no match.
 */
export function fuzzyScore(text: string, query: string): number {
  const t = text.toLowerCase();
  const q = query.toLowerCase().trim();
  if (!q) return 0;
  let score = 0;
  let ti = 0;
  let streak = 0;
  for (const ch of q) {
    const found = t.indexOf(ch, ti);
    if (found === -1) return -1;
    streak = found === ti ? streak + 1 : 0;
    score += 1 + streak * 2 + (found === 0 || t[found - 1] === ' ' ? 3 : 0);
    ti = found + 1;
  }
  return score - t.length * 0.01;
}

/** Label matches always outrank hint matches, which outrank group-name matches. */
function rank(cmd: Command, query: string): number {
  const label = fuzzyScore(cmd.label, query);
  if (label >= 0) return 2000 + label;
  const hint = cmd.hint ? fuzzyScore(cmd.hint, query) : -1;
  if (hint >= 0) return 1000 + hint;
  return fuzzyScore(cmd.group + ' ' + cmd.label, query);
}

@Component({
  selector: 'app-command-palette',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './command-palette.html',
  styleUrl: './command-palette.scss',
})
export class CommandPalette {
  protected readonly i18n = inject(I18nService);
  private readonly commands = inject(CommandsService);
  private readonly theme = inject(ThemeService);
  private readonly scroll = inject(ScrollService);

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');

  protected readonly query = signal('');
  protected readonly cursor = signal(0);

  private readonly all = computed<Command[]>(() => {
    const ui = this.i18n.ui();
    const p = ui.palette;
    const go: Command[] = SECTION_IDS.map((id) => ({
      id: 'go-' + id,
      group: p.navigate,
      label: ui.nav[id],
      icon: 'arrow',
      hint: '#' + id,
      run: () => this.scroll.scrollTo(id),
    }));
    const actions: Command[] = [
      {
        id: 'terminal',
        group: p.actions,
        label: p.openTerminal,
        icon: 'terminal',
        hint: '`',
        run: () => this.commands.openTerminal(),
      },
      {
        id: 'theme',
        group: p.actions,
        label: p.toggleTheme,
        icon: 'moon',
        run: () => this.theme.toggle(),
      },
      {
        id: 'copy',
        group: p.actions,
        label: p.copyEmail,
        icon: 'copy',
        run: () => void copyText(PERSON.email),
      },
      {
        id: 'print',
        group: p.actions,
        label: p.print,
        icon: 'print',
        run: () => setTimeout(() => window.print(), 50),
      },
      ...LANGS.filter((l) => l.code !== this.i18n.lang()).map((l): Command => ({
        id: 'lang-' + l.code,
        group: p.actions,
        label: `${p.switchLang} ${l.native}`,
        icon: 'globe',
        hint: l.label,
        run: () => this.i18n.set(l.code),
      })),
    ];
    const links: Command[] = SOCIALS.map((s) => ({
      id: 'link-' + s.id,
      group: p.links,
      label: s.label,
      icon: s.id,
      hint: s.id === 'email' ? s.handle : '@' + s.handle,
      run: () => window.open(s.url, s.id === 'email' ? '_self' : '_blank', 'noopener'),
    }));
    return [...go, ...actions, ...links];
  });

  protected readonly results = computed(() => {
    const q = this.query();
    if (!q.trim()) return this.all();
    return this.all()
      .map((c) => ({ c, s: rank(c, q) }))
      .filter((r) => r.s >= 0)
      .sort((a, b) => b.s - a.s)
      .map((r) => r.c);
  });

  /** Results with a group header flag, so the template stays declarative. */
  protected readonly view = computed(() =>
    this.results().map((c, i, list) => ({
      c,
      i,
      header: i === 0 || list[i - 1]!.group !== c.group,
    })),
  );

  private returnFocus: HTMLElement | null = null;

  constructor() {
    effect(() => {
      const open = this.commands.paletteOpen();
      const dialog = this.dialog().nativeElement;
      if (open && !dialog.open) {
        this.returnFocus = document.activeElement as HTMLElement | null;
        this.query.set('');
        this.cursor.set(0);
        dialog.showModal();
        queueMicrotask(() => this.input().nativeElement.focus());
      } else if (!open && dialog.open) {
        dialog.close();
      }
    });
  }

  protected onInput(value: string): void {
    this.query.set(value);
    this.cursor.set(0);
  }

  protected onKey(event: KeyboardEvent): void {
    const count = this.results().length;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!count) return;
      const delta = event.key === 'ArrowDown' ? 1 : -1;
      this.cursor.update((c) => (c + delta + count) % count);
      queueMicrotask(() =>
        this.dialog()
          .nativeElement.querySelector('[aria-selected="true"]')
          ?.scrollIntoView({ block: 'nearest' }),
      );
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const cmd = this.results()[this.cursor()];
      if (cmd) this.run(cmd);
    }
  }

  protected run(cmd: Command): void {
    this.close();
    cmd.run();
  }

  /** Fired by the native dialog on Esc and on `close()`. */
  protected onClosed(): void {
    this.commands.paletteOpen.set(false);
    this.returnFocus?.focus?.({ preventScroll: true });
  }

  protected close(): void {
    this.commands.paletteOpen.set(false);
  }

  protected backdropClick(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) this.close();
  }
}
