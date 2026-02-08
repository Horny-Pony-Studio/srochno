'use client';

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore, useCallback, type ReactNode } from 'react';
import { themeParams } from '@telegram-apps/sdk-react';

export type Theme = 'light' | 'dark';
export type ThemePreference = 'auto' | 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  preference: 'auto',
  setPreference: () => {},
});

const THEME_STORAGE_KEY = 'theme-preference';

// --- Preference from localStorage via useSyncExternalStore ---

const preferenceListeners = new Set<() => void>();

function subscribePreference(cb: () => void) {
  preferenceListeners.add(cb);
  return () => { preferenceListeners.delete(cb); };
}

function getPreferenceSnapshot(): ThemePreference {
  const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemePreference | null;
  return saved && ['auto', 'light', 'dark'].includes(saved) ? saved : 'auto';
}

function getPreferenceServerSnapshot(): ThemePreference {
  return 'auto';
}

// --- System dark mode via useSyncExternalStore ---

function subscribeSystemDark(cb: () => void) {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}

function getSystemDarkSnapshot(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function getSystemDarkServerSnapshot(): boolean {
  return false;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const preference = useSyncExternalStore(subscribePreference, getPreferenceSnapshot, getPreferenceServerSnapshot);
  const systemDark = useSyncExternalStore(subscribeSystemDark, getSystemDarkSnapshot, getSystemDarkServerSnapshot);

  const theme = useMemo<Theme>(() => {
    if (preference === 'auto') {
      try {
        return themeParams.isDark() ? 'dark' : 'light';
      } catch {
        return systemDark ? 'dark' : 'light';
      }
    }
    return preference;
  }, [preference, systemDark]);

  // DOM side effect — toggle dark class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const setPreference = useCallback((newPreference: ThemePreference) => {
    localStorage.setItem(THEME_STORAGE_KEY, newPreference);
    preferenceListeners.forEach(cb => cb());
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, preference, setPreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
