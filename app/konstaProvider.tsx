"use client";
import React, { useState, useEffect } from 'react';
import { App } from 'konsta/react';
import { useTheme } from '@/src/providers/ThemeProvider';
import ToastContainer from '@/components/ToastContainer';

export default function KonstaProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <App theme="ios" dark={mounted && theme === 'dark'}>
      {children}
      <ToastContainer />
    </App>
  );
}