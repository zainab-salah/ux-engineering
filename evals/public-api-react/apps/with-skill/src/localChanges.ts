import { useCallback, useEffect, useRef, useState } from 'react';
import { EMPTY_CHANGES, parseChanges, STORAGE_KEY, type Changes } from './products';

/**
 * DummyJSON accepts writes but never stores them, so confirmed writes are kept as a local overlay
 * on top of the fetched catalog. The overlay is persisted in localStorage when available and
 * synced across tabs. If storage is unavailable the overlay still works until reload (`storageOk` is false).
 */
export function useLocalChanges() {
  const [changes, setChanges] = useState<Changes>(() => {
    try { return parseChanges(localStorage.getItem(STORAGE_KEY)); } catch { return EMPTY_CHANGES; }
  });
  const [storageOk, setStorageOk] = useState(true);
  const latest = useRef(changes);

  const commit = useCallback((next: Changes) => {
    latest.current = next;
    setChanges(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); setStorageOk(true); } catch { setStorageOk(false); }
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) { const next = parseChanges(event.newValue); latest.current = next; setChanges(next); }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const update = useCallback((fn: (current: Changes) => Changes) => commit(fn(latest.current)), [commit]);
  const reset = useCallback(() => commit(EMPTY_CHANGES), [commit]);
  return { changes, update, reset, storageOk };
}
