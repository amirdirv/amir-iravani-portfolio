import { Lang, YearMonth } from './models';

const LOCALES: Record<Lang, string> = { en: 'en-GB', it: 'it-IT', fa: 'fa-IR' };

function parts(ym: YearMonth): [number, number] {
  const [y, m] = ym.split('-').map(Number);
  return [y!, m!];
}

/** Current month as `YYYY-MM`. */
export function thisMonth(now = new Date()): YearMonth {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}` as YearMonth;
}

/** Inclusive number of months between two `YYYY-MM` values (an open end means "now"). */
export function monthsBetween(start: YearMonth, end: YearMonth = thisMonth()): number {
  const [sy, sm] = parts(start);
  const [ey, em] = parts(end);
  return Math.max(1, (ey - sy) * 12 + (em - sm) + 1);
}

/** "Apr 2023" / "apr 2023" — Persian keeps the Gregorian calendar so dates match the CV. */
export function formatMonth(ym: YearMonth, lang: Lang): string {
  const [y, m] = parts(ym);
  return new Intl.DateTimeFormat(LOCALES[lang], {
    month: 'short',
    year: 'numeric',
    calendar: 'gregory',
    numberingSystem: lang === 'fa' ? 'arabext' : 'latn',
  }).format(new Date(y, m - 1, 1));
}

/** "1 yr 8 mo" in the active language's short units. */
export function formatDuration(
  months: number,
  units: { yr: string; mo: string },
  num: (n: number) => string,
): string {
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y ? `${num(y)} ${units.yr}` : '', m ? `${num(m)} ${units.mo}` : '']
    .filter(Boolean)
    .join(' ');
}
