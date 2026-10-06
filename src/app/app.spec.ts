import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { CommandsService } from './core/commands.service';

describe('App', () => {
  it('renders every section in order', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const sections = (fixture.nativeElement as HTMLElement).querySelectorAll('main section[id]');
    expect([...sections].map((s) => s.id)).toEqual([
      'top',
      'about',
      'skills',
      'experience',
      'projects',
      'education',
      'contact',
    ]);
  });

  it('opens the palette with Ctrl+K and the terminal with the backquote key', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const commands = TestBed.inject(CommandsService);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
    expect(commands.paletteOpen()).toBe(true);

    commands.closeAll();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: '`', code: 'Backquote' }));
    expect(commands.terminalOpen()).toBe(true);
    expect(commands.paletteOpen()).toBe(false);
  });
});
