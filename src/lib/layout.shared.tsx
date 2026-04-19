import { defineI18nUI } from 'fumadocs-ui/i18n';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { PenLineIcon } from 'lucide-react';
import { ThemeSwitch } from '@/components/theme-switch';
import { i18n } from './i18n';
import { appName, gitConfig } from './shared';

export const i18nUI = defineI18nUI(i18n, {
  en: {
    displayName: 'English',
    chooseTheme: 'Theme',
  },
  zh: {
    displayName: '中文',
    chooseTheme: '主题',
  },
});

export function baseOptions(locale: string): BaseLayoutProps {
  return {
    i18n: true,
    links: [
      {
        type: 'icon',
        label: locale === 'zh' ? '博客' : 'Blog',
        text: locale === 'zh' ? '博客' : 'Blog',
        url: 'https://xychr.com/',
        external: true,
        icon: <PenLineIcon />,
      },
    ],
    nav: {
      title: (
        <>
          <img
            src="/images/logo_no_background.png"
            alt=""
            aria-hidden="true"
            className="h-8 w-8 object-contain"
          />
          <span>{appName}</span>
        </>
      ),
      url: `/${locale}/`,
    },
    slots: {
      themeSwitch: ThemeSwitch,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
