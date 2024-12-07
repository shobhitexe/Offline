import * as React from "react";

import { cn } from "../lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      color = "ui-bg-inputField ui-placeholder-[#908d8b] text-main",
      type,
      ...props
    },
    ref
  ) => {
    return (
      <input
        type={type}
        min={0}
        className={cn(
          `ui-flex ui-h-10 ui-w-full ui-rounded-md ui-border ui-border-r ${color} ui-px-3 ui-py-5 ui-text-sm ui-ring-offset-main ui-file:border-0 ui-file:bg-transparent ui-file:text-sm ui-file:font-medium ui-focus-visible:outline-none ui-focus-visible:ring-2 ui-focus-visible:ring-main ui-focus-visible:ring-offset-2 ui-disabled:cursor-not-allowed ui-disabled:opacity-50`,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
