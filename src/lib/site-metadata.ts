import type { Metadata } from 'next';
import { appName } from './shared';

export const siteUrl = 'https://gd.xychr.com';
export const siteUrlObject = new URL(siteUrl);

type SiteLocale = 'en' | 'zh';

type LocaleSeoConfig = {
  defaultDescription: string;
  homeDescription: string;
  homeSubtitle: string;
  keywords: string[];
  languageTag: string;
  openGraphLocale: string;
};

const iconMetadata = {
  apple: '/images/logo.png',
  icon: '/images/logo.png',
  shortcut: '/images/logo.png',
} as const;

const shareImagePath = '/images/logo.png';

const localeSeoConfigs: Record<SiteLocale, LocaleSeoConfig> = {
  en: {
    defaultDescription:
      'Ghost Downloader is a browser-first resource discovery and desktop handoff hub for cross-platform downloads, browser extension pairing, streaming media capture, and GitHub Release delivery.',
    homeDescription:
      'Discover resources in the browser and hand them off to the desktop with Ghost Downloader, a cross-platform hub for browser extension pairing, streaming capture, and GitHub Release downloads.',
    homeSubtitle: 'Browser-first resource discovery and desktop handoff hub',
    keywords: [
      'Ghost Downloader',
      'download manager',
      'browser download handoff',
      'resource discovery',
      'stream capture',
      'GitHub release downloader',
      'cross-platform downloader',
    ],
    languageTag: 'en-US',
    openGraphLocale: 'en_US',
  },
  zh: {
    defaultDescription:
      'Ghost Downloader 是一个浏览器优先的资源发现与桌面接管中枢，支持跨平台下载、浏览器扩展联动、流媒体捕获与 GitHub Release 资源接管。',
    homeDescription:
      'Ghost Downloader 让浏览器中的资源发现、下载接管与桌面执行连成一体，支持跨平台下载、扩展联动、流媒体资源捕获与 GitHub Release 分发。',
    homeSubtitle: '浏览器资源发现与桌面接管中枢',
    keywords: [
      'Ghost Downloader',
      '下载器',
      '浏览器下载接管',
      '资源嗅探',
      '流媒体下载',
      'GitHub Release 下载',
      '跨平台下载器',
    ],
    languageTag: 'zh-CN',
    openGraphLocale: 'zh_CN',
  },
};

function withTrailingSlash(pathname: string) {
  if (pathname.length === 0 || pathname === '/') {
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

function getAlternateOpenGraphLocales(locale: string) {
  return Object.values(localeSeoConfigs)
    .map((config) => config.openGraphLocale)
    .filter((value) => value !== getSeoConfig(locale).openGraphLocale);
}

export function getLocalizedPath(locale: string, pathname = '/') {
  const normalizedPath = withTrailingSlash(pathname);
  const normalizedLocale = normalizeLocale(locale);

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
    'en-US': getAbsoluteUrl(getLocalizedPath('en', pathname)),
    'zh-CN': getAbsoluteUrl(getLocalizedPath('zh', pathname)),
  };
}

export function getDocsPagePath(slug?: string[]) {
  if (!slug || slug.length === 0) {
    return '/docs/';
  }

  return `/docs/${slug.join('/')}/`;
}

export function getLocaleLayoutMetadata(locale: string): Metadata {
  const config = getSeoConfig(locale);
  const canonical = getAbsoluteUrl(getLocalizedPath(locale));
  const shareImage = getAbsoluteUrl(shareImagePath);

  return {
    alternates: {
      canonical,
      languages: getLanguageAlternates(),
    },
    applicationName: appName,
    description: config.defaultDescription,
    icons: iconMetadata,
    keywords: config.keywords,
    metadataBase: siteUrlObject,
    openGraph: {
      alternateLocale: getAlternateOpenGraphLocales(locale),
      description: config.defaultDescription,
      images: [shareImage],
      locale: config.openGraphLocale,
      siteName: appName,
      title: appName,
      type: 'website',
      url: canonical,
    },
    title: {
      default: appName,
      template: `%s | ${appName}`,
    },
    twitter: {
      card: 'summary_large_image',
      description: config.defaultDescription,
      images: [shareImage],
      title: appName,
    },
  };
}

export function getHomePageMetadata(locale: string): Metadata {
  const config = getSeoConfig(locale);
  const canonical = getAbsoluteUrl(getLocalizedPath(locale));
  const title = `${appName} | ${config.homeSubtitle}`;
  const shareImage = getAbsoluteUrl(shareImagePath);

  return {
    alternates: {
      canonical,
      languages: getLanguageAlternates(),
    },
    description: config.homeDescription,
    keywords: config.keywords,
    openGraph: {
      alternateLocale: getAlternateOpenGraphLocales(locale),
      description: config.homeDescription,
      images: [shareImage],
      locale: config.openGraphLocale,
      siteName: appName,
      title,
      type: 'website',
      url: canonical,
    },
    title: {
      absolute: title,
    },
    twitter: {
      card: 'summary_large_image',
      description: config.homeDescription,
      images: [shareImage],
      title,
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
  const canonical = getAbsoluteUrl(getLocalizedPath(locale, pathname));
  const image = getAbsoluteUrl(imagePath);
  const resolvedDescription = description ?? config.defaultDescription;

  return {
    alternates: {
      canonical,
      languages: getLanguageAlternates(pathname),
    },
    description: resolvedDescription,
    openGraph: {
      alternateLocale: getAlternateOpenGraphLocales(locale),
      description: resolvedDescription,
      images: [image],
      locale: config.openGraphLocale,
      siteName: appName,
      title,
      type: 'article',
      url: canonical,
    },
    title,
    twitter: {
      card: 'summary_large_image',
      description: resolvedDescription,
      images: [image],
      title,
    },
  };
}
