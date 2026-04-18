'use client';

import { Outfit } from 'next/font/google';
import { cn } from '@/lib/cn';
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

export function GhostHomePage() {
  return (
    <div className={cn(styles.root, outfit.variable)}>
      <HeroSection />
      <BrowserExtensionShowcase />
      <FeaturesSection />
      <ProtocolShowcase />
      <DownloadCTA />
    </div>
  );
}
