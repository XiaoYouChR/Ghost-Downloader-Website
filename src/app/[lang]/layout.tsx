import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { ThemeProvider } from '@/components/theme-provider';
import { i18n } from '@/lib/i18n';
import { i18nUI } from '@/lib/layout.shared';
import { THEME_MEDIA_QUERY, THEME_STORAGE_KEY } from '@/lib/theme';
import '../global.css';

const inter = Inter({
  subsets: ['latin'],
});

const themeScript = `
  (() => {
    try {
      const root = document.documentElement;
      const storedTheme = localStorage.getItem('${THEME_STORAGE_KEY}');
      const resolvedTheme =
        storedTheme === 'light' || storedTheme === 'dark'
          ? storedTheme
          : window.matchMedia('${THEME_MEDIA_QUERY}').matches ? 'dark' : 'light';

      root.classList.toggle('dark', resolvedTheme === 'dark');
      root.style.colorScheme = resolvedTheme;
    } catch {}
  })();
`;

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({
    lang,
  }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { lang } = await params;

  if (!i18n.languages.includes(lang as (typeof i18n.languages)[number])) {
    notFound();
  }

  return (
    <html lang={lang} className={inter.className} suppressHydrationWarning>
      <head>
        <Script id="ghost-theme-init" strategy="beforeInteractive">
          {themeScript}
        </Script>
      </head>
      <body className="flex min-h-screen flex-col">
        <ThemeProvider>
          <RootProvider theme={{ enabled: false }} i18n={i18nUI.provider(lang)}>
            {children}
          </RootProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
