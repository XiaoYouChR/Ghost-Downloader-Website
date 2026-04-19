import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { i18n } from '@/lib/i18n';

function resolveLocale(acceptLanguage: string | null) {
  for (const entry of acceptLanguage?.toLowerCase().split(',') ?? []) {
    const language = entry.split(';')[0]?.trim();

    if (language?.startsWith('zh')) {
      return 'zh';
    }

    if (language?.startsWith('en')) {
      return 'en';
    }
  }

  return i18n.defaultLanguage;
}

export default async function RootPage() {
  const headerStore = await headers();
  const locale = resolveLocale(headerStore.get('accept-language'));

  redirect(`/${locale}`);
}
