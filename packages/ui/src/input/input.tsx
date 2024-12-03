import * as React from "react";

import { cn } from "../lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, color = "text-main", type, ...props }, ref) => {
    return (
      <input
        type={type}
        min={0}
        className={cn(
          `ui-flex ui-text-white ui-bg-transparent ui-h-10 ui-w-full ui-border-b ${color} ui-px-3 ui-py-5 ui-text-sm focus:ui-outline-none ui-file:border-0 ui-file:bg-transparent ui-file:text-sm ui-file:font-medium ui-focus-visible:outline-none ui-disabled:cursor-not-allowed ui-disabled:opacity-50`,
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
