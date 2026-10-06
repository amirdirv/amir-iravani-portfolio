import { formatDuration, formatMonth, monthsBetween, thisMonth } from './dates';

describe('dates', () => {
  it('counts months inclusively', () => {
    expect(monthsBetween('2023-04', '2024-11')).toBe(20);
    expect(monthsBetween('2022-02', '2022-02')).toBe(1);
  });

  it('treats an open end as the current month', () => {
    expect(monthsBetween(thisMonth())).toBe(1);
  });

  it('formats durations with localized units', () => {
    const units = { yr: 'yr', mo: 'mo' };
    expect(formatDuration(20, units, String)).toBe('1 yr 8 mo');
    expect(formatDuration(12, units, String)).toBe('1 yr');
    expect(formatDuration(7, units, String)).toBe('7 mo');
  });

  it('keeps the Gregorian calendar in Persian', () => {
    expect(formatMonth('2023-04', 'en')).toMatch(/Apr.*2023/);
    expect(formatMonth('2023-04', 'fa')).toContain('۲۰۲۳');
  });
});
