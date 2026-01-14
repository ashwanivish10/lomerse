import * as React from "react";
// ✅ NEW: Import the auto-resize component
import TextareaAutosize from "react-textarea-autosize";

import { cn } from "@/lib/utils";

// ✅ UPDATE: Update the props to match the new component
export type TextareaProps = React.ComponentProps<typeof TextareaAutosize>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextareaAutosize
        className={cn(
          // ✅ DESIGN: Removed `min-h-[80px]` as auto-resize handles it.
          // Added `transition-colors` for a smoother focus.
          "flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "transition-colors duration-150",
          className,
        )}
        ref={ref}
        // ✅ NEW: We set a default `minRows` instead of a fixed min-height.
        // The user can override this by passing their own `minRows` prop.
        minRows={3}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };