import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { I18nService } from './i18n.service';

describe('I18nService', () => {
  beforeEach(() => localStorage.clear());

  it('switches language, direction and copy at runtime', () => {
    const i18n = TestBed.inject(I18nService);
    const doc = TestBed.inject(DOCUMENT);

    i18n.set('fa');
    TestBed.tick();
    expect(i18n.dir()).toBe('rtl');
    expect(doc.documentElement.dir).toBe('rtl');
    expect(doc.documentElement.lang).toBe('fa');
    expect(i18n.ui().nav.contact).toBe('تماس');

    i18n.set('it');
    TestBed.tick();
    expect(doc.documentElement.dir).toBe('ltr');
    expect(i18n.ui().nav.contact).toBe('Contatti');
    expect(localStorage.getItem('ai.lang')).toBe('it');
  });

  it('uses Persian digits only in Persian', () => {
    const i18n = TestBed.inject(I18nService);
    i18n.set('en');
    expect(i18n.num(2026)).toBe('2026');
    i18n.set('fa');
    expect(i18n.num(2026)).toBe('۲۰۲۶');
  });
});
