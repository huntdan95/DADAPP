import { useEffect, useState } from 'react';
import { Pencil, AlertTriangle, RefreshCcw, Loader2 } from 'lucide-react';
import { CardSection } from '@/components/ui/Card';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { DamScheduleEditor } from '@/features/damSchedule/DamScheduleEditor';
import type {
  DamScheduleProvider,
  DamScheduleReading,
  Location,
} from '@/lib/providers/types';
import { fetchDamSchedule } from '@/lib/providers';
import {
  damScheduleKey,
  todayLocalDate,
  watchDamSchedule,
  type DamScheduleDoc,
} from '@/lib/damSchedule/store';
import { useAuth } from '@/lib/useAuth';
import { cn, formatRelativeTime } from '@/lib/utils';
import { friendlyError } from '@/lib/errors';

/**
 * Live view of today's generation schedule. Two data paths:
 *
 *  - `kind === 'auto'` → derive status from the downstream USGS flow gauge
 *    (autoInfer.ts). Refetched on demand. No Firestore involved.
 *  - everything else  → Firestore subscription on `damSchedules/{key}`,
 *    edited via the manual sheet.
 */
export function DamSection({
  provider,
  location,
}: {
  provider: DamScheduleProvider;
  location: Location;
}) {
  const auth = useAuth();
  const isFirebase = auth.kind === 'signed-in';
  const isAuto = provider.kind === 'auto';

  // -- auto branch ---------------------------------------------------------
  const [autoReading, setAutoReading] = useState<DamScheduleReading | null>(null);
  const [autoLoading, setAutoLoading] = useState(false);
  const [autoError, setAutoError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuto) return;
    let cancelled = false;
    setAutoLoading(true);
    setAutoError(null);
    fetchDamSchedule(provider, location)
      .then((r) => {
        if (!cancelled) setAutoReading(r);
      })
      .catch((e) => {
        if (!cancelled) setAutoError(friendlyError(e));
      })
      .finally(() => {
        if (!cancelled) setAutoLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuto, providerCacheKey(provider), location.id]);

  async function refetchAuto() {
    if (!isAuto) return;
    setAutoLoading(true);
    setAutoError(null);
    try {
      const r = await fetchDamSchedule(provider, location);
      setAutoReading(r);
    } catch (e) {
      setAutoError(friendlyError(e));
    } finally {
      setAutoLoading(false);
    }
  }

  // -- firestore branch -----------------------------------------------------
  const [doc, setDoc] = useState<DamScheduleDoc | null>(null);
  const [waitingDoc, setWaitingDoc] = useState(true);
  const [editing, setEditing] = useState(false);
  const date = todayLocalDate(location.timezone);
  const firestoreKey = isAuto ? null : damScheduleKey(provider, date);

  useEffect(() => {
    if (isAuto) return;
    if (!isFirebase) {
      setWaitingDoc(false);
      return;
    }
    if (!firestoreKey) return;
    return watchDamSchedule(firestoreKey, (d) => {
      setDoc(d);
      setWaitingDoc(false);
    });
  }, [firestoreKey, isFirebase, isAuto]);

  const userEmail =
    auth.kind === 'signed-in' ? auth.user.email ?? undefined : undefined;
  const damLabel = damLabelFor(provider);

  // ---- render -------------------------------------------------------------

  if (!isAuto && !isFirebase) {
    return (
      <CardSection label="Dam Generation">
        <div className="text-xs text-muted">
          Sign in to track {damLabel} schedules.
        </div>
      </CardSection>
    );
  }

  if (isAuto && autoLoading && !autoReading) {
    return (
      <CardSection label="Dam Generation">
        <div className="text-xs text-muted py-2 flex items-center gap-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Reading the gauge…
        </div>
      </CardSection>
    );
  }
  if (!isAuto && waitingDoc) {
    return (
      <CardSection label="Dam Generation">
        <div className="text-xs text-muted py-2">Loading schedule…</div>
      </CardSection>
    );
  }

  // Unified shape that the bar UI consumes.
  const hourly: Array<number | null> = isAuto
    ? autoReading?.hourlyUnits ?? Array.from({ length: 24 }, () => null)
    : doc?.hourlyUnits ?? Array.from({ length: 24 }, () => null);

  const currentHour = currentHourIn(location.timezone);
  const next = nextChangeIn(hourly, currentHour);
  const stale =
    !isAuto &&
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
              {isAuto ? (
                <>
                  Auto from gauge
                  {autoReading?.scrapedAt &&
                    ` · updated ${formatRelativeTime(autoReading.scrapedAt)}`}
                </>
              ) : (
                <>
                  {damLabel}
                  {doc?.source === 'scraped' && ' · scraped'}
                  {doc?.source === 'manual' && ' · manual'}
                  {!doc && ' · not entered yet'}
                  {doc?.updatedAt && ` · updated ${formatRelativeTime(
                    doc.updatedAt.toDate().toISOString()
                  )}`}
                </>
              )}
            </div>
            {isAuto && (
              <div className="text-[10px] text-muted/80 mt-0.5">
                Estimated from downstream flow vs. baseline. Today's bar shows
                the recent 24-hour pattern.
              </div>
            )}
            {stale && (
              <div className="text-warn flex items-center gap-1 mt-0.5">
                <AlertTriangle className="w-3 h-3" />
                Schedule may be stale — re-enter for today
              </div>
            )}
            {autoError && (
              <div className="text-danger mt-1">{autoError}</div>
            )}
          </div>
          {isAuto ? (
            <Button
              size="sm"
              variant="secondary"
              onClick={refetchAuto}
              disabled={autoLoading}
            >
              {autoLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCcw className="w-4 h-4" />
              )}
              Refresh
            </Button>
          ) : (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setEditing(true)}
            >
              <Pencil className="w-4 h-4" />
              Edit
            </Button>
          )}
        </div>
      </div>

      <BottomSheet
        open={editing}
        onClose={() => setEditing(false)}
        title="Set today's schedule"
      >
        {editing && !isAuto && (
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

function providerCacheKey(p: DamScheduleProvider): string {
  switch (p.kind) {
    case 'auto':
      return `auto:${p.flowSiteId}`;
    case 'tva':
      return `tva:${p.dam}`;
    case 'usace':
      return `usace:${p.district}/${p.project}`;
    case 'consumers-energy':
      return `ce:${p.dam}`;
    case 'manual':
      return 'manual';
  }
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
    case 'auto':
      return `Auto from gauge ${p.flowSiteId}`;
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
