import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
  withIncrementalHydration,
} from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Every page is prerendered HTML that gets hydrated; below-the-fold
    // sections hydrate (and download their JS) only when scrolled into view.
    provideClientHydration(withIncrementalHydration(), withEventReplay()),
  ],
};
