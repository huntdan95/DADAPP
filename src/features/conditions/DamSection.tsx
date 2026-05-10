import { useEffect, useState } from 'react';
import { Pencil, AlertTriangle } from 'lucide-react';
import { CardSection } from '@/components/ui/Card';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { DamScheduleEditor } from '@/features/damSchedule/DamScheduleEditor';
import type { DamScheduleProvider, Location } from '@/lib/providers/types';
import {
  damScheduleKey,
  todayLocalDate,
  watchDamSchedule,
  type DamScheduleDoc,
} from '@/lib/damSchedule/store';
import { useAuth } from '@/lib/useAuth';
import { cn, formatRelativeTime } from '@/lib/utils';

/**
 * Live view of today's generation schedule for this location's dam,
 * plus an Edit button that opens the manual-entry sheet. Subscribes
 * directly to Firestore — when the cloud function eventually scrapes,
 * the bar updates without a refresh.
 */
export function DamSection({
  provider,
  location,
}: {
  provider: DamScheduleProvider;
  location: Location;
}) {
  const auth = useAuth();
  const [doc, setDoc] = useState<DamScheduleDoc | null>(null);
  const [waiting, setWaiting] = useState(true);
  const [editing, setEditing] = useState(false);

  const date = todayLocalDate(location.timezone);
  const key = damScheduleKey(provider, date);
  const isFirebase = auth.kind === 'signed-in';

  useEffect(() => {
    if (!isFirebase) {
      setWaiting(false);
      return;
    }
    return watchDamSchedule(key, (d) => {
      setDoc(d);
      setWaiting(false);
    });
  }, [key, isFirebase]);

  const userEmail =
    auth.kind === 'signed-in' ? auth.user.email ?? undefined : undefined;

  const damLabel = damLabelFor(provider);

  if (!isFirebase) {
    return (
      <CardSection label="Dam Generation">
        <div className="text-xs text-muted">
          Sign in to track {damLabel} schedules.
        </div>
      </CardSection>
    );
  }

  if (waiting) {
    return (
      <CardSection label="Dam Generation">
        <div className="text-xs text-muted py-2">Loading schedule…</div>
      </CardSection>
    );
  }

  const hourly = doc?.hourlyUnits ?? Array.from({ length: 24 }, () => null);
  const currentHour = currentHourIn(location.timezone);
  const next = nextChangeIn(hourly, currentHour);
  const stale =
    doc?.updatedAt &&
    Date.now() - doc.updatedAt.toMillis() > 36 * 3600 * 1000;

  return (
    <CardSection label="Dam Generation">
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-24 gap-[2px]">
          {hourly.map((units, hour) => (
            <div
              key={hour}
              title={`${hour}:00 — ${
                units == null ? 'unknown' : `${units} unit(s)`
              }`}
              className={cn(
                'h-7 rounded-sm transition relative',
                units == null && 'bg-surface-2',
                units === 0 && 'bg-accent/70',
                units === 1 && 'bg-warn/70',
                units != null && units >= 2 && 'bg-danger/70',
                hour === currentHour && 'ring-2 ring-text/40'
              )}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-muted px-0.5 num">
          <span>12a</span>
          <span>6a</span>
          <span>noon</span>
          <span>6p</span>
          <span>11p</span>
        </div>

        <div className="flex items-center justify-between gap-2 mt-1">
          <div className="text-xs text-muted flex-1">
            <div className="text-text">
              {currentStatusLabel(hourly[currentHour])}
              {next && (
                <span className="text-muted">
                  {' '}
                  · {next.label} at {formatHour12(next.hour)}
                </span>
              )}
            </div>
            <div>
              {damLabel}
              {doc?.source === 'scraped' && ' · scraped'}
              {doc?.source === 'manual' && ' · manual'}
              {!doc && ' · not entered yet'}
              {doc?.updatedAt && ` · updated ${formatRelativeTime(
                doc.updatedAt.toDate().toISOString()
              )}`}
            </div>
            {stale && (
              <div className="text-warn flex items-center gap-1 mt-0.5">
                <AlertTriangle className="w-3 h-3" />
                Schedule may be stale — re-enter for today
              </div>
            )}
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setEditing(true)}
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Button>
        </div>
      </div>

      <BottomSheet
        open={editing}
        onClose={() => setEditing(false)}
        title="Set today's schedule"
      >
        {editing && (
          <DamScheduleEditor
            provider={provider}
            location={location}
            initial={doc?.hourlyUnits}
            userEmail={userEmail}
            onCancel={() => setEditing(false)}
            onSaved={() => setEditing(false)}
          />
        )}
      </BottomSheet>
    </CardSection>
  );
}

function damLabelFor(p: DamScheduleProvider): string {
  switch (p.kind) {
    case 'tva':
      return `${p.dam} (TVA)`;
    case 'usace':
      return `${p.project} (USACE ${p.district})`;
    case 'consumers-energy':
      return `${p.dam} (Consumers Energy)`;
    case 'manual':
      return 'Manual schedule';
  }
}

function currentHourIn(timezone: string): number {
  const part = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    hourCycle: 'h23',
    timeZone: timezone,
  }).format(new Date());
  return parseInt(part, 10);
}

function currentStatusLabel(units: number | null): string {
  if (units == null) return 'Schedule unknown';
  if (units === 0) return 'No generation — wadeable';
  if (units === 1) return 'Partial generation — transitional';
  return 'Heavy generation — float-only';
}

interface NextChange {
  hour: number;
  label: string;
}

/**
 * Look forward from `currentHour` for the next non-null hour whose value
 * differs from now's. Returns label like "Generation starts" or
 * "Generation stops".
 */
function nextChangeIn(
  hourly: Array<number | null>,
  currentHour: number
): NextChange | null {
  const now = hourly[currentHour];
  for (let i = 1; i < 24; i++) {
    const h = (currentHour + i) % 24;
    const v = hourly[h];
    if (v == null) continue;
    if (v === now) continue;
    if ((now == null || now === 0) && v >= 1) {
      return { hour: h, label: 'Generation starts' };
    }
    if ((now ?? 0) >= 1 && v === 0) {
      return { hour: h, label: 'Generation stops' };
    }
    if ((now ?? 0) >= 1 && v >= 1 && v !== now) {
      return { hour: h, label: `Changes to ${v} unit${v === 1 ? '' : 's'}` };
    }
  }
  return null;
}

function formatHour12(h: number): string {
  if (h === 0) return '12 AM';
  if (h < 12) return `${h} AM`;
  if (h === 12) return '12 PM';
  return `${h - 12} PM`;
}
