import * as React from "react";
import { cn } from "@/shared/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full border-0 border-b border-input bg-transparent px-0 py-3 text-sm text-foreground shadow-none transition placeholder:text-muted-foreground/60 focus-visible:border-secondary focus-visible:outline-none focus-visible:ring-0 disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";
