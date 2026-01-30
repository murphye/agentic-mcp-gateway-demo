"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactElement,
  cloneElement,
  isValidElement,
} from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-pear text-gray-dark hover:bg-pear-dark",
        secondary: "bg-gray-light text-gray-dark hover:bg-gray-200",
        outline: "border border-gray-300 bg-white hover:bg-gray-light",
        ghost: "hover:bg-gray-light",
        link: "text-pear-dark underline-offset-4 hover:underline",
        dark: "bg-gray-dark text-white hover:bg-gray-700",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        default: "h-11 px-6 text-base",
        lg: "h-14 px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size, className }));

    if (asChild && isValidElement(children)) {
      return cloneElement(children as ReactElement<{ className?: string }>, {
        className: cn(classes, (children as ReactElement<{ className?: string }>).props.className),
        ...props,
      });
    }

    return (
      <button className={classes} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
