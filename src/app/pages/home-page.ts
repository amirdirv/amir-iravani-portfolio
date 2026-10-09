import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { I18nService } from '../core/i18n.service';
import { businessSchema, personSchema, profilePageSchema, websiteSchema } from '../core/schema';
import { SeoService } from '../core/seo.service';
import { About } from '../sections/about/about';
import { Contact } from '../sections/contact/contact';
import { EducationSection } from '../sections/education/education';
import { ExperienceSection } from '../sections/experience/experience';
import { Hero } from '../sections/hero/hero';
import { Projects } from '../sections/projects/projects';
import { SignalGraph } from '../sections/skills/signal-graph';

/**
 * The one-page portfolio. Above-the-fold sections ship in the page chunk;
 * everything below is prerendered as HTML but its JavaScript loads and
 * hydrates only when it scrolls into view (`hydrate on viewport`). The
 * placeholders keep the section ids so `#anchors` work before loading.
 */
@Component({
  selector: 'app-home-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Hero, About, SignalGraph, ExperienceSection, Projects, EducationSection, Contact],
  template: `
    <app-hero />
    <app-about />

    @defer (on viewport; hydrate on viewport) {
      <app-signal-graph />
    } @placeholder {
      <section id="skills" class="defer-slot" style="min-height: 1800px"></section>
    }
    @defer (on viewport; hydrate on viewport) {
      <app-experience />
    } @placeholder {
      <section id="experience" class="defer-slot" style="min-height: 2800px"></section>
    }
    @defer (on viewport; hydrate on viewport) {
      <app-projects />
    } @placeholder {
      <section id="projects" class="defer-slot" style="min-height: 2400px"></section>
    }
    @defer (on viewport; hydrate on viewport) {
      <app-education />
    } @placeholder {
      <section id="education" class="defer-slot" style="min-height: 900px"></section>
    }
    @defer (on viewport; hydrate on viewport) {
      <app-contact />
    } @placeholder {
      <section id="contact" class="defer-slot" style="min-height: 1000px"></section>
    }
  `,
})
export class HomePage {
  private readonly i18n = inject(I18nService);
  private readonly seo = inject(SeoService);

  constructor() {
    effect(() => {
      const lang = this.i18n.lang();
      const meta = this.i18n.ui().meta;
      this.seo.apply({
        lang,
        path: '/',
        title: meta.title,
        description: meta.description,
        imageAlt: meta.imageAlt,
        ogType: 'profile',
        schema: [
          websiteSchema(lang),
          profilePageSchema(lang, meta.title, meta.description),
          personSchema(lang),
          businessSchema(lang),
        ],
      });
    });
  }
}
