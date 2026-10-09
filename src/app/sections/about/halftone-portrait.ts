import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ThemeService } from '../../core/theme.service';

/**
 * Renders the portrait as a halftone of brand-coloured dots; hovering (or
 * focusing) "develops" it into the real photo. The dot grid is computed once
 * from the image's luminance and redrawn only when the theme changes.
 */
@Component({
  selector: 'app-halftone-portrait',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Focusable so keyboard users can "develop" the photo too; the <img> carries the alt text.
  host: { '[class.is-ready]': 'ready()', tabindex: '0' },
  template: `
    <img [src]="src()" [alt]="alt()" width="250" height="250" loading="lazy" decoding="async" />
    <canvas #canvas aria-hidden="true"></canvas>
  `,
  styles: `
    :host {
      position: relative;
      display: block;
      aspect-ratio: 1;
      overflow: hidden;
      border-radius: var(--radius);
      background: var(--c-bg-2);
      outline-offset: 4px;
    }
    img,
    canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    img {
      opacity: 0;
      filter: grayscale(0.2) contrast(1.05);
      transform: scale(1.06);
      transition:
        opacity 0.7s var(--ease-out),
        transform 1.2s var(--ease-out);
    }
    canvas {
      transition:
        opacity 0.7s var(--ease-out),
        transform 1.2s var(--ease-out);
    }
    :host(:hover) img,
    :host(:focus-visible) img,
    :host(:not(.is-ready)) img {
      opacity: 1;
      transform: none;
    }
    :host(:hover) canvas,
    :host(:focus-visible) canvas {
      opacity: 0;
      transform: scale(1.04);
    }
  `,
})
export class HalftonePortrait {
  readonly src = input.required<string>();
  readonly alt = input('');

  protected readonly ready = signal(false);
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly theme = inject(ThemeService);
  private cells: { x: number; y: number; r: number; t: number }[] = [];
  private readonly grid = 46;

  constructor() {
    afterNextRender(() => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        this.cells = this.sample(img);
        this.draw();
        this.ready.set(true);
      };
      img.src = this.src();
    });
    effect(() => {
      this.theme.theme();
      if (this.cells.length) queueMicrotask(() => this.draw());
    });
  }

  private sample(img: HTMLImageElement): { x: number; y: number; r: number; t: number }[] {
    const n = this.grid;
    const off = document.createElement('canvas');
    off.width = off.height = n;
    const ctx = off.getContext('2d', { willReadFrequently: true });
    if (!ctx) return [];
    ctx.drawImage(img, 0, 0, n, n);
    const { data } = ctx.getImageData(0, 0, n, n);
    const cells = [];
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        const i = (y * n + x) * 4;
        const lum = (0.2126 * data[i]! + 0.7152 * data[i + 1]! + 0.0722 * data[i + 2]!) / 255;
        // Contrast curve so the light studio background drops out cleanly.
        const ink = Math.pow(1 - lum, 1.35);
        if (ink > 0.06) cells.push({ x, y, r: ink, t: (x + (n - y)) / (2 * n) });
      }
    }
    return cells;
  }

  private draw(): void {
    const canvas = this.canvas().nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const size = 720;
    canvas.width = canvas.height = size;
    const step = size / this.grid;
    const css = getComputedStyle(document.documentElement);
    const stops = ['--c-rose', '--c-violet', '--c-sun'].map((v) => css.getPropertyValue(v).trim());
    const gradient = ctx.createLinearGradient(0, size, size, 0);
    gradient.addColorStop(0, stops[0] || '#ff2e63');
    gradient.addColorStop(0.55, stops[1] || '#8b5cf6');
    gradient.addColorStop(1, stops[2] || '#ffb300');

    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    for (const c of this.cells) {
      const cx = c.x * step + step / 2;
      const cy = c.y * step + step / 2;
      const r = (step / 2) * Math.min(1, c.r * 1.15);
      ctx.moveTo(cx + r, cy);
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
    }
    ctx.fill();
  }
}
