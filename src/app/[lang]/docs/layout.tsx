import type { ReactNode } from 'react';
import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';

type DocsLayoutProps = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

export default async function Layout({ children, params }: DocsLayoutProps) {
  const { lang } = await params;
  const footer = (
    <div
      key="beian"
      className="mt-2 flex flex-col items-start gap-1 text-xs text-fd-muted-foreground"
    >
      <a
        href="https://beian.miit.gov.cn/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex transition-colors hover:text-fd-foreground"
      >
        湘ICP备2026012876号-1
      </a>
      <a
        href="https://beian.mps.gov.cn/#/query/webSearch?code=43072402000246"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 transition-colors hover:text-fd-foreground"
      >
        <img
          src="/images/beian-icon.png"
          alt=""
          className="inline-block h-4 w-auto shrink-0"
          decoding="async"
          loading="lazy"
        />
        湘公网安备43072402000246号
      </a>
    </div>
  );

  return (
    <DocsLayout
      tree={source.getPageTree(lang)}
      {...baseOptions(lang)}
      sidebar={{ footer }}
    >
      {children}
    </DocsLayout>
  );
}
