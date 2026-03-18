import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
  aside?: ReactNode;
  meta?: readonly string[];
  className?: string;
  titleClassName?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  actions,
  aside,
  meta,
  className,
  titleClassName,
}: PageHeroProps) {
  return (
    <section className={cn("page-hero hero-spotlight px-6 py-8 sm:px-8 lg:px-12 lg:py-12", className)}>
      <div className="hero-grid absolute inset-0 opacity-35" />
      <div
        className={cn(
          "relative z-10 grid gap-10",
          aside ? "lg:grid-cols-[minmax(0,1.04fr)_0.96fr] lg:items-center" : "max-w-3xl"
        )}
      >
        <div className="flex flex-col gap-6">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <div className="flex flex-col gap-4">
            <h1
              className={cn(
                "max-w-[13ch] text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl",
                titleClassName
              )}
            >
              {title}
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-[1.15rem]">
              {description}
            </p>
          </div>

          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}

          {meta?.length ? (
            <div className="flex flex-wrap gap-2">
              {meta.map((item) => (
                <span key={item} className="brand-chip text-[11px] font-medium text-foreground">
                  {item}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {aside ? <div className="relative z-10">{aside}</div> : null}
      </div>
    </section>
  );
}
