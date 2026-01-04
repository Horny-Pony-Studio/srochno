"use client";
import React from 'react';
import { App } from 'konsta/react';
import "konsta/theme.css";


export default function KonstaProvider({ children }: { children: React.ReactNode }) {
  return <App theme="ios">{children}</App>;
}