'use client';

import { useEffect, useState, type ComponentProps, type ReactNode } from 'react';
import Link from 'fumadocs-core/link';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from 'fumadocs-ui/components/ui/navigation-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'fumadocs-ui/components/ui/popover';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import { useHomeLayout } from 'fumadocs-ui/layouts/home';
import { ArrowDownToLine, ChevronDown, Languages } from 'lucide-react';
import { cn } from '@/lib/cn';
import { createTranslator, type Translate } from '@/lib/copy';
import { i18n } from '@/lib/i18n';
import { MdiIcon, type MdiIconName } from '@/lib/icons';
import { externalLinks, gitConfig, repoUrl } from '@/lib/shared';
import { getLocalizedPath } from '@/lib/site-metadata';
import { githubStars } from '@/lib/stars.generated';

import { GithubMark } from '@/components/github-mark';

/**
 * The home page's top bar, passed to `HomeLayout` as `slots.header`.
 *
 * Two groups, and only one of them ever collapses:
 *
 * - **The links never do.** Docs, Blog and Community are the site's navigation;
 *   burying them behind a tap on a phone is what makes a bar feel empty.
 * - **The actions collapse together, into one row.** Below 768px the star
 *   count, language select and download button move into a single right-aligned
 *   row in the sheet — the same three controls in the same order, not a stacked
 *   list.
 *
 * fumadocs' own `Header` does the reverse (links hide at `sm`, actions at `lg`,
 * and between the two it shows both a full nav and a hamburger), and hardcodes
 * all three breakpoints in className strings with no prop to change them. Hence
 * this file rather than a `#nd-nav` override in `global.css`.
 */
export function SiteHeader(props: ComponentProps<'header'>) {
  const { slots } = useHomeLayout();
  const { locale = i18n.defaultLanguage } = useI18n();
  const t = createTranslator(locale);
  const [openMenu, setOpenMenu] = useState('');

  const actions = (
    <>
      <GithubStars t={t} />
      {slots.languageSelect && (
        <slots.languageSelect.root className={cn(chip, 'me-1 w-8 px-0')}>
          <Languages className="size-4" />
        </slots.languageSelect.root>
      )}
      <a href="#download" className={action}>
        <ArrowDownToLine className="size-4 shrink-0" aria-hidden />
        {t('nav.download')}
      </a>
    </>
  );

  return (
    <NavigationMenu value={openMenu} onValueChange={setOpenMenu} asChild>
      <header
        {...props}
        id="nd-nav"
        className={cn('sticky top-0 z-40 h-14', props.className)}
      >
        {/* The frosted shell. `global.css` styles `#nd-nav > div` for the
            gradient, border and shadow, but the blur has to be a utility —
            written as a declaration there it gets stripped from the build. */}
        <div className="backdrop-blur-[22px] backdrop-saturate-[1.65]">
          <NavigationMenuList
            asChild
            className="flex h-14 w-full items-center gap-1.5 px-[0.55rem] md:px-[0.85rem]"
          >
            <nav>
              {slots.navTitle && (
                <slots.navTitle className="inline-flex shrink-0 items-center gap-[0.7rem] px-3 py-[0.55rem] font-semibold md:px-[0.9rem]" />
              )}

              <ul className="flex shrink-0 flex-row items-center gap-1.5">
                <li>
                  <BarLink href={getLocalizedPath(locale, '/docs/')}>
                    {t('nav.docs')}
                  </BarLink>
                </li>
                <li>
                  <BarLink href={externalLinks.blog} external>
                    {t('nav.blog')}
                  </BarLink>
                </li>
                <li>
                  <CommunityMenu t={t} />
                </li>
              </ul>

              <div className="ms-auto flex shrink-0 flex-row items-center gap-2 max-sm:hidden">
                {actions}
              </div>

              <NavigationMenuItem asChild className="ms-auto shrink-0 sm:hidden">
                <div>
                  <NavigationMenuTrigger
                    aria-label={t('nav.menu')}
                    className={cn(chip, 'group flex w-8 px-0')}
                  >
                    <ChevronDown className="size-5 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="flex flex-row items-center justify-end gap-2 p-3">
                    {actions}
                  </NavigationMenuContent>
                </div>
              </NavigationMenuItem>
            </nav>
          </NavigationMenuList>
          <NavigationMenuViewport />
        </div>
      </header>
    </NavigationMenu>
  );
}

/** Shared box for every control in the bar: 32px tall, same radius and focus ring. */
const control = cn(
  'inline-flex h-8 items-center justify-center gap-1.5 rounded-lg text-sm',
  'transition-colors',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
);

/** Neutral chip with the nav's own CSS-variable border and background. */
const chip = cn(
  control,
  'px-2.5 border border-[var(--ghost-nav-chip-border)] text-ink-muted',
  'bg-[var(--ghost-nav-chip-background)]',
  'hover:border-[var(--ghost-nav-chip-hover-border)] hover:text-ink',
  'hover:bg-[var(--ghost-nav-chip-hover-background)]',
);

/** Tighter chip for the GitHub badge — the standard 10px reads wide here. */
const compactChip = cn(chip, 'px-1.5');

/** Filled accent button. `border-transparent` matches the chips' 1px border. */
const action = cn(
  control,
  'px-1.5 border border-transparent bg-accent font-medium text-accent-contrast',
  'hover:bg-accent-hover',
);

function BarLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: ReactNode;
}) {
  return (
    <Link href={href} external={external} className={chip}>
      {children}
    </Link>
  );
}

const community = [
  {
    icon: 'discord',
    url: externalLinks.discord,
    text: 'nav.community.discord',
    body: 'nav.community.discordBody',
  },
  {
    icon: 'qq',
    url: externalLinks.qq,
    text: 'nav.community.qq',
    body: 'nav.community.qqBody',
  },
] as const satisfies ReadonlyArray<{
  icon: MdiIconName;
  url: string;
  text: string;
  body: string;
}>;

/**
 * A `Popover`, not a `NavigationMenuContent`: fumadocs renders nav menus into a
 * viewport that spans the whole bar, which is a mega-menu — right for a grid of
 * product links, absurd for two chat invites. A popover anchors under its
 * trigger and is sized by its contents, so nothing has to cap it.
 */
function CommunityMenu({ t }: { t: Translate }) {
  return (
    <Popover>
      <PopoverTrigger className={cn(chip, 'group')}>
        {t('nav.community')}
        <ChevronDown className="size-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </PopoverTrigger>
      <PopoverContent align="start" className="flex w-64 flex-col gap-1 p-1.5">
        {community.map((item) => (
          <Link
            key={item.url}
            href={item.url}
            external
            className="flex items-start gap-2.5 rounded-lg p-2 transition-colors hover:bg-raised"
          >
            <MdiIcon name={item.icon} className="mt-0.5 size-4 text-ink-muted" />
            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-ink">
                {t(item.text)}
              </span>
              <span className="text-xs leading-snug text-ink-muted">
                {t(item.body)}
              </span>
            </span>
          </Link>
        ))}
      </PopoverContent>
    </Popover>
  );
}

/** 7787 → `7.8k`. Keeps the pill a stable width as the count creeps up. */
function formatStars(count: number) {
  return count >= 1000 ? `${(count / 1000).toFixed(1)}k` : String(count);
}

/**
 * GitHub mark plus the live star count.
 *
 * `output: 'export'` means no server renders this per request, so the number is
 * baked at build time by `scripts/gen-stars.mjs` and refreshed here once the
 * page is interactive — fetching only in the browser would leave the bar
 * reflowing on every load. api.github.com allows 60 unauthenticated requests an
 * hour per IP and sends `access-control-allow-origin: *`; a throttled or failed
 * request just leaves the baked number in place.
 */
function GithubStars({ t }: { t: Translate }) {
  const [count, setCount] = useState(githubStars);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`https://api.github.com/repos/${gitConfig.user}/${gitConfig.repo}`, {
      signal: controller.signal,
      headers: { accept: 'application/vnd.github+json' },
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { stargazers_count?: number } | null) => {
        if (typeof data?.stargazers_count === 'number') {
          setCount(data.stargazers_count);
        }
      })
      .catch(() => {
        // Offline, rate limited, or blocked — the baked count still stands.
      });

    return () => controller.abort();
  }, []);

  return (
    <Link
      href={repoUrl}
      external
      className={compactChip}
      aria-label={`${t('nav.community.github')} — ${count} ${t('nav.stars')}`}
    >
      <GithubMark className="size-4" />
      <span className="tabular-nums">{formatStars(count)}</span>
    </Link>
  );
}
