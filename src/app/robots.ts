import type { MetadataRoute } from 'next';
import { getAbsoluteUrl } from '@/lib/site-metadata';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      allow: '/',
      userAgent: '*',
    },
    sitemap: getAbsoluteUrl('/sitemap.xml'),
  };
}
