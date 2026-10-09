import { resolveRoute } from './page.service';
import { absoluteUrl, localizedPath, parsePath } from './site';

describe('site URLs', () => {
  it('puts English at the root and other languages under a prefix, without trailing slashes', () => {
    expect(localizedPath('en', '/')).toBe('/');
    expect(localizedPath('it', '/')).toBe('/it');
    expect(localizedPath('fa', '/projects/diar')).toBe('/fa/projects/diar');
    expect(localizedPath('en', '/projects/')).toBe('/projects');
  });

  it('builds absolute canonical URLs', () => {
    expect(absoluteUrl('en', '/')).toBe('https://amir-iravani.it/');
    expect(absoluteUrl('it', '/projects')).toBe('https://amir-iravani.it/it/projects');
  });

  it('parses language and language-neutral path', () => {
    expect(parsePath('/')).toEqual({ lang: 'en', path: '/' });
    expect(parsePath('/fa')).toEqual({ lang: 'fa', path: '/' });
    expect(parsePath('/it/projects/tulero?x=1#top')).toEqual({
      lang: 'it',
      path: '/projects/tulero',
    });
    // "/en" is not a language prefix: English lives at the root.
    expect(parsePath('/en/projects')).toEqual({ lang: 'en', path: '/en/projects' });
  });
});

describe('resolveRoute', () => {
  it('maps every page type', () => {
    expect(resolveRoute('/')).toMatchObject({ kind: 'home', lang: 'en' });
    expect(resolveRoute('/it')).toMatchObject({ kind: 'home', lang: 'it' });
    expect(resolveRoute('/fa/projects')).toMatchObject({ kind: 'projects', lang: 'fa' });
    expect(resolveRoute('/projects/diar')).toMatchObject({ kind: 'project', id: 'diar' });
    expect(resolveRoute('/it/projects/tulero/')).toMatchObject({ kind: 'project', id: 'tulero' });
  });

  it('treats everything else as not found', () => {
    expect(resolveRoute('/404').kind).toBe('not-found');
    expect(resolveRoute('/wp-admin').kind).toBe('not-found');
    expect(resolveRoute('/projects/diar/extra').kind).toBe('not-found');
  });
});
