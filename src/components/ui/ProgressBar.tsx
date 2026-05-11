import { Loader2 } from 'lucide-react';

/**
 * Progress bar for long-running background tasks (boat-launch scrape,
 * stocking scrape, etc.). Determinate mode (with a value 0-100) shows
 * a fill bar + percent; indeterminate mode (no value) shows a sliding
 * animation. Status / subStatus / eta lines are all optional.
 *
 * Designed to slot into compact UI surfaces (the map legend, a card
 * footer) without being a giant blocking modal — the user can still
 * navigate while a task runs.
 */
export function ProgressBar({
  value,
  status,
  subStatus,
  eta,
  variant = 'info',
  className = '',
}: {
  /** 0-100. Omit / undefined for indeterminate sliding animation. */
  value?: number;
  /** Primary status line shown above the bar. */
  status?: string;
  /** Smaller line below status, e.g. 'Chunk 2 of 4'. */
  subStatus?: string;
  /** Right-aligned est-time-remaining badge, e.g. '~3 min left'. */
  eta?: string;
  /** Bar color. info = blue, accent = green, warn = yellow. */
  variant?: 'info' | 'accent' | 'warn';
  className?: string;
}) {
  const isDeterminate = typeof value === 'number';
  const clamped = isDeterminate
    ? Math.max(0, Math.min(100, value))
    : 0;

  const fillColor =
    variant === 'accent'
      ? 'bg-accent'
      : variant === 'warn'
      ? 'bg-warn'
      : 'bg-info';

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {(status || isDeterminate || eta) && (
        <div className="flex items-center justify-between gap-2 text-[11px]">
          <span className="text-text flex items-center gap-1.5">
            {!isDeterminate && (
              <Loader2 className="w-3 h-3 animate-spin text-muted" />
            )}
            {status}
          </span>
          <span className="text-muted num shrink-0">
            {eta ? eta : isDeterminate ? `${Math.round(clamped)}%` : ''}
          </span>
        </div>
      )}
      <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
        {isDeterminate ? (
          <div
            className={`h-full ${fillColor} transition-all duration-300 ease-out`}
            style={{ width: `${clamped}%` }}
          />
        ) : (
          <div
            className={`h-full w-1/3 ${fillColor} progress-indeterminate`}
          />
        )}
      </div>
      {subStatus && (
        <div className="text-[10px] text-muted">{subStatus}</div>
      )}
    </div>
  );
}
