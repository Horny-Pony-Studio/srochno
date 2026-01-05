"use client";

import React from "react";
import { Page as KonstaPage } from "konsta/react";
import AppNavbar from "./AppNavbar";

type Props = {
  title?: string;
  backLink?: boolean;
  onBackAction?: () => void;
  navRight?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

export default function AppPage({
  title,
  backLink = true,
  onBackAction,
  navRight,
  children,
  className,
}: Props) {
  return (
    <KonstaPage className={className}>
      {title && (
        <AppNavbar title={title} backLink={backLink} onBackAction={onBackAction} navRight={navRight} />
      )}
      {children}
    </KonstaPage>
  );
}
