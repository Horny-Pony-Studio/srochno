"use client";

import React from "react";
import { Page as KonstaPage } from "konsta/react";

type Props = {
  children?: React.ReactNode;
  className?: string;
};

export default function AppPage({ children, className }: Props) {
  return <KonstaPage className={className}>{children}</KonstaPage>;
}
