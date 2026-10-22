import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Archivo, JetBrains_Mono } from 'next/font/google';
import { i18nProvider } from 'fumadocs-ui/i18n';
import { LocaleProvider } from '@/components/locale-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { i18n } from '@/lib/i18n';
import { translations } from '@/lib/layout.shared';
import { getLocaleLayoutMetadata } from '@/lib/site-metadata';
import '../global.css';

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export async function generateMetadata({
  params,
}: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params;

  return getLocaleLayoutMetadata(lang);
}

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({
    lang,
  }));
}

export const dynamicParams = false;

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<'/[lang]'>) {
  const { lang } = await params;

  if (!i18n.languages.includes(lang as (typeof i18n.languages)[number])) {
    notFound();
  }

  return (
    <html
      lang={lang}
      className={`${archivo.variable} ${jetbrainsMono.variable} font-sans`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col">
        <ThemeProvider>
          <LocaleProvider i18n={i18nProvider(translations, lang)}>{children}</LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
