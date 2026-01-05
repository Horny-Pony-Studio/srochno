"use client"

import React from 'react';
import { Navbar, NavbarBackLink } from 'konsta/react';
import { useRouter } from 'next/navigation';

type Props = {
  title?: React.ReactNode;
  backLink?: boolean;
  onBackAction?: () => void;
  navRight?: React.ReactNode;
  titleFontSizeIos?: string;
  className?: string;
};

export default function AppNavbar({
  title,
  backLink = false,
  onBackAction,
  navRight,
  titleFontSizeIos = "text-[24px]",
  className = "bg-white border-b border-[#C6C6C8] px-2 py-3",
}: Props) {
  const router = useRouter();
  const isPreview = typeof window !== 'undefined' && window.location.href.includes('examplePreview');

  const handleBack = () => {
    if (onBackAction) return onBackAction();
    router.back();
  };

  return (
    <Navbar
      titleFontSizeIos={titleFontSizeIos}
      className={className}
      title={title}
      left={backLink && !isPreview ? <NavbarBackLink onClick={handleBack} /> : undefined}
      right={navRight}
    />
  );
}