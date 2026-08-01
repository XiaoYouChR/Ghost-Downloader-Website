import { zhCN } from '@fumadocs/language/zh-cn';
import { uiTranslations } from 'fumadocs-ui/i18n';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { GhostMark } from '@/components/ghost-mark';
import { GithubMark } from '@/components/github-mark';
import { ThemeSwitch } from '@/components/theme-switch';
import { MdiIcon } from '@/lib/icons';
import { i18n } from './i18n';
import { appName, externalLinks, repoUrl } from './shared';
import { getLocalizedPath } from './site-metadata';

export const translations = i18n
  .translations()
  .extend(uiTranslations())
  .preset('zh', zhCN())
  .add({ zh: { displayName: '中文' } });

const brandMark = <GhostMark className="h-6 w-6 text-ink" />;

function baseOptions(locale: string): BaseLayoutProps {
  return {
    i18n: true,
    nav: {
      title: (
        <>
          {brandMark}
          <span>{appName}</span>
        </>
      ),
      url: getLocalizedPath(locale, '/'),
    },
    slots: {
      themeSwitch: ThemeSwitch,
    },
  };
}

export function homeOptions(locale: string): BaseLayoutProps {
  const base = baseOptions(locale);

  return {
    ...base,
    nav: {
      ...base.nav,
      title: (
        <>
          {brandMark}
          <span className="max-md:hidden">{appName}</span>
        </>
      ),
    },
    themeSwitch: { enabled: false },
    searchToggle: { enabled: false },
  };
}

export function docsOptions(locale: string): BaseLayoutProps {
  return {
    ...baseOptions(locale),
    links: [
      {
        type: 'icon',
        url: repoUrl,
        icon: <GithubMark className="h-5 w-5" />,
        text: 'GitHub',
        external: true,
      },
      {
        type: 'icon',
        url: externalLinks.discord,
        icon: <MdiIcon name="discord" className="h-5 w-5" />,
        text: 'Discord',
        external: true,
      },
      {
        type: 'icon',
        url: externalLinks.qq,
        icon: <MdiIcon name="qq" className="h-5 w-5" />,
        text: 'QQ',
        external: true,
      },
    ],
  };
}
