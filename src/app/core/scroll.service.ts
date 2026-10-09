import { DOCUMENT, Injectable, inject, signal } from '@angular/core';
import { prefersReducedMotion } from './motion';

export const SECTION_IDS = [
  'about',
  'skills',
  'experience',
  'projects',
  'education',
  'contact',
] as const;
export type SectionId = (typeof SECTION_IDS)[number];

/**
 * Scroll state as signals (progress, scroll-spy) and in-page section jumps.
 * Pages are real documents, so back/forward and `#anchor` scrolling are the
 * browser's own; this only adds smooth scrolling and focus management.
 */
@Injectable({ providedIn: 'root' })
export class ScrollService {
  private readonly document = inject(DOCUMENT);

  /** 0 → 1 across the whole document. */
  readonly progress = signal(0);
  /** True once the visitor has scrolled past the top of the hero. */
  readonly scrolled = signal(false);
  readonly active = signal<SectionId | null>(null);

  private started = false;

  /** Called once by the shell after first render (needs a real DOM). */
  start(): void {
    const win = this.document.defaultView;
    if (this.started || !win) return;
    this.started = true;

    let frame = 0;
    const update = () => {
      frame = 0;
      const el = this.document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      this.progress.set(max > 0 ? Math.min(1, el.scrollTop / max) : 0);
      this.scrolled.set(el.scrollTop > 24);
      this.active.set(this.sectionAt(win.innerHeight * 0.45));
    };
    win.addEventListener('scroll', () => (frame ||= win.requestAnimationFrame(update)), {
      passive: true,
    });
    update();

    // From now on in-page #anchor links animate (the landing jump stayed instant).
    win.requestAnimationFrame(() => this.document.documentElement.classList.add('smooth-scroll'));

    // Native #anchor jumps (links, back/forward): move focus to the section too.
    win.addEventListener('hashchange', () => this.focusSection(win.location.hash.slice(1)));
  }

  scrollTo(id: string, behavior: ScrollBehavior = 'smooth'): void {
    const win = this.document.defaultView;
    if (id === 'top') {
      win?.scrollTo({ top: 0, behavior: this.motion(behavior) });
      return;
    }
    const target = this.document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: this.motion(behavior), block: 'start' });
    this.focusSection(id);
  }

  /** Moves focus for keyboard and screen-reader users without a second jump. */
  private focusSection(id: string): void {
    const target = id ? this.document.getElementById(id) : null;
    if (!target) return;
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }

  /** The last section whose top has passed `line` px from the viewport top. */
  private sectionAt(line: number): SectionId | null {
    let current: SectionId | null = null;
    for (const id of SECTION_IDS) {
      const el = this.document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= line) current = id;
    }
    return current;
  }

  private motion(behavior: ScrollBehavior): ScrollBehavior {
    return prefersReducedMotion() ? 'instant' : behavior;
  }
}
