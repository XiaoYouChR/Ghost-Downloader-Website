'use client';

import type { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { I18nProviderProps } from 'fumadocs-ui/contexts/i18n';
import { i18n } from '@/lib/i18n';
import { getLocalizedPath } from '@/lib/site-metadata';

// The ESA redirect rule sends Chinese browsers from `/` to `/zh/` unless this
// cookie says `en`, so a visitor who picks English is not sent back next time.
// See docs/adr/0003.
export function LocaleProvider({
  i18n: i18nProps,
  children,
}: {
  i18n: Omit<I18nProviderProps, 'children'>;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(locale: string) {
    document.cookie = `locale=${locale}; path=/; max-age=31536000; samesite=lax`;
    const prefix = `/${i18nProps.locale}`;
    const rest =
      i18nProps.locale !== i18n.defaultLanguage && pathname.startsWith(prefix)
        ? pathname.slice(prefix.length)
        : pathname;
    router.push(getLocalizedPath(locale, rest || '/'));
  }

  return (
    <RootProvider theme={{ enabled: false }} i18n={{ ...i18nProps, onLocaleChange: switchLocale }}>
      {children}
    </RootProvider>
  );
}
