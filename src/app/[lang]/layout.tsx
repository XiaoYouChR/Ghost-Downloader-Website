import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Inter } from 'next/font/google';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { ThemeProvider } from '@/components/theme-provider';
import { i18n } from '@/lib/i18n';
import { i18nUI } from '@/lib/layout.shared';
import {
  THEME_RESOLVED_COOKIE_KEY,
  isResolvedTheme,
} from '@/lib/theme';
import '../global.css';

const inter = Inter({
  subsets: ['latin'],
});

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
  const cookieStore = await cookies();

  if (!i18n.languages.includes(lang as (typeof i18n.languages)[number])) {
    notFound();
  }

  const resolvedThemeCookie = cookieStore.get(THEME_RESOLVED_COOKIE_KEY)?.value ?? null;
  const resolvedTheme = isResolvedTheme(resolvedThemeCookie)
    ? resolvedThemeCookie
    : 'light';

  return (
    <html
      lang={lang}
      className={`${inter.className}${resolvedTheme === 'dark' ? ' dark' : ''}`}
      suppressHydrationWarning
    >
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
