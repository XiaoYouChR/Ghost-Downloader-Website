'use client';

import { useEffect } from 'react';

function resolveLocale(languages: readonly string[]) {
  return languages.some((language) => language.toLowerCase().startsWith('zh'))
    ? 'zh'
    : 'en';
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
