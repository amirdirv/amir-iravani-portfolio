import { ChangeDetectionStrategy, Component, input } from '@angular/core';

let uid = 0;

/**
 * The "Ai" monogram: an A whose apex runs straight into the stem of an i,
 * dotted with a sun. Amir Iravani → A.I. — the human kind.
 *
 * `animated` draws the strokes in and lets the sun pulse.
 */
@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'logo', '[class.logo--animated]': 'animated()', role: 'img', '[attr.aria-label]': 'label()' },
  template: `
    <svg viewBox="0 0 64 64" [attr.width]="size()" [attr.height]="size()" aria-hidden="true">
      <defs>
        <linearGradient [attr.id]="gradientId" gradientUnits="userSpaceOnUse" x1="10" y1="54" x2="54" y2="10">
          <stop offset="0" stop-color="var(--c-rose)" />
          <stop offset=".55" stop-color="var(--c-violet)" />
          <stop offset="1" stop-color="var(--c-sun)" />
        </linearGradient>
      </defs>
      @if (tile()) {
        <rect width="64" height="64" rx="16" class="logo__tile" />
      }
      <g fill="none" [attr.stroke]="'url(#' + gradientId + ')'" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
        <path class="logo__stroke" pathLength="1" d="M14 50 31 14h17" />
        <path class="logo__stroke logo__stroke--2" pathLength="1" d="M48 14v36" />
        <path class="logo__stroke logo__stroke--3" pathLength="1" d="M22.5 37H48" />
      </g>
      <circle class="logo__sun" cx="48" cy="14" r="4.5" />
    </svg>
  `,
  styles: `
    :host { display: inline-flex; line-height: 0; }
    .logo__tile { fill: var(--c-tile); }
    .logo__sun { fill: var(--c-sun); transform-origin: 48px 14px; }
    :host(.logo--animated) {
      .logo__stroke { stroke-dasharray: 1; stroke-dashoffset: 1; animation: draw 0.9s var(--ease-out) forwards; }
      .logo__stroke--2 { animation-delay: 0.35s; }
      .logo__stroke--3 { animation-delay: 0.6s; }
      .logo__sun { transform: scale(0); animation: rise 0.6s 0.9s var(--ease-spring) forwards, pulse 3.2s 1.6s ease-in-out infinite; }
    }
    @keyframes draw { to { stroke-dashoffset: 0; } }
    @keyframes rise { to { transform: scale(1); } }
    @keyframes pulse { 50% { filter: drop-shadow(0 0 6px var(--c-sun)); } }
    @media (prefers-reduced-motion: reduce) {
      :host(.logo--animated) .logo__stroke, :host(.logo--animated) .logo__sun { animation: none; stroke-dashoffset: 0; transform: none; }
    }
  `,
})
export class Logo {
  readonly size = input(36);
  readonly tile = input(false);
  readonly animated = input(false);
  readonly label = input('Amir Iravani');

  protected readonly gradientId = `ai-logo-${++uid}`;
}
