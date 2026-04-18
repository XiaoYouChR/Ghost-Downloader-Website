import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import {
  Archive,
  Box,
  Cpu,
  Disc,
  ExternalLink,
  FileCode,
  Fingerprint,
  Folder,
  HardDrive,
  Info,
  Link as LinkIcon,
  ListChecks,
  Play,
  Settings,
  X,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import styles from './home.module.css';

export function ProtocolShowcase() {
  return (
    <section
      id="protocols"
      className="border-t border-slate-200/50 bg-slate-50 py-40 dark:border-transparent dark:bg-[#060A10]"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-16 lg:flex-row lg:gap-24">
          <div className="flex-1 space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
                <Cpu size={10} />
                Desktop Core
              </div>
              <h2
                className={cn(
                  styles.display,
                  'text-4xl leading-tight font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl'
                )}
              >
                A Native experience, <br />
                <span className="text-blue-600 dark:text-blue-500">Perfectly at home.</span>
              </h2>
              <p className="max-w-lg text-lg leading-relaxed font-medium text-slate-600 opacity-90 dark:text-slate-400 dark:opacity-80">
                Ghost Downloader isn&apos;t just a background service. It&apos;s a
                high-performance desktop hub designed for clarity and absolute
                performance.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pb-8">
              <div
                className={cn(
                  styles.surfaceCard,
                  'group relative col-span-2 overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 transition-colors hover:border-slate-300 dark:border-white/5 dark:bg-linear-to-br dark:from-[#121A2A] dark:to-[#0A0F18] dark:hover:border-white/10'
                )}
              >
                <div className="absolute -top-2 -right-2 p-6 text-slate-100 opacity-50 transition-transform group-hover:scale-110 dark:text-white dark:opacity-[0.03]">
                  <Cpu size={100} />
                </div>
                <div className="relative z-10 flex items-center gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                    <Cpu size={22} />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <h4 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                        Multi-Thread Engine
                      </h4>
                      <span className="flex h-fit items-center rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[8px] leading-none font-bold uppercase tracking-widest text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400">
                        Core
                      </span>
                    </div>
                    <p className="max-w-[200px] text-xs leading-normal text-slate-500 dark:text-slate-400">
                      Dynamic thread allocation for up to 32 parallel chunks per
                      resource.
                    </p>
                  </div>
                </div>
              </div>

              <CapabilityTile icon={<HardDrive size={16} />} title="Smart Write" badge="H-Disk" />
              <CapabilityTile icon={<Fingerprint size={16} />} title="Identity" badge="SSL" />
              <CapabilityTile icon={<ListChecks size={16} />} title="Scheduler" badge="Tasks" />
              <CapabilityTile icon={<LinkIcon size={16} />} title="Remote" badge="API" />
            </div>
          </div>

          <div className="w-full flex-1 space-y-3">
            <TaskRow
              name="WindowsManager-v2.3.5.exe"
              type="exe"
              status="Task Completed"
              iconColor="bg-blue-600"
            />
            <TaskRow
              name="FlClash-0.8.90-windows-amd64-setup.exe"
              type="exe"
              status="Task Completed"
              iconColor="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10"
              iconInnerColor="text-blue-600 dark:text-blue-400"
            />
            <TaskRow
              name="WebPShop_0_4_3_Win_x64.8bi"
              type="plugin"
              status="Task Completed"
              iconColor="bg-slate-200 dark:bg-slate-900"
              iconInnerColor="text-slate-700 dark:text-white"
            />
            <TaskRow
              name="eudic_win.zip"
              type="zip"
              status="Task Completed"
              iconColor="bg-blue-600"
            />
            <TaskRow
              name="Win10_22H2_English_x64v1.iso"
              type="iso"
              status="Task Completed"
              iconColor="bg-red-500/90"
            />
            <TaskRow
              name="EasyCLI-v0.1.32-windows-x64.zip"
              type="zip"
              status="Task Completed"
              iconColor="bg-blue-600"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function CapabilityTile({
  icon,
  title,
  badge,
}: {
  icon: ReactNode;
  title: string;
  badge: string;
}) {
  return (
    <div
      className={cn(
        styles.widgetCard,
        'group flex items-center gap-3 rounded-[1.25rem] border border-slate-200 bg-white px-4 py-2.5 transition-all hover:border-blue-200 hover:bg-slate-50 dark:border-white/5 dark:bg-[#101726] dark:hover:border-blue-500/30 dark:hover:bg-[#151D2E]'
      )}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 text-slate-500 transition-all group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600 dark:border-white/5 dark:bg-[#1A2436] dark:text-slate-400 dark:group-hover:border-blue-500/30 dark:group-hover:bg-blue-500/20 dark:group-hover:text-blue-400">
        {icon}
      </div>
      <div className="overflow-hidden">
        <h4 className="mb-0.5 truncate text-[10px] leading-tight font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
          {title}
        </h4>
        <span className="block text-[8px] leading-none font-bold uppercase tracking-widest text-blue-500 dark:text-blue-400/80">
          {badge}
        </span>
      </div>
    </div>
  );
}

function TaskRow({
  name,
  status,
  type,
  iconColor,
  iconInnerColor = 'text-white',
}: {
  name: string;
  status: string;
  type: 'exe' | 'zip' | 'iso' | 'plugin';
  iconColor: string;
  iconInnerColor?: string;
}) {
  const icon =
    type === 'exe' ? (
      <Settings size={22} className={iconInnerColor} strokeWidth={2.5} />
    ) : type === 'zip' ? (
      <Archive size={22} className={iconInnerColor} strokeWidth={2.5} />
    ) : type === 'iso' ? (
      <Disc size={22} className={iconInnerColor} strokeWidth={2.5} />
    ) : (
      <Box size={22} className={iconInnerColor} strokeWidth={2.5} />
    );

  const badge = type === 'zip' ? 'ZIP' : type === 'iso' ? 'ISO' : type === 'plugin' ? 'PLUGIN' : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={cn(
        styles.taskCard,
        'group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3 transition-all hover:border-slate-300 dark:border-white/5 dark:bg-[#111826] dark:hover:border-white/10'
      )}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className={`flex h-12 w-12 items-center justify-center rounded-lg shadow-sm ${iconColor}`}>
            {icon}
          </div>
          {badge ? (
            <div className="absolute -right-1.5 -bottom-1.5 rounded border border-slate-200 bg-slate-100 px-1 text-[8px] font-bold text-slate-600 ring-2 ring-white dark:border-transparent dark:bg-[#1A2436] dark:text-white dark:ring-[#111826]">
              {badge}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col">
          <p className="mb-0.5 text-sm font-bold tracking-tight text-slate-900 dark:text-slate-200">
            {name}
          </p>
          <div className="flex items-center gap-1.5 text-slate-500">
            <Info size={12} strokeWidth={3} />
            <span className="text-[11px] font-semibold">{status}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 opacity-0 transition-opacity md:opacity-40 group-hover:opacity-100">
        <ActionButton icon={<Play size={14} fill="currentColor" />} />
        <ActionButton icon={<Fingerprint size={14} />} />
        <ActionButton icon={<ExternalLink size={14} />} />
        <ActionButton icon={<Folder size={14} />} />
        <ActionButton icon={<X size={14} />} />
      </div>
    </motion.div>
  );
}

function ActionButton({ icon }: { icon: ReactNode }) {
  return (
    <button
      type="button"
      className={cn(
        styles.widgetButton,
        'flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
      )}
    >
      {icon}
    </button>
  );
}
