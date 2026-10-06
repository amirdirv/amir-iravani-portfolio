import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { ThemeService } from '../../core/theme.service';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  /** 0 → 1 position along the brand gradient. */
  hue: number;
  size: number;
  sun: boolean;
}

/** The logo strokes in its 64-unit viewBox — kept in sync with `Logo` and favicon.svg. */
const STROKES: [number, number][][] = [
  [[14, 50], [31, 14], [48, 14]],
  [[48, 14], [48, 50]],
  [[22.5, 37], [48, 37]],
];
const SUN = { x: 48, y: 14, r: 4.5 };
const STROKE_W = 6;

/** Samples points that fill the monogram's strokes and sun, in viewBox units. */
function sampleMonogram(density: number): { x: number; y: number; sun: boolean }[] {
  const points: { x: number; y: number; sun: boolean }[] = [];
  for (const stroke of STROKES) {
    for (let i = 0; i < stroke.length - 1; i++) {
      const [ax, ay] = stroke[i]!;
      const [bx, by] = stroke[i + 1]!;
      const len = Math.hypot(bx - ax, by - ay);
      const nx = -(by - ay) / len;
      const ny = (bx - ax) / len;
      const steps = Math.round(len * density);
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const offset = (Math.random() - 0.5) * STROKE_W;
        points.push({ x: ax + (bx - ax) * t + nx * offset, y: ay + (by - ay) * t + ny * offset, sun: false });
      }
    }
  }
  const sunCount = Math.round(SUN.r * SUN.r * density * 1.6);
  for (let i = 0; i < sunCount; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * SUN.r;
    points.push({ x: SUN.x + Math.cos(a) * r, y: SUN.y + Math.sin(a) * r, sun: true });
  }
  return points;
}

/**
 * A few hundred particles that fly in and assemble the Ai monogram, then
 * scatter away from the pointer and spring back. Pure canvas 2D, runs only
 * while on screen and freezes into a still image under reduced motion.
 */
@Component({
  selector: 'app-particle-monogram',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `<canvas #canvas></canvas>`,
  styles: `
    :host { display: block; position: relative; width: 100%; aspect-ratio: 1; touch-action: pan-y; }
    canvas { width: 100%; height: 100%; }
  `,
})
export class ParticleMonogram {
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly theme = inject(ThemeService);
  private readonly destroyRef = inject(DestroyRef);

  private colors = { rose: '#ff2e63', violet: '#8b5cf6', sun: '#ffb300' };
  private particles: Particle[] = [];
  private pointer = { x: -9999, y: -9999 };
  private size = 0;
  private dpr = 1;
  private frame = 0;
  private visible = true;

  constructor() {
    afterNextRender(() => this.init());
    // Re-read brand colours when the theme flips (light theme uses deeper tones).
    effect(() => {
      this.theme.theme();
      queueMicrotask(() => this.readColors());
    });
  }

  private init(): void {
    const canvas = this.canvas().nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const win = window;
    const reduced = win.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.readColors();

    const resize = () => {
      const rect = this.host.nativeElement.getBoundingClientRect();
      this.dpr = Math.min(win.devicePixelRatio || 1, 2);
      this.size = rect.width;
      canvas.width = rect.width * this.dpr;
      canvas.height = rect.width * this.dpr;
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      this.layout(reduced);
      if (reduced) this.draw(ctx);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(this.host.nativeElement);

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      this.pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => (this.pointer = { x: -9999, y: -9999 });
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);

    const io = new IntersectionObserver(([entry]) => {
      this.visible = !!entry?.isIntersecting;
      if (this.visible && !reduced && !this.frame) this.loop(ctx);
    });
    io.observe(canvas);

    this.destroyRef.onDestroy(() => {
      ro.disconnect();
      io.disconnect();
      cancelAnimationFrame(this.frame);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
    });
  }

  /** (Re)computes particle targets for the current canvas size. */
  private layout(settled: boolean): void {
    const pad = this.size * 0.08;
    const scale = (this.size - pad * 2) / 64;
    const density = this.size < 360 ? 3.2 : 4.4;
    const targets = sampleMonogram(density);
    const previous = this.particles;
    this.particles = targets.map((t, i) => {
      const tx = pad + t.x * scale;
      const ty = pad + t.y * scale;
      const old = previous[i];
      const angle = Math.random() * Math.PI * 2;
      const dist = this.size * (0.6 + Math.random() * 0.6);
      return {
        x: settled ? tx : (old?.x ?? this.size / 2 + Math.cos(angle) * dist),
        y: settled ? ty : (old?.y ?? this.size / 2 + Math.sin(angle) * dist),
        vx: 0,
        vy: 0,
        tx,
        ty,
        // Gradient runs bottom-left → top-right like the logo.
        hue: Math.min(1, Math.max(0, (t.x + (64 - t.y)) / 128)),
        size: (t.sun ? 1.5 : 1.1) + Math.random() * 1.3,
        sun: t.sun,
      };
    });
  }

  private loop(ctx: CanvasRenderingContext2D): void {
    if (!this.visible) {
      this.frame = 0;
      return;
    }
    const repel = this.size * 0.16;
    for (const p of this.particles) {
      const dx = p.x - this.pointer.x;
      const dy = p.y - this.pointer.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < repel * repel) {
        const d = Math.sqrt(d2) || 1;
        const force = (1 - d / repel) * 2.4;
        p.vx += (dx / d) * force;
        p.vy += (dy / d) * force;
      }
      p.vx += (p.tx - p.x) * 0.018;
      p.vy += (p.ty - p.y) * 0.018;
      p.vx *= 0.86;
      p.vy *= 0.86;
      p.x += p.vx;
      p.y += p.vy;
    }
    this.draw(ctx);
    this.frame = requestAnimationFrame(() => this.loop(ctx));
  }

  private draw(ctx: CanvasRenderingContext2D): void {
    ctx.clearRect(0, 0, this.size, this.size);
    const { rose, violet, sun } = this.colors;
    for (const p of this.particles) {
      ctx.fillStyle = p.sun ? sun : p.hue < 0.5 ? mix(rose, violet, p.hue / 0.5) : mix(violet, sun, (p.hue - 0.5) / 0.5);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private readColors(): void {
    const style = getComputedStyle(document.documentElement);
    const read = (name: string, fallback: string) => style.getPropertyValue(name).trim() || fallback;
    this.colors = {
      rose: read('--c-rose', '#ff2e63'),
      violet: read('--c-violet', '#8b5cf6'),
      sun: read('--c-sun', '#ffb300'),
    };
    mixCache.clear();
  }
}

const mixCache = new Map<string, string>();

/** Linear mix of two #rrggbb colours, quantised to 24 steps and cached. */
function mix(a: string, b: string, t: number): string {
  const step = Math.round(t * 24);
  const key = a + b + step;
  let out = mixCache.get(key);
  if (!out) {
    const pa = parseInt(a.slice(1), 16);
    const pb = parseInt(b.slice(1), 16);
    const k = step / 24;
    const ch = (shift: number) => Math.round(((pa >> shift) & 255) * (1 - k) + ((pb >> shift) & 255) * k);
    out = `rgb(${ch(16)} ${ch(8)} ${ch(0)})`;
    mixCache.set(key, out);
  }
  return out;
}
