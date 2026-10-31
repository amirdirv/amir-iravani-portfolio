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
import { prefersReducedMotion } from '../../core/motion';

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
  [
    [14, 50],
    [31, 14],
    [48, 14],
  ],
  [
    [48, 14],
    [48, 50],
  ],
  [
    [22.5, 37],
    [48, 37],
  ],
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
        points.push({
          x: ax + (bx - ax) * t + nx * offset,
          y: ay + (by - ay) * t + ny * offset,
          sun: false,
        });
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
    :host {
      display: block;
      position: relative;
      width: 100%;
      aspect-ratio: 1;
      touch-action: pan-y;
    }
    canvas {
      width: 100%;
      height: 100%;
    }
    @media not ((hover: hover) and (pointer: fine)) {
      canvas {
        animation: monogram-in 1s 0.2s var(--ease-out, ease-out) both;
      }
    }
    @keyframes monogram-in {
      from {
        opacity: 0;
        transform: scale(0.94);
      }
    }
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
  private started = false;

  constructor() {
    afterNextRender(() => this.init());
    // Re-read brand colours when the theme flips (light theme uses deeper tones).
    effect(() => {
      this.theme.theme();
      // Browser only: there are no computed styles while prerendering.
      if (this.size) queueMicrotask(() => this.readColors());
    });
  }

  private init(): void {
    const canvas = this.canvas().nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const win = window;
    // Touch devices get the finished monogram at once (with a CSS fade): the fly-in costs a phone's CPU
    // seconds of work during page load. Mouse users keep the full animation and the pointer repel.
    const reduced =
      prefersReducedMotion() ||
      (typeof win.matchMedia === 'function' && !win.matchMedia('(hover: hover) and (pointer: fine)').matches);
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
      else if (this.started && this.visible && !this.frame) this.loop(ctx);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(this.host.nativeElement);

    // The loop sleeps once the monogram has settled; the pointer wakes it up again.
    const wake = () => {
      if (this.started && this.visible && !reduced && !this.frame) this.loop(ctx);
    };
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      this.pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      wake();
    };
    const onLeave = () => {
      this.pointer = { x: -9999, y: -9999 };
      wake();
    };
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);

    const io = new IntersectionObserver(([entry]) => {
      this.visible = !!entry?.isIntersecting;
      wake();
    });
    io.observe(canvas);

    // The fly-in starts once the page has loaded and the main thread is free, so it never competes with the
    // first paint or the first tap.
    const begin = () => {
      this.started = true;
      wake();
    };
    const idle = (win as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
      .requestIdleCallback;
    const schedule = () => (idle ? idle(begin, { timeout: 1500 }) : setTimeout(begin, 200));
    if (document.readyState === 'complete') schedule();
    else win.addEventListener('load', schedule, { once: true });

    this.destroyRef.onDestroy(() => {
      ro.disconnect();
      io.disconnect();
      win.removeEventListener('load', schedule);
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
    let motion = 0;
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
      motion = Math.max(motion, Math.abs(p.vx) + Math.abs(p.vy), Math.abs(p.tx - p.x) + Math.abs(p.ty - p.y));
    }
    this.draw(ctx);
    // Settled (every particle home, nothing moving): stop until the pointer or a resize wakes it.
    if (motion < 0.05) {
      this.frame = 0;
      return;
    }
    this.frame = requestAnimationFrame(() => this.loop(ctx));
  }

  private draw(ctx: CanvasRenderingContext2D): void {
    ctx.clearRect(0, 0, this.size, this.size);
    const { rose, violet, sun } = this.colors;
    // One path per colour instead of one fill per particle (a few dozen fills instead of hundreds).
    const groups = new Map<string, Particle[]>();
    for (const p of this.particles) {
      const color = p.sun
        ? sun
        : p.hue < 0.5
          ? mix(rose, violet, p.hue / 0.5)
          : mix(violet, sun, (p.hue - 0.5) / 0.5);
      let list = groups.get(color);
      if (!list) groups.set(color, (list = []));
      list.push(p);
    }
    for (const [color, list] of groups) {
      ctx.fillStyle = color;
      ctx.beginPath();
      for (const p of list) {
        ctx.moveTo(p.x + p.size, p.y);
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      }
      ctx.fill();
    }
  }

  private readColors(): void {
    const style = getComputedStyle(document.documentElement);
    const read = (name: string, fallback: string) =>
      style.getPropertyValue(name).trim() || fallback;
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
    const ch = (shift: number) =>
      Math.round(((pa >> shift) & 255) * (1 - k) + ((pb >> shift) & 255) * k);
    out = `rgb(${ch(16)} ${ch(8)} ${ch(0)})`;
    mixCache.set(key, out);
  }
  return out;
}
