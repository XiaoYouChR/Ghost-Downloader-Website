'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { ArrowDownToLine, ArrowUpRight, X } from 'lucide-react';
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
import { entrance, entranceDelayed } from './primitives';
import { ConnectionField } from './connection-field';
import { cn } from '@/lib/cn';
import { MdiIcon, type MdiIconName } from '@/lib/icons';

const browserAddonUrls = {
  Chrome:
    'https://chromewebstore.google.com/detail/ghost-downloader-for-brow/lagbjgkmaafnlinaeonbhjchnjinjpeh',
  Edge: 'https://microsoftedge.microsoft.com/addons/detail/ghost-downloader-browser/odaohmfjjbompdkmfbambadnagplcmce',
  Firefox: 'https://addons.mozilla.org/firefox/addon/ghost-downloader/',
} as const;

type DownloadOption = {
  fileName: string;
  href: string;
  label: string;
  meta: string;
  recommended?: boolean;
};

type OptionGroup = {
  label: string;
  items: DownloadOption[];
};

type PlatformPanel = {
  platform: DownloadPlatform;
  title: string;
  latestLabel: string | null;
  groups: OptionGroup[];
};

type DownloadCopy = {
  titlePrefix: string;
  titleBrand: string;
  subtitle: string;
  unavailable: string;
  viewReleases: string;
  installer: string;
  portable: string;
  appImage: string;
  deb: string;
  tarXz: string;
  appleSilicon: string;
  intel: string;
  x64: string;
  arm64: string;
  recommended: string;
  appTitle: string;
  extensionTitle: string;
  platforms: {
    windows: string;
    macos: string;
    linux: string;
    android: string;
  };
  subtitles: {
    windows: string;
    macos: string;
    linux: string;
    android: string;
    chrome: string;
    edge: string;
    firefox: string;
  };
};

type DownloadProps = {
  copy: DownloadCopy;
  lang: string;
  release: DownloadReleaseState;
};

function mirrorUrl(url: string, lang: string): string {
  if (lang === 'zh') {
    return url.replace('github.com', 'gitcode.com');
  }
  return url;
}

function mirrorAsset(
  asset: DownloadAsset | undefined,
  lang: string,
): DownloadAsset | undefined {
  if (!asset) return undefined;
  return { ...asset, url: mirrorUrl(asset.url, lang) };
}

function createOption(
  asset: DownloadAsset | undefined,
  lang: string,
  label: string,
  meta: string,
  recommended = false,
): DownloadOption | null {
  const mirrored = mirrorAsset(asset, lang);
  if (!mirrored) return null;
  return {
    fileName: mirrored.fileName,
    href: mirrored.url,
    label,
    meta,
    recommended,
  };
}

function createGroup(
  label: string,
  items: Array<DownloadOption | null>,
): OptionGroup | null {
  const available = items.filter(Boolean) as DownloadOption[];
  return available.length > 0 ? { label, items: available } : null;
}

function buildPanel(
  copy: DownloadCopy,
  lang: string,
  platform: DownloadPlatform,
  release: DownloadReleaseState,
): PlatformPanel {
  const version = release.data.latestVersion;
  const latestLabel = version ? `Latest ${version}` : null;

  if (platform === 'windows') {
    return {
      platform,
      title: copy.platforms.windows,
      latestLabel,
      groups: [
        createGroup(copy.installer, [
          createOption(release.data.windows.exe.x64, lang, copy.x64, '.exe', true),
          createOption(release.data.windows.exe.arm64, lang, copy.arm64, '.exe'),
        ]),
        createGroup(copy.portable, [
          createOption(release.data.windows.zip.x64, lang, copy.x64, '.zip'),
          createOption(release.data.windows.zip.arm64, lang, copy.arm64, '.zip'),
        ]),
      ].filter(Boolean) as OptionGroup[],
    };
  }

  if (platform === 'macos') {
    return {
      platform,
      title: copy.platforms.macos,
      latestLabel,
      groups: [
        createGroup(copy.platforms.macos, [
          createOption(release.data.macos.arm64, lang, copy.appleSilicon, '.dmg', true),
          createOption(release.data.macos.x64, lang, copy.intel, '.dmg'),
        ]),
      ].filter(Boolean) as OptionGroup[],
    };
  }

  if (platform === 'android') {
    return {
      platform,
      title: copy.platforms.android,
      latestLabel,
      groups: [
        createGroup('APK', [
          createOption(release.data.android.apk, lang, 'arm64-v8a', '.apk', true),
        ]),
      ].filter(Boolean) as OptionGroup[],
    };
  }

  return {
    platform,
    title: copy.platforms.linux,
    latestLabel,
    groups: [
      createGroup(copy.x64, [
        createOption(release.data.linux.x64.appImage, lang, copy.appImage, 'x86_64'),
        createOption(release.data.linux.x64.deb, lang, copy.deb, 'x86_64'),
        createOption(release.data.linux.x64.tarXz, lang, copy.tarXz, 'x86_64'),
      ]),
      createGroup(copy.arm64, [
        createOption(release.data.linux.arm64.appImage, lang, copy.appImage, 'ARM64'),
        createOption(release.data.linux.arm64.deb, lang, copy.deb, 'ARM64'),
        createOption(release.data.linux.arm64.tarXz, lang, copy.tarXz, 'ARM64'),
      ]),
    ].filter(Boolean) as OptionGroup[],
  };
}

const browserCards: Array<{
  name: string;
  icon: MdiIconName;
  subtitleKey: keyof DownloadCopy['subtitles'];
  url: string;
}> = [
  { name: 'Chrome', icon: 'chrome', subtitleKey: 'chrome', url: browserAddonUrls.Chrome },
  { name: 'Edge', icon: 'edge', subtitleKey: 'edge', url: browserAddonUrls.Edge },
  { name: 'Firefox', icon: 'firefox', subtitleKey: 'firefox', url: browserAddonUrls.Firefox },
];

const platformCards: Array<{
  platform: DownloadPlatform;
  icon: MdiIconName;
  subtitleKey: keyof DownloadCopy['subtitles'];
}> = [
  { platform: 'windows', icon: 'windows', subtitleKey: 'windows' },
  { platform: 'macos', icon: 'apple', subtitleKey: 'macos' },
  { platform: 'linux', icon: 'linux', subtitleKey: 'linux' },
  { platform: 'android', icon: 'android', subtitleKey: 'android' },
];

const subscribeMobile = (cb: () => void) => {
  const mq = window.matchMedia('(max-width: 640px)');
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};
const getMobile = () => window.matchMedia('(max-width: 640px)').matches;
const getMobileServer = () => false;

export function Download({ copy, lang, release }: DownloadProps) {
  const [activeSheet, setActiveSheet] = useState<PlatformPanel | null>(null);
  const isMobile = useSyncExternalStore(subscribeMobile, getMobile, getMobileServer);

  return (
    <section
      id="download"
      className="relative isolate overflow-hidden border-t border-edge px-5 py-24 sm:px-8 md:py-32"
    >
      {/* The field returns to close the arc: the page opens on the blockade and
          ends on the download running. Everything between is evidence. */}
      <ConnectionField variant="trail" className="opacity-25" />
      <div className="relative mx-auto w-full max-w-6xl text-center">
        <motion.div {...entrance}>
          <h2 className="font-display text-[2rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-5xl">
            <span className="text-ink">{copy.titlePrefix}</span>{' '}
            <span className="text-accent">{copy.titleBrand}</span>
          </h2>
          <p className="mt-4 text-lg text-ink-muted">
            {copy.subtitle}
          </p>
        </motion.div>

        {release.hasAnyPlatformAsset ? (
          <motion.div
            {...entranceDelayed}
            className="mt-10"
          >
            <p className="text-base font-semibold tracking-[-0.01em] text-ink-muted">
              {copy.appTitle}
            </p>
            <div className="mt-5 flex flex-col items-center justify-center gap-5 sm:flex-row sm:flex-wrap">
            {platformCards.map(({ platform, icon, subtitleKey }) => {
              const panel = buildPanel(copy, lang, platform, release);
              const hasOptions = panel.groups.length > 0;

              if (!hasOptions) return null;

              if (isMobile) {
                return (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => setActiveSheet(panel)}
                    className="w-full text-left sm:w-auto"
                  >
                    <PlatformCardSurface
                      icon={icon}
                      title={copy.platforms[platform]}
                      subtitle={copy.subtitles[subtitleKey]}
                    />
                  </button>
                );
              }

              return (
                <Popover key={platform}>
                  <PopoverTrigger asChild>
                    <button type="button" className="text-left">
                      <PlatformCardSurface
                        icon={icon}
                        title={copy.platforms[platform]}
                        subtitle={copy.subtitles[subtitleKey]}
                      />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="center"
                    sideOffset={16}
                    collisionPadding={16}
                    className="flex w-[min(92vw,24rem)] flex-col overflow-hidden rounded-xl border border-edge bg-surface p-0 text-left shadow-lg"
                  >
                    <OptionsPanel copy={copy} panel={panel} />
                  </PopoverContent>
                </Popover>
              );
            })}
            </div>
          </motion.div>
        ) : (
          <p className="mt-14 text-sm text-ink-muted">{copy.unavailable}</p>
        )}

        <motion.div
          {...entranceDelayed}
          className="mt-12"
        >
          <p className="text-base font-semibold tracking-[-0.01em] text-ink-muted">
            {copy.extensionTitle}
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-5 sm:flex-row sm:flex-wrap">
            {browserCards.map(({ name, icon, subtitleKey, url }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="text-left"
              >
                <PlatformCardSurface
                  icon={icon}
                  title={name}
                  subtitle={copy.subtitles[subtitleKey]}
                />
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div {...entranceDelayed}>
          <a
            href={lang === 'zh' ? releasesUrl.replace('github.com', 'gitcode.com') : releasesUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-flex items-center gap-1 text-sm font-medium text-ink-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
          >
            {copy.viewReleases}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </motion.div>
      </div>

      <BottomSheet
        copy={copy}
        panel={activeSheet}
        onClose={() => setActiveSheet(null)}
      />
    </section>
  );
}

function PlatformCardSurface({
  icon,
  title,
  subtitle,
}: {
  icon: MdiIconName;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="group flex w-full min-w-[10rem] items-center gap-4 rounded-xl border border-edge bg-surface px-6 py-5 transition-all hover:scale-[1.03] hover:border-edge-strong hover:shadow-md active:scale-95 sm:w-auto">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-raised transition-colors group-hover:bg-accent group-hover:text-accent-contrast">
        <MdiIcon name={icon} className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="text-[11px] font-medium text-ink-faint transition-colors group-hover:text-accent">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function OptionsPanel({
  copy,
  panel,
  bodyClassName,
}: {
  copy: DownloadCopy;
  panel: PlatformPanel;
  bodyClassName?: string;
}) {
  return (
    <div className="flex flex-col overflow-hidden">
      <div className="border-b border-edge bg-raised/50 px-5 py-4">
        <p className="text-sm font-semibold text-ink">{panel.title}</p>
        {panel.latestLabel ? (
          <p className="mt-0.5 font-mono text-[11px] text-accent">{panel.latestLabel}</p>
        ) : null}
      </div>

      <ScrollArea type="always" scrollHideDelay={0} className="overflow-hidden">
        <ScrollViewport
          className={cn(
            'max-h-[calc(var(--radix-popover-content-available-height,70vh)-7rem)] overscroll-contain px-4 py-4',
            bodyClassName,
          )}
        >
          <div className="space-y-4">
            {panel.groups.map((group) => (
              <div key={group.label}>
                <p className="mb-2 font-mono text-[11px] font-medium tracking-[0.12em] text-ink-faint uppercase">
                  {group.label}
                </p>
                <div className="grid gap-1.5">
                  {group.items.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      title={item.fileName}
                      className="group/item flex min-w-0 items-center gap-3 rounded-lg border border-edge bg-ground px-3 py-2.5 transition-colors hover:border-accent/30 hover:bg-accent-wash"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-raised text-ink-faint transition-colors group-hover/item:bg-accent group-hover/item:text-accent-contrast">
                        <ArrowDownToLine className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-ink">{item.label}</span>
                          {item.recommended ? (
                            <span className="rounded-full bg-accent-wash px-2 py-0.5 font-mono text-[10px] font-medium text-accent">
                              {copy.recommended}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-0.5 truncate font-mono text-[11px] text-ink-faint">
                          {item.fileName}
                        </p>
                      </div>
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-ink-faint transition-colors group-hover/item:text-accent" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollViewport>
      </ScrollArea>

      <div className="border-t border-edge px-4 py-3">
        <a
          href={releasesUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-faint transition-colors hover:text-accent"
        >
          {copy.viewReleases}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}

function BottomSheet({
  copy,
  panel,
  onClose,
}: {
  copy: DownloadCopy;
  panel: PlatformPanel | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!panel) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose, panel]);

  if (!panel) return null;

  return createPortal(
    <div className="fixed inset-0 z-[90] sm:hidden">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute right-0 bottom-0 left-0 overflow-hidden rounded-t-2xl border border-edge bg-surface shadow-2xl">
        <div className="flex items-center justify-between px-5 pt-3 pb-1">
          <div className="mx-auto h-1.5 w-14 rounded-full bg-edge-strong" />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-edge bg-ground text-ink-faint transition-colors hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex max-h-[78svh] min-h-0 flex-col px-3 pb-4">
          <OptionsPanel
            copy={copy}
            panel={panel}
            bodyClassName="max-h-[calc(78svh-8rem)]"
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
