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
    <a
      key="icp"
      href="https://beian.miit.gov.cn/"
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 inline-flex text-xs text-fd-muted-foreground transition-colors hover:text-fd-foreground"
    >
      湘ICP备2026012876号-1
    </a>
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
