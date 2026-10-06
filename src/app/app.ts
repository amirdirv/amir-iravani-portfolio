import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from './core/i18n.service';
import { ThemeService } from './core/theme.service';
import { Logo } from './shared/logo';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Logo],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly i18n = inject(I18nService);
  protected readonly theme = inject(ThemeService);
}
