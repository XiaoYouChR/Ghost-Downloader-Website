import styles from './home.module.css';

export function GhostMascot({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className={`${styles.mascotFloat} relative h-64 w-48`}>
        <div
          className="absolute inset-0 rounded-t-full rounded-b-[3rem] bg-linear-to-b from-white/95 to-blue-200/30 blur-[1px] shadow-[0_20px_60px_rgba(59,130,246,0.15)]"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
          }}
        >
          <div className="absolute inset-0 rounded-t-full bg-blue-100/30 blur-2xl" />
        </div>

        <div className="absolute top-8 left-8 h-12 w-12 rounded-full bg-white blur-xl opacity-80" />

        <div className="absolute top-24 left-1/2 flex -translate-x-1/2 gap-12">
          <div className={`${styles.mascotEye} h-2.5 w-2.5 rounded-full bg-slate-800`} />
          <div className={`${styles.mascotEye} h-2.5 w-2.5 rounded-full bg-slate-800`} />
        </div>

        <div className="absolute top-28 left-1/2 flex -translate-x-1/2 gap-16 opacity-30">
          <div className="h-2 w-4 rounded-full bg-pink-200 blur-sm" />
          <div className="h-2 w-4 rounded-full bg-pink-200 blur-sm" />
        </div>
      </div>

      <div
        className={`${styles.mascotShadow} mx-auto -mt-4 h-4 w-32 rounded-full bg-slate-300 blur-xl dark:bg-slate-400/20`}
      />
    </div>
  );
}
