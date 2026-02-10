'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { initData } from '@telegram-apps/sdk-react';
import { setAuthToken, getMe } from '@/lib/api';
import type { UserProfile } from '@/types/api';

interface AuthContextValue {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
  refetchUser: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let raw: string | undefined;
      try {
        raw = initData.raw();
        console.log('[Auth] initData.raw() →', raw ? `${raw.slice(0, 50)}…` : 'empty');
      } catch (e) {
        console.warn('[Auth] initData.raw() threw:', e);
      }

      if (!raw) {
        console.warn('[Auth] No initData — skipping auth');
        setError('Telegram initData not available');
        setUser(null);
        return;
      }

      setAuthToken(raw);
      console.log('[Auth] Fetching /api/users/me…');
      const profile = await getMe();
      console.log('[Auth] Profile loaded:', profile);
      setUser(profile);
    } catch (err) {
      console.error('[Auth] Failed:', err);
      const message =
        err instanceof Error ? err.message : 'Authentication failed';
      setError(message);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const contextValue = useMemo<AuthContextValue>(() => ({
    user,
    isLoading,
    isAuthenticated: user !== null,
    error,
    refetchUser: fetchUser,
  }), [user, isLoading, error, fetchUser]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
