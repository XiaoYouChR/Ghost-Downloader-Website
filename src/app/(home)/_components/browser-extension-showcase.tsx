import {
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';
import { motion } from 'motion/react';
import {
  Bell,
  Camera,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  Folder,
  Globe,
  HardDrive,
  Pause,
  RotateCcw,
  Search,
  Send,
  Settings,
  Smartphone,
  Video,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import type { HomeCopy } from '@/lib/home-i18n';
import { GhostMascot } from './ghost-mascot';
import styles from './home.module.css';

type BrowserExtensionShowcaseProps = {
  copy: HomeCopy['browserShowcase'];
};

type ConnectionPath = {
  id: 'snap' | 'storage' | 'edge-sim';
  path: string;
};

export function BrowserExtensionShowcase({
  copy,
}: BrowserExtensionShowcaseProps) {
  const previewAreaRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const snapRef = useRef<HTMLDivElement>(null);
  const storageRef = useRef<HTMLDivElement>(null);
  const edgeSimRef = useRef<HTMLDivElement>(null);
  const [connectionPaths, setConnectionPaths] = useState<ConnectionPath[]>([]);

  useLayoutEffect(() => {
    let animationFrameId = 0;
    let timeoutId = 0;

    const calculatePaths = () => {
      if (!previewAreaRef.current || !panelRef.current) return;

      const containerRect = previewAreaRef.current.getBoundingClientRect();
      const panelRect = panelRef.current.getBoundingClientRect();

      const configs = [
        {
          id: 'snap',
          ref: snapRef,
          getStart: (cardRect: DOMRect) => ({
            x: cardRect.right - containerRect.left - 8,
            y: cardRect.top - containerRect.top + cardRect.height * 0.58,
          }),
          getEnd: () => ({
            x: panelRect.left - containerRect.left + 18,
            y: panelRect.top - containerRect.top + panelRect.height * 0.24,
          }),
          cp1Dx: 90,
          cp1Dy: 8,
          cp2Dx: -70,
          cp2Dy: -22,
        },
        {
          id: 'storage',
          ref: storageRef,
          getStart: (cardRect: DOMRect) => ({
            x: cardRect.left - containerRect.left + 8,
            y: cardRect.top - containerRect.top + cardRect.height * 0.42,
          }),
          getEnd: () => ({
            x: panelRect.right - containerRect.left - 18,
            y: panelRect.top - containerRect.top + panelRect.height * 0.76,
          }),
          cp1Dx: -88,
          cp1Dy: 12,
          cp2Dx: 58,
          cp2Dy: 18,
        },
        {
          id: 'edge-sim',
          ref: edgeSimRef,
          getStart: (cardRect: DOMRect) => ({
            x: cardRect.left - containerRect.left + 8,
            y: cardRect.top - containerRect.top + cardRect.height * 0.56,
          }),
          getEnd: () => ({
            x: panelRect.right - containerRect.left - 18,
            y: panelRect.top - containerRect.top + panelRect.height * 0.32,
          }),
          cp1Dx: -94,
          cp1Dy: -18,
          cp2Dx: 56,
          cp2Dy: -10,
        },
      ] as const;

      const newPaths = configs
        .map((config) => {
          const card = config.ref.current;
          if (!card) return null;

          const cardRect = card.getBoundingClientRect();
          const start = config.getStart(cardRect);
          const end = config.getEnd();
          const cp1 = {
            x: start.x + config.cp1Dx,
            y: start.y + config.cp1Dy,
          };
          const cp2 = {
            x: end.x + config.cp2Dx,
            y: end.y + config.cp2Dy,
          };

          return {
            id: config.id,
            path: `M ${start.x} ${start.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${end.x} ${end.y}`,
          };
        })
        .filter((value): value is ConnectionPath => value !== null);

      setConnectionPaths((currentPaths) =>
        currentPaths.length === newPaths.length &&
        currentPaths.every(
          (path, index) =>
            path.id === newPaths[index]?.id &&
            path.path === newPaths[index]?.path,
        )
          ? currentPaths
          : newPaths,
      );
    };

    const schedulePathCalculation = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(calculatePaths);
    };

    const handleLoad = () => calculatePaths();

    calculatePaths();
    schedulePathCalculation();
    timeoutId = window.setTimeout(calculatePaths, 250);
    window.addEventListener('resize', schedulePathCalculation);
    window.addEventListener('load', handleLoad);
    document.fonts?.ready.then(calculatePaths).catch(() => {});

    const observer =
      typeof ResizeObserver === 'undefined'
        ? undefined
        : new ResizeObserver(schedulePathCalculation);

    for (const element of [
      previewAreaRef.current,
      panelRef.current,
      snapRef.current,
      storageRef.current,
      edgeSimRef.current,
    ]) {
      if (observer && element) {
        observer.observe(element);
      }
    }

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', schedulePathCalculation);
      window.removeEventListener('load', handleLoad);
      observer?.disconnect();
    };
  }, []);

  return (
    <section id="extension" className="relative overflow-hidden bg-transparent py-40">
      <div
        aria-hidden="true"
        className="absolute top-40 -right-20 -z-0 h-[600px] w-[600px] rounded-full bg-blue-600/5 blur-[150px]"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-20 -left-20 -z-0 h-[400px] w-[400px] rounded-full bg-cyan-600/5 blur-[120px]"
      />

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">
        <div className="order-2 space-y-10 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">
              <Zap size={10} fill="currentColor" />
              {copy.badge}
            </div>

            <h2
              className={cn(
                styles.display,
                'text-5xl leading-[0.95] font-bold tracking-tight text-slate-900 dark:text-white md:text-7xl'
              )}
            >
              {copy.title.prefix}{' '}
              <span className="text-blue-600 dark:text-blue-500">
                {copy.title.highlight}
              </span>{' '}
              <br />
              {copy.title.suffix}
            </h2>

            <p className="max-w-md text-lg leading-relaxed font-medium text-slate-600 dark:text-slate-400">
              {copy.description}
            </p>
          </motion.div>

          <div className="relative grid grid-cols-2 gap-4">
            <div
              className={cn(
                styles.surfaceCard,
                'group relative col-span-2 overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 transition-all hover:border-blue-200 dark:border-white/5 dark:bg-linear-to-br dark:from-[#121A2A] dark:to-[#0A0F18] dark:hover:border-white/10'
              )}
            >
              <div className="absolute -top-2 -right-2 p-4 text-blue-500/10 opacity-50 transition-all duration-700 group-hover:scale-110 group-hover:-rotate-6 dark:text-blue-200/10 dark:opacity-60 dark:[filter:drop-shadow(0_0_20px_rgba(96,165,250,0.08))] dark:group-hover:text-blue-100/15 dark:group-hover:opacity-80">
                <GhostIcon size={100} />
              </div>
              <div className="relative z-10 flex items-center gap-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                  <Search size={22} />
                </div>
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <h4 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                      {copy.deepScan.title}
                    </h4>
                    <span className="rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[8px] leading-none font-bold uppercase tracking-widest text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400">
                      {copy.deepScan.badge}
                    </span>
                  </div>
                  <p className="max-w-sm text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {copy.deepScan.description}
                  </p>
                </div>
              </div>
            </div>

            <CompactWidget
              icon={<Smartphone size={18} />}
              title={copy.compactWidgets.mobileSim.title}
              desc={copy.compactWidgets.mobileSim.description}
            />
            <CompactWidget
              icon={<Video size={18} />}
              title={copy.compactWidgets.mediaLab.title}
              desc={copy.compactWidgets.mediaLab.description}
            />

            <div
              className={cn(
                styles.surfaceCard,
                'group relative col-span-2 flex items-center justify-between overflow-hidden rounded-[1.8rem] border border-slate-200 bg-slate-50 px-6 py-4 transition-all hover:border-blue-200 dark:border-white/5 dark:bg-[#0D121C] dark:hover:border-white/10'
              )}
            >
              <div className="absolute inset-0 bg-linear-to-r from-blue-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-blue-500/10" />
              <div className="relative z-10 flex items-center gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-100 text-blue-600 shadow-inner dark:border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400 dark:shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                  <Zap size={16} fill="currentColor" />
                </div>
                <div>
                  <h4 className="text-xs leading-none font-bold tracking-tight text-slate-900 dark:text-white">
                    {copy.compactWidgets.bridgeSync.title}
                  </h4>
                  <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                    {copy.compactWidgets.bridgeSync.description}
                  </p>
                </div>
              </div>
              <div className="relative z-10 flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-[8px] font-bold uppercase tracking-widest text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/5 dark:text-blue-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400 shadow-[0_0_5px_rgba(96,165,250,0.8)]" />
                {copy.compactWidgets.bridgeSync.status}
              </div>
            </div>
          </div>
        </div>

        <div
          ref={previewAreaRef}
          className="relative order-1 flex h-[650px] items-center justify-center lg:order-2"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 opacity-60 dark:opacity-30">
            <TabWireframe
              width="w-3/4"
              offset="-translate-x-12"
              color="bg-slate-200 dark:bg-[#1e293b]"
              border="border-slate-300 dark:border-white/5"
            />
            <TabWireframe
              width="w-2/3"
              offset="translate-x-8"
              color="bg-slate-300 dark:bg-[#0f172a]"
              border="border-slate-400 dark:border-white/5"
            />
            <TabWireframe
              width="w-4/5"
              offset="-translate-x-4"
              color="bg-blue-100 dark:bg-blue-500/10"
              border="border-blue-200 dark:border-blue-500/10"
            />
          </div>

          <div className="absolute top-1/4 -right-12 -z-10 rotate-12 scale-50 opacity-40 md:-right-14 md:scale-75">
            <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-[40px]" />
            <GhostMascot />
          </div>

          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              styles.panelShell,
              'relative z-20 w-full max-w-[380px] overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white/95 backdrop-blur-xl dark:border-white/10 dark:bg-[#0A0E17]/95'
            )}
          >
            <div className="flex gap-2 border-b border-slate-100 bg-slate-50 px-4 py-4 dark:border-white/5 dark:bg-[#111827]">
              <NavTab label={copy.panel.tabs.downloads} active icon={<Download size={14} />} />
              <NavTab label={copy.panel.tabs.sniffer} icon={<Globe size={14} />} />
              <NavTab label={copy.panel.tabs.advanced} icon={<Wrench size={14} />} />
              <div className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 dark:border-white/5 dark:bg-[#1F2937] dark:text-slate-400">
                <Settings size={14} />
              </div>
            </div>

            <div className="flex items-center justify-between bg-white px-5 py-3 dark:bg-[#070A10]">
              <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-emerald-600 shadow-sm dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                <CheckCircle2 size={12} strokeWidth={3} />
                <span className="text-[10px] font-bold">{copy.panel.connected}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {copy.panel.interceptDownloads}
                </span>
                <div className="relative h-5 w-10 cursor-pointer rounded-full border border-blue-400/30 bg-blue-600 p-1 shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                  <div className="absolute top-1 right-1 h-3 w-3 rounded-full bg-white shadow-sm" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-slate-50 px-5 py-2 dark:bg-[#0B101A]">
              <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                {copy.panel.taskList}
              </span>
            </div>

            <div className="h-[320px] space-y-4 overflow-y-auto bg-slate-50 px-4 py-4 dark:bg-[#0B101A] [&::-webkit-scrollbar]:hidden">
              <TaskCardItem
                copy={copy.panel}
                name="WindowsManager-v2.3.5.exe"
                progress="100%"
                size="10.7 MB"
                completed
              />
              <TaskCardItem
                copy={copy.panel}
                name="QQ_9.9.29_260401_x64_01.exe"
                progress="24%"
                speed="66.1 MB/s"
                size="-- MB"
              />
            </div>

            <div className="border-t border-slate-100 bg-white/90 p-5 backdrop-blur-md dark:border-white/5 dark:bg-[#0D121C]/95">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-500/50 bg-blue-600 py-3.5 font-bold text-white shadow-[0_5px_15px_rgba(37,99,235,0.2)] transition-all hover:scale-[1.02] active:scale-95 dark:shadow-[0_0_25px_rgba(37,99,235,0.3)]"
              >
                <Send size={16} />
                {copy.panel.bridgeAction}
              </button>
              <div className="mt-3 flex justify-center gap-4">
                <p className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                  <CheckCircle2 size={10} className="text-emerald-500/70" />
                  {copy.panel.autoMerge}
                </p>
                <p className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                  <Bell size={10} className="text-blue-500/70" />
                  {copy.panel.syncComplete}
                </p>
              </div>
            </div>
          </motion.div>

          <FloatingCard
            outerRef={snapRef}
            className="top-12 -left-24"
            icon={<Camera className="text-indigo-500" />}
            title={copy.floatingCards.snap.title}
            desc={copy.floatingCards.snap.description}
            delay={0.5}
          />
          <FloatingCard
            outerRef={storageRef}
            className="right-[-5.75rem] bottom-24 md:right-[-6.25rem]"
            icon={<HardDrive size={16} className="text-blue-500" />}
            title={copy.floatingCards.storage.title}
            desc={copy.floatingCards.storage.description}
            delay={0.8}
            reverse
          />
          <FloatingCard
            outerRef={edgeSimRef}
            className="top-32 -right-40"
            icon={<Smartphone className="text-rose-500" />}
            title={copy.floatingCards.edgeSim.title}
            desc={copy.floatingCards.edgeSim.description}
            delay={1.2}
            reverse
          />

          <svg className="pointer-events-none absolute inset-0 -z-10 h-full w-full">
            <defs>
              <filter
                id="ghost-extension-link-glow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {connectionPaths.map((connection, index) => (
              <g key={connection.id}>
                <path
                  d={connection.path}
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="1.25"
                  strokeDasharray="4 6"
                  opacity="0.3"
                />
                <circle
                  r="2.75"
                  fill="#93c5fd"
                  filter="url(#ghost-extension-link-glow)"
                >
                  <animateMotion
                    path={connection.path}
                    dur={`${3.4 + index * 0.45}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}

function TabWireframe({
  width,
  offset,
  color,
  border,
}: {
  width: string;
  offset: string;
  color: string;
  border: string;
}) {
  return (
    <div
      className={`${width} ${offset} ${color} ${border} flex h-12 items-center gap-4 rounded-2xl border px-4 shadow-sm backdrop-blur-md`}
    >
      <div className="h-3 w-3 rounded-full bg-slate-400/50 dark:bg-slate-600/50" />
      <div className="h-2 w-1/3 rounded-full bg-slate-400/50 dark:bg-slate-600/50" />
    </div>
  );
}

function NavTab({
  label,
  icon,
  active = false,
}: {
  label: string;
  icon: ReactNode;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold transition-all ${
        active
          ? 'border-blue-200 bg-blue-50 text-blue-600 shadow-sm dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:shadow-[0_0_10px_rgba(37,99,235,0.1)]'
          : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
      }`}
    >
      <span>{icon}</span>
      <span className="whitespace-nowrap">{label}</span>
    </div>
  );
}

function TaskCardItem({
  copy,
  name,
  progress,
  size,
  speed,
  completed = false,
}: {
  copy: HomeCopy['browserShowcase']['panel'];
  name: string;
  progress: string;
  size: string;
  speed?: string;
  completed?: boolean;
}) {
  if (completed) {
    return (
      <div
        className={cn(
          styles.taskCard,
          'group rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300 dark:border-white/5 dark:bg-[#131B2A] dark:hover:border-white/10'
        )}
      >
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-blue-500 dark:border-white/5 dark:bg-[#1A2436] dark:text-blue-400">
              <FileText size={18} />
            </div>
            <div className="overflow-hidden">
              <p className="max-w-[180px] truncate text-[13px] font-bold text-slate-900 dark:text-slate-200">
                {name}
              </p>
              <p className="mt-0.5 text-[10px] font-bold text-slate-500">
                <span className="text-slate-400">{copy.completed}</span> &bull; {size}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
            <CheckCircle2 size={10} strokeWidth={3} />
            <span className="text-[9px] font-bold">{copy.completed}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <MiniAction icon={<ExternalLink size={12} />} label={copy.openFile} />
          <MiniAction icon={<Folder size={12} />} label={copy.revealFolder} />
          <button
            type="button"
            className="ml-auto cursor-pointer p-1.5 text-slate-400 transition-colors hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        styles.taskCard,
        'rounded-2xl border border-blue-200 bg-white p-4 dark:border-blue-500/20 dark:bg-[#131B2A]'
      )}
    >
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400">
            <FileText size={18} />
          </div>
          <p className="max-w-[180px] truncate text-[13px] font-bold text-slate-900 dark:text-white">
            {name}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1 rounded-full border border-blue-200 bg-slate-50 px-2.5 py-1 text-blue-600 dark:border-blue-500/20 dark:bg-[#1A2436] dark:text-blue-400">
          <RotateCcw size={10} />
          <span className="text-[9px] font-bold">{copy.downloading}</span>
        </div>
      </div>

      <div className="mt-2 mb-3">
        <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-[#1E293B]">
          <div
            className="h-full rounded-full bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.8)]"
            style={{ width: progress }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-x-2 text-[10px] font-bold text-slate-500">
          <span className="text-blue-600 dark:text-blue-400">{progress}</span>
          <span>{speed}</span>
        </div>
        <div className="flex items-center gap-2">
          <MiniAction icon={<Pause size={12} fill="currentColor" />} label={copy.pause} />
          <button
            type="button"
            className="cursor-pointer px-2 py-1 text-slate-400 transition-colors hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function MiniAction({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <button
      type="button"
      className={cn(
        styles.widgetButton,
        'flex items-center gap-1.5 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 whitespace-nowrap text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
      )}
    >
      <span className="shrink-0 text-slate-500">{icon}</span>
      <span className="text-[9px] font-bold">{label}</span>
    </button>
  );
}

function FloatingCard({
  outerRef,
  className,
  icon,
  title,
  desc,
  delay,
  reverse = false,
}: {
  outerRef?: RefObject<HTMLDivElement | null>;
  className: string;
  icon: ReactNode;
  title: string;
  desc: string;
  delay: number;
  reverse?: boolean;
}) {
  return (
    <motion.div
      ref={outerRef}
      initial={{ opacity: 0, x: reverse ? 30 : -30, y: 10 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={cn(
        styles.floatingCard,
        `absolute ${className} z-30 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#121A2A]/80`
      )}
    >
      <div
        className={cn(
          styles.widgetButton,
          'flex h-10 w-10 items-center justify-center rounded-lg border border-slate-100 bg-slate-50'
        )}
      >
        {icon}
      </div>
      <div>
        <p className="text-[10px] leading-none font-extrabold text-slate-900 dark:text-white">
          {title}
        </p>
        <p className="mt-1 text-[9px] font-bold text-slate-500 dark:text-slate-400">
          {desc}
        </p>
      </div>
    </motion.div>
  );
}

function CompactWidget({
  icon,
  title,
  desc,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div
      className={cn(
        styles.widgetCard,
        'group rounded-[1.8rem] border border-slate-200 bg-white p-5 transition-all hover:border-blue-200 dark:border-white/5 dark:bg-[#101726] dark:hover:border-blue-500/30 dark:hover:bg-[#151D2E]'
      )}
    >
      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-blue-500 transition-all group-hover:bg-blue-50 dark:border-white/5 dark:bg-[#1A2436] dark:text-blue-400 dark:group-hover:border-blue-500/30 dark:group-hover:bg-blue-500/20">
        {icon}
      </div>
      <div>
        <h4 className="mb-1 text-sm font-bold tracking-tight text-slate-900 dark:text-slate-200">
          {title}
        </h4>
        <p className="text-[10px] leading-normal font-medium text-slate-500">{desc}</p>
      </div>
    </div>
  );
}

function GhostIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C8.13 2 5 5.13 5 9V14C5 14.55 4.55 15 4 15H3V17H4.1C4.54 18.7 6.08 20 7.9 20C8.36 20 8.81 19.92 9.22 19.78C10.05 20.54 11.08 21 12.2 21C13.25 21 14.23 20.57 15 19.91C15.7 20.58 16.65 21 17.7 21C19.52 21 21 19.52 21 17.7V9C21 5.13 17.87 2 14 2H12Z"
        fill="currentColor"
      />
      <circle cx="9" cy="9.5" r="1" fill="white" />
      <circle cx="15" cy="9.5" r="1" fill="white" />
    </svg>
  );
}
