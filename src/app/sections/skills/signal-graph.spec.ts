import { TestBed } from '@angular/core/testing';
import { I18nService } from '../../core/i18n.service';
import { EXPERIENCES } from '../../data/profile';
import { SignalGraph } from './signal-graph';

describe('SignalGraph', () => {
  async function setup() {
    TestBed.inject(I18nService).set('en');
    const fixture = TestBed.createComponent(SignalGraph);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const click = async (node: string) => {
      el.querySelector<HTMLButtonElement>(`[data-node="${node}"]`)!.click();
      await fixture.whenStable();
    };
    return { el, click };
  }

  it('lights every role that used a selected skill', async () => {
    const { el, click } = await setup();
    await click('s:angular');

    const expected = EXPERIENCES.filter((e) => e.stack.includes('angular')).map((e) => 'r:' + e.id);
    const lit = [...el.querySelectorAll<HTMLElement>('.node--role.lit')].map(
      (n) => n.dataset['node'],
    );
    expect(lit.sort()).toEqual(expected.sort());
    expect(el.querySelector('.readout')?.textContent).toContain('Meyler Srl');
  });

  it('lights the stack of a selected role and toggles off on a second click', async () => {
    const { el, click } = await setup();
    await click('r:meyler');
    const meyler = EXPERIENCES.find((e) => e.id === 'meyler')!;
    expect(el.querySelectorAll('.node--skill.lit').length).toBe(meyler.stack.length);

    await click('r:meyler');
    expect(el.querySelectorAll('.node.lit').length).toBe(0);
  });
});
