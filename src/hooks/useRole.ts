'use client';

import { useState, useEffect, useCallback } from 'react';

type UserRole = 'client' | 'executor' | null;

const STORAGE_KEY = 'user_role';

export function useRole() {
  const [role, setRoleState] = useState<UserRole>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setRoleState(localStorage.getItem(STORAGE_KEY) as UserRole);
    setIsReady(true);
  }, []);

  const setRole = useCallback((r: UserRole) => {
    if (r) {
      localStorage.setItem(STORAGE_KEY, r);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    setRoleState(r);
  }, []);

  return { role, setRole, isReady };
}
