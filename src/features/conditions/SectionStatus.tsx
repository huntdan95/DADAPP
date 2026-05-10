import type { ReactNode } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import type { AsyncState } from './useAsync';
import { cn } from '@/lib/utils';
import { friendlyError } from '@/lib/errors';

/**
 * Wrapper that renders children only on success. Loading shows a small
 * spinner; error shows a one-line message and keeps the section visible
 * (so one provider failing doesn't blank the dashboard).
 */
export function SectionStatus<T>({
  state,
  className,
  children,
}: {
  state: AsyncState<T>;
  className?: string;
  children: (data: T) => ReactNode;
}) {
  if (state.status === 'idle' || state.status === 'loading') {
    return (
      <div
        className={cn(
          'flex items-center gap-2 text-muted text-sm py-2',
          className
        )}
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading…
      </div>
    );
  }
  if (state.status === 'error') {
    return (
      <div
        className={cn(
          'flex items-start gap-2 text-warn text-sm py-2',
          className
        )}
      >
        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>{friendlyError(state.error)}</span>
      </div>
    );
  }
  return <>{children(state.data)}</>;
}
