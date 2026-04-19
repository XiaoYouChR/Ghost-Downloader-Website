'use client';

import type { ComponentPropsWithoutRef } from 'react';
import { Check, Moon, Sun } from 'lucide-react';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'fumadocs-ui/components/ui/popover';
import type { ThemeSwitchProps } from 'fumadocs-ui/layouts/shared/slots/theme-switch';
import { cn } from '@/lib/cn';
import { useTheme } from '@/components/theme-provider';
import type { ThemeMode } from '@/lib/theme';

const allThemeOptions = [
  {
    icon: Sun,
    key: 'light',
  },
  {
    icon: Moon,
    key: 'dark',
  },
  {
    icon: SystemThemeIcon,
    key: 'system',
  },
] as const satisfies Array<{
  icon: (props: ComponentPropsWithoutRef<'svg'>) => React.ReactNode;
  key: ThemeMode;
}>;

function SystemThemeIcon(props: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

const themeLabels = {
  zh: {
    dark: '深色',
    light: '浅色',
    system: '跟随系统',
  },
  en: {
    dark: 'Dark',
    light: 'Light',
    system: 'System',
  },
} as const satisfies Record<'en' | 'zh', Record<ThemeMode, string>>;

export function ThemeSwitch({
  children,
  className,
  mode = 'light-dark-system',
}: ThemeSwitchProps) {
  const { mounted, resolvedTheme, setTheme, theme } = useTheme();
  const { locale, text } = useI18n();
  const copy = {
    chooseTheme: text.chooseTheme,
    ...themeLabels[locale === 'zh' ? 'zh' : 'en'],
  };
  const themeOptions =
    mode === 'light-dark'
      ? allThemeOptions.filter((option) => option.key !== 'system')
      : allThemeOptions;
  const selectedTheme = mounted ? theme : 'system';
  const triggerTheme =
    mode === 'light-dark' && selectedTheme === 'system'
      ? resolvedTheme
      : selectedTheme;
  const activeOption =
    allThemeOptions.find((option) => option.key === triggerTheme) ??
    allThemeOptions[2];
  const TriggerIcon = activeOption.icon;
  const trigger =
    children ?? <TriggerIcon className="size-5" data-theme-switch-icon="" />;

  return (
    <Popover>
      <div className={cn('shrink-0', className)} data-theme-switch="">
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={copy.chooseTheme}
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'gap-1.5 p-1.5 data-[state=open]:bg-fd-accent',
            )}
            data-theme-switch-trigger=""
          >
            {trigger}
          </button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="flex flex-col gap-0.5 p-1">
        <p className="p-2 text-xs font-medium text-fd-muted-foreground">
          {copy.chooseTheme}
        </p>
        {themeOptions.map(({ icon: Icon, key }) => {
          const active = key === theme;
          const label = copy[key];

          return (
            <button
              key={key}
              type="button"
              className={cn(
                'flex items-center gap-2 rounded-lg px-2 py-1.5 text-start text-sm transition-colors',
                active
                  ? 'bg-fd-primary/10 text-fd-primary'
                  : 'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground',
              )}
              onClick={() => setTheme(key)}
            >
              <Icon className="size-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {active ? <Check className="size-4 shrink-0" /> : null}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
