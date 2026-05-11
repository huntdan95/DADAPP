import { useEffect, useState } from 'react';

/**
 * React hook for `navigator.onLine` with live event updates. Returns
 * `true` if we believe we have a network connection, `false` otherwise.
 *
 * Note: `navigator.onLine` is best-effort. A "true" reading just means
 * the OS has a route to the network — it doesn't guarantee the internet
 * is actually reachable. Use this for UX hints (show "offline" banner,
 * skip optimistic Storage uploads) rather than gating critical logic.
 */
export function useOnline(): boolean {
  const [online, setOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return online;
}
