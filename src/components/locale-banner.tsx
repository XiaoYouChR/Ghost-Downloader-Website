'use client';

import Link from 'next/link';
import { useState, useSyncExternalStore } from 'react';

function detectChinese(languages: readonly string[]) {
  return languages.some((lang) => lang.toLowerCase().startsWith('zh'));
}

const subscribe = () => () => {};

const prefersChineseSnapshot = () =>
  detectChinese(
    navigator.languages.length > 0 ? navigator.languages : [navigator.language],
  );

const serverSnapshot = () => false;

export function LocaleBanner() {
  const prefersChinese = useSyncExternalStore(
    subscribe,
    prefersChineseSnapshot,
    serverSnapshot,
  );
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem('locale-banner-dismissed') === '1',
  );

  if (!prefersChinese || dismissed) return null;

  return (
    <div
      role="status"
      className="flex items-center justify-center gap-3 bg-fd-primary px-4 py-2.5 text-sm text-fd-primary-foreground"
    >
      <span>此页面也有中文版本</span>
      <Link
        href="/zh/"
        className="rounded-full border border-current/30 px-3 py-0.5 font-medium transition-colors hover:bg-fd-primary-foreground/10"
      >
        切换到中文
      </Link>
      <button
        type="button"
        onClick={() => { localStorage.setItem('locale-banner-dismissed', '1'); setDismissed(true); }}
        className="ml-1 opacity-70 transition-opacity hover:opacity-100"
        aria-label="关闭"
      >
        ✕
      </button>
    </div>
  );
}
