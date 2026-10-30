import { DOCUMENT, Injectable, effect, inject, signal } from '@angular/core';
import { prefersReducedMotion } from './motion';
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
      // setAttribute, not dataset: the prerender DOM has no `dataset`.
      this.document.documentElement.setAttribute('data-theme', theme);
      this.document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', theme === 'dark' ? '#07070c' : '#f6f4ef');
    });
  }

  /**
   * Switches theme. With a click event, the new theme grows out of the button
   * as a circle (View Transitions API); elsewhere it simply cross-fades.
   */
  toggle(event?: MouseEvent): void {
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    const apply = () => {
      this.theme.set(next);
      writeStorage(STORAGE_KEY, next);
    };
    const doc = this.document as Document & {
      startViewTransition?: (cb: () => void) => {
        ready: Promise<void>;
        finished: Promise<void>;
      };
    };
    if (!event || !doc.startViewTransition || prefersReducedMotion()) {
      apply();
      return;
    }
    const { clientX: x, clientY: y } = event;
    const win = this.document.defaultView!;
    const radius = Math.hypot(Math.max(x, win.innerWidth - x), Math.max(y, win.innerHeight - y));
    const root = this.document.documentElement;
    const transition = doc.startViewTransition(() => {
      // Colour transitions off, so the "after" snapshot shows the final colours.
      root.classList.add('theme-switching');
      apply();
      // Signals render asynchronously; set the attribute now so the snapshot is right.
      root.setAttribute('data-theme', next);
    });
    transition.finished.finally(() => root.classList.remove('theme-switching'));
    transition.ready
      .then(() => {
        this.document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          {
            duration: 650,
            easing: 'cubic-bezier(0.32, 0.72, 0, 1)',
            pseudoElement: '::view-transition-new(root)',
          },
        );
      })
      .catch(() => {});
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
