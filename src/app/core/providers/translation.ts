
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

const TRANSLATE_LOADER_CONFIG = {
  prefix: './assets/i18n/',
  suffix: '.json',
  enforceLoading: false,
  useHttpBackend: false,
};

export const TRANSLATION = {
  providers: [
    provideTranslateService({
      loader: provideTranslateHttpLoader(TRANSLATE_LOADER_CONFIG),
    }),
  ],
};
