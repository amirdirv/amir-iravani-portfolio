import { Directive, ElementRef, inject, input } from '@angular/core';

/**
 * Subtle 3D tilt + cursor spotlight. Writes CSS custom properties only
 * (`--rx`, `--ry`, `--mx`, `--my`), so styling stays in the component's SCSS.
 * Ignores touch input and respects reduced motion.
 */
@Directive({
  selector: '[appTilt]',
  host: {
    '(pointermove)': 'move($event)',
    '(pointerleave)': 'reset()',
  },
})
export class Tilt {
  /** Maximum rotation in degrees. */
  readonly max = input(6, { alias: 'appTilt', transform: (v: string | number) => Number(v) || 6 });

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly reduced =
    typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  protected move(event: PointerEvent): void {
    if (event.pointerType !== 'mouse' || this.reduced) return;
    const node = this.el.nativeElement;
    const r = node.getBoundingClientRect();
    const x = (event.clientX - r.left) / r.width;
    const y = (event.clientY - r.top) / r.height;
    node.style.setProperty('--rx', `${(0.5 - y) * this.max()}deg`);
    node.style.setProperty('--ry', `${(x - 0.5) * this.max()}deg`);
    node.style.setProperty('--mx', `${x * 100}%`);
    node.style.setProperty('--my', `${y * 100}%`);
  }

  protected reset(): void {
    const style = this.el.nativeElement.style;
    for (const prop of ['--rx', '--ry', '--mx', '--my']) style.removeProperty(prop);
  }
}
