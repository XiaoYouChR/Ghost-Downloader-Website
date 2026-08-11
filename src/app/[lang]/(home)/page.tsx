import type { Metadata } from 'next';
import { createTranslator } from '@/lib/copy';
import { getLatestDownloadRelease, releasesUrl } from '@/lib/github-release';
import { appName, repoUrl } from '@/lib/shared';
import {
  getAbsoluteUrl,
  getHomePageMetadata,
  getLocalizedPath,
  getSeoConfig,
} from '@/lib/site-metadata';
import { SiteFooter } from '@/components/site-footer';
import { Hero } from '@/components/home/hero';
import { Resilience } from '@/components/home/resilience';
import { Sniff } from '@/components/home/sniff';
import { Protocols } from '@/components/home/protocols';
import { Download } from '@/components/home/download';

export async function generateMetadata({
  params,
}: PageProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params;

  return getHomePageMetadata(lang);
}

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params;
  const release = await getLatestDownloadRelease();
  const t = createTranslator(lang);

  const seoConfig = getSeoConfig(lang);
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: appName,
      description: seoConfig.homeDescription,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Windows, macOS, Linux, Android',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      url: getAbsoluteUrl('/'),
      downloadUrl: releasesUrl,
      ...(release.data.latestVersion && {
        softwareVersion: release.data.latestVersion,
      }),
      license: 'https://www.gnu.org/licenses/gpl-3.0.html',
      image: getAbsoluteUrl('/images/banner.png'),
      sourceOrganization: {
        '@type': 'Person',
        name: 'XiaoYouChR',
        url: repoUrl,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: appName,
      url: getAbsoluteUrl('/'),
    },
  ];

  return (
    <main className="bg-ground text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero
        copy={{
          title: t('hero.title'),
          subtitle: t('hero.subtitle'),
          ctaPrimary: t('hero.ctaPrimary'),
          ctaPlatform: {
            windows: t('hero.cta.windows'),
            macos: t('hero.cta.macos'),
            linux: t('hero.cta.linux'),
            android: t('hero.cta.android'),
          },
          ctaSecondary: t('hero.ctaSecondary'),
          shotAlt: t('hero.shotAlt'),
        }}
        docsHref={getLocalizedPath(lang, '/docs/')}
      />
      <Resilience
        copy={{
          title: t('resilience.title'),
          body: t('resilience.body'),
          stats: [
            { value: t('resilience.stat1.value'), label: t('resilience.stat1.label') },
            { value: t('resilience.stat2.value'), label: t('resilience.stat2.label') },
            { value: t('resilience.stat3.value'), label: t('resilience.stat3.label') },
          ],
          note: t('resilience.note'),
          noteLink: t('resilience.noteLink'),
          noteLinkHref: getLocalizedPath(lang, '/docs/benchmark/'),
        }}
      />
      <Sniff
        copy={{
          title: t('sniff.title'),
          body: t('sniff.body'),
          beats: [
            {
              step: '1',
              shotId: '02',
              shotLabel: '"Download this video" button on a video page',
              title: t('sniff.beat1.title'),
              body: t('sniff.beat1.body'),
              alt: t('sniff.beat1.alt'),
              srcLight: '/shots/light/shot-02.webp',
              srcDark: '/shots/dark/shot-02.webp',
            },
            {
              step: '2',
              shotId: '03',
              shotLabel: 'Extension popup listing sniffed resources',
              title: t('sniff.beat2.title'),
              body: t('sniff.beat2.body'),
              alt: t('sniff.beat2.alt'),
              srcLight: '/shots/light/shot-03.webp',
              srcDark: '/shots/dark/shot-03.webp',
            },
            {
              step: '3',
              shotId: '04',
              shotLabel: 'Sniffed task landing in the desktop app',
              title: t('sniff.beat3.title'),
              body: t('sniff.beat3.body'),
              alt: t('sniff.beat3.alt'),
              srcLight: '/shots/light/shot-04.webp',
              srcDark: '/shots/dark/shot-04.webp',
            },
          ],
        }}
      />
      <Protocols
        copy={{
          title: t('protocols.title'),
          body: t('protocols.body'),
          protocols: [
            { name: t('protocols.http.name'), note: t('protocols.http.note') },
            { name: t('protocols.torrent.name'), note: t('protocols.torrent.note') },
            { name: t('protocols.ftp.name'), note: t('protocols.ftp.note') },
            { name: t('protocols.m3u8.name'), note: t('protocols.m3u8.note') },
            { name: t('protocols.dash.name'), note: t('protocols.dash.note') },
            { name: t('protocols.ed2k.name'), note: t('protocols.ed2k.note') },
          ],
          live: { title: t('protocols.live.title'), body: t('protocols.live.body'), alt: t('protocols.live.alt') },
          parsers: { title: t('protocols.parsers.title'), body: t('protocols.parsers.body'), alt: t('protocols.parsers.alt') },
          android: { title: t('protocols.android.title'), body: t('protocols.android.body'), alts: [t('protocols.android.alt1'), t('protocols.android.alt2'), t('protocols.android.alt3')] },
        }}
      />
      <Download
        copy={{
          titlePrefix: t('download.title.prefix'),
          titleBrand: t('download.title.brand'),
          subtitle: t('download.subtitle'),
          unavailable: t('download.unavailable'),
          viewReleases: t('download.viewReleases'),
          installer: t('download.installer'),
          portable: t('download.portable'),
          appImage: t('download.appImage'),
          deb: t('download.deb'),
          tarXz: t('download.tarXz'),
          appleSilicon: t('download.appleSilicon'),
          intel: t('download.intel'),
          x64: t('download.x64'),
          arm64: t('download.arm64'),
          recommended: t('download.recommended'),
          appTitle: t('download.app.title'),
          extensionTitle: t('download.extension.title'),
          platforms: {
            windows: 'Windows',
            macos: 'macOS',
            linux: 'Linux',
            android: 'Android',
          },
          subtitles: {
            windows: t('download.windows.subtitle'),
            macos: t('download.macos.subtitle'),
            linux: t('download.linux.subtitle'),
            android: t('download.android.subtitle'),
            chrome: t('download.chrome.subtitle'),
            edge: t('download.edge.subtitle'),
            firefox: t('download.firefox.subtitle'),
          },
        }}
        lang={lang}
        release={release}
      />
      <SiteFooter lang={lang} />
    </main>
  );
}
