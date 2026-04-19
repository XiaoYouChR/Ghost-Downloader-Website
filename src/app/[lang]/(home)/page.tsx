import { GhostHomePage } from '@/app/(home)/_components/ghost-home';
import { getLatestDownloadRelease } from '@/lib/github-release';
import { getHomeCopy } from '@/lib/home-i18n';

type HomePageProps = {
  params: Promise<{ lang: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;
  const downloadRelease = await getLatestDownloadRelease();

  return (
    <GhostHomePage
      lang={lang}
      copy={getHomeCopy(lang)}
      downloadRelease={downloadRelease}
    />
  );
}
