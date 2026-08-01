import { cn } from '@/lib/cn';
import { mdiIcons, type MdiIconName } from '@/lib/icons.generated';

export type { MdiIconName };

export function MdiIcon({
  name,
  className,
}: {
  name: MdiIconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      <path d={mdiIcons[name]} />
    </svg>
  );
}
