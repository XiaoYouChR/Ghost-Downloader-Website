import type { ReactNode } from 'react';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';

type HomeLayoutProps = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

export default async function Layout({ children, params }: HomeLayoutProps) {
  const { lang } = await params;
  const options = baseOptions(lang);

  return (
    <HomeLayout
      {...options}
      nav={{
        ...options.nav,
        transparentMode: 'always',
      }}
    >
      {children}
    </HomeLayout>
  );
}
