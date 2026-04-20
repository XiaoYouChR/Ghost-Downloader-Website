'use client';

import { useEffect } from 'react';

function resolveLocale(languages: readonly string[]) {
  for (const language of languages) {
    const normalized = language.toLowerCase();

    if (normalized.startsWith('zh')) {
      return 'zh';
    }

    if (normalized.startsWith('en')) {
      return 'en';
    }
  }

  return 'en';
}

export function RootLocaleRedirect() {
  useEffect(() => {
    const languages = navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language];

    window.location.replace(`/${resolveLocale(languages)}/`);
  }, []);

  return null;
}
