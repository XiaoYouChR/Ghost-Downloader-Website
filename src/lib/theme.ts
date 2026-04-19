export const THEME_STORAGE_KEY = 'theme';
export const THEME_RESOLVED_COOKIE_KEY = 'resolved-theme';
export const THEME_MEDIA_QUERY = '(prefers-color-scheme: dark)';
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = Exclude<ThemeMode, 'system'>;

export function isThemeMode(value: string | null): value is ThemeMode {
  return value === 'light' || value === 'dark' || value === 'system';
}

export function isResolvedTheme(value: string | null): value is ResolvedTheme {
  return value === 'light' || value === 'dark';
}
