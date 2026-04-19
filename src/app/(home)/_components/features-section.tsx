import { motion } from 'motion/react';
import {
  CloudDownload,
  GitBranch,
  HardDrive,
  Network,
  PlayCircle,
  Radar,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import type { HomeCopy } from '@/lib/home-i18n';
import styles from './home.module.css';

const features = [
  {
    id: 'sniffer',
    icon: Radar,
    iconColor: 'text-slate-500',
    theme: 'dark',
    span: 'col-span-1 md:col-span-2',
  },
  {
    id: 'bilibiliEngine',
    icon: PlayCircle,
    iconColor: 'text-pink-500',
    theme: 'light',
    span: 'col-span-1 md:col-span-1',
  },
  {
    id: 'hlsDash',
    icon: Network,
    iconColor: 'text-indigo-500',
    theme: 'light',
    span: 'col-span-1 md:col-span-1',
  },
  {
    id: 'httpSmartWrite',
    icon: HardDrive,
    iconColor: 'text-cyan-500',
    theme: 'light',
    span: 'col-span-1 md:col-span-2',
  },
  {
    id: 'ftpFtps',
    icon: CloudDownload,
    iconColor: 'text-blue-500',
    theme: 'light',
    span: 'col-span-1 md:col-span-1',
  },
  {
    id: 'githubAccel',
    icon: GitBranch,
    iconColor: 'text-slate-700 dark:text-slate-300',
    theme: 'light',
    span: 'col-span-1 md:col-span-2',
  },
] as const satisfies ReadonlyArray<{
  id: keyof HomeCopy['features']['items'];
  icon: typeof Radar;
  iconColor: string;
  theme: 'dark' | 'light';
  span: string;
}>;

type FeaturesSectionProps = {
  copy: HomeCopy['features'];
};

export function FeaturesSection({ copy }: FeaturesSectionProps) {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-32">
      <div className="mb-24 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
          <Radar size={10} />
          {copy.badge}
        </div>
        <p
          className={cn(
            styles.display,
            'text-4xl leading-tight font-bold text-slate-900 dark:text-white md:text-5xl'
          )}
        >
          {copy.title.line1} <br />
          <span className="text-blue-600 dark:text-blue-500">{copy.title.highlight}</span>
        </p>
      </div>

      <div className="grid auto-rows-[220px] grid-cols-1 gap-6 md:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const itemCopy = copy.items[feature.id];

          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              className={cn(
                styles.surfaceCard,
                'group relative flex cursor-default flex-col justify-between overflow-hidden rounded-[2rem] p-8 transition-all',
                feature.span,
                feature.theme === 'dark'
                  ? 'border-transparent bg-slate-900 text-white dark:bg-[#111827]'
                  : 'border border-slate-200 bg-white text-slate-900 hover:border-slate-300 dark:border-white/5 dark:bg-[#111827] dark:text-white dark:hover:border-white/10 dark:hover:bg-[#151D2C]'
              )}
            >
              <Icon
                className={cn(
                  'pointer-events-none absolute top-1/2 -right-8 h-64 w-64 -translate-y-1/2 transition-colors',
                  feature.theme === 'dark'
                    ? 'text-white/5 group-hover:text-white/10'
                    : 'text-slate-900/[0.02] group-hover:text-slate-900/[0.04] dark:text-white/[0.02] dark:group-hover:text-white/[0.04]'
                )}
              />

              <div
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-105',
                  feature.theme === 'dark'
                    ? 'border border-white/5 bg-[#1A2436]'
                    : 'border border-slate-100 bg-slate-50 dark:border-white/5 dark:bg-[#1A2436]'
                )}
              >
                <Icon className={feature.iconColor} strokeWidth={1.5} size={22} />
              </div>

              <div className="relative z-10">
                <h3
                  className={cn(
                    'mb-1.5 text-[1.15rem] font-bold text-slate-900 dark:text-white',
                    feature.theme === 'dark' && 'text-white'
                  )}
                >
                  {itemCopy.title}
                </h3>
                <p
                  className={cn(
                    'text-[0.95rem] leading-relaxed text-slate-500 dark:text-slate-400',
                    feature.theme === 'dark' && 'text-slate-400'
                  )}
                >
                  {itemCopy.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
