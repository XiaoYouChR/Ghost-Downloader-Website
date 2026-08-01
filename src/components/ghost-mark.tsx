import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';

/**
 * The mark's geometry, in a 24×24 box. Exported because the hero draws the same
 * outline at display scale, and `public/brand/ghost-mask.svg` carries a copy for
 * use as a CSS mask — all three must stay identical.
 *
 * Body spans x 5→21 (plus an arm reaching to x=3 at hip height) and y 2→21. The
 * eyes sit at y 9.5, just under 40% of the way down.
 */
export const GHOST_PATH =
  'M12 2C8.13 2 5 5.13 5 9V14C5 14.55 4.55 15 4 15H3V17H4.1C4.54 18.7 6.08 20 7.9 20C8.36 20 8.81 19.92 9.22 19.78C10.05 20.54 11.08 21 12.2 21C13.25 21 14.23 20.57 15 19.91C15.7 20.58 16.65 21 17.7 21C19.52 21 21 19.52 21 17.7V9C21 5.13 17.87 2 14 2H12ZM8 9.5a1 1 0 1 0 2 0a1 1 0 1 0-2 0ZM14 9.5a1 1 0 1 0 2 0a1 1 0 1 0-2 0Z';

/**
 * The Ghost Downloader brand mark used across the site.
 *
 * One path with cutout eyes, so it needs a single colour and reads on any
 * background. Distinct from the application icon, which keeps its own
 * rounded, dimensional look in docks and app stores.
 */
export function GhostMark({
  className,
  ...props
}: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn('shrink-0', className)}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="currentColor"
        d={GHOST_PATH}
      />
    </svg>
  );
}
