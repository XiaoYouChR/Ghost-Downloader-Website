'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type PropsWithChildren,
} from 'react';
import {
  THEME_MEDIA_QUERY,
  THEME_COOKIE_MAX_AGE,
  THEME_RESOLVED_COOKIE_KEY,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type ThemeMode,
  isThemeMode,
} from '@/lib/theme';

type ThemeContextValue = {
  mounted: boolean;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
  theme: ThemeMode;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') {
      return 'system';
    }

    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeMode(storedTheme) ? storedTheme : 'system';
  });
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light',
  );
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(THEME_MEDIA_QUERY);

    const syncTheme = () => {
      const nextResolvedTheme =
        theme === 'system' ? (mediaQuery.matches ? 'dark' : 'light') : theme;
      const root = document.documentElement;

      root.classList.toggle('dark', nextResolvedTheme === 'dark');
      root.style.colorScheme = nextResolvedTheme;
      document.cookie = `${THEME_RESOLVED_COOKIE_KEY}=${nextResolvedTheme}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; SameSite=Lax`;
      setResolvedTheme(nextResolvedTheme);
    };

    syncTheme();
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);

    if (theme !== 'system') {
      return;
    }

    mediaQuery.addEventListener('change', syncTheme);

    return () => {
      mediaQuery.removeEventListener('change', syncTheme);
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ mounted, resolvedTheme, setTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider.');
  }

  return context;
}
