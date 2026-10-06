import { DOCUMENT, Injectable, inject, signal } from '@angular/core';

export const SECTION_IDS = ['about', 'skills', 'experience', 'projects', 'education', 'contact'] as const;
export type SectionId = (typeof SECTION_IDS)[number];

/**
 * Tracks scroll progress and which section is on screen, as signals.
 * One passive listener + one IntersectionObserver for the whole page.
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
    };
    win.addEventListener('scroll', () => (frame ||= win.requestAnimationFrame(update)), { passive: true });
    update();

    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) this.active.set(entry.target.id as SectionId);
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    for (const id of SECTION_IDS) {
      const section = this.document.getElementById(id);
      if (section) observer.observe(section);
    }
  }

  scrollTo(id: string): void {
    const target = id === 'top' ? this.document.body : this.document.getElementById(id);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Move focus for keyboard and screen-reader users without a second jump.
    if (target && id !== 'top') {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  }
}
