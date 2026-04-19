import { GhostHomePage } from '@/app/(home)/_components/ghost-home';
import { getHomeCopy } from '@/lib/home-i18n';

type HomePageProps = {
  params: Promise<{ lang: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;

  return <GhostHomePage lang={lang} copy={getHomeCopy(lang)} />;
}
