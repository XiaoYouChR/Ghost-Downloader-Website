import Link from 'next/link';
import { cn } from '@/lib/cn';
import type { HomeCopy } from '@/lib/home-i18n';
import styles from './home.module.css';

const projectUrl = 'https://github.com/XiaoYouChR/Ghost-Downloader-3';
const releasesUrl = `${projectUrl}/releases`;

type DownloadCTAProps = {
  lang: string;
  copy: HomeCopy['download'];
};

export function DownloadCTA({ lang, copy }: DownloadCTAProps) {
  return (
    <section
      id="downloads"
      className="relative overflow-hidden bg-slate-50 px-6 py-40 dark:bg-[#00040A]"
    >
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -z-0 h-[30rem] w-[80rem] -translate-x-1/2 -translate-y-1/2 bg-blue-500/10 blur-[150px] dark:bg-blue-600/10"
      />
      <div aria-hidden="true" className={styles.starryTexture} />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h2
          className={cn(
            styles.display,
            'mb-8 text-5xl font-bold tracking-tight text-slate-900 dark:text-white md:text-7xl'
          )}
        >
          {copy.title.line1} <br />
          {copy.title.highlight}
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-xl text-slate-500 dark:text-slate-400">
          {copy.description}
        </p>

        <div className="flex flex-col justify-center gap-6 sm:flex-row">
          <DownloadButton
            platform="windows"
            os={copy.downloads.windows.label}
            version={copy.downloads.windows.version}
          />
          <DownloadButton
            platform="macos"
            os={copy.downloads.macos.label}
            version={copy.downloads.macos.version}
          />
          <DownloadButton
            platform="linux"
            os={copy.downloads.linux.label}
            version={copy.downloads.linux.version}
          />
        </div>

        <div className="mt-20 flex flex-col items-center gap-8 border-t border-slate-200 pt-12 dark:border-white/5">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-600">
            {copy.alsoAvailableAs}
          </p>
          <div className="flex flex-wrap justify-center gap-10 md:gap-16">
            <BrowserLink
              name={copy.browsers.chrome}
              addonSuffix={copy.browsers.addonSuffix}
              icon="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/googlechrome.svg"
            />
            <BrowserLink
              name={copy.browsers.edge}
              addonSuffix={copy.browsers.addonSuffix}
              icon="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/microsoftedge.svg"
            />
            <BrowserLink
              name={copy.browsers.firefox}
              addonSuffix={copy.browsers.addonSuffix}
              icon="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/firefoxbrowser.svg"
            />
          </div>
        </div>
      </div>

      <footer className="absolute right-0 bottom-12 left-0 flex flex-wrap justify-center gap-x-12 gap-y-3 px-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600">
        <span>{copy.footer.copyright}</span>
        <a
          href={projectUrl}
          target="_blank"
          rel="noreferrer"
          className="transition-colors hover:text-blue-500"
        >
          {copy.footer.githubSource}
        </a>
        <Link href={`/${lang}/docs`} className="transition-colors hover:text-blue-500">
          {copy.footer.documentation}
        </Link>
        <span>{copy.footer.privacy}</span>
      </footer>
    </section>
  );
}

function BrowserLink({
  name,
  addonSuffix,
  icon,
}: {
  name: string;
  addonSuffix: string;
  icon: string;
}) {
  return (
    <a href="#extension" className="group flex items-center gap-3">
      <img
        src={icon}
        alt={name}
        className="h-5 w-5 opacity-40 transition-all filter group-hover:opacity-100 dark:invert dark:brightness-200"
        referrerPolicy="no-referrer"
      />
      <span className="text-sm font-bold text-slate-400 transition-colors group-hover:text-slate-800 dark:text-white/40 dark:group-hover:text-white">
        {name} {addonSuffix}
      </span>
    </a>
  );
}

function DownloadButton({
  platform,
  os,
  version,
}: {
  platform: 'windows' | 'macos' | 'linux';
  os: string;
  version: string;
}) {
  const logo =
    platform === 'windows'
      ? 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/windows.svg'
      : platform === 'macos'
        ? 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/apple.svg'
        : 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/linux.svg';

  return (
    <a
      href={releasesUrl}
      target="_blank"
      rel="noreferrer"
      className={cn(
        styles.surfaceCard,
        'group relative rounded-3xl border border-slate-200 bg-white px-8 py-5 text-left transition-all hover:scale-105 hover:border-slate-300 hover:bg-white active:scale-95 dark:border-white/5 dark:bg-[#0D121C] dark:hover:border-white/10 dark:hover:bg-[#121824]'
      )}
    >
      <div className="absolute inset-0 rounded-3xl bg-linear-to-b from-slate-100/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-blue-500/8" />
      <div className="relative z-10 flex items-center gap-4">
        <div className="rounded-2xl bg-slate-100 p-3 shadow-sm transition-all group-hover:bg-blue-600 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] dark:bg-[#1A2436] dark:shadow-[0_0_15px_rgba(37,99,235,0)]">
          <img
            src={logo}
            alt={os}
            className="h-6 w-6 transition-all filter group-hover:brightness-0 group-hover:invert dark:invert dark:brightness-200"
            referrerPolicy="no-referrer"
          />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800 transition-colors group-hover:text-slate-900 dark:text-white dark:group-hover:text-blue-50">
            {os}
          </p>
          <p className="text-[10px] font-bold text-slate-500 transition-colors group-hover:text-blue-600 dark:text-slate-500 dark:group-hover:text-blue-200/50">
            {version}
          </p>
        </div>
      </div>
    </a>
  );
}
