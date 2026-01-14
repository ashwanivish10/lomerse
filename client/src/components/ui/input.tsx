import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Optional icon displayed inside the input (left side) */
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", icon, ...props }, ref) => {
    const baseStyles =
      "flex w-full h-11 rounded-xl border border-input bg-background px-4 py-2 text-sm text-foreground " +
      "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 " +
      "disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ease-in-out";

    if (icon) {
      return (
        <div className="relative w-full">
          {/* Icon Container */}
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/80 flex items-center justify-center">
            {icon}
          </span>

          {/* Input Field */}
          <input
            ref={ref}
            type={type}
            className={cn(baseStyles, "pl-10", className)}
            {...props}
          />
        </div>
      );
    }

    return (
      <input
        ref={ref}
        type={type}
        className={cn(baseStyles, className)}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
