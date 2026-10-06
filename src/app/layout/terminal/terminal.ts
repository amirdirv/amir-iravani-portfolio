import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CommandsService } from '../../core/commands.service';
import { I18nService } from '../../core/i18n.service';
import { ScrollService } from '../../core/scroll.service';
import { ThemeService } from '../../core/theme.service';
import { Line, ShellEffect, complete, runShell } from './shell';

interface Entry {
  id: number;
  input?: string;
  lines: Line[];
}

const BANNER: Line[] = [
  { kind: 'accent', text: 'amir-os 22.0.0 (zoneless) — tty1' },
  { kind: 'muted', text: "Type 'help' to see what I can do. Try 'sudo hire-amir'." },
];

@Component({
  selector: 'app-terminal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './terminal.html',
  styleUrl: './terminal.scss',
})
export class Terminal {
  protected readonly i18n = inject(I18nService);
  private readonly commands = inject(CommandsService);
  private readonly scroll = inject(ScrollService);
  private readonly theme = inject(ThemeService);

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');
  private readonly screen = viewChild.required<ElementRef<HTMLElement>>('screen');

  protected readonly entries = signal<Entry[]>([{ id: 0, lines: BANNER }]);
  protected readonly value = signal('');
  private readonly history: string[] = [];
  private historyIndex = -1;
  private nextId = 1;

  constructor() {
    effect(() => {
      const open = this.commands.terminalOpen();
      const dialog = this.dialog().nativeElement;
      if (open && !dialog.open) {
        dialog.showModal();
        queueMicrotask(() => this.input().nativeElement.focus());
      } else if (!open && dialog.open) {
        dialog.close();
      }
    });
    // Keep the newest output in view.
    effect(() => {
      this.entries();
      queueMicrotask(() => {
        const el = this.screen().nativeElement;
        el.scrollTop = el.scrollHeight;
      });
    });
  }

  protected submit(event: Event): void {
    event.preventDefault();
    const input = this.value();
    this.value.set('');
    if (input.trim()) this.history.push(input);
    this.historyIndex = -1;

    const result = runShell(input, { lang: this.i18n.lang(), history: this.history });
    if (result.effect?.type === 'clear') {
      this.entries.set([]);
      return;
    }
    this.entries.update((list) => [...list, { id: this.nextId++, input, lines: result.lines }]);
    if (result.effect) this.apply(result.effect);
  }

  protected onKey(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      event.preventDefault();
      this.value.set(complete(this.value()));
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      if (!this.history.length) return;
      event.preventDefault();
      const last = this.history.length - 1;
      if (event.key === 'ArrowUp') {
        this.historyIndex = this.historyIndex === -1 ? last : Math.max(0, this.historyIndex - 1);
      } else {
        this.historyIndex =
          this.historyIndex === -1 || this.historyIndex >= last ? -1 : this.historyIndex + 1;
      }
      this.value.set(this.historyIndex === -1 ? '' : this.history[this.historyIndex]!);
    } else if (event.key === 'l' && event.ctrlKey) {
      event.preventDefault();
      this.entries.set([]);
    }
  }

  protected focusInput(): void {
    if (!window.getSelection()?.toString()) this.input().nativeElement.focus();
  }

  protected onClosed(): void {
    this.commands.terminalOpen.set(false);
  }

  protected close(): void {
    this.commands.terminalOpen.set(false);
  }

  private apply(effect: ShellEffect): void {
    switch (effect.type) {
      case 'exit':
        this.close();
        break;
      case 'goto':
        setTimeout(() => {
          this.close();
          this.scroll.scrollTo(effect.section);
        }, 450);
        break;
      case 'lang':
        this.i18n.set(effect.lang);
        break;
      case 'theme':
        this.theme.toggle();
        break;
      case 'open':
        window.open(effect.url, '_blank', 'noopener');
        break;
    }
  }
}
