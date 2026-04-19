import { useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { motion } from 'motion/react';
import {
  AppWindow,
  FileVideo,
  HardDrive,
  Layout,
  Music,
  Paperclip,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import type { HomeCopy } from '@/lib/home-i18n';
import styles from './home.module.css';

type BrowserFlowProps = {
  labels: HomeCopy['hero']['flowLabels'];
};

export function BrowserFlow({ labels }: BrowserFlowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  const rightRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  const [paths, setPaths] = useState<string[]>([]);

  useLayoutEffect(() => {
    let animationFrameId = 0;
    let isAnimating = true;

    const calculatePaths = () => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newPaths = leftRefs
        .map((leftRef, index) => {
          const rightRef = rightRefs[index];
          if (!leftRef.current || !rightRef.current) return '';

          const leftRect = leftRef.current.getBoundingClientRect();
          const rightRect = rightRef.current.getBoundingClientRect();
          const x1 = leftRect.left + leftRect.width / 2 - containerRect.left;
          const y1 = leftRect.top + leftRect.height / 2 - containerRect.top;
          const x2 = rightRect.left + rightRect.width / 2 - containerRect.left;
          const y2 = rightRect.top + rightRect.height / 2 - containerRect.top;
          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2 + (index === 1 ? 20 : -20);

          return `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;
        })
        .filter(Boolean);

      setPaths(newPaths);
    };

    calculatePaths();
    window.addEventListener('resize', calculatePaths);

    const observer =
      typeof ResizeObserver === 'undefined'
        ? undefined
        : new ResizeObserver(calculatePaths);

    if (observer && containerRef.current) {
      observer.observe(containerRef.current);
    }

    const startTime = Date.now();
    const updateLoop = () => {
      if (!isAnimating) return;

      calculatePaths();
      if (Date.now() - startTime < 4500) {
        animationFrameId = requestAnimationFrame(updateLoop);
      }
    };

    updateLoop();

    return () => {
      isAnimating = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', calculatePaths);
      observer?.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 flex items-center justify-between px-4 md:px-20"
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-80"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="ghost-home-flow-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {paths.map((path, index) => (
          <g key={path}>
            <path
              d={path}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="4 6"
              opacity="0.5"
            />
            <motion.circle
              r="3"
              fill="#93c5fd"
              filter="url(#ghost-home-flow-glow)"
            >
              <animateMotion path={path} dur={`${3 + index}s`} repeatCount="indefinite" />
            </motion.circle>
          </g>
        ))}
      </svg>

      <div className="flex flex-col gap-12">
        <FloatingIcon
          delay={0}
          innerRef={leftRefs[0]}
          icon={<AppWindow className="text-blue-500" />}
          label={labels.extension}
        />
        <FloatingIcon
          delay={1}
          innerRef={leftRefs[1]}
          className="-translate-x-12"
          icon={<FileVideo className="text-slate-500 dark:text-slate-400" />}
          label={labels.media}
        />
        <FloatingIcon
          delay={2}
          innerRef={leftRefs[2]}
          icon={<Layout className="text-slate-500 dark:text-slate-400" />}
          label={labels.tabs}
        />
      </div>

      <div className="flex flex-col gap-12">
        <FloatingIcon
          delay={0.5}
          alignRight
          innerRef={rightRefs[0]}
          icon={<HardDrive className="text-slate-700 dark:text-white" />}
          label={labels.storage}
        />
        <FloatingIcon
          delay={1.5}
          alignRight
          innerRef={rightRefs[1]}
          className="translate-x-12"
          icon={<Music className="text-slate-500 dark:text-slate-400" />}
          label={labels.assets}
        />
        <FloatingIcon
          delay={2.5}
          alignRight
          innerRef={rightRefs[2]}
          icon={<Paperclip className="text-slate-500 dark:text-slate-400" />}
          label={labels.tasks}
        />
      </div>
    </div>
  );
}

function FloatingIcon({
  icon,
  label,
  delay = 0,
  alignRight = false,
  className,
  innerRef,
}: {
  icon: ReactNode;
  label: string;
  delay?: number;
  alignRight?: boolean;
  className?: string;
  innerRef?: RefObject<HTMLDivElement | null>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: alignRight ? 50 : -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 1 }}
      className={cn(
        'group flex items-center gap-4',
        alignRight ? 'flex-row-reverse text-right' : 'flex-row',
        className
      )}
    >
      <div
        ref={innerRef}
        className={cn(
          styles.glassCard,
          'relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border transition-transform group-hover:scale-110 group-hover:rotate-6'
        )}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl bg-blue-500/10 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-blue-500/5"
        />
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 opacity-80 transition-opacity group-hover:text-blue-500 group-hover:opacity-100 dark:text-slate-500 dark:opacity-60 dark:group-hover:text-blue-400">
          {label}
        </span>
      </div>
    </motion.div>
  );
}
