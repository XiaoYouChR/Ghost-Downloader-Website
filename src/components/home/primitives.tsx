import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

/** Consistent vertical rhythm and gutter for every band on the page. */
export function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn('px-5 py-24 sm:px-8 md:py-32', className)}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

type HeadingProps = {
  children: ReactNode;
  className?: string;
};

/** Band headline. Tight tracking is what gives the type its confidence. */
export function SectionTitle({ children, className }: HeadingProps) {
  return (
    <h2
      className={cn(
        'font-display text-[2rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance text-ink sm:text-5xl',
        className,
      )}
    >
      {children}
    </h2>
  );
}

/** Supporting paragraph under a section title. */
export function SectionBody({ children, className }: HeadingProps) {
  return (
    <p
      className={cn(
        'max-w-[52ch] text-base leading-relaxed text-ink-muted sm:text-lg',
        className,
      )}
    >
      {children}
    </p>
  );
}

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

/**
 * Filled call to action. One per viewport, at most.
 *
 * The transparent border is not decoration: `secondaryAction` is outlined, so
 * without a matching border this button is 2px shorter. A flex row hides that
 * by stretching, but a stacked column (the phone hero) does not.
 */
export const primaryAction = cn(
  'inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3',
  'border border-transparent bg-accent text-accent-contrast font-medium',
  'transition-colors hover:bg-accent-hover',
  focusRing,
);

/** Outlined companion to `primaryAction`. */
export const secondaryAction = cn(
  'inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3',
  'border border-edge-strong bg-surface text-ink font-medium',
  'transition-colors hover:bg-raised',
  focusRing,
);

// The top bar's own filled button lives in `site-header.tsx`, sized off the
// same 32px box as the chips beside it rather than off this file's scale.

export const entrance = {
  initial: { y: 32 },
  whileInView: { y: 0 },
  viewport: { once: true, margin: '-80px' } as const,
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
};

export const entranceDelayed = {
  ...entrance,
  transition: { ...entrance.transition, delay: 0.12 },
};
