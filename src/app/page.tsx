import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { i18n } from '@/lib/i18n';

const localeAliases = {
  'zh-cn': 'zh',
  'zh-hans': 'zh',
  'zh': 'zh',
  'en': 'en',
} as const;

function resolveLocale(acceptLanguage: string | null) {
  if (!acceptLanguage) {
    return i18n.defaultLanguage;
  }

  const languages = acceptLanguage
    .split(',')
    .map((entry) => entry.split(';')[0]?.trim().toLowerCase())
    .filter(Boolean);

  for (const language of languages) {
    if (language in localeAliases) {
      return localeAliases[language as keyof typeof localeAliases];
    }

    const baseLanguage = language.split('-')[0];

    if (baseLanguage in localeAliases) {
      return localeAliases[baseLanguage as keyof typeof localeAliases];
    }
  }

  return i18n.defaultLanguage;
}

export default async function RootPage() {
  const headerStore = await headers();
  const locale = resolveLocale(headerStore.get('accept-language'));

  redirect(`/${locale}`);
}
