import Link from "next/link";

import { ArrowRight } from "lucide-react";

import type { PageCTA } from "@/content/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/shared/lib/utils";

type CtaBandProps = {
  cta: PageCTA;
  className?: string;
};

export function CtaBand({ cta, className }: CtaBandProps) {
  return (
    <section className={cn("cta-band", className)}>
      <div className="hero-grid absolute inset-0 opacity-35" />
      <div className="relative z-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="max-w-3xl">
          <span className="status-chip w-fit">{cta.eyebrow}</span>
          <h2 className="font-headline mt-5 text-3xl font-bold uppercase leading-[0.98] tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
            {cta.title}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/72 sm:text-lg">
            {cta.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 lg:justify-end">
          <Link
            href={cta.primary.href}
            className={buttonVariants({ size: "lg" })}
          >
            {cta.primary.label}
            <ArrowRight data-icon="inline-end" />
          </Link>

          {cta.secondary ? (
            <Link
              href={cta.secondary.href}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-white/14 bg-white/6 text-white hover:bg-white/10 hover:text-white"
              )}
            >
              {cta.secondary.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
