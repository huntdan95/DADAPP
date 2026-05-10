import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { signInWithGoogle } from '@/lib/firebase';

export function SignInScreen() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSignIn() {
    setBusy(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 gap-6 bg-bg text-text">
      <div className="text-center max-w-sm flex flex-col items-center gap-2">
        <div className="text-5xl mb-2">🎣</div>
        <h1 className="text-2xl font-semibold">Dad's Fishing Co-Pilot</h1>
        <p className="text-sm text-muted">
          Pre-trip conditions, on-the-water logging, and pattern recognition
          for the spots you actually fish.
        </p>
      </div>

      <Button onClick={onSignIn} disabled={busy} size="lg" className="w-full max-w-xs">
        {busy ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Opening Google…
          </>
        ) : (
          <>Sign in with Google</>
        )}
      </Button>

      {error && <div className="text-sm text-danger max-w-xs text-center">{error}</div>}

      <div className="text-xs text-muted max-w-xs text-center safe-bottom">
        Single-user app. Once dad signs in for the first time, Firestore
        rules will be locked to his email.
      </div>
    </div>
  );
}
