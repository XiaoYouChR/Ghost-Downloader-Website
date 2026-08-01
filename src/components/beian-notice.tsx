import { createTranslator } from '@/lib/copy';
import { cn } from '@/lib/cn';

const icpUrl = 'https://beian.miit.gov.cn/';
const publicSecurityUrl =
  'https://beian.mps.gov.cn/#/query/webSearch?code=43072402000246';

/**
 * The filings Chinese hosting requires.
 *
 * Shared so the home page and the docs sidebar cannot drift apart — the
 * numbers are a legal requirement and must read identically in both.
 */
export function BeianNotice({
  lang,
  className,
}: {
  lang: string;
  className?: string;
}) {
  const t = createTranslator(lang);

  return (
    <div className={cn('flex flex-wrap items-center gap-x-6 gap-y-2', className)}>
      <a
        href={icpUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex transition-colors hover:text-accent"
      >
        {t('footer.icp')}
      </a>
      <a
        href={publicSecurityUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 transition-colors hover:text-accent"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, images unoptimized */}
        <img
          src="/images/beian-icon.png"
          alt=""
          className="h-3.5 w-auto shrink-0"
          loading="lazy"
          decoding="async"
        />
        {t('footer.publicSecurity')}
      </a>
    </div>
  );
}
