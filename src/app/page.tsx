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

export default function RootPage() {
  useEffect(() => {
    window.location.replace(`/${resolveLocale(navigator.languages)}/`);
  }, []);

  return null;
}
