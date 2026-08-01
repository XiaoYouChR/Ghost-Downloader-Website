import type { Metadata } from 'next';
import { i18n } from './i18n';
import { appName } from './shared';

const siteUrl = 'https://gd.xychr.com';
const siteUrlObject = new URL(siteUrl);

type SiteLocale = 'en' | 'zh';

type LocaleSeoConfig = {
  defaultDescription: string;
  homeDescription: string;
  homeSubtitle: string;
  keywords: string[];
  openGraphLocale: string;
};

const iconMetadata = {
  apple: '/images/logo.png',
  icon: '/images/logo.png',
  shortcut: '/images/logo.png',
} as const;

const shareImage = {
  alt: `${appName} share image`,
  height: 600,
  url: getAbsoluteUrl('/images/banner.png'),
  width: 1200,
};

const localeSeoConfigs: Record<SiteLocale, LocaleSeoConfig> = {
  en: {
    defaultDescription:
      'Ghost Downloader sniffs page media, records live streams, and replaces five tools. HTTP, BitTorrent, FTP, M3U8, DASH and eD2k in one app — on Windows, macOS, Linux and Android.',
    homeDescription:
      'A downloader that sniffs page media, records live streams, and replaces five tools. Fast, free, and open source.',
    homeSubtitle: 'The only downloader you need',
    keywords: [
      'Ghost Downloader',
      'download manager',
      'media sniffer',
      'live stream recorder',
      'torrent client',
      'M3U8 downloader',
      'cross-platform downloader',
    ],
    openGraphLocale: 'en_US',
  },
  zh: {
    defaultDescription:
      'Ghost Downloader 能嗅探网页媒体、录制直播流，一个应用取代五个工具。支持 HTTP、BitTorrent、FTP、M3U8、DASH、eD2k——覆盖 Windows、macOS、Linux 和 Android。',
    homeDescription:
      '一个能嗅探网页媒体、录制直播流、取代五个工具的下载器。够快，免费，开源。',
    homeSubtitle: '下载器的集大成者',
    keywords: [
      'Ghost Downloader',
      '下载器',
      '媒体嗅探',
      '直播录制',
      '种子下载',
      'M3U8 下载',
      '跨平台下载器',
    ],
    openGraphLocale: 'zh_CN',
  },
};

function withTrailingSlash(pathname: string) {
  if (!pathname || pathname === '/') {
    return '/';
  }

  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;

  return normalized.endsWith('/') ? normalized : `${normalized}/`;
}

function normalizeLocale(locale: string): SiteLocale {
  return locale === 'zh' ? 'zh' : 'en';
}

function getSeoConfig(locale: string) {
  return localeSeoConfigs[normalizeLocale(locale)];
}

export function getLocalizedPath(locale: string, pathname = '/') {
  const normalizedPath = withTrailingSlash(pathname);
  const normalizedLocale = normalizeLocale(locale);

  if (normalizedLocale === i18n.defaultLanguage) {
    return normalizedPath;
  }

  if (normalizedPath === '/') {
    return `/${normalizedLocale}/`;
  }

  return `/${normalizedLocale}${normalizedPath}`;
}

export function getAbsoluteUrl(pathname: string) {
  return new URL(pathname, siteUrlObject).toString();
}

export function getLanguageAlternates(pathname = '/') {
  return {
    'x-default': getAbsoluteUrl(getLocalizedPath(i18n.defaultLanguage, pathname)),
    'en-US': getAbsoluteUrl(getLocalizedPath('en', pathname)),
    'zh-CN': getAbsoluteUrl(getLocalizedPath('zh', pathname)),
  };
}

export function getDocsPagePath(slug?: string[]) {
  return !slug || slug.length === 0 ? '/docs/' : `/docs/${slug.join('/')}/`;
}

function createPageMetadata({
  description,
  image = shareImage,
  locale,
  pathname = '/',
  title,
  type = 'website',
}: {
  description: string;
  image?: string | typeof shareImage;
  locale: string;
  pathname?: string;
  title: string;
  type?: 'article' | 'website';
}): Pick<Metadata, 'alternates' | 'description' | 'openGraph' | 'twitter'> {
  const config = getSeoConfig(locale);
  const canonical = getAbsoluteUrl(getLocalizedPath(locale, pathname));

  return {
    alternates: {
      canonical,
      languages: getLanguageAlternates(pathname),
    },
    description,
    openGraph: {
      alternateLocale: Object.values(localeSeoConfigs)
        .map(({ openGraphLocale }) => openGraphLocale)
        .filter((value) => value !== config.openGraphLocale),
      description,
      images: [image],
      locale: config.openGraphLocale,
      siteName: appName,
      title,
      type,
      url: canonical,
    },
    twitter: {
      card: 'summary_large_image',
      description,
      images: [image],
      title,
    },
  };
}

export function getLocaleLayoutMetadata(locale: string): Metadata {
  const config = getSeoConfig(locale);

  return {
    ...createPageMetadata({
      description: config.defaultDescription,
      locale,
      title: appName,
    }),
    applicationName: appName,
    icons: iconMetadata,
    keywords: config.keywords,
    metadataBase: siteUrlObject,
    title: {
      default: appName,
      template: `%s | ${appName}`,
    },
  };
}

export function getHomePageMetadata(locale: string): Metadata {
  const config = getSeoConfig(locale);
  const title = `${appName} | ${config.homeSubtitle}`;

  return {
    ...createPageMetadata({
      description: config.homeDescription,
      locale,
      title,
    }),
    keywords: config.keywords,
    title: {
      absolute: title,
    },
  };
}

export function getDocsPageMetadata({
  description,
  imagePath,
  locale,
  pathname,
  title,
}: {
  description?: string;
  imagePath: string;
  locale: string;
  pathname: string;
  title: string;
}): Metadata {
  const config = getSeoConfig(locale);
  const resolvedDescription = description ?? config.defaultDescription;

  return {
    ...createPageMetadata({
      description: resolvedDescription,
      image: getAbsoluteUrl(imagePath),
      locale,
      pathname,
      title,
      type: 'article',
    }),
    title,
  };
}
