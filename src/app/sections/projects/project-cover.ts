import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Small seeded PRNG (mulberry32) so a project's cover never changes between visits. */
function rng(seed: string): () => number {
  let a = 0;
  for (const ch of seed) a = (Math.imul(a ^ ch.charCodeAt(0), 2654435761) >>> 0) + 1;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generative cover art: concentric arcs, a dot field and an orbiting "sun",
 * all derived from the project id and its two-colour palette.
 */
@Component({
  selector: 'app-project-cover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `
    <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient [attr.id]="id() + '-bg'" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" [attr.stop-color]="palette()[0]" />
          <stop offset="1" [attr.stop-color]="palette()[1]" />
        </linearGradient>
        <radialGradient [attr.id]="id() + '-glow'">
          <stop offset="0" stop-color="#fff" stop-opacity=".55" />
          <stop offset="1" stop-color="#fff" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="240" [attr.fill]="'url(#' + id() + '-bg)'" />
      <g fill="none" stroke="#fff" stroke-linecap="round">
        @for (arc of art().arcs; track $index) {
          <circle
            [attr.cx]="art().cx"
            [attr.cy]="art().cy"
            [attr.r]="arc.r"
            [attr.stroke-width]="arc.w"
            [attr.stroke-opacity]="arc.o"
            [attr.stroke-dasharray]="arc.dash"
            class="arc"
            [style.animation-duration.s]="arc.speed"
            [style.transform-origin]="art().cx + 'px ' + art().cy + 'px'"
          />
        }
      </g>
      <g fill="#fff">
        @for (dot of art().dots; track $index) {
          <circle
            [attr.cx]="dot.x"
            [attr.cy]="dot.y"
            [attr.r]="dot.r"
            [attr.fill-opacity]="dot.o"
          />
        }
      </g>
      <circle
        [attr.cx]="art().sx"
        [attr.cy]="art().sy"
        r="46"
        [attr.fill]="'url(#' + id() + '-glow)'"
      />
      <circle [attr.cx]="art().sx" [attr.cy]="art().sy" r="9" fill="#fff" />
    </svg>
  `,
  styles: `
    :host {
      display: block;
      overflow: hidden;
    }
    svg {
      width: 100%;
      height: 100%;
    }
    .arc {
      transform-box: view-box;
      animation: turn linear infinite;
      animation-play-state: var(--play, paused);
    }
    @keyframes turn {
      to {
        transform: rotate(360deg);
      }
    }
  `,
})
export class ProjectCover {
  readonly id = input.required<string>();
  readonly palette = input.required<readonly [string, string]>();

  protected readonly art = computed(() => {
    const rand = rng(this.id());
    const cx = 260 + rand() * 120;
    const cy = 40 + rand() * 160;
    const arcs = Array.from({ length: 7 }, (_, i) => {
      const r = 30 + i * 26 + rand() * 10;
      const circumference = 2 * Math.PI * r;
      const on = circumference * (0.15 + rand() * 0.55);
      return {
        r,
        w: 1 + rand() * 2.5,
        o: 0.25 + rand() * 0.5,
        dash: `${on} ${circumference - on}`,
        speed: 30 + rand() * 60,
      };
    });
    const dots = Array.from({ length: 36 }, () => ({
      x: rand() * 400,
      y: rand() * 240,
      r: 0.8 + rand() * 1.8,
      o: 0.2 + rand() * 0.5,
    }));
    const angle = rand() * Math.PI * 2;
    return { cx, cy, arcs, dots, sx: cx + Math.cos(angle) * 82, sy: cy + Math.sin(angle) * 82 };
  });
}
