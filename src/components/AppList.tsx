"use client"

import {List} from "konsta/react";

export default function AppList({children}: {children: React.ReactNode}) {
  return (
    <List strongIos insetIos className={"m-0"}>
      {children}
    </List>
  )
}