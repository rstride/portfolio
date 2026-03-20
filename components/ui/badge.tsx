import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/shared/lib/utils"

const badgeVariants = cva(
  "font-label inline-flex items-center border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0",
  {
    variants: {
      variant: {
        default:
          "border-primary/30 bg-primary/12 text-primary hover:bg-primary/18",
        secondary:
          "border-secondary/25 bg-secondary/12 text-secondary hover:bg-secondary/18",
        destructive: "border-destructive/30 bg-destructive/15 text-destructive hover:bg-destructive/20",
        outline: "border-border/25 bg-card/80 text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
