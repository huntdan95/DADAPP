import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { DamScheduleProvider, Location } from '@/lib/providers/types';
import {
  damScheduleKey,
  emptyHourly,
  todayLocalDate,
  writeDamSchedule,
  type DamScheduleDoc,
} from '@/lib/damSchedule/store';
import { cn } from '@/lib/utils';
import { friendlyError } from '@/lib/errors';

/**
 * Tap-to-cycle hour grid for entering today's generation schedule.
 * Each cell cycles 0 → 1 → 2 → 3 → off (null) on tap. Includes a few
 * presets for common shapes (off all day, generating midday, etc).
 */
export function DamScheduleEditor({
  provider,
  location,
  initial,
  userEmail,
  onSaved,
  onCancel,
}: {
  provider: DamScheduleProvider;
  location: Location;
  initial?: Array<number | null>;
  userEmail?: string;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const date = todayLocalDate(location.timezone);
  const [hours, setHours] = useState<Array<number | null>>(
    initial ? [...initial] : emptyHourly()
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const damName = damNameFor(provider);

  function cycle(h: number) {
    setHours((prev) => {
      const next = [...prev];
      const v = prev[h];
      // null → 0 → 1 → 2 → 3 → null
      next[h] = v == null ? 0 : v >= 3 ? null : v + 1;
      return next;
    });
  }

  function applyAllOff() {
    setHours(Array.from({ length: 24 }, () => 0));
  }

  function applyMidday() {
    setHours(
      Array.from({ length: 24 }, (_, h) => (h >= 14 && h <= 20 ? 2 : 0))
    );
  }

  function applyEvening() {
    setHours(
      Array.from({ length: 24 }, (_, h) => (h >= 18 && h <= 22 ? 2 : 0))
    );
  }

  async function save() {
    setBusy(true);
    setError(null);
    try {
      const key = damScheduleKey(provider, date);
      const doc_: Omit<DamScheduleDoc, 'updatedAt'> = {
        damName,
        authority: provider.kind === 'consumers-energy'
          ? 'consumers-energy'
          : (provider.kind as DamScheduleDoc['authority']),
        date,
        hourlyUnits: hours,
        source: 'manual',
      };
      await writeDamSchedule(key, doc_, userEmail);
      onSaved();
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm text-muted">
        {damName} · {date} ({location.timezone.split('/')[1]})
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" onClick={applyAllOff}>
          Off all day
        </Button>
        <Button size="sm" variant="secondary" onClick={applyMidday}>
          Mid-day gen (2–8 PM)
        </Button>
        <Button size="sm" variant="secondary" onClick={applyEvening}>
          Evening gen (6–10 PM)
        </Button>
      </div>

      <div>
        <div className="text-xs uppercase tracking-wider text-muted mb-2">
          Tap to set hour: gray = unknown, green = off, yellow = 1 unit,
          red = 2+ units
        </div>
        <div className="grid grid-cols-12 gap-1">
          {hours.map((u, h) => (
            <button
              key={h}
              type="button"
              onClick={() => cycle(h)}
              className={cn(
                'aspect-square rounded text-[10px] font-medium num',
                u == null && 'bg-surface-2 text-muted',
                u === 0 && 'bg-accent/70 text-bg',
                u === 1 && 'bg-warn/80 text-bg',
                u === 2 && 'bg-danger/80 text-bg',
                u != null && u >= 3 && 'bg-danger text-bg ring-2 ring-danger'
              )}
            >
              <div className="leading-none">{formatHour(h)}</div>
              <div className="text-[9px] opacity-80">
                {u == null ? '·' : u}
              </div>
            </button>
          ))}
        </div>
      </div>

      {error && <div className="text-sm text-danger">{error}</div>}

      <div className="flex gap-2 justify-end pt-1">
        <Button variant="secondary" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
        <Button onClick={save} disabled={busy}>
          {busy && <Loader2 className="w-4 h-4 animate-spin" />}
          {busy ? 'Saving…' : 'Save schedule'}
        </Button>
      </div>
    </div>
  );
}

function formatHour(h: number): string {
  if (h === 0) return '12a';
  if (h < 12) return `${h}a`;
  if (h === 12) return '12p';
  return `${h - 12}p`;
}

function damNameFor(p: DamScheduleProvider): string {
  switch (p.kind) {
    case 'tva':
      return p.dam;
    case 'usace':
      return `${p.district}/${p.project}`;
    case 'consumers-energy':
      return p.dam;
    case 'manual':
      return 'Schedule';
  }
}
