"use client"

import {Navbar} from "konsta/react";

export default function AppNavbar ({title}: {title: string}) {
  return (
    <Navbar titleFontSizeIos={"text-[24px]"} className={"bg-white border-b border-[#C6C6C8] px-4 py-3"} title={title} />
  )
}