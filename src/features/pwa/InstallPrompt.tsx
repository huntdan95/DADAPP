import { useEffect, useState } from 'react';
import { Download, Share, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

/**
 * Cross-platform install prompt:
 * - Chrome / Edge / Samsung Internet → beforeinstallprompt event lets us
 *   call .prompt() directly.
 * - iOS Safari → no API; show instructions ("Tap Share, then Add to
 *   Home Screen") with the iOS share icon.
 * - Already installed (display-mode: standalone) → render nothing.
 *
 * Dismissal is persisted in localStorage so we don't nag.
 */

const DISMISS_KEY = 'dad-fishing.install-prompt-dismissed';
const DISMISS_DAYS = 14;

interface BIPEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [bip, setBip] = useState<BIPEvent | null>(null);
  const [showIos, setShowIos] = useState(false);
  const [dismissed, setDismissed] = useState(() => isDismissed());

  useEffect(() => {
    if (isInstalled()) return;
    const onBip = (e: Event) => {
      e.preventDefault();
      setBip(e as BIPEvent);
    };
    window.addEventListener('beforeinstallprompt', onBip);
    if (isIosSafari() && !isDismissed()) {
      setShowIos(true);
    }
    return () => window.removeEventListener('beforeinstallprompt', onBip);
  }, []);

  if (dismissed || isInstalled()) return null;
  if (!bip && !showIos) return null;

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setDismissed(true);
  }

  async function install() {
    if (!bip) return;
    await bip.prompt();
    await bip.userChoice;
    setBip(null);
  }

  return (
    <div
      className={cn(
        'fixed bottom-20 inset-x-3 z-30 max-w-md mx-auto',
        'bg-surface border border-accent/40 rounded-2xl shadow-lg p-3',
        'flex items-start gap-3 safe-bottom'
      )}
      role="dialog"
      aria-label="Install app"
    >
      <div className="flex-1">
        <div className="text-sm font-semibold flex items-center gap-2">
          <Download className="w-4 h-4 text-accent" />
          Install on this device
        </div>
        {showIos ? (
          <div className="text-xs text-muted mt-1">
            Tap{' '}
            <Share className="inline-block w-3.5 h-3.5 align-text-bottom mx-0.5" />{' '}
            in Safari's toolbar, then choose <strong>Add to Home Screen</strong>.
          </div>
        ) : (
          <div className="text-xs text-muted mt-1">
            Add to your home screen for full-screen, offline-aware access.
          </div>
        )}
        {bip && (
          <Button size="sm" onClick={install} className="mt-2">
            Install
          </Button>
        )}
      </div>
      <button
        type="button"
        onClick={dismiss}
        className="p-1 -m-1 text-muted hover:text-text"
        aria-label="Dismiss install prompt"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function isInstalled(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // iOS
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIosSafari(): boolean {
  const ua = navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua) && !(window as Window & { MSStream?: unknown }).MSStream;
  const safari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
  return iOS && safari;
}

function isDismissed(): boolean {
  const raw = localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;
  const ts = Number(raw);
  if (Number.isNaN(ts)) return false;
  return Date.now() - ts < DISMISS_DAYS * 24 * 60 * 60 * 1000;
}
