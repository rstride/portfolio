import * as React from "react";
import { cn } from "@/shared/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[120px] w-full border-0 border-b border-input bg-transparent px-0 py-3 text-sm text-foreground shadow-none transition placeholder:text-muted-foreground/60 focus-visible:border-secondary focus-visible:outline-none focus-visible:ring-0 disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";
