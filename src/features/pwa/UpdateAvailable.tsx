import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

/**
 * Toast that appears when a new service-worker version has installed.
 * Registration itself happens in main.tsx (one-shot, not React-tree
 * dependent). This component just listens for the custom 'pwa-need-refresh'
 * event our registration emits, and dispatches 'pwa-update-now' when
 * the user taps Reload.
 */
export function UpdateAvailable() {
  const [needRefresh, setNeedRefresh] = useState(false);

  useEffect(() => {
    const onNeed = () => setNeedRefresh(true);
    window.addEventListener('pwa-need-refresh', onNeed);
    return () => window.removeEventListener('pwa-need-refresh', onNeed);
  }, []);

  if (!needRefresh) return null;

  return (
    <div
      className="fixed bottom-24 inset-x-3 z-40 max-w-md mx-auto bg-surface border border-info/40 rounded-2xl shadow-lg p-3 flex items-center gap-3"
      role="status"
    >
      <RefreshCw className="w-4 h-4 text-info" />
      <div className="flex-1 text-sm">
        New version available
        <div className="text-xs text-muted">Reload to update</div>
      </div>
      <Button
        size="sm"
        onClick={() => window.dispatchEvent(new Event('pwa-update-now'))}
      >
        Reload
      </Button>
      <button
        type="button"
        onClick={() => setNeedRefresh(false)}
        className="text-xs text-muted hover:text-text px-2"
      >
        Later
      </button>
    </div>
  );
}
