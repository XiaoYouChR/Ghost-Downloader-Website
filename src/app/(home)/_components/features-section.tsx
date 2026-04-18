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
import styles from './home.module.css';

const features = [
  {
    title: 'The Sniffer',
    desc: 'Intelligent resource detection across all active tabs, identifying HLS, DASH, and dynamic streams.',
    icon: Radar,
    iconColor: 'text-slate-500',
    theme: 'dark',
    span: 'col-span-1 md:col-span-2',
  },
  {
    title: 'Bilibili Engine',
    desc: 'Direct video & audio parsing.',
    icon: PlayCircle,
    iconColor: 'text-pink-500',
    theme: 'light',
    span: 'col-span-1 md:col-span-1',
  },
  {
    title: 'HLS / DASH / m3u8',
    desc: 'Live stream segment parallelization.',
    icon: Network,
    iconColor: 'text-indigo-500',
    theme: 'light',
    span: 'col-span-1 md:col-span-1',
  },
  {
    title: 'HTTP Smart Write',
    desc: 'Direct-to-disk chunk writing to save memory and SSD lifespan.',
    icon: HardDrive,
    iconColor: 'text-cyan-500',
    theme: 'light',
    span: 'col-span-1 md:col-span-2',
  },
  {
    title: 'FTP / FTPS',
    desc: 'Secure legacy file transfers.',
    icon: CloudDownload,
    iconColor: 'text-blue-500',
    theme: 'light',
    span: 'col-span-1 md:col-span-1',
  },
  {
    title: 'GitHub Accel',
    desc: 'Bypass regional blockades for release downloads.',
    icon: GitBranch,
    iconColor: 'text-slate-700 dark:text-slate-300',
    theme: 'light',
    span: 'col-span-1 md:col-span-2',
  },
] as const;

export function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-32">
      <div className="mb-24 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
          <Radar size={10} />
          Engineered for Perfection
        </div>
        <p
          className={cn(
            styles.display,
            'text-4xl leading-tight font-bold text-slate-900 dark:text-white md:text-5xl'
          )}
        >
          Invisible Infrastructure. <br />
          <span className="text-blue-600 dark:text-blue-500">Visible Performance.</span>
        </p>
      </div>

      <div className="grid auto-rows-[220px] grid-cols-1 gap-6 md:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <motion.div
              key={feature.title}
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
                  {feature.title}
                </h3>
                <p
                  className={cn(
                    'text-[0.95rem] leading-relaxed text-slate-500 dark:text-slate-400',
                    feature.theme === 'dark' && 'text-slate-400'
                  )}
                >
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
