import { createTranslator } from '@/lib/copy';
import { docsLinks, externalLinks } from '@/lib/shared';
import { getLocalizedPath } from '@/lib/site-metadata';
import { cn } from '@/lib/cn';
import { BeianNotice } from './beian-notice';
import { ThemeSwitch } from './theme-switch';

/**
 * The home page's footer, including the filings Chinese hosting requires.
 *
 * It also carries the theme switch: none of the seven reference sites we
 * measured puts one in a home-page header, and Cursor — the only one with an
 * explicit three-way control — keeps it down here. Docs pages are unaffected;
 * fumadocs renders theirs at the foot of the sidebar.
 */
export function SiteFooter({
  lang,
  className,
}: {
  lang: string;
  className?: string;
}) {
  const t = createTranslator(lang);

  const links = [
    { label: t('footer.docs'), href: getLocalizedPath(lang, '/docs/') },
    { label: t('footer.github'), href: externalLinks.github },
    { label: t('footer.discord'), href: externalLinks.discord },
    { label: t('footer.qq'), href: externalLinks.qq },
    { label: t('footer.donate'), href: getLocalizedPath(lang, docsLinks.donate) },
  ];

  return (
    <footer
      className={cn('border-t border-edge px-5 py-10 sm:px-8', className)}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 text-sm text-ink-faint">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-accent"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <ThemeSwitch className="-my-1.5" />
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
          <span>{t('footer.copyright')}</span>
          <BeianNotice lang={lang} />
        </div>
      </div>
    </footer>
  );
}
