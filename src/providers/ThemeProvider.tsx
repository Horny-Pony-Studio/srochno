'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
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

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>('auto');
  const [theme, setTheme] = useState<Theme>('light');

  // Визначення теми на основі preference
  useEffect(() => {
    let effectiveTheme: Theme;

    if (preference === 'auto') {
      // Спочатку Telegram theme
      try {
        const tgTheme = themeParams.isDark() ? 'dark' : 'light';
        effectiveTheme = tgTheme;
      } catch {
        // Fallback на системну тему
        if (typeof window !== 'undefined') {
          const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          effectiveTheme = isDark ? 'dark' : 'light';
        } else {
          effectiveTheme = 'light';
        }
      }
    } else {
      effectiveTheme = preference;
    }

    setTheme(effectiveTheme);

    // Оновлюємо HTML атрибут для Tailwind dark mode
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', effectiveTheme === 'dark');
    }
  }, [preference]);

  // Завантаження збереженої теми
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemePreference | null;
      if (saved && ['auto', 'light', 'dark'].includes(saved)) {
        setPreferenceState(saved);
      }
    }
  }, []);

  // Слухач системної теми (коли preference = 'auto')
  useEffect(() => {
    if (preference !== 'auto' || typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const isDark = mediaQuery.matches;
      setTheme(isDark ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', isDark);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [preference]);

  const setPreference = (newPreference: ThemePreference) => {
    setPreferenceState(newPreference);
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, newPreference);
    }
  };

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
