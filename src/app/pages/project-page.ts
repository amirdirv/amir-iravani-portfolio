import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { formatMonth } from '../core/dates';
import { I18nService } from '../core/i18n.service';
import { PageService } from '../core/page.service';
import { projectSchema } from '../core/schema';
import { Crumb, SeoService } from '../core/seo.service';
import { SiteNav } from '../core/site-nav.service';
import { EXPERIENCES, PROJECTS, SKILLS } from '../data/profile';
import { ProjectCover } from '../sections/projects/project-cover';
import { Breadcrumbs } from '../shared/breadcrumbs';
import { Icon } from '../shared/icon';
import { NotFoundView } from './not-found-page';

/** Trims to a whole word at or under `max` characters, for meta descriptions. */
export function clip(text: string, max = 155): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:—–-]+$/, '') + '…';
}

@Component({
  selector: 'app-project-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Breadcrumbs, ProjectCover, Icon, NotFoundView],
  templateUrl: './project-page.html',
  styleUrls: ['./page.scss', './project-page.scss'],
})
export class ProjectPage {
  /** Project id from the URL (`/projects/:id`). */
  protected readonly id = () => this.pageService.route.id ?? '';

  private readonly pageService = inject(PageService);
  protected readonly i18n = inject(I18nService);
  protected readonly nav = inject(SiteNav);
  private readonly seo = inject(SeoService);

  protected readonly project = computed(() => PROJECTS.find((p) => p.id === this.id()));

  protected readonly job = computed(() => {
    const id = this.project()?.experience;
    return id ? EXPERIENCES.find((e) => e.id === id) : undefined;
  });

  protected readonly neighbours = computed(() => {
    const i = PROJECTS.findIndex((p) => p.id === this.id());
    const n = PROJECTS.length;
    return { prev: PROJECTS[(i - 1 + n) % n]!, next: PROJECTS[(i + 1) % n]! };
  });

  protected readonly others = computed(() => PROJECTS.filter((p) => p.id !== this.id()));

  protected readonly crumbs = computed<Crumb[]>(() => {
    const c = this.i18n.ui().crumbs;
    return [
      { name: c.home, path: '/' },
      { name: c.projects, path: '/projects' },
      { name: this.project()?.name ?? '' },
    ];
  });

  constructor() {
    effect(() => {
      const project = this.project();
      if (!project) return; // NotFoundView applies its own (noindex) SEO.
      const lang = this.i18n.lang();
      const ui = this.i18n.ui().project;
      const title = ui.titleTemplate.replace('{name}', project.name);
      const description = clip(`${project.tagline[lang]} ${project.description[lang]}`);
      this.seo.apply({
        lang,
        path: `/projects/${project.id}`,
        title,
        description,
        image: `/og/${project.id}.png`,
        imageAlt: `${project.name} — ${project.tagline[lang]}`,
        ogType: 'article',
        breadcrumbs: this.crumbs(),
        schema: projectSchema(lang, project, title, description),
      });
    });
  }

  protected skill(id: string): string {
    return SKILLS.find((s) => s.id === id)?.label ?? id;
  }

  protected jobRange(): string {
    const job = this.job();
    if (!job) return '';
    const lang = this.i18n.lang();
    const end = job.end ? formatMonth(job.end, lang) : this.i18n.ui().common.present;
    return `${formatMonth(job.start, lang)} — ${end}`;
  }
}
