import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
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

function getContentFilePath(slug: string[] | undefined, locale: string): string | undefined {
  const localeSuffix = locale === i18n.defaultLanguage ? '' : `.${locale}`;

  if (!slug || slug.length === 0) {
    return `content/docs/index${localeSuffix}.mdx`;
  }

  const directPath = `content/docs/${slug.join('/')}${localeSuffix}.mdx`;
  if (existsSync(directPath)) return directPath;

  const indexPath = `content/docs/${slug.join('/')}/index${localeSuffix}.mdx`;
  if (existsSync(indexPath)) return indexPath;

  return undefined;
}

function getGitLastmod(filePath: string): Date | undefined {
  try {
    const result = execSync(`git log -1 --format=%cI -- "${filePath}"`, {
      encoding: 'utf-8',
    }).trim();
    return result ? new Date(result) : undefined;
  } catch {
    return undefined;
  }
}

function createSitemapEntry(
  locale: string,
  pathname: string,
  lastModified?: Date,
): SitemapEntry {
  return {
    alternates: {
      languages: getLanguageAlternates(pathname),
    },
    lastModified,
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
    const filePath = getContentFilePath(slug, lang);
    const lastModified = filePath ? getGitLastmod(filePath) : undefined;
    const entry = createSitemapEntry(lang, getDocsPagePath(slug), lastModified);
    entries.set(entry.url, entry);
  }

  return Array.from(entries.values());
}
