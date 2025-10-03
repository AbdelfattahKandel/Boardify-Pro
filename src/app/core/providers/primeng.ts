import { providePrimeNG } from 'primeng/config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import Lara from '@primeng/themes/lara';

/**
 * PrimeNG global configuration
 * - Async animations for performance (tree-shakeable).
 * - Lara theme preset with dark mode support.
 */
export const PRIME_NG = {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Lara,
        options: {
          // darkModeSelector: 'dark', // CSS class/selector that triggers dark mode
          cssLayer: false,
          prefix: 'p',
        },
      },
    }),
  ],
};
