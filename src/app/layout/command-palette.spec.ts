import { TestBed } from '@angular/core/testing';
import { CommandsService } from '../core/commands.service';
import { I18nService } from '../core/i18n.service';
import { CommandPalette, fuzzyScore } from './command-palette';

describe('fuzzyScore', () => {
  it('matches subsequences and rejects the rest', () => {
    expect(fuzzyScore('Projects', 'prj')).toBeGreaterThan(0);
    expect(fuzzyScore('Projects', 'xyz')).toBe(-1);
  });

  it('prefers word starts and consecutive runs', () => {
    expect(fuzzyScore('Italiano', 'ital')).toBeGreaterThan(fuzzyScore('digital', 'ital'));
  });
});

describe('CommandPalette', () => {
  it('ranks label matches above group matches', async () => {
    TestBed.inject(I18nService).set('en');
    const fixture = TestBed.createComponent(CommandPalette);
    TestBed.inject(CommandsService).openPalette();
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'ital';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    const first = fixture.nativeElement.querySelector('[role="option"]') as HTMLElement;
    expect(first.textContent).toContain('Italiano');
  });
});
