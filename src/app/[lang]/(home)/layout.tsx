import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { SiteHeader } from '@/components/site-header';
import { homeOptions } from '@/lib/layout.shared';

export default async function Layout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  const options = homeOptions(lang);

  return (
    <HomeLayout {...options} slots={{ ...options.slots, header: SiteHeader }}>
      {children}
    </HomeLayout>
  );
}
