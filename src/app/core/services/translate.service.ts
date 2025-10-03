import { Injectable, signal, computed, effect } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Language = 'ar' | 'en';

/**
 * TranslationService
 * -------------------
 * - Manages application language state with Angular Signals.
 * - Syncs language changes with ngx-translate, DOM attributes, and localStorage.
 * - No manual subscriptions → Signals + Effects handle reactivity cleanly.
 */
@Injectable({
  providedIn: 'root'
})
export class TranslatService {
  /** Current selected language ('en' | 'ar') */
  public readonly currentLanguage = signal<Language>('ar');

  /** Whether translations have finished loading */
  public readonly translationsLoaded = signal(false);

  /** Document direction (rtl | ltr) derived from currentLanguage */
  public readonly direction = computed<'rtl' | 'ltr'>(
    () => this.currentLanguage() === 'ar' ? 'rtl' : 'ltr'
  );

  /** Whether the current language is RTL */
  public readonly isRTL = computed(() => this.direction() === 'rtl');

  private readonly isBrowser = typeof window !== 'undefined';

  constructor(private translate: TranslateService) {
    this.initializeLanguage();

    // 🔥 Effect: whenever language changes → update translate, DOM, and localStorage
    effect(() => {
      const lang = this.currentLanguage();
      if (!this.isBrowser) return;

      this.translate.use(lang).subscribe({
        next: () => this.translationsLoaded.set(true),
        error: () => this.translationsLoaded.set(false),
      });

      this.updateDocumentAttributes(lang);
      this.persistLanguage(lang);
    });
  }

  /**
   * Initializes language from localStorage or defaults to 'ar'.
   */
  private initializeLanguage(): void {
    if (!this.isBrowser) {
      this.translationsLoaded.set(true);
      return;
    }

    const savedLang = localStorage.getItem('preferredLanguage') as Language | null;
    const initialLang = savedLang || 'ar';

    this.currentLanguage.set(initialLang);
    this.translate.setFallbackLang(initialLang);
  }

  /**
   * Switch application language between 'ar' and 'en'.
   * @remarks
   * Automatically updates TranslateService, DOM attributes, and localStorage.
   */
  public switchLanguage(): void {
    this.currentLanguage.set(this.currentLanguage() === 'ar' ? 'en' : 'ar');
  }

  /**
   * Instantly translate a key with optional params.
   * @param key The translation key.
   * @param params Optional interpolation parameters.
   */
  public translateKey(key: string, params?: Record<string, unknown>): string {
    return this.translate.instant(key, params);
  }

  /**
   * Update DOM attributes to reflect current language.
   * @param lang Current language.
   */
  private updateDocumentAttributes(lang: Language): void {
    if (!this.isBrowser) return;

    const dir = lang === 'ar' ? 'rtl' : 'ltr';

    document.documentElement.lang = lang;
    document.documentElement.dir = dir;

    document.body.classList.remove('ar', 'en');
    document.body.classList.add(lang);
  }

  /**
   * Persist language preference in localStorage.
   * @param lang Current language.
   */
  private persistLanguage(lang: Language): void {
    localStorage.setItem('preferredLanguage', lang);
  }

  public readonly isArabic = computed(() => this.currentLanguage() === 'ar');

}
