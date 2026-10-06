import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));

// A hello for the curious ones who open DevTools.
console.log(
  '%c Ai %c Hey, fellow developer 👋  Press ` for a terminal or Ctrl/⌘ K for the command palette.\n' +
    'Source: https://github.com/amirdirv/amir-iravani-portfolio',
  'background:linear-gradient(120deg,#ff2e63,#8b5cf6,#ffb300);color:#fff;font-weight:700;padding:4px 8px;border-radius:6px',
  'color:inherit',
);
