import * as React from "react";
import { cn } from "../lib/utils";

interface FormInputProps extends React.ComponentProps<"input"> {
  label?: string;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, type, label, ...props }, ref) => {
    return (
      <div className="grid w-full max-w-sm items-center">
        <label className="text-sm" htmlFor={props.id}>
          {label}
        </label>
        <input
          id={props.id}
          type={type}
          className={cn(
            "ui-flex ui-h-10 ui-w-full ui-rounded-md ui-border ui-border-input ui-bg-background ui-px-3 ui-py-2 ui-text-base ui-ring-offset-background file:ui-border-0 file:ui-bg-transparent file:ui-text-sm file:ui-font-medium file:ui-text-foreground placeholder:ui-text-muted-foreground focus-visible:ui-outline-none focus-visible:ui-ring-2 focus-visible:ui-ring-ring focus-visible:ui-ring-offset-2 disabled:ui-cursor-not-allowed disabled:ui-opacity-50 md:ui-text-sm",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export { FormInput };
