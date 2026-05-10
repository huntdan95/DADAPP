import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function StatBlock({
  label,
  value,
  unit,
  hint,
  emphasis,
  className,
}: {
  label: string;
  value: ReactNode;
  unit?: string;
  hint?: ReactNode;
  emphasis?: 'normal' | 'big';
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      <div className="text-xs uppercase tracking-wider text-muted">{label}</div>
      <div
        className={cn(
          'num text-text font-semibold',
          emphasis === 'big' ? 'text-3xl' : 'text-xl'
        )}
      >
        {value}
        {unit && (
          <span className="text-muted text-base font-normal ml-1">{unit}</span>
        )}
      </div>
      {hint && <div className="text-xs text-muted">{hint}</div>}
    </div>
  );
}
