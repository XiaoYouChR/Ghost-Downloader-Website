'use client';

import { Outfit } from 'next/font/google';
import { cn } from '@/lib/cn';
import type { DownloadReleaseState } from '@/lib/github-release';
import type { HomeCopy } from '@/lib/home-i18n';
import { HeroSection } from './hero-section';
import { BrowserExtensionShowcase } from './browser-extension-showcase';
import { FeaturesSection } from './features-section';
import { ProtocolShowcase } from './protocol-showcase';
import { DownloadCTA } from './download-cta';
import styles from './home.module.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-ghost-display',
  weight: ['400', '500', '600', '700', '800'],
});

type GhostHomePageProps = {
  downloadRelease: DownloadReleaseState;
  lang: string;
  copy: HomeCopy;
};

export function GhostHomePage({
  downloadRelease,
  lang,
  copy,
}: GhostHomePageProps) {
  return (
    <div
      className={cn(styles.root, outfit.variable)}
      data-lang={lang}
    >
      <HeroSection copy={copy.hero} lang={lang} />
      <BrowserExtensionShowcase copy={copy.browserShowcase} />
      <FeaturesSection copy={copy.features} />
      <ProtocolShowcase copy={copy.protocols} />
      <DownloadCTA lang={lang} copy={copy.download} release={downloadRelease} />
    </div>
  );
}
