"use client";

import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/content/site";
import { getServiceIcon } from "@/features/services/model";
import { cn } from "@/shared/lib/utils";
import { SectionIntro } from "@/shared/components/section-intro";

export function ServicesSection() {
  return (
    <div className="page-shell">
      <SectionIntro
        eyebrow={site.homeSections.services.eyebrow}
        title={site.homeSections.services.title}
        description={site.homeSections.services.description}
      />

      <div className="mt-12 grid gap-4 lg:grid-cols-3">
        {site.homeServiceSpotlights.map((service, index) => {
          const Icon = getServiceIcon(service.icon);

          return (
            <article
              key={service.href}
              className={cn("comparison-card flex h-full flex-col", index % 2 === 1 && "lg:translate-y-8")}
            >
              <div className="flex items-start gap-4">
                <div className="flex size-12 items-center justify-center border border-primary/20 bg-primary/10 text-primary">
                  <Icon />
                </div>
                <div>
                  <Badge variant="secondary" className="mb-3">
                    {service.badge}
                  </Badge>
                  <h3 className="font-headline text-3xl font-bold uppercase tracking-[-0.04em] text-foreground">
                    {service.title}
                  </h3>
                </div>
              </div>

              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                {service.description}
              </p>

              <div className="mt-6 grid gap-3">
                <div className="surface-subtle p-4">
                  <p className="font-label text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Format
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">{service.format}</p>
                </div>
                <div className="surface-tint p-4">
                  <p className="font-label text-[11px] uppercase tracking-[0.18em] text-primary">
                    Quand le choisir
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    {service.bestFor}
                  </p>
                </div>
                <div className="surface-subtle p-4">
                  <p className="font-label text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Temporalité
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {service.timeline}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                {service.deliverables.slice(0, 2).map((deliverable) => (
                  <div key={deliverable} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="mt-2 size-1.5 bg-primary" />
                    <span>{deliverable}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-border/16 pt-5">
                <p className="text-sm leading-relaxed text-foreground">{service.outcome}</p>
                <Link
                  href={service.href}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "mt-4 px-0 text-foreground hover:border-transparent hover:bg-transparent"
                  )}
                >
                  Voir le détail
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
