import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommandsService } from '../core/commands.service';
import { I18nService, LANGS } from '../core/i18n.service';
import { SECTION_IDS, ScrollService, SectionId } from '../core/scroll.service';
import { ThemeService } from '../core/theme.service';
import { Icon } from '../shared/icon';
import { Logo } from '../shared/logo';

@Component({
  selector: 'app-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Logo, Icon],
  host: { '[class.is-scrolled]': 'scroll.scrolled()', '[class.is-open]': 'menuOpen()' },
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav {
  protected readonly i18n = inject(I18nService);
  protected readonly theme = inject(ThemeService);
  protected readonly scroll = inject(ScrollService);
  protected readonly commands = inject(CommandsService);

  protected readonly langs = LANGS;
  protected readonly menuOpen = signal(false);

  protected readonly links = computed(() => {
    const nav = this.i18n.ui().nav;
    return SECTION_IDS.map((id) => ({ id, label: nav[id] }));
  });

  /** ⌘ on Apple platforms, Ctrl elsewhere — only used for the hint label. */
  protected readonly modKey =
    typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl';

  protected go(id: SectionId | 'top', event?: Event): void {
    event?.preventDefault();
    this.menuOpen.set(false);
    this.scroll.scrollTo(id);
  }
}
