import Script from 'next/script';
import { THEME_MEDIA_QUERY, THEME_STORAGE_KEY } from '@/lib/theme';

const themeScript = `
  (() => {
    try {
      const root = document.documentElement;
      const storedTheme = localStorage.getItem('${THEME_STORAGE_KEY}');
      const systemTheme = window.matchMedia('${THEME_MEDIA_QUERY}').matches ? 'dark' : 'light';
      const resolvedTheme =
        storedTheme === 'light' || storedTheme === 'dark'
          ? storedTheme
          : systemTheme;

      root.classList.toggle('dark', resolvedTheme === 'dark');
      root.style.colorScheme = resolvedTheme;
    } catch {}
  })();
`;

export function ThemeScript() {
  return (
    <Script id="ghost-theme-init" strategy="beforeInteractive">
      {themeScript}
    </Script>
  );
}
