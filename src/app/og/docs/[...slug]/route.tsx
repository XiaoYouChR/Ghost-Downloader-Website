import { getPageImage, source } from '@/lib/source';
import { i18n } from '@/lib/i18n';
import { appName } from '@/lib/shared';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';
import { generate as DefaultImage } from 'fumadocs-ui/og';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/og/docs/[...slug]'>) {
  const { slug } = await params;
  const contentSegments = slug.slice(0, -1);
  const [firstSegment, ...restSegments] = contentSegments;
  const locale = i18n.languages.includes(firstSegment as (typeof i18n.languages)[number])
    ? firstSegment
    : i18n.defaultLanguage;
  const pageSlug = locale === firstSegment ? restSegments : contentSegments;
  const page = source.getPage(pageSlug, locale);
  if (!page) notFound();

  return new ImageResponse(
    <DefaultImage title={page.data.title} description={page.data.description} site={appName} />,
    {
      width: 1200,
      height: 630,
    },
  );
}

export function generateStaticParams() {
  return source.generateParams().map((params) => ({
    slug: getPageImage(source.getPage(params.slug, params.lang)!).segments,
  }));
}
