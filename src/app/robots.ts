import type { MetadataRoute } from 'next';
import { getAbsoluteUrl } from '@/lib/site-metadata';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      allow: '/',
      disallow: ['/api/', '/llms.txt', '/llms-full.txt', '/*/llms.mdx/'],
      userAgent: '*',
    },
    sitemap: getAbsoluteUrl('/sitemap.xml'),
  };
}
