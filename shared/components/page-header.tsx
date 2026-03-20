import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
  aside?: ReactNode;
  meta?: readonly string[];
  className?: string;
  titleClassName?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  aside,
  meta,
  className,
  titleClassName,
}: PageHeaderProps) {
  return (
    <section className={cn("px-1 py-2 sm:px-0 lg:py-4", className)}>
      <div
        className={cn(
          "grid gap-8 lg:gap-10",
          aside ? "lg:grid-cols-[minmax(0,1.04fr)_0.96fr] lg:items-start" : "max-w-3xl"
        )}
      >
        <div className="flex flex-col gap-6">
          {eyebrow ? <span className="status-chip w-fit">{eyebrow}</span> : null}

          <div className="flex flex-col gap-4">
            <h1
              className={cn(
                "font-headline max-w-[13ch] text-3xl font-bold uppercase leading-[0.98] tracking-[-0.04em] text-foreground sm:text-4xl lg:text-5xl",
                titleClassName
              )}
            >
              {title}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {description}
            </p>
          </div>

          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}

          {meta?.length ? (
            <div className="flex flex-wrap gap-2">
              {meta.map((item) => (
                <span key={item} className="meta-chip text-foreground">
                  {item}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {aside ? <div>{aside}</div> : null}
      </div>
    </section>
  );
}
