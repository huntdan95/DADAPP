import { useEffect, useState } from 'react';
import { Bug, Fish, Plus, StickyNote } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Card } from '@/components/ui/Card';
import type { Location } from '@/lib/providers/types';
import { watchLogEntries } from '@/lib/log/store';
import type { LogEntry } from '@/lib/log/types';
import { QuickLog } from './QuickLog';
import { LogEntryDetail } from './LogEntryDetail';
import { AskClaude } from '@/features/journal/AskClaude';

/**
 * The Log tab. Replaces the previous Trip/Catch UI with a single flat
 * stream. The "+ Log" button is the primary action; everything else is
 * a chronological feed of past entries with photo thumbs.
 *
 * AskClaude lives at the bottom — same pattern as before, since
 * pattern queries make sense over the user's full catch history.
 */
export function LogFeed({
  locations,
  isFirebaseConfigured,
}: {
  locations: Location[];
  isFirebaseConfigured: boolean;
}) {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [quickLogOpen, setQuickLogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<LogEntry | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    return watchLogEntries(setEntries);
  }, [isFirebaseConfigured]);

  if (!isFirebaseConfigured) {
    return (
      <div className="text-center text-muted py-12 px-4">
        Sign in to enable logging.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <Button
        onClick={() => setQuickLogOpen(true)}
        className="w-full"
        size="lg"
      >
        <Plus className="w-5 h-5" />
        New log entry
      </Button>

      {entries.length === 0 ? (
        <div className="text-center text-muted py-8 text-sm">
          No entries yet. Tap above to log your first catch, hatch, or note.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {entries.map((e) => (
            <LogRow
              key={e.id}
              entry={e}
              onOpen={() => setSelectedEntry(e)}
            />
          ))}
        </div>
      )}

      <BottomSheet
        open={quickLogOpen}
        onClose={() => setQuickLogOpen(false)}
        title="New log entry"
      >
        {quickLogOpen && (
          <QuickLog
            locations={locations}
            onClose={() => setQuickLogOpen(false)}
            onSaved={() => setQuickLogOpen(false)}
          />
        )}
      </BottomSheet>

      <BottomSheet
        open={selectedEntry != null}
        onClose={() => setSelectedEntry(null)}
        title="Log entry"
      >
        {selectedEntry && (
          <LogEntryDetail
            entry={selectedEntry}
            onClose={() => setSelectedEntry(null)}
          />
        )}
      </BottomSheet>

      <AskClaude />
    </div>
  );
}

function LogRow({
  entry,
  onOpen,
}: {
  entry: LogEntry;
  onOpen: () => void;
}) {
  const Icon =
    entry.kind === 'catch' ? Fish : entry.kind === 'hatch' ? Bug : StickyNote;
  const iconColor =
    entry.kind === 'catch'
      ? 'text-accent'
      : entry.kind === 'hatch'
      ? 'text-info'
      : 'text-muted';
  const title =
    entry.kind === 'catch'
      ? entry.species ?? 'Catch'
      : entry.kind === 'hatch'
      ? entry.hatchName ?? 'Hatch'
      : 'Note';
  const subtitle =
    entry.kind === 'catch'
      ? [
          entry.lengthInches != null && `${entry.lengthInches}"`,
          entry.flyOrLure,
          entry.method,
        ]
          .filter(Boolean)
          .join(' · ')
      : entry.kind === 'hatch'
      ? entry.hatchStage && entry.hatchStage !== 'unknown'
        ? entry.hatchStage
        : ''
      : entry.notes?.slice(0, 60);

  const time = new Date(entry.time);
  const timeLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(time);

  return (
    <button type="button" onClick={onOpen} className="text-left">
      <Card className="hover:bg-surface-2/30 transition flex items-center gap-3 p-3">
        {entry.photoUrl ? (
          <img
            src={entry.photoUrl}
            alt=""
            className="w-14 h-14 object-cover rounded-lg shrink-0 border border-border"
            loading="lazy"
          />
        ) : (
          <div className="w-14 h-14 rounded-lg bg-surface-2 border border-border flex items-center justify-center shrink-0">
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-semibold flex items-center gap-2">
            <Icon className={`w-4 h-4 ${iconColor}`} />
            {title}
          </div>
          {subtitle && (
            <div className="text-xs text-muted truncate">{subtitle}</div>
          )}
          <div className="text-[10px] text-muted/80 num">
            {timeLabel}
            {entry.locationName && ` · ${entry.locationName}`}
          </div>
        </div>
      </Card>
    </button>
  );
}
