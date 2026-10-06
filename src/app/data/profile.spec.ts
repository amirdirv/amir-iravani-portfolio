import { Lang } from '../core/models';
import { EDUCATION, EXPERIENCES, PROJECTS, SKILLS, SPOKEN_LANGUAGES } from './profile';
import { UI } from './ui';

const LANGS: Lang[] = ['en', 'it', 'fa'];
const skillIds = new Set(SKILLS.map((s) => s.id));

/** Collects every localized leaf (`{en, it, fa}`) in a tree with its path. */
function leaves(node: unknown, path = 'UI'): [string, Record<string, unknown>][] {
  if (!node || typeof node !== 'object' || Array.isArray(node)) return [];
  const record = node as Record<string, unknown>;
  if ('en' in record) return [[path, record]];
  return Object.entries(record).flatMap(([k, v]) => leaves(v, `${path}.${k}`));
}

describe('profile data', () => {
  it('only references skills that exist', () => {
    for (const job of EXPERIENCES)
      for (const id of job.stack) expect(skillIds, `${job.id} → ${id}`).toContain(id);
    for (const p of PROJECTS)
      for (const id of p.stack) expect(skillIds, `${p.id} → ${id}`).toContain(id);
  });

  it('uses unique ids', () => {
    for (const list of [SKILLS, EXPERIENCES, PROJECTS, EDUCATION]) {
      const ids = list.map((x) => x.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('lists experiences newest first with valid date ranges', () => {
    const starts = EXPERIENCES.map((e) => e.start);
    expect([...starts].sort().reverse()).toEqual(starts);
    for (const e of EXPERIENCES) if (e.end) expect(e.end >= e.start, e.id).toBe(true);
    expect(EXPERIENCES.filter((e) => !e.end).length).toBeGreaterThanOrEqual(1);
  });

  it('translates every role, summary and highlight list into all languages', () => {
    for (const e of EXPERIENCES) {
      for (const lang of LANGS) {
        expect(e.role[lang], `${e.id}.role.${lang}`).toBeTruthy();
        expect(e.summary[lang], `${e.id}.summary.${lang}`).toBeTruthy();
        expect(e.highlights[lang].length, `${e.id}.highlights.${lang}`).toBe(
          e.highlights.en.length,
        );
      }
    }
    for (const p of PROJECTS)
      for (const lang of LANGS) expect(p.description[lang], p.id).toBeTruthy();
  });

  it('has CEFR detail for every non-native language', () => {
    for (const l of SPOKEN_LANGUAGES) if (l.level !== 'native') expect(l.detail?.length).toBe(5);
  });
});

describe('UI copy', () => {
  it('has a non-empty value in every language for every key', () => {
    const all = leaves(UI);
    expect(all.length).toBeGreaterThan(80);
    for (const [path, leaf] of all) {
      for (const lang of LANGS) {
        const value = leaf[lang];
        const ok = Array.isArray(value)
          ? value.length > 0 && value.every(Boolean)
          : typeof value === 'string' && !!value;
        expect(ok, `${path}.${lang}`).toBe(true);
      }
      if (Array.isArray(leaf['en'])) {
        const expected = (leaf['en'] as unknown[]).length;
        for (const lang of LANGS)
          expect((leaf[lang] as unknown[]).length, `${path}.${lang} length`).toBe(expected);
      }
    }
  });
});
