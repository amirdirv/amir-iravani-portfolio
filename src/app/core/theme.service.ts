import { DOCUMENT, Injectable, effect, inject, signal } from '@angular/core';
import { readStorage, writeStorage } from './storage';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'ai.theme';

/** Dark by default; respects the OS preference until the visitor chooses. */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  readonly theme = signal<Theme>(this.initialTheme());

  constructor() {
    effect(() => {
      const theme = this.theme();
      this.document.documentElement.dataset['theme'] = theme;
      this.document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', theme === 'dark' ? '#07070c' : '#f6f4ef');
    });
  }

  toggle(): void {
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    writeStorage(STORAGE_KEY, next);
  }

  private initialTheme(): Theme {
    const saved = readStorage(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    const prefersLight = this.document.defaultView?.matchMedia?.(
      '(prefers-color-scheme: light)',
    ).matches;
    return prefersLight ? 'light' : 'dark';
  }
}
