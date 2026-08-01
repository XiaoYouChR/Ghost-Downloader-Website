import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { BeianNotice } from '@/components/beian-notice';
import { docsOptions } from '@/lib/layout.shared';

export default async function Layout({ children, params }: LayoutProps<'/[lang]/docs'>) {
  const { lang } = await params;
  const footer = (
    <BeianNotice
      key="beian"
      lang={lang}
      className="mt-2 flex-col items-start gap-y-1 text-xs text-fd-muted-foreground"
    />
  );

  return (
    <DocsLayout
      tree={source.getPageTree(lang)}
      {...docsOptions(lang)}
      sidebar={{ footer }}
    >
      {children}
    </DocsLayout>
  );
}
