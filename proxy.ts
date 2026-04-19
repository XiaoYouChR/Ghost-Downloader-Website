import { NextRequest, NextResponse } from 'next/server';
import { getNegotiator, isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import { i18n } from '@/lib/i18n';
import { docsContentRoute, docsRoute } from '@/lib/shared';

const { rewrite: rewriteDocs } = rewritePath(
  `${docsRoute}{/*path}`,
  `${docsContentRoute}{/*path}/content.md`,
);
const { rewrite: rewriteSuffix } = rewritePath(
  `${docsRoute}{/*path}.mdx`,
  `${docsContentRoute}{/*path}/content.md`,
);

function splitLocale(pathname: string) {
  const segments = pathname.split('/');
  const maybeLocale = segments[1];

  if (maybeLocale && i18n.languages.includes(maybeLocale as (typeof i18n.languages)[number])) {
    const stripped = `/${segments.slice(2).join('/')}`.replace(/\/+/g, '/');

    return {
      locale: maybeLocale,
      pathname: stripped === '/' ? '/' : stripped.replace(/\/$/, '') || '/',
    };
  }

  return {
    pathname,
  };
}

function withLocalePrefix(locale: string, pathname: string) {
  return `/${locale}${pathname}`.replace(/\/+/g, '/');
}

function getPreferredLocale(request: NextRequest) {
  const preferredLanguages = getNegotiator(request).languages();

  for (const language of preferredLanguages) {
    const normalized = language.toLowerCase();

    if (normalized.startsWith('zh')) return 'cn';
    if (normalized.startsWith('en')) return 'en';
  }

  return i18n.defaultLanguage;
}

export default function proxy(request: NextRequest) {
  const { locale, pathname } = splitLocale(request.nextUrl.pathname);

  if (!locale) {
    const preferredLocale = getPreferredLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = withLocalePrefix(preferredLocale, pathname);

    return NextResponse.redirect(url);
  }

  const result = rewriteSuffix(pathname);
  if (result) {
    return NextResponse.rewrite(new URL(withLocalePrefix(locale, result), request.nextUrl));
  }

  if (isMarkdownPreferred(request)) {
    const result = rewriteDocs(pathname);

    if (result) {
      return NextResponse.rewrite(new URL(withLocalePrefix(locale, result), request.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
};
