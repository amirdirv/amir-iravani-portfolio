import { ChangeDetectionStrategy, Component, DOCUMENT, effect, inject } from '@angular/core';
import { I18nService } from '../core/i18n.service';
import { SeoService } from '../core/seo.service';
import { SiteNav } from '../core/site-nav.service';
import { parsePath } from '../core/site';
import { PROJECTS } from '../data/profile';
import { Icon } from '../shared/icon';

/**
 * Body of the 404 page, also used inline when `/projects/:id` has an
 * unknown id. Marks the page `noindex` and offers the useful ways out.
 */
@Component({
  selector: 'app-not-found-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    @let ui = i18n.ui().notFound;
    <section class="container nf" aria-labelledby="nf-title">
      <p class="nf__code mono" aria-hidden="true">404</p>
      <h1 id="nf-title" class="page-title">{{ ui.heading }}</h1>
      <p class="section-lead">{{ ui.lead }}</p>

      <pre
        class="nf__term mono"
        dir="ltr"
        aria-hidden="true"
      ><span class="ps1">amir&#64;turin:~$</span> git checkout {{ path }}
<span class="err">error: pathspec '{{ path }}' did not match any file(s) known to git</span></pre>

      <p class="nf__actions">
        <a class="btn btn--primary" [href]="nav.home()">
          {{ ui.home }} <app-icon name="arrow" [size]="18" class="flip-rtl" />
        </a>
        <a class="btn" [href]="nav.projects()">{{ ui.projects }}</a>
        <a class="btn" [href]="nav.section('contact')">{{ ui.contact }}</a>
      </p>

      <ul class="nf__links">
        @for (p of projects; track p.id) {
          <li>
            <a [href]="nav.project(p.id)">{{ p.name }}</a>
          </li>
        }
      </ul>
    </section>
  `,
  styleUrl: './page.scss',
  styles: `
    .nf {
      display: grid;
      gap: 20px;
      padding-bottom: clamp(64px, 10vw, 140px);
    }
    .nf__code {
      font-size: clamp(5rem, 18vw, 11rem);
      line-height: 0.9;
      font-weight: 500;
      background: var(--grad-brand);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .nf__term {
      max-width: 100%;
      margin: 8px 0 0;
      padding: 16px 18px;
      overflow-x: auto;
      border: 1px solid var(--c-line);
      border-radius: var(--radius-sm);
      background: var(--c-bg-2);
      font-size: 13px;
      white-space: pre-wrap;
      word-break: break-word;
      .ps1 {
        color: var(--c-teal);
      }
      .err {
        color: var(--c-rose);
      }
    }
    .nf__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
    .nf__links {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 20px;
      margin: 8px 0 0;
      padding: 0;
      list-style: none;
      a {
        color: var(--c-muted);
        &:hover {
          color: var(--c-text);
        }
      }
    }
  `,
})
export class NotFoundView {
  protected readonly i18n = inject(I18nService);
  protected readonly nav = inject(SiteNav);
  private readonly seo = inject(SeoService);
  protected readonly projects = PROJECTS;
  private readonly document = inject(DOCUMENT);

  /** The path the visitor asked for, echoed in the fake terminal. */
  protected get path(): string {
    return this.document.location?.pathname.replace(/^\/+/, '').slice(0, 80) || '404';
  }

  constructor() {
    effect(() => {
      const lang = this.i18n.lang();
      const ui = this.i18n.ui().notFound;
      const current = parsePath(this.path === '404' ? '/' : '/' + this.path).path;
      this.seo.apply({
        lang,
        path: current,
        title: ui.title,
        description: ui.description,
        noindex: true,
      });
    });
  }
}

@Component({
  selector: 'app-not-found-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NotFoundView],
  template: `<app-not-found-view />`,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class NotFoundPage {}
