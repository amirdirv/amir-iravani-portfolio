import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { I18nService } from '../core/i18n.service';
import { projectsPageSchema } from '../core/schema';
import { Crumb, SeoService } from '../core/seo.service';
import { Projects } from '../sections/projects/projects';
import { Breadcrumbs } from '../shared/breadcrumbs';

@Component({
  selector: 'app-projects-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Projects, Breadcrumbs],
  template: `
    @let ui = i18n.ui().projectsPage;
    <header class="container page-head">
      <app-breadcrumbs [crumbs]="crumbs()" />
      <h1 class="page-title">{{ ui.heading }}</h1>
      <p class="section-lead">{{ ui.lead }}</p>
    </header>
    <app-projects [asPage]="true" />
  `,
  styleUrl: './page.scss',
})
export class ProjectsPage {
  protected readonly i18n = inject(I18nService);
  private readonly seo = inject(SeoService);

  protected crumbs(): Crumb[] {
    const c = this.i18n.ui().crumbs;
    return [{ name: c.home, path: '/' }, { name: c.projects }];
  }

  constructor() {
    effect(() => {
      const lang = this.i18n.lang();
      const ui = this.i18n.ui().projectsPage;
      this.seo.apply({
        lang,
        path: '/projects',
        title: ui.title,
        description: ui.description,
        breadcrumbs: this.crumbs(),
        schema: [projectsPageSchema(lang, ui.title, ui.description)],
      });
    });
  }
}
