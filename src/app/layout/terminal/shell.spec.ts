import { EXPERIENCES } from '../../data/profile';
import { complete, runShell } from './shell';

const ctx = { lang: 'en' as const, history: ['help', 'whoami'] };
const text = (input: string) =>
  runShell(input, ctx)
    .lines.map((l) => l.text)
    .join('\n');

describe('terminal shell', () => {
  it('prints help', () => {
    expect(text('help')).toContain('Available commands');
  });

  it('prints one line per role for experience', () => {
    expect(runShell('experience', ctx).lines.length).toBe(EXPERIENCES.length);
  });

  it('navigates to known sections only', () => {
    expect(runShell('goto projects', ctx).effect).toEqual({ type: 'goto', section: 'projects' });
    expect(runShell('cd #contact', ctx).effect).toEqual({ type: 'goto', section: 'contact' });
    expect(runShell('goto nowhere', ctx).effect).toBeUndefined();
  });

  it('switches language and theme through effects', () => {
    expect(runShell('lang fa', ctx).effect).toEqual({ type: 'lang', lang: 'fa' });
    expect(runShell('lang de', ctx).lines[0]?.kind).toBe('error');
    expect(runShell('theme', ctx).effect).toEqual({ type: 'theme' });
  });

  it('has the easter egg', () => {
    expect(runShell('sudo hire-amir', ctx).effect).toEqual({ type: 'goto', section: 'contact' });
    expect(runShell('sudo rm -rf /', ctx).lines[0]?.kind).toBe('error');
  });

  it('reports unknown commands and ignores blank input', () => {
    expect(text('rm -rf /')).toContain('command not found');
    expect(runShell('   ', ctx).lines).toEqual([]);
  });

  it('shows history', () => {
    expect(text('history')).toContain('whoami');
  });

  it('tab-completes unambiguous commands only', () => {
    expect(complete('wh')).toBe('whoami ');
    expect(complete('e')).toBe('e');
    expect(complete('goto pro')).toBe('goto pro');
  });
});
