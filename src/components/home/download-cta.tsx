'use client';

import { useSyncExternalStore } from 'react';
import { ArrowDownToLine } from 'lucide-react';
import { cn } from '@/lib/cn';
import { detectPlatform, type Platform } from '@/lib/platform';
import { primaryAction } from './primitives';

// The platform never changes under us, so there is nothing to subscribe to.
// `useSyncExternalStore` is still the right tool: it is how React reads a
// client-only value without a hydration mismatch, and it is already the
// pattern `locale-banner.tsx` uses to read `navigator.languages`.
const subscribe = () => () => {};
const clientSnapshot = () => detectPlatform();
const serverSnapshot = () => null;

export type PlatformLabels = Record<Platform, string>;

type DownloadCtaProps = {
  href: string;
  /** Shown in the static HTML and to anyone we cannot place. Must stand alone. */
  fallback: string;
  labels: PlatformLabels;
  className?: string;
};

/**
 * The hero's primary call to action, naming the visitor's platform.
 *
 * A static export cannot know the platform at build time, so the label can only
 * be resolved after hydration — see `docs/adr/0001-*`. Every candidate label is
 * rendered into the same grid cell and all but one is `visibility: hidden`, so
 * the track sizes itself to the widest and the swap moves nothing. That also
 * keeps the reservation honest for free: it follows the copy, in whichever
 * locale, instead of a hardcoded width that rots the next time a label changes.
 *
 * `visibility: hidden` (not `display: none`) is what reserves the space, and it
 * also drops the inactive labels out of the accessibility tree, so no
 * `aria-hidden` is needed.
 */
export function DownloadCta({
  href,
  fallback,
  labels,
  className,
}: DownloadCtaProps) {
  const platform = useSyncExternalStore(
    subscribe,
    clientSnapshot,
    serverSnapshot,
  );

  const active = platform ? labels[platform] : fallback;
  const candidates = [fallback, ...Object.values(labels)];

  return (
    <a href={href} className={cn(primaryAction, className)}>
      <ArrowDownToLine className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="grid">
        {candidates.map((label, i) => (
          <span
            key={i}
            className={cn(
              'col-start-1 row-start-1 whitespace-nowrap',
              label !== active && 'invisible',
            )}
          >
            {label}
          </span>
        ))}
      </span>
    </a>
  );
}
