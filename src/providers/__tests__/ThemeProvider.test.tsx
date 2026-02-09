import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import React from 'react';

vi.mock('@telegram-apps/sdk-react', () => ({
  themeParams: {
    isDark: () => false,
  },
}));

import { ThemeProvider, useTheme } from '../ThemeProvider';

function TestConsumer() {
  const { theme, preference, setPreference } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="preference">{preference}</span>
      <button onClick={() => setPreference('dark')}>set-dark</button>
      <button onClick={() => setPreference('light')}>set-light</button>
      <button onClick={() => setPreference('auto')}>set-auto</button>
    </div>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('defaults to auto preference and light theme', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('preference')).toHaveTextContent('auto');
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });

  it('reads saved preference from localStorage', () => {
    localStorage.setItem('theme-preference', 'dark');

    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('preference')).toHaveTextContent('dark');
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  it('ignores invalid localStorage value', () => {
    localStorage.setItem('theme-preference', 'rainbow');

    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('preference')).toHaveTextContent('auto');
  });

  it('switches to dark theme when setPreference is called', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    act(() => {
      screen.getByText('set-dark').click();
    });

    expect(screen.getByTestId('preference')).toHaveTextContent('dark');
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    expect(localStorage.getItem('theme-preference')).toBe('dark');
  });

  it('toggles dark class on document', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    act(() => {
      screen.getByText('set-dark').click();
    });

    expect(document.documentElement.classList.contains('dark')).toBe(true);

    act(() => {
      screen.getByText('set-light').click();
    });

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('switches back to auto', () => {
    localStorage.setItem('theme-preference', 'dark');

    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    act(() => {
      screen.getByText('set-auto').click();
    });

    expect(screen.getByTestId('preference')).toHaveTextContent('auto');
    expect(localStorage.getItem('theme-preference')).toBe('auto');
  });
});
