import { useEffect, useRef, useState, useCallback } from 'react';

export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T; loadedAt: number }
  | { status: 'error'; error: Error };

/**
 * Generic data-fetching hook used by each section. Each section fetches
 * independently — one provider failing must not blank the dashboard.
 */
export function useAsync<T>(
  fn: () => Promise<T>,
  deps: ReadonlyArray<unknown>
): { state: AsyncState<T>; refresh: () => void } {
  const [state, setState] = useState<AsyncState<T>>({ status: 'idle' });
  const tokenRef = useRef(0);

  const run = useCallback(() => {
    const token = ++tokenRef.current;
    setState({ status: 'loading' });
    fn().then(
      (data) => {
        if (tokenRef.current !== token) return;
        setState({ status: 'success', data, loadedAt: Date.now() });
      },
      (error: unknown) => {
        if (tokenRef.current !== token) return;
        setState({
          status: 'error',
          error: error instanceof Error ? error : new Error(String(error)),
        });
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(run, [run]);
  return { state, refresh: run };
}
