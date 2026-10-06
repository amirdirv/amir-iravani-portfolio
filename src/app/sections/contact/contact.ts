import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../core/i18n.service';
import { PERSON, SOCIALS } from '../../data/profile';
import { Icon } from '../../shared/icon';
import { Reveal } from '../../shared/reveal.directive';
import { copyText } from '../../shared/clipboard';

/**
 * No backend, no tracking: the form composes a `mailto:` link so the message
 * is written and sent from the visitor's own mail client.
 */
@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, Icon, Reveal],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  protected readonly i18n = inject(I18nService);
  protected readonly email = PERSON.email;
  protected readonly socials = SOCIALS.filter((s) => s.id !== 'email');

  protected readonly name = signal('');
  protected readonly company = signal('');
  protected readonly message = signal('');
  protected readonly error = signal(false);
  protected readonly copied = signal(false);

  protected send(event: Event): void {
    event.preventDefault();
    const name = this.name().trim();
    const message = this.message().trim();
    if (!name || !message) {
      this.error.set(true);
      return;
    }
    this.error.set(false);
    const company = this.company().trim();
    const subject = `${this.i18n.ui().contact.subject} — ${name}${company ? ` (${company})` : ''}`;
    const body = `${message}\n\n— ${name}${company ? `, ${company}` : ''}`;
    window.location.href = `mailto:${this.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  protected async copy(): Promise<void> {
    if (await copyText(this.email)) {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1800);
    }
  }
}
