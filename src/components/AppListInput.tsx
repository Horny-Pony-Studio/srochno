"use client";

import React, { forwardRef } from "react";
import { ListInput } from "konsta/react";

type Props = React.ComponentProps<typeof ListInput> & {
  labelText?: React.ReactNode;
};

const AppListInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, Props>(
  ({ labelText, className, label, ...props }, ref) => {
    const resolvedLabel =
      labelText !== undefined
        ? typeof labelText === "string"
          ? <span className="text-sm">{labelText}</span>
          : labelText
        : label;

    return (
      <ListInput
        ref={ref as unknown as React.Ref<HTMLInputElement | HTMLTextAreaElement>}
        label={resolvedLabel}
        className={className}
        {...props}
      />
    );
  }
);

AppListInput.displayName = "AppListInput";

export default React.memo(AppListInput);
