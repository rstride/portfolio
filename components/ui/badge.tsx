import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-primary/40 bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-medium",
        className
      )}
      {...props}
    />
  );
}

