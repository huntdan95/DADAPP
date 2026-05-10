import { useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ConditionsCard } from '@/features/conditions/ConditionsCard';
import { seedLocations } from '@/seedLocations';

export default function App() {
  // Forcing a remount on the cards is the simplest way to trigger every
  // useAsync inside them to re-fetch. Phase 2 will replace this with a
  // proper refresh-context.
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-full safe-top safe-bottom">
      <header className="sticky top-0 z-10 backdrop-blur bg-bg/80 border-b border-border safe-top">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold">Dad's Fishing Co-Pilot</h1>
            <p className="text-xs text-muted">
              {seedLocations.length} location{seedLocations.length === 1 ? '' : 's'}
            </p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setRefreshKey((k) => k + 1)}
            aria-label="Refresh"
          >
            <RefreshCcw className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4 flex flex-col gap-4">
        {seedLocations.map((loc) => (
          <ConditionsCard key={`${loc.id}:${refreshKey}`} location={loc} />
        ))}

        <footer className="text-xs text-muted text-center py-6">
          Phase 1 dashboard · Open-Meteo + USGS · refresh icon top right
        </footer>
      </main>
    </div>
  );
}
