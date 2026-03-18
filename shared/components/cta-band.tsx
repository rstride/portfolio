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
      <div className="relative z-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="max-w-3xl">
          <p className="eyebrow text-white/70">{cta.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {cta.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/76 sm:text-lg">
            {cta.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 lg:justify-end">
          <Link
            href={cta.primary.href}
            className={cn(
              buttonVariants({ size: "lg" }),
              "border-0 bg-[linear-gradient(135deg,var(--primary),var(--brand-secondary))] text-primary-foreground shadow-[0_14px_30px_rgba(22,126,102,0.22)]"
            )}
          >
            {cta.primary.label}
            <ArrowRight data-icon="inline-end" />
          </Link>

          {cta.secondary ? (
            <Link
              href={cta.secondary.href}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-white/12 bg-white/8 text-white hover:bg-white/12 hover:text-white"
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
