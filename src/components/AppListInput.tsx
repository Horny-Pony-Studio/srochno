"use client";

import React, { forwardRef } from "react";
import { ListInput } from "konsta/react";

type Props = React.ComponentProps<typeof ListInput> & {
  labelText?: React.ReactNode;
};

const AppListInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, Props>(
  ({ labelText, className, ...props }, ref) => {
    return (
      <ListInput
        ref={ref as any}
        label={
          typeof labelText === "string" ? (
            <span className="text-sm">{labelText}</span>
          ) : (
            labelText
          )
        }
        className={className}
        {...props}
      />
    );
  }
);

AppListInput.displayName = "AppListInput";

export default AppListInput;

