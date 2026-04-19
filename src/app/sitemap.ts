import type { MetadataRoute } from 'next';
import { i18n } from '@/lib/i18n';
import {
  getAbsoluteUrl,
  getDocsPagePath,
  getLanguageAlternates,
  getLocalizedPath,
} from '@/lib/site-metadata';
import { source } from '@/lib/source';

type SitemapEntry = MetadataRoute.Sitemap[number];

export const dynamic = 'force-static';

function createSitemapEntry(locale: string, pathname: string): SitemapEntry {
  return {
    alternates: {
      languages: getLanguageAlternates(pathname),
    },
    lastModified: new Date(),
    url: getAbsoluteUrl(getLocalizedPath(locale, pathname)),
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries = new Map<string, SitemapEntry>();

  for (const locale of i18n.languages) {
    for (const pathname of ['/', '/docs/']) {
      const entry = createSitemapEntry(locale, pathname);
      entries.set(entry.url, entry);
    }
  }

  for (const { lang, slug } of source.generateParams()) {
    const entry = createSitemapEntry(lang, getDocsPagePath(slug));
    entries.set(entry.url, entry);
  }

  return Array.from(entries.values());
}
