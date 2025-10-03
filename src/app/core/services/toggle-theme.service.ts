import { Injectable, OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToggleThemeService implements OnDestroy {
  private readonly THEME_KEY = 'app-theme';
  private readonly DARK_THEME_CLASS = 'my-app-dark';
  private readonly DARK_THEME_VALUE = 'dark';
  private readonly LIGHT_THEME_VALUE = 'light';

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    const savedTheme = this.getSavedTheme();
    const isDark = savedTheme === this.DARK_THEME_VALUE || 
                  (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    this.setTheme(isDark);
  }

  toggleDarkMode(): void {
    const element = document.documentElement;
    const isDark = !element.classList.contains(this.DARK_THEME_CLASS);
    this.setTheme(isDark);
  }

  private setTheme(isDark: boolean): void {
    const element = document.documentElement;
    
    if (isDark) {
      element.classList.add(this.DARK_THEME_CLASS);
      this.saveTheme(this.LIGHT_THEME_VALUE);
    } else {
      element.classList.remove(this.DARK_THEME_CLASS);
      this.saveTheme(this.DARK_THEME_VALUE);
    }
  }

  private saveTheme(theme: string): void {
    try {
      localStorage.setItem(this.THEME_KEY, theme);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  }

  private getSavedTheme(): string | null {
    try {
      return localStorage.getItem(this.THEME_KEY);
    } catch (error) {
      console.error('Error getting saved theme:', error);
      return null;
    }
  }

  isDarkMode(): boolean {
    return document.documentElement.classList.contains(this.DARK_THEME_CLASS);
  }

  ngOnDestroy(): void {
    // Clean up if needed
  }
}
