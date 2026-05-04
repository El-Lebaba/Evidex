import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export function useSimulationInterval(enabled: boolean, callback: () => void, intervalMs: number) {
  const callbackRef = useRef(callback);
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', setAppState);

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!enabled || appState !== 'active') {
      return;
    }

    const interval = setInterval(() => {
      callbackRef.current();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [appState, enabled, intervalMs]);
}
