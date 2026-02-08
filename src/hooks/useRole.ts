'use client';

import { useSyncExternalStore, useCallback } from 'react';

type UserRole = 'client' | 'executor' | null;

const STORAGE_KEY = 'user_role';

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => { listeners.delete(callback); };
}

const VALID_ROLES = new Set<string>(['client', 'executor']);

function getSnapshot(): UserRole {
  const value = localStorage.getItem(STORAGE_KEY);
  return value && VALID_ROLES.has(value) ? (value as UserRole) : null;
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
