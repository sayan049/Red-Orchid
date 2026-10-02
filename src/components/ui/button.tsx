import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { MetallicButton } from "./metallic-button"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "metallic-btn-root metallic-btn-graphite text-bone hover:text-white rounded-xl",
        metallic:
          "metallic-btn-root metallic-btn-graphite text-bone hover:text-white rounded-xl",
        "metallic-silver":
          "metallic-btn-root metallic-btn-silver text-bone hover:text-white rounded-xl",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-white/10 bg-transparent hover:border-white/30 hover:text-white text-white/80",
        secondary:
          "bg-white/10 text-white hover:bg-white/20",
        ghost: "hover:bg-white/10 hover:text-white text-white/80",
        link: "text-orchid underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-lg px-3.5 text-xs",
        lg: "h-13 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const isMetallic =
      variant === "default" ||
      variant === "metallic" ||
      variant === "metallic-silver" ||
      variant === undefined

    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      )
    }

    if (isMetallic) {
      const isSilver = variant === "metallic-silver"
      const innerRadius =
        size === "sm" ? "rounded-[7px]" : size === "lg" ? "rounded-[11px]" : "rounded-[9px]"
      return (
        <button
          className={cn(
            buttonVariants({ variant, size, className }),
            isSilver ? "metallic-btn-silver" : "metallic-btn-graphite",
            "p-[1px]"
          )}
          ref={ref}
          {...props}
        >
          <span
            className={cn(
              "metallic-btn-inner w-full h-full px-4 sm:px-6 py-2",
              innerRadius
            )}
          >
            <span className="metallic-btn-brush" aria-hidden="true" />
            <span className="metallic-btn-reflection" aria-hidden="true" />
            <span
              className="absolute top-0 left-3 right-3 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none opacity-75 group-hover:opacity-100 transition-opacity"
              aria-hidden="true"
            />
            <span className="relative z-10 flex items-center justify-center gap-2">
              {children}
            </span>
          </span>
        </button>
      )
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  },
)
Button.displayName = "Button"

export { Button, MetallicButton, buttonVariants }
