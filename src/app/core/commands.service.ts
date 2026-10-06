import { Injectable, signal } from '@angular/core';

/** Open/close state of the two keyboard-first overlays (palette & terminal). */
@Injectable({ providedIn: 'root' })
export class CommandsService {
  readonly paletteOpen = signal(false);
  readonly terminalOpen = signal(false);

  openPalette(): void {
    this.terminalOpen.set(false);
    this.paletteOpen.set(true);
  }

  openTerminal(): void {
    this.paletteOpen.set(false);
    this.terminalOpen.set(true);
  }

  closeAll(): void {
    this.paletteOpen.set(false);
    this.terminalOpen.set(false);
  }
}
