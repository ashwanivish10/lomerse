import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
// ✅ UPDATE: Import Plus and Minus icons
import { Plus, Minus } from "lucide-react";

import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    // ✅ DESIGN: Replaced `border-b` with a full card style.
    // `overflow-hidden` is key for the rounded corners.
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden",
      className,
    )}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        // ✅ DESIGN: Added `p-4`, removed underline, added hover/open background
        "flex flex-1 items-center justify-between p-4 font-medium transition-all hover:no-underline hover:bg-muted/10 [&[data-state=open]]:bg-muted/10",
        className,
      )}
      {...props}
    >
      {children}
      {/* ✅ DESIGN: Replaced Chevron with Plus/Minus for a clearer UI */}
      <Plus className="h-5 w-5 shrink-0 transition-transform duration-200 [data-state=open]:hidden" />
      <Minus className="h-5 w-5 shrink-0 transition-transform duration-200 hidden [data-state=open]:block" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    {/* ✅ DESIGN: Added `px-4` to match the trigger's padding */}
    <div className={cn("px-4 pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };