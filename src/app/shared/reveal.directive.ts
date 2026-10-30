import {
  Directive,
  ElementRef,
  OnDestroy,
  afterNextRender,
  booleanAttribute,
  inject,
  input,
} from '@angular/core';

/**
 * Fades an element up (and out of a soft blur) the first time it scrolls into view.
 * `appReveal="120"` delays the transition by 120 ms (for staggering lists).
 * `revealWords` reveals a heading word by word instead (words, never letters,
 * so joined Persian script stays intact).
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
  readonly words = input(false, { alias: 'revealWords', transform: booleanAttribute });

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;

  constructor() {
    afterNextRender(() => {
      const node = this.el.nativeElement;
      if (typeof IntersectionObserver === 'undefined') return;
      if (node.getBoundingClientRect().top < window.innerHeight) return;

      const restore = this.words() ? this.splitWords(node) : null;
      node.classList.add('reveal');
      if (restore) node.classList.add('reveal--words');
      this.observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            node.classList.add('is-visible');
            this.observer?.disconnect();
            if (restore) setTimeout(restore, 1600 + this.delay());
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

  /**
   * Wraps each word of the element's text nodes in a span. Returns a function
   * that puts the original text nodes back (Angular keeps references to them).
   */
  private splitWords(node: HTMLElement): (() => void) | null {
    const texts = [...node.childNodes].filter(
      (n): n is Text => n.nodeType === Node.TEXT_NODE && !!n.textContent?.trim(),
    );
    if (!texts.length || node.children.length) return null;

    node.setAttribute('aria-label', node.textContent?.trim() ?? '');
    const swaps: [Text, HTMLSpanElement][] = [];
    let index = 0;
    for (const text of texts) {
      const holder = node.ownerDocument.createElement('span');
      holder.setAttribute('aria-hidden', 'true');
      for (const part of (text.textContent ?? '').split(/(\s+)/)) {
        if (!part) continue;
        if (/^\s+$/.test(part)) {
          holder.append(part);
          continue;
        }
        const word = node.ownerDocument.createElement('span');
        word.className = 'reveal-word';
        word.style.setProperty('--w', String(index++));
        word.textContent = part;
        holder.append(word);
      }
      text.replaceWith(holder);
      swaps.push([text, holder]);
    }
    return () => {
      for (const [text, holder] of swaps) holder.replaceWith(text);
      node.removeAttribute('aria-label');
      node.classList.remove('reveal--words');
    };
  }
}
