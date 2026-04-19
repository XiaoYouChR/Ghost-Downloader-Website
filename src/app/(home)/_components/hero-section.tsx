import { motion } from 'motion/react';
import { cn } from '@/lib/cn';
import type { HomeCopy } from '@/lib/home-i18n';
import { BrowserFlow } from './browser-flow';
import { GhostMascot } from './ghost-mascot';
import styles from './home.module.css';

type HeroSectionProps = {
  copy: HomeCopy['hero'];
  lang: string;
};

export function HeroSection({ copy, lang }: HeroSectionProps) {
  return (
    <section
      className={cn(
        styles.heroSection,
        styles.bgMesh,
        'relative flex flex-col items-center justify-center overflow-hidden px-6 pb-20'
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 -left-20 h-[40rem] w-[40rem] rounded-full bg-blue-300/30 blur-[150px] dark:bg-blue-600/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-1/4 h-[30rem] w-[30rem] translate-x-1/4 rounded-full bg-indigo-300/30 blur-[120px] dark:bg-indigo-600/10"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="z-10 mb-12 max-w-4xl text-center"
      >
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
          <div className="h-1 w-1 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.6)] dark:bg-blue-400 dark:shadow-[0_0_5px_rgba(96,165,250,0.8)]" />
          {copy.badge}
        </div>

        <h1
          className={cn(
            styles.display,
            'mb-8 text-6xl leading-[0.9] font-bold tracking-tight text-slate-900 dark:text-white md:text-8xl'
          )}
        >
          {copy.title.line1} <br />
          {copy.title.line2}
        </h1>

        <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed font-medium text-slate-600 dark:text-slate-400 md:text-xl">
          {copy.description}
        </p>

        <div className="mb-24 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#downloads"
            className="rounded-2xl border border-blue-500/50 bg-blue-600 px-8 py-4 font-semibold text-white shadow-[0_0_20px_rgba(37,99,235,0.2)] transition-all hover:scale-[1.02] hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] active:scale-95 dark:shadow-[0_0_30px_rgba(37,99,235,0.3)] dark:hover:shadow-[0_0_40px_rgba(37,99,235,0.5)]"
          >
            {copy.primaryCta}
          </a>
          <a
            href={`/${lang}/docs`}
            className={cn(
              styles.surfaceCard,
              'rounded-2xl border border-slate-200 bg-white px-8 py-4 font-semibold text-slate-700 transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-[#111827] dark:text-slate-300 dark:hover:bg-[#151D2C]'
            )}
          >
            {copy.secondaryCta}
          </a>
        </div>
      </motion.div>

      <div className="relative mt-12 h-[400px] w-full max-w-6xl">
        <BrowserFlow labels={copy.flowLabels} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-75 md:scale-100">
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-blue-400/10 blur-[50px] dark:bg-blue-500/20"
          />
          <GhostMascot />
        </div>
      </div>
    </section>
  );
}
