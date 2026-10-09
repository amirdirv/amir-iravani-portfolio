import { Directive, ElementRef, OnDestroy, afterNextRender, inject, input } from '@angular/core';

/**
 * Fades an element up the first time it scrolls into view.
 * `appReveal="120"` delays the transition by 120 ms (for staggering lists).
 *
 * The hiding class is added in the browser only, and only to elements that
 * are still below the viewport: prerendered HTML is always fully visible
 * (crawlers, no-JS visitors), and content already on screen never blinks.
 */
@Directive({
  selector: '[appReveal]',
  host: { '[style.--reveal-delay.ms]': 'delay()' },
})
export class Reveal implements OnDestroy {
  readonly delay = input(0, {
    alias: 'appReveal',
    transform: (v: string | number) => Number(v) || 0,
  });

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;

  constructor() {
    afterNextRender(() => {
      const node = this.el.nativeElement;
      if (typeof IntersectionObserver === 'undefined') return;
      if (node.getBoundingClientRect().top < window.innerHeight) return;

      node.classList.add('reveal');
      this.observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            node.classList.add('is-visible');
            this.observer?.disconnect();
          }
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
      );
      this.observer.observe(node);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
