import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { deleteLogEntry } from '@/lib/log/store';
import type { LogEntry } from '@/lib/log/types';

export function LogEntryDetail({
  entry,
  onClose,
}: {
  entry: LogEntry;
  onClose: () => void;
}) {
  const time = new Date(entry.time);
  const timeLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(time);

  return (
    <div className="flex flex-col gap-3">
      {entry.photoUrl && (
        <img
          src={entry.photoUrl}
          alt=""
          className="w-full max-h-72 object-cover rounded-xl border border-border"
        />
      )}

      <div className="text-sm text-muted">{timeLabel}</div>

      {entry.kind === 'catch' && (
        <div>
          <div className="text-lg font-semibold">
            {entry.species ?? 'Unknown species'}
            {entry.lengthInches != null && (
              <span className="text-muted font-normal num"> · {entry.lengthInches}"</span>
            )}
          </div>
          <div className="text-sm text-muted">
            {[entry.method, entry.flyOrLure].filter(Boolean).join(' · ')}
            {entry.method === 'troll' && entry.trollingDepthFt != null && (
              <span className="num"> · {entry.trollingDepthFt} ft</span>
            )}
            {entry.method === 'troll' && entry.trollingSpeedMph != null && (
              <span className="num"> · {entry.trollingSpeedMph} mph</span>
            )}
            {entry.releasedOrKept && ` · ${entry.releasedOrKept}`}
          </div>
        </div>
      )}

      {entry.kind === 'hatch' && (
        <div>
          <div className="text-lg font-semibold">
            {entry.hatchName ?? 'Hatch'}
            {entry.hatchStage && entry.hatchStage !== 'unknown' && (
              <span className="text-muted font-normal"> · {entry.hatchStage}</span>
            )}
          </div>
        </div>
      )}

      {entry.notes && (
        <div className="text-sm whitespace-pre-wrap">{entry.notes}</div>
      )}

      <div className="rounded-xl bg-surface-2/40 border border-border p-3 text-xs text-muted num">
        {Number.isFinite(entry.conditions.airTempF) &&
          `${Math.round(entry.conditions.airTempF)}°F air`}
        {entry.flowReading?.waterTempF != null &&
          ` · ${Math.round(entry.flowReading.waterTempF)}°F water`}
        {entry.flowReading?.flowCfs != null &&
          ` · ${Math.round(entry.flowReading.flowCfs)} cfs`}
        {Number.isFinite(entry.conditions.pressureMb) &&
          ` · ${Math.round(entry.conditions.pressureMb)} mb ${entry.conditions.pressureTrend}`}
        {entry.locationName && (
          <div className="text-[11px] mt-1">{entry.locationName}</div>
        )}
        {entry.gps && (
          <div className="text-[11px]">
            {entry.gps.lat.toFixed(4)}, {entry.gps.lng.toFixed(4)}
          </div>
        )}
        {entry.flowReading?.siteName && (
          <div className="text-[10px] mt-1">
            Flow from {entry.flowReading.siteName}
          </div>
        )}
      </div>

      <div className="flex justify-between pt-2">
        <Button
          variant="ghost"
          onClick={async () => {
            if (!confirm('Delete this log entry?')) return;
            await deleteLogEntry(entry);
            onClose();
          }}
        >
          <Trash2 className="w-4 h-4 text-danger" />
          Delete
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}
