'use client';

import { useSyncExternalStore, useCallback } from 'react';

type UserRole = 'client' | 'executor' | null;

const STORAGE_KEY = 'user_role';

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => { listeners.delete(callback); };
}

function getSnapshot(): UserRole {
  return localStorage.getItem(STORAGE_KEY) as UserRole;
}

function getServerSnapshot(): UserRole {
  return null;
}

export function useRole() {
  const role = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setRole = useCallback((r: UserRole) => {
    if (r) {
      localStorage.setItem(STORAGE_KEY, r);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    listeners.forEach(cb => cb());
  }, []);

  return { role, setRole, isReady: true };
}
