import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../core/i18n.service';
import { ScrollService } from '../core/scroll.service';
import { Icon } from '../shared/icon';
import { Logo } from '../shared/logo';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Logo, Icon],
  template: `
    @let ui = i18n.ui().footer;
    <footer class="container footer">
      <div class="footer__brand">
        <app-logo [size]="44" [tile]="true" />
        <div>
          <p class="footer__name">Amir Mohammad Iravani</p>
          <p class="footer__built">{{ ui.built }}</p>
        </div>
      </div>

      <div class="footer__actions">
        <button type="button" class="footer__btn" (click)="print()">
          <app-icon name="print" [size]="16" /> {{ ui.print }}
        </button>
        <a class="footer__btn" href="https://github.com/amirdirv/amir-iravani-portfolio" target="_blank" rel="noopener">
          <app-icon name="github" [size]="16" /> {{ ui.source }}
        </a>
        <a class="footer__btn" href="#top" (click)="top($event)">
          <app-icon name="arrowDown" [size]="16" class="up" /> {{ ui.top }}
        </a>
      </div>

      <p class="footer__tips mono">{{ ui.tips }}</p>
      <p class="footer__copy mono">© {{ i18n.num(year) }} Amir Iravani</p>
    </footer>
  `,
  styles: `
    :host { display: block; position: relative; z-index: 1; border-top: 1px solid var(--c-line); }
    .footer { display: grid; grid-template-columns: 1fr auto; gap: 28px 40px; padding-block: 48px 40px; align-items: center; }
    .footer__brand { display: flex; align-items: center; gap: 16px; }
    .footer__name { font-family: var(--f-display); font-weight: 600; }
    .footer__built { font-size: 13px; color: var(--c-muted); }
    .footer__actions { display: flex; flex-wrap: wrap; gap: 8px; }
    .footer__btn {
      display: inline-flex; align-items: center; gap: 8px; padding: 9px 14px; border: 1px solid var(--c-line);
      border-radius: 999px; background: var(--c-surface); font-size: 13px; color: var(--c-muted); text-decoration: none;
      transition: color .2s, border-color .2s;
      &:hover { color: var(--c-text); border-color: var(--c-line-strong); }
    }
    .up { transform: rotate(180deg); }
    .footer__tips, .footer__copy { font-size: 12px; color: var(--c-faint); }
    .footer__copy { text-align: end; }
    @media (max-width: 760px) {
      .footer { grid-template-columns: 1fr; }
      .footer__copy { text-align: start; }
    }
  `,
})
export class Footer {
  protected readonly i18n = inject(I18nService);
  private readonly scroll = inject(ScrollService);
  protected readonly year = new Date().getFullYear();

  protected print(): void {
    window.print();
  }

  protected top(event: Event): void {
    event.preventDefault();
    this.scroll.scrollTo('top');
  }
}
