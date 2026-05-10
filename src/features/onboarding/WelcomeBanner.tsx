import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';

/**
 * One-time welcome card shown above the Conditions feed on a fresh
 * account. Two sentences explain what the app does and how to make a
 * first log entry. Tapping × persists the dismissal in localStorage so
 * we never show it again.
 */

const KEY = 'dad-fishing.welcomed.v1';

export function WelcomeBanner() {
  const [dismissed, setDismissed] = useState(
    () => typeof localStorage !== 'undefined' && localStorage.getItem(KEY) === '1'
  );
  if (dismissed) return null;

  function dismiss() {
    try {
      localStorage.setItem(KEY, '1');
    } catch {
      // private mode, etc — fine, we'll just keep showing the banner
    }
    setDismissed(true);
  }

  return (
    <div className="rounded-2xl border border-accent/40 bg-accent/5 p-4 flex items-start gap-3">
      <div className="rounded-lg bg-accent/15 p-1.5 text-accent shrink-0">
        <Sparkles className="w-5 h-5" />
      </div>
      <div className="flex-1 text-sm">
        <div className="font-semibold mb-1">Welcome 👋</div>
        <p className="text-muted">
          We pre-loaded a few popular spots so you can poke around. Tap any
          card to see live conditions. When you catch something or spot a
          hatch, hit <b>Log</b> below — just snap a photo and we'll do the
          rest.
        </p>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="p-1 -m-1 text-muted hover:text-text shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
