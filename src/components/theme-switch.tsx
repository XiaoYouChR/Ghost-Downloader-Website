'use client';

import { Airplay, Moon, Sun } from 'lucide-react';
import type { ThemeSwitchProps } from 'fumadocs-ui/layouts/shared/slots/theme-switch';
import { cn } from '@/lib/cn';
import { useTheme } from '@/components/theme-provider';
import type { ThemeMode } from '@/lib/theme';

const switchItems = [
  {
    icon: Sun,
    key: 'light',
    label: 'Light theme',
  },
  {
    icon: Moon,
    key: 'dark',
    label: 'Dark theme',
  },
  {
    icon: Airplay,
    key: 'system',
    label: 'System theme',
  },
] as const satisfies {
  icon: typeof Sun;
  key: ThemeMode;
  label: string;
}[];

function getItemClassName(active: boolean) {
  return cn(
    'size-6.5 rounded-full p-1.5 transition-colors',
    active
      ? 'bg-fd-accent text-fd-accent-foreground'
      : 'text-fd-muted-foreground',
  );
}

export function ThemeSwitch({
  className,
  mode = 'light-dark',
  ...props
}: ThemeSwitchProps) {
  const { mounted, resolvedTheme, setTheme, theme } = useTheme();
  const containerClassName = cn(
    'inline-flex items-center overflow-hidden rounded-full border p-1 *:rounded-full',
    className,
  );

  if (mode === 'light-dark') {
    const activeTheme = mounted ? resolvedTheme : null;

    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className={containerClassName}
        data-theme-toggle=""
        onClick={() => setTheme(activeTheme === 'dark' ? 'light' : 'dark')}
      >
        <Sun
          fill="currentColor"
          className={getItemClassName(activeTheme === 'light')}
        />
        <Moon
          fill="currentColor"
          className={getItemClassName(activeTheme === 'dark')}
        />
      </button>
    );
  }

  return (
    <div {...props} className={containerClassName} data-theme-toggle="">
      {switchItems.map(({ icon: Icon, key, label }) => (
        <button
          key={key}
          type="button"
          aria-label={label}
          className={getItemClassName(mounted && theme === key)}
          onClick={() => setTheme(key)}
        >
          <Icon className="size-full" fill="currentColor" />
        </button>
      ))}
    </div>
  );
}
