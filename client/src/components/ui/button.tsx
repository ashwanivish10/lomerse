// import * as React from "react"
// import { Slot } from "@radix-ui/react-slot"
// import { cva, type VariantProps } from "class-variance-authority"

// import { cn } from "@/lib/utils"

// const buttonVariants = cva(
//   "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0" +
//   " hover-elevate active-elevate-2",
//   {
//     variants: {
//       variant: {
//         default:
//           "bg-primary text-primary-foreground border border-primary-border",
//         destructive:
//           "bg-destructive text-destructive-foreground border border-destructive-border",
//         outline:
//           // Shows the background color of whatever card / sidebar / accent background it is inside of.
//           // Inherits the current text color.
//           " border [border-color:var(--button-outline)]  shadow-xs active:shadow-none ",
//         secondary: "border bg-secondary text-secondary-foreground border border-secondary-border ",
//         // Add a transparent border so that when someone toggles a border on later, it doesn't shift layout/size.
//         ghost: "border border-transparent",
//       },
//       // Heights are set as "min" heights, because sometimes Ai will place large amount of content
//       // inside buttons. With a min-height they will look appropriate with small amounts of content,
//       // but will expand to fit large amounts of content.
//       size: {
//         default: "min-h-9 px-4 py-2",
//         sm: "min-h-8 rounded-md px-3 text-xs",
//         lg: "min-h-10 rounded-md px-8",
//         icon: "h-9 w-9",
//       },
//     },
//     defaultVariants: {
//       variant: "default",
//       size: "default",
//     },
//   },
// )

// export interface ButtonProps
//   extends React.ButtonHTMLAttributes<HTMLButtonElement>,
//     VariantProps<typeof buttonVariants> {
//   asChild?: boolean
// }

// const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
//   ({ className, variant, size, asChild = false, ...props }, ref) => {
//     const Comp = asChild ? Slot : "button"
//     return (
//       <Comp
//         className={cn(buttonVariants({ variant, size, className }))}
//         ref={ref}
//         {...props}
//       />
//     )
//   },
// )
// Button.displayName = "Button"

// export { Button, buttonVariants }


import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 ease-in-out select-none " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/70 disabled:pointer-events-none disabled:opacity-50 " +
    "active:scale-[0.97] shadow-sm hover:shadow-md",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600",
        destructive:
          "bg-gradient-to-r from-rose-500 to-red-500 text-white hover:from-rose-600 hover:to-red-600",
        outline:
          "border border-gray-300 text-gray-900 bg-transparent hover:bg-gray-100/60 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800/60",
        secondary:
          "bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
        ghost:
          "bg-transparent text-gray-700 hover:bg-gray-100/50 dark:text-gray-200 dark:hover:bg-gray-800/50",
        glass:
          "backdrop-blur-md bg-white/20 border border-white/30 text-white hover:bg-white/30",
      },
      size: {
        default: "min-h-10 px-5 py-2.5 text-sm",
        sm: "min-h-8 rounded-lg px-3 text-xs",
        lg: "min-h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10 p-0 flex items-center justify-center",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
