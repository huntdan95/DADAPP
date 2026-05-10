import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { getFirebaseApp, watchAuth } from './firebase';

export type AuthStatus =
  | { kind: 'no-firebase' }       // env not configured — local-only mode
  | { kind: 'pending' }           // checking session
  | { kind: 'signed-out' }
  | { kind: 'signed-in'; user: User };

export function useAuth(): AuthStatus {
  const [status, setStatus] = useState<AuthStatus>(() =>
    getFirebaseApp() != null ? { kind: 'pending' } : { kind: 'no-firebase' }
  );

  useEffect(() => {
    if (getFirebaseApp() == null) return;
    const unsub = watchAuth((user) => {
      setStatus(user ? { kind: 'signed-in', user } : { kind: 'signed-out' });
    });
    return unsub;
  }, []);

  return status;
}
