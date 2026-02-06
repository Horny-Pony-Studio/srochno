"use client";
import React from 'react';
import { App } from 'konsta/react';
import { useTheme } from '@/src/providers/ThemeProvider';
import "konsta/theme.css";


export default function KonstaProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <App theme="ios" dark={theme === 'dark'}>
      {children}
    </App>
  );
}