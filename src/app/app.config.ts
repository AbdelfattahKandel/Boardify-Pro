import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { PRIME_NG } from './core/providers/primeng';
import { TRANSLATION } from './core/providers/translation';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    ...PRIME_NG.providers,
    ...TRANSLATION.providers,
    provideHttpClient(),
  ],
};
