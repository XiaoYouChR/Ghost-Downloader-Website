'use client';

import { useEffect, useState } from 'react';

function detectChinese(languages: readonly string[]) {
  return languages.some((lang) => lang.toLowerCase().startsWith('zh'));
}

export function LocaleBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const languages =
      navigator.languages.length > 0
        ? navigator.languages
        : [navigator.language];

    if (detectChinese(languages)) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      role="status"
      className="fixed top-0 right-0 left-0 z-50 flex items-center justify-center gap-3 bg-fd-primary px-4 py-2.5 text-sm text-fd-primary-foreground"
    >
      <span>此页面也有中文版本</span>
      <a
        href="/zh/"
        className="rounded-full border border-current/30 px-3 py-0.5 font-medium transition-colors hover:bg-fd-primary-foreground/10"
      >
        切换到中文
      </a>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="ml-1 opacity-70 transition-opacity hover:opacity-100"
        aria-label="关闭"
      >
        ✕
      </button>
    </div>
  );
}
