import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { I18nService } from '../core/i18n.service';
import { Crumb } from '../core/seo.service';
import { SiteNav } from '../core/site-nav.service';

/**
 * Visible breadcrumb trail. The same `Crumb[]` is passed to `SeoService`,
 * which emits the matching BreadcrumbList JSON-LD, so the two never drift.
 */
@Component({
  selector: 'app-breadcrumbs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="crumbs mono" [attr.aria-label]="i18n.ui().crumbs.label">
      <ol>
        @for (crumb of crumbs(); track $index; let last = $last) {
          <li>
            @if (crumb.path !== undefined && !last) {
              <a [href]="nav.link(crumb.path)">{{ crumb.name }}</a>
            } @else {
              <span aria-current="page">{{ crumb.name }}</span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styles: `
    .crumbs {
      font-size: 12.5px;
      color: var(--c-muted);
    }
    ol {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    li {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    li + li::before {
      content: '/';
      color: var(--c-faint);
    }
    a {
      color: var(--c-muted);
      text-decoration: none;
      &:hover,
      &:focus-visible {
        color: var(--c-text);
        text-decoration: underline;
      }
    }
    [aria-current] {
      color: var(--c-text);
    }
  `,
})
export class Breadcrumbs {
  readonly crumbs = input.required<Crumb[]>();
  protected readonly i18n = inject(I18nService);
  protected readonly nav = inject(SiteNav);
}
