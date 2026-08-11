import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { secondaryAction } from './primitives';
import { ConnectionField, GhostContour } from './connection-field';
import { DownloadCta, type PlatformLabels } from './download-cta';
import { Shot } from './shot';

type HeroCopy = {
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaPlatform: PlatformLabels;
  ctaSecondary: string;
  shotAlt: string;
};

/**
 * The first viewport is one abstract field, and the copy lives inside the ghost
 * it cuts out — so legibility falls out of the composition instead of needing a
 * scrim, and the words land in the band where the field is quietest.
 *
 * No product screenshot up here. That is the reward for scrolling one notch,
 * and it floats on the same speed lines this section ends on, so the two
 * viewports read as one continuous space rather than two pages.
 */
export function Hero({ copy, docsHref }: { copy: HeroCopy; docsHref: string }) {
  return (
    <>
      <section className="gd-hero relative isolate grid min-h-[min(94svh,940px)] place-items-center overflow-hidden px-5 sm:px-8">
        <ConnectionField variant="hero" />
        <GhostContour />

        <div className="gd-hero__copy relative flex w-full max-w-[34rem] flex-col items-center text-center">
          {/* Capped at 3.5rem so "The only downloader" stays on one line at the
              copy's measure. A step larger breaks it three ways, which both
              spoils the rhythm and pushes the buttons onto the ghost's hem. */}
          <h1 className="gd-headline font-display text-[clamp(2.25rem,4.2vw,3.5rem)] leading-[0.98] font-bold tracking-[-0.04em] text-balance text-ink">
            {copy.title}
          </h1>

          <p className="mt-6 text-[0.9375rem] leading-relaxed text-pretty text-ink-muted sm:text-lg">
            {copy.subtitle}
          </p>

          {/* Side by side from `sm` up. On a phone they stack full width: once
              the primary names the platform, "Download for Android" alone is
              230px and "View on GitHub" 178px, which cannot share a 350px row
              at any gap. Stacking costs ~60px of the silhouette's copy budget,
              so it is spent deliberately — matched widths read as a decision,
              two ragged centred pills read as an accident. */}
          {/* No width or alignment classes on the children: flex's default
              `stretch` fills the row in column direction and matches heights in
              row direction, which is what keeps the bordered secondary button
              level with the borderless primary one. */}
          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center">
            <DownloadCta
              href="#download"
              fallback={copy.ctaPrimary}
              labels={copy.ctaPlatform}
            />
            <Link href={docsHref} className={secondaryAction}>
              <BookOpen className="h-4 w-4" />
              {copy.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      {/* The second beat: the product itself, floating on the speed lines the
          hero ends on. No heading — it needs no introduction. */}
      <section className="relative isolate overflow-hidden px-5 pt-4 pb-24 sm:px-8 md:pb-32">
        <ConnectionField variant="trail" className="opacity-30" />
        <div className="relative mx-auto w-full max-w-5xl">
          <Shot
            id="01"
            label="Desktop app: mixed task states across several protocols"
            alt={copy.shotAlt}
            srcLight="/shots/light/shot-01.webp"
            srcDark="/shots/dark/shot-01.webp"
            priority
          />
        </div>
      </section>
    </>
  );
}
