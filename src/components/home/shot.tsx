import { cn } from '@/lib/cn';
import { GhostMark } from '@/components/ghost-mark';

type ShotProps = {
  /** Shot number from the production shot list, shown while unshot. */
  id: string;
  /** What this frame will hold, shown while unshot. */
  label: string;
  /** Alt text for the finished screenshot. */
  alt: string;
  /** Light-theme asset path under `public/`. */
  srcLight?: string;
  /** Dark-theme asset path under `public/`. */
  srcDark?: string;
  /** CSS aspect ratio. Forces `object-cover` cropping when set with images. */
  aspect?: string;
  className?: string;
  priority?: boolean;
};

export function Shot({
  id,
  label,
  alt,
  srcLight,
  srcDark,
  aspect,
  className,
  priority = false,
}: ShotProps) {
  const hasImage = srcLight && srcDark;

  if (hasImage) {
    const imgClass = aspect
      ? 'h-full w-full object-cover'
      : 'w-full';

    return (
      <figure
        className={cn('overflow-hidden rounded-lg', className)}
        style={aspect ? { aspectRatio: aspect } : undefined}
      >
        {/* eslint-disable @next/next/no-img-element -- static export, images unoptimized */}
        <img
          src={srcLight}
          alt={alt}
          className={cn(imgClass, 'dark:hidden')}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
        <img
          src={srcDark}
          alt={alt}
          className={cn('hidden', imgClass, 'dark:block')}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
        {/* eslint-enable @next/next/no-img-element */}
      </figure>
    );
  }

  return (
    <figure
      className={cn(
        'relative overflow-hidden rounded-xl border border-edge bg-raised',
        'shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-12px_rgba(0,0,0,0.12)]',
        'dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_24px_48px_-24px_rgba(0,0,0,0.8)]',
        className,
      )}
      style={{ aspectRatio: aspect ?? '16 / 10' }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
        <GhostMark className="h-10 w-10 text-ink-faint/25" />
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase">
            Shot {id}
          </span>
          <span className="max-w-[32ch] text-sm text-ink-faint">{label}</span>
        </div>
      </div>
    </figure>
  );
}
