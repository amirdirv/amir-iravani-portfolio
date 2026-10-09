import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService, LANGS } from '../core/i18n.service';
import { SiteNav } from '../core/site-nav.service';
import { PROJECTS } from '../data/profile';
import { ScrollService } from '../core/scroll.service';
import { Icon } from '../shared/icon';
import { Logo } from '../shared/logo';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Logo, Icon],
  template: `
    @let ui = i18n.ui().footer;
    @let site = i18n.ui().site;
    @let crumbs = i18n.ui().crumbs;
    <footer class="container footer">
      <div class="footer__brand">
        <app-logo [size]="44" [tile]="true" />
        <div>
          <p class="footer__name" translate="no">Amir Mohammad Iravani</p>
          <p class="footer__built">{{ ui.built }}</p>
        </div>
      </div>

      <div class="footer__actions">
        <button type="button" class="footer__btn" (click)="print()">
          <app-icon name="print" [size]="16" /> {{ ui.print }}
        </button>
        <a
          class="footer__btn"
          href="https://github.com/amirdirv/amir-iravani-portfolio"
          target="_blank"
          rel="noopener"
        >
          <app-icon name="github" [size]="16" /> {{ ui.source }}
        </a>
        <button type="button" class="footer__btn" (click)="top()">
          <app-icon name="arrowDown" [size]="16" class="up" /> {{ ui.top }}
        </button>
      </div>

      <nav class="footer__sitemap" [attr.aria-label]="site.pages">
        <div>
          <p class="footer__label mono">{{ site.pages }}</p>
          <ul>
            <li>
              <a [href]="nav.home()">{{ crumbs.home }}</a>
            </li>
            <li>
              <a [href]="nav.projects()">{{ crumbs.projects }}</a>
            </li>
            @for (p of projects; track p.id) {
              <li>
                <a [href]="nav.project(p.id)">{{ p.name }}</a>
              </li>
            }
          </ul>
        </div>
        <div>
          <p class="footer__label mono">{{ site.languages }}</p>
          <ul>
            @for (l of langs; track l.code) {
              <li>
                <a
                  [href]="nav.langLink(l.code)"
                  (click)="nav.onLangClick($event, l.code)"
                  [attr.hreflang]="l.code"
                  [attr.lang]="l.code"
                  >{{ l.native }}</a
                >
              </li>
            }
          </ul>
        </div>
      </nav>

      <p class="footer__tips mono">{{ ui.tips }}</p>
      <p class="footer__copy mono">© {{ i18n.num(year) }} Amir Iravani</p>
    </footer>
  `,
  styles: `
    :host {
      display: block;
      position: relative;
      z-index: 1;
      border-top: 1px solid var(--c-line);
    }
    .footer {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 28px 40px;
      padding-block: 48px 40px;
      align-items: center;
    }
    .footer__brand {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .footer__name {
      font-family: var(--f-display);
      font-weight: 600;
    }
    .footer__built {
      font-size: 13px;
      color: var(--c-muted);
    }
    .footer__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .footer__btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 9px 14px;
      border: 1px solid var(--c-line);
      border-radius: 999px;
      background: var(--c-surface);
      font-size: 13px;
      color: var(--c-muted);
      text-decoration: none;
      transition:
        color 0.2s,
        border-color 0.2s;
      &:hover {
        color: var(--c-text);
        border-color: var(--c-line-strong);
      }
    }
    .up {
      transform: rotate(180deg);
    }
    .footer__sitemap {
      grid-column: 1 / -1;
      display: flex;
      flex-wrap: wrap;
      gap: 24px 64px;
      padding-top: 24px;
      border-top: 1px solid var(--c-line);
      ul {
        display: flex;
        flex-wrap: wrap;
        gap: 6px 18px;
        margin: 8px 0 0;
        padding: 0;
        list-style: none;
      }
      a {
        font-size: 14px;
        color: var(--c-muted);
        text-decoration: none;
        &:hover {
          color: var(--c-text);
          text-decoration: underline;
        }
      }
    }
    .footer__label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--c-faint);
    }
    .footer__tips,
    .footer__copy {
      font-size: 12px;
      color: var(--c-faint);
    }
    .footer__copy {
      text-align: end;
    }
    @media (max-width: 760px) {
      .footer {
        grid-template-columns: 1fr;
      }
      .footer__copy {
        text-align: start;
      }
    }
  `,
})
export class Footer {
  protected readonly i18n = inject(I18nService);
  private readonly scroll = inject(ScrollService);
  protected readonly nav = inject(SiteNav);
  protected readonly projects = PROJECTS;
  protected readonly langs = LANGS;
  protected readonly year = new Date().getFullYear();

  protected print(): void {
    window.print();
  }

  protected top(): void {
    this.scroll.scrollTo('top');
  }
}
