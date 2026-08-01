import { cn } from '@/lib/cn';
import { GhostMark } from '@/components/ghost-mark';

type ShotProps = {
  /** Shot number from the production shot list, shown while unshot. */
  id: string;
  /** What this frame will hold, shown while unshot. */
  label: string;
  /** Alt text for the finished screenshot. */
  alt: string;
  /** Path under `public/`. Leave unset until the screenshot exists. */
  src?: string;
  /** CSS aspect ratio, e.g. `16 / 10`. */
  aspect?: string;
  className?: string;
  priority?: boolean;
};

/**
 * A framed product screenshot.
 *
 * Until the real asset lands, this renders a labelled placeholder at the same
 * dimensions, so page rhythm can be judged before the screenshots exist.
 * Dropping in `src` is the only change needed to go live.
 */
export function Shot({
  id,
  label,
  alt,
  src,
  aspect = '16 / 10',
  className,
  priority = false,
}: ShotProps) {
  return (
    <figure
      className={cn(
        'relative overflow-hidden rounded-xl border border-edge bg-raised',
        'shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-12px_rgba(0,0,0,0.12)]',
        'dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_24px_48px_-24px_rgba(0,0,0,0.8)]',
        className,
      )}
      style={{ aspectRatio: aspect }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- static export, images unoptimized
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <GhostMark className="h-10 w-10 text-ink-faint/25" />
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase">
              Shot {id}
            </span>
            <span className="max-w-[32ch] text-sm text-ink-faint">{label}</span>
          </div>
        </div>
      )}
    </figure>
  );
}
