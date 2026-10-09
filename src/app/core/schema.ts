import { EDUCATION, EXPERIENCES, PERSON, PROJECTS, SKILLS, SOCIALS } from '../data/profile';
import { Lang, Project } from './models';
import { SITE_URL, absoluteUrl } from './site';

/**
 * schema.org builders. Stable `@id`s let every page reference the same
 * Person / WebSite / ProfessionalService nodes instead of repeating them.
 */
export const IDS = {
  person: `${SITE_URL}/#person`,
  website: `${SITE_URL}/#website`,
  business: `${SITE_URL}/#business`,
} as const;

const IN_LANGUAGE: Record<Lang, string> = { en: 'en', it: 'it', fa: 'fa' };
const skillName = (id: string) => SKILLS.find((s) => s.id === id)?.label ?? id;

export function personSchema(lang: Lang): object {
  const current = EXPERIENCES.filter((e) => !e.end);
  return {
    '@type': 'Person',
    '@id': IDS.person,
    name: PERSON.name,
    alternateName: PERSON.shortName,
    givenName: 'Amir Mohammad',
    familyName: 'Iravani',
    jobTitle: 'Front-End Engineer',
    description: {
      en: 'Front-end engineer specialised in Angular, React and Vue, based in Turin, Italy.',
      it: 'Front-end engineer specializzato in Angular, React e Vue, con base a Torino.',
      fa: 'مهندس فرانت‌اند متخصص Angular، React و Vue، ساکن تورین ایتالیا.',
    }[lang],
    url: `${SITE_URL}/`,
    image: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/${PERSON.photo.replace(/\.webp$/, '.jpg')}`,
      caption: PERSON.name,
    },
    email: `mailto:${PERSON.email}`,
    homeLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Torino',
        addressRegion: 'Piemonte',
        addressCountry: 'IT',
      },
    },
    knowsLanguage: ['fa', 'en', 'it'],
    knowsAbout: [...new Set(SKILLS.filter((s) => s.weight >= 3).map((s) => s.label))],
    alumniOf: EDUCATION.map((e) => ({
      '@type': 'CollegeOrUniversity',
      name: e.school.en,
      url: e.url,
    })),
    ...(current.length && {
      affiliation: current.map((e) => ({
        '@type': 'Organization',
        name: e.company,
        ...(e.companyUrl && { url: e.companyUrl }),
      })),
    }),
    sameAs: SOCIALS.filter((s) => s.id !== 'email').map((s) => s.url),
  };
}

export function websiteSchema(lang: Lang): object {
  return {
    '@type': 'WebSite',
    '@id': IDS.website,
    url: `${SITE_URL}/`,
    name: 'Amir Iravani',
    inLanguage: ['en', 'it', 'fa'],
    publisher: { '@id': IDS.person },
    about: { '@id': IDS.person },
    description: {
      en: 'Portfolio of Amir Iravani, front-end engineer in Turin.',
      it: 'Portfolio di Amir Iravani, front-end engineer a Torino.',
      fa: 'پورتفولیوی امیر ایروانی، مهندس فرانت‌اند در تورین.',
    }[lang],
  };
}

/**
 * Local business node. A freelancer has no public storefront, so this is a
 * ProfessionalService with a service area (Turin → Piedmont → Italy, plus
 * remote) rather than a street address.
 */
export function businessSchema(lang: Lang): object {
  return {
    '@type': 'ProfessionalService',
    '@id': IDS.business,
    name: {
      en: 'Amir Iravani — Front-End Development',
      it: 'Amir Iravani — Sviluppo Front-End',
      fa: 'امیر ایروانی — توسعهٔ فرانت‌اند',
    }[lang],
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/icons/icon-512.png`,
    image: `${SITE_URL}/og-image.png`,
    email: PERSON.email,
    founder: { '@id': IDS.person },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Torino',
      addressRegion: 'Piemonte',
      addressCountry: 'IT',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 45.0703, longitude: 7.6869 },
    areaServed: [
      { '@type': 'City', name: 'Torino' },
      { '@type': 'AdministrativeArea', name: 'Piemonte' },
      { '@type': 'Country', name: 'Italia' },
    ],
    availableLanguage: ['Persian', 'English', 'Italian'],
    knowsAbout: [
      'Angular',
      'TypeScript',
      'React',
      'Vue.js',
      'Web accessibility',
      'Web performance',
    ],
    makesOffer: [
      {
        en: 'Angular front-end development',
        it: 'Sviluppo front-end Angular',
        fa: 'توسعهٔ فرانت‌اند با Angular',
      },
      {
        en: 'Startup MVPs and landing pages',
        it: 'MVP e landing page per startup',
        fa: 'MVP و لندینگ‌پیج برای استارتاپ',
      },
      {
        en: 'Multilingual and right-to-left websites',
        it: 'Siti multilingue e da destra a sinistra',
        fa: 'وب‌سایت‌های چندزبانه و راست‌به‌چپ',
      },
    ].map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: name[lang] } })),
    sameAs: SOCIALS.filter((s) => s.id !== 'email').map((s) => s.url),
  };
}

export function profilePageSchema(lang: Lang, title: string, description: string): object {
  const url = absoluteUrl(lang, '/');
  return {
    '@type': 'ProfilePage',
    '@id': url + '#webpage',
    url,
    name: title,
    description,
    inLanguage: IN_LANGUAGE[lang],
    isPartOf: { '@id': IDS.website },
    mainEntity: { '@id': IDS.person },
    about: { '@id': IDS.person },
    primaryImageOfPage: `${SITE_URL}/og-image.png`,
  };
}

export function projectsPageSchema(lang: Lang, title: string, description: string): object {
  const url = absoluteUrl(lang, '/projects');
  return {
    '@type': 'CollectionPage',
    '@id': url + '#webpage',
    url,
    name: title,
    description,
    inLanguage: IN_LANGUAGE[lang],
    isPartOf: { '@id': IDS.website },
    author: { '@id': IDS.person },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: PROJECTS.length,
      itemListElement: PROJECTS.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: absoluteUrl(lang, `/projects/${p.id}`),
        name: p.name,
      })),
    },
  };
}

export function projectSchema(
  lang: Lang,
  project: Project,
  title: string,
  description: string,
): object[] {
  const url = absoluteUrl(lang, `/projects/${project.id}`);
  const work = {
    '@type': project.repo ? 'SoftwareSourceCode' : 'CreativeWork',
    '@id': url + '#project',
    name: project.name,
    headline: project.tagline[lang],
    description: project.description[lang],
    url: project.url ?? project.repo ?? url,
    ...(project.repo && { codeRepository: project.repo }),
    creator: { '@id': IDS.person },
    author: { '@id': IDS.person },
    dateCreated: project.year.slice(0, 4),
    keywords: project.stack.map(skillName).join(', '),
    image: `${SITE_URL}/og/${project.id}.png`,
    inLanguage: IN_LANGUAGE[lang],
  };
  const page = {
    '@type': 'WebPage',
    '@id': url + '#webpage',
    url,
    name: title,
    description,
    inLanguage: IN_LANGUAGE[lang],
    isPartOf: { '@id': IDS.website },
    about: { '@id': url + '#project' },
    author: { '@id': IDS.person },
    breadcrumb: { '@id': url + '#breadcrumb' },
    primaryImageOfPage: `${SITE_URL}/og/${project.id}.png`,
  };
  return [page, work];
}
