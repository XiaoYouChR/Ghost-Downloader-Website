'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, Download, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'fumadocs-ui/components/ui/popover';
import {
  ScrollArea,
  ScrollViewport,
} from 'fumadocs-ui/components/ui/scroll-area';
import type {
  DownloadAsset,
  DownloadPlatform,
  DownloadReleaseState,
} from '@/lib/github-release';
import { releasesUrl } from '@/lib/github-release';
import { cn } from '@/lib/cn';
import type { HomeCopy } from '@/lib/home-i18n';
import styles from './home.module.css';

const projectUrl = 'https://github.com/XiaoYouChR/Ghost-Downloader-3';
const beianUrl = 'https://beian.miit.gov.cn/';
const browserAddonUrls = {
  chrome: 'https://chromewebstore.google.com/detail/ghost-downloader-browser/pinckpkeeajogfgajbicpnengimiblch',
  edge: 'https://microsoftedge.microsoft.com/addons/detail/ghost-downloader-browser/odaohmfjjbompdkmfbambadnagplcmce',
  firefox: 'https://addons.mozilla.org/zh-CN/firefox/addon/ghost-downloader/',
} as const;

type DownloadCTAProps = {
  copy: HomeCopy['download'];
  lang: string;
  release: DownloadReleaseState;
};

type OptionGroup = {
  items: DownloadOption[];
  label: string;
};

type DownloadOption = {
  fileName: string;
  href: string;
  label: string;
  meta: string;
  recommended?: boolean;
};

type PlatformOptionPanel = {
  groups: OptionGroup[];
  latestLabel: string | null;
  platform: DownloadPlatform;
};

type PlatformCardConfig = {
  platform: DownloadPlatform;
  subtitle: string;
  title: string;
};

const platformLogos = {
  linux: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/linux.svg',
  macos: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/apple.svg',
  windows: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/windows.svg',
} satisfies Record<DownloadPlatform, string>;

export function DownloadCTA({ copy, lang, release }: DownloadCTAProps) {
  const [activeSheet, setActiveSheet] = useState<PlatformOptionPanel | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const platformCards: PlatformCardConfig[] = [
    {
      platform: 'windows',
      subtitle: copy.downloads.windows.version,
      title: copy.downloads.windows.label,
    },
    {
      platform: 'macos',
      subtitle: copy.downloads.macos.version,
      title: copy.downloads.macos.label,
    },
    {
      platform: 'linux',
      subtitle: copy.downloads.linux.version,
      title: copy.downloads.linux.label,
    },
  ];

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 640px)');
    const update = () => setIsMobile(mediaQuery.matches);

    update();
    mediaQuery.addEventListener('change', update);

    return () => {
      mediaQuery.removeEventListener('change', update);
    };
  }, []);

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
            'mb-8 text-5xl font-bold tracking-tight text-slate-900 dark:text-white md:text-7xl',
          )}
        >
          {copy.title.line1} <br />
          {copy.title.highlight}
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-xl text-slate-500 dark:text-slate-400">
          {copy.description}
        </p>

        <div className="flex flex-col justify-center gap-6 sm:flex-row">
          {platformCards.map(({ platform, subtitle, title }) => (
            <PlatformDownloadCard
              key={platform}
              copy={copy}
              isMobile={isMobile}
              platform={platform}
              release={release}
              subtitle={subtitle}
              title={title}
              onOpenSheet={setActiveSheet}
            />
          ))}
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
              href={browserAddonUrls.chrome}
            />
            <BrowserLink
              name={copy.browsers.edge}
              addonSuffix={copy.browsers.addonSuffix}
              icon="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/microsoftedge.svg"
              href={browserAddonUrls.edge}
            />
            <BrowserLink
              name={copy.browsers.firefox}
              addonSuffix={copy.browsers.addonSuffix}
              icon="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/firefoxbrowser.svg"
              href={browserAddonUrls.firefox}
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
        <a
          href={beianUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-blue-500"
        >
          {copy.footer.privacy}
        </a>
      </footer>

      <DownloadSheet
        copy={copy}
        onClose={() => setActiveSheet(null)}
        panel={activeSheet}
      />
    </section>
  );
}

function BrowserLink({
  href,
  name,
  addonSuffix,
  icon,
}: {
  href: string;
  name: string;
  addonSuffix: string;
  icon: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center gap-3"
    >
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

function PlatformDownloadCard({
  copy,
  isMobile,
  onOpenSheet,
  platform,
  release,
  subtitle,
  title,
}: {
  copy: HomeCopy['download'];
  isMobile: boolean;
  onOpenSheet: (panel: PlatformOptionPanel | null) => void;
  platform: DownloadPlatform;
  release: DownloadReleaseState;
  subtitle: string;
  title: string;
}) {
  const panel = useMemo(
    () => createPlatformPanel(copy, platform, release),
    [copy, platform, release],
  );
  const hasOptions = panel.groups.length > 0;

  if (!hasOptions) {
    return (
      <DownloadCardLink
        href={release.data.releaseUrl}
        platform={platform}
        subtitle={subtitle}
        title={title}
      />
    );
  }

  if (isMobile) {
    return (
      <button
        type="button"
        onClick={() => onOpenSheet(panel)}
        className="text-left"
      >
        <DownloadCardSurface platform={platform} subtitle={subtitle} title={title} />
      </button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className="text-left">
          <DownloadCardSurface
            platform={platform}
            subtitle={subtitle}
            title={title}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        sideOffset={18}
        className="flex max-h-[min(78vh,40rem)] w-[min(92vw,26rem)] flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/92 p-0 text-left shadow-[0_24px_60px_rgba(15,23,42,0.14)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#0D121C]/92 dark:shadow-[0_34px_90px_rgba(0,0,0,0.56)]"
      >
        <DownloadOptionsPanel copy={copy} panel={panel} />
      </PopoverContent>
    </Popover>
  );
}

function DownloadCardLink({
  href,
  platform,
  subtitle,
  title,
}: {
  href: string;
  platform: DownloadPlatform;
  subtitle: string;
  title: string;
}) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="text-left">
      <DownloadCardSurface platform={platform} subtitle={subtitle} title={title} />
    </a>
  );
}

function DownloadCardSurface({
  platform,
  subtitle,
  title,
}: {
  platform: DownloadPlatform;
  subtitle: string;
  title: string;
}) {
  const logo = getPlatformLogo(platform);

  return (
    <div
      className={cn(
        styles.surfaceCard,
        'group relative w-full rounded-3xl border border-slate-200 bg-white px-8 py-5 text-left transition-all hover:scale-[1.03] hover:border-slate-300 hover:bg-white active:scale-95 dark:border-white/5 dark:bg-[#0D121C] dark:hover:border-white/10 dark:hover:bg-[#121824]',
      )}
    >
      <div className="absolute inset-0 rounded-3xl bg-linear-to-b from-slate-100/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-blue-500/8" />
      <div className="relative z-10 flex items-center gap-4">
        <div className="rounded-2xl bg-slate-100 p-3 shadow-sm transition-all group-hover:bg-blue-600 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] dark:bg-[#1A2436] dark:shadow-[0_0_15px_rgba(37,99,235,0)]">
          <img
            src={logo}
            alt={title}
            className="h-6 w-6 transition-all filter group-hover:brightness-0 group-hover:invert dark:invert dark:brightness-200"
            referrerPolicy="no-referrer"
          />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800 transition-colors group-hover:text-slate-900 dark:text-white dark:group-hover:text-blue-50">
            {title}
          </p>
          <p className="text-[10px] font-bold text-slate-500 transition-colors group-hover:text-blue-600 dark:text-slate-500 dark:group-hover:text-blue-200/70">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

function DownloadOptionsPanel({
  bodyClassName,
  copy,
  panel,
}: {
  bodyClassName?: string;
  copy: HomeCopy['download'];
  panel: PlatformOptionPanel;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-[1.75rem]">
      <div className="border-b border-slate-200/80 bg-slate-50/80 px-5 py-4 dark:border-white/5 dark:bg-white/[0.03]">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-slate-100 p-3 shadow-sm dark:bg-[#1A2436] dark:shadow-[0_0_15px_rgba(37,99,235,0)]">
            {getPanelIcon(panel.platform)}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {getPanelTitle(copy, panel.platform)}
            </p>
            {panel.latestLabel ? (
              <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-300">
                {panel.latestLabel}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <ScrollArea
        type="always"
        scrollHideDelay={0}
        className="overflow-hidden"
      >
        <ScrollViewport
          className={cn(
            '!h-auto max-h-[calc(min(78vh,40rem)-9.5rem)] overscroll-contain px-4 py-4',
            bodyClassName,
          )}
        >
          <div className="space-y-4">
            {panel.groups.map((group) => (
              <div
                key={group.label}
                className="rounded-[1.25rem] border border-slate-200/70 bg-slate-50/70 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:border-white/6 dark:bg-white/[0.03] dark:shadow-none"
              >
                <p className="mb-2 text-[11px] font-bold tracking-[0.16em] text-slate-400 uppercase dark:text-slate-500">
                  {group.label}
                </p>
                <div className="grid gap-2">
                  {group.items.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      title={item.fileName}
                      className="group/item rounded-[1rem] border border-slate-200/80 bg-white px-3 py-3 transition-colors hover:border-blue-200 hover:bg-blue-50/60 dark:border-white/8 dark:bg-[#101726] dark:hover:border-blue-500/20 dark:hover:bg-[#131C2E]"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors group-hover/item:bg-blue-600 group-hover/item:text-white dark:bg-[#1A2436] dark:text-slate-300 dark:group-hover/item:bg-blue-500 dark:group-hover/item:text-white">
                          <Download className="size-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                              {item.label}
                            </p>
                            {item.recommended ? (
                              <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
                                {copy.recommended}
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                            {item.meta}
                          </p>
                          <p className="mt-1 break-all text-[11px] leading-relaxed whitespace-normal text-slate-400 dark:text-slate-500">
                            {item.fileName}
                          </p>
                        </div>
                        <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-slate-300 transition-colors group-hover/item:text-blue-500 dark:text-slate-600 dark:group-hover/item:text-blue-300" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollViewport>
      </ScrollArea>

      <div className="border-t border-slate-200/80 px-4 py-4 dark:border-white/5">
        <a
          href={releasesUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-300"
        >
          {copy.viewAllReleases}
          <ArrowUpRight className="size-4" />
        </a>
      </div>
    </div>
  );
}

function DownloadSheet({
  copy,
  onClose,
  panel,
}: {
  copy: HomeCopy['download'];
  onClose: () => void;
  panel: PlatformOptionPanel | null;
}) {
  useEffect(() => {
    if (!panel) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, panel]);

  if (!panel) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[90] sm:hidden">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute right-0 bottom-0 left-0 rounded-t-[2rem] border border-white/10 bg-white/96 shadow-[0_-28px_80px_rgba(15,23,42,0.18)] backdrop-blur-2xl dark:bg-[#0B1018]/96 dark:shadow-[0_-32px_90px_rgba(0,0,0,0.58)]">
        <div className="flex items-center justify-between px-5 pt-3 pb-1">
          <div className="mx-auto h-1.5 w-14 rounded-full bg-slate-200 dark:bg-slate-700" />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="flex max-h-[78svh] min-h-0 flex-col px-3 pb-4">
          <DownloadOptionsPanel
            copy={copy}
            panel={panel}
            bodyClassName="max-h-[calc(78svh-9.5rem)]"
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}

function createPlatformPanel(
  copy: HomeCopy['download'],
  platform: DownloadPlatform,
  release: DownloadReleaseState,
): PlatformOptionPanel {
  const latestLabel = release.data.latestVersion
    ? `${copy.latest} ${release.data.latestVersion}`
    : null;

  if (platform === 'windows') {
    return {
      groups: [
        createGroup(copy.installer, [
          createWindowsOption(copy, release.data.windows.exe.x64, copy.x64, '.exe', true),
          createWindowsOption(copy, release.data.windows.exe.arm64, copy.arm64, '.exe'),
        ]),
        createGroup(copy.portable, [
          createWindowsOption(copy, release.data.windows.zip.x64, copy.x64, '.zip'),
          createWindowsOption(copy, release.data.windows.zip.arm64, copy.arm64, '.zip'),
        ]),
      ].filter((group): group is OptionGroup => group !== null),
      latestLabel,
      platform,
    };
  }

  if (platform === 'macos') {
    return {
      groups: [
        createGroup(copy.downloads.macos.label, [
          createOption(release.data.macos.arm64, copy.appleSilicon, '.dmg'),
          createOption(release.data.macos.x64, copy.intel, '.dmg'),
        ]),
      ].filter((group): group is OptionGroup => group !== null),
      latestLabel,
      platform,
    };
  }

  return {
    groups: [
      createGroup(copy.x64, [
        createOption(release.data.linux.x64.appImage, copy.appImage, 'x86_64'),
        createOption(release.data.linux.x64.deb, copy.deb, 'x86_64'),
        createOption(release.data.linux.x64.tarXz, copy.tarXz, 'x86_64'),
      ]),
      createGroup(copy.arm64, [
        createOption(release.data.linux.arm64.appImage, copy.appImage, 'ARM64'),
        createOption(release.data.linux.arm64.deb, copy.deb, 'ARM64'),
        createOption(release.data.linux.arm64.tarXz, copy.tarXz, 'ARM64'),
      ]),
    ].filter((group): group is OptionGroup => group !== null),
    latestLabel,
    platform,
  };
}

function createGroup(label: string, items: Array<DownloadOption | null>) {
  const availableItems = items.filter((item): item is DownloadOption => item !== null);

  if (availableItems.length === 0) {
    return null;
  }

  return {
    items: availableItems,
    label,
  };
}

function createWindowsOption(
  copy: HomeCopy['download'],
  asset: DownloadAsset | undefined,
  architecture: string,
  extension: string,
  recommended = false,
) {
  const flavor = extension === '.exe' ? copy.installer : copy.portable;

  return createOption(asset, `${architecture} ${flavor}`, extension, recommended);
}

function createOption(
  asset: DownloadAsset | undefined,
  label: string,
  meta: string,
  recommended = false,
): DownloadOption | null {
  if (!asset) {
    return null;
  }

  return {
    fileName: asset.fileName,
    href: asset.url,
    label,
    meta,
    recommended,
  };
}

function getPlatformLogo(platform: DownloadPlatform) {
  return platformLogos[platform];
}

function getPanelIcon(platform: DownloadPlatform) {
  return (
    <img
      src={getPlatformLogo(platform)}
      alt=""
      aria-hidden="true"
      className="h-5 w-5 dark:invert dark:brightness-200"
      referrerPolicy="no-referrer"
    />
  );
}

function getPanelTitle(copy: HomeCopy['download'], platform: DownloadPlatform) {
  if (platform === 'windows') {
    return copy.downloads.windows.label;
  }

  if (platform === 'macos') {
    return copy.downloads.macos.label;
  }

  return copy.downloads.linux.label;
}
