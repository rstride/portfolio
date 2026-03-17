"use client";

import Link from "next/link";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { site } from "@/content/site";
import { getServiceIcon, services } from "@/features/services/model";
import { cn } from "@/lib/utils";
import { SectionIntro } from "@/shared/components/section-intro";
import { revealInView } from "@/shared/motion/reveal";

export function ServicesSection() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionIntro
        eyebrow="Offres"
        title={site.sections.featuredServicesLabel}
        description={site.sections.servicesIntro}
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-[0.94fr_1.06fr]">
        <motion.div
          {...revealInView}
          transition={{ ...revealInView.transition, delay: 0.06 }}
          className="section-signal px-6 py-8 sm:px-8"
        >
          <div className="relative z-10 flex h-full flex-col justify-between gap-8">
            <div>
              <p className="eyebrow">Cadre d’intervention</p>
              <h3 className="mt-3 max-w-[12ch] text-3xl font-semibold tracking-tight text-foreground">
                Trois formats lisibles, sans jargon commercial inutile
              </h3>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                Chaque offre garde une forte identité visuelle, mais le site assume un système commun
                : promesse claire, livrable fort et résultat attendu.
              </p>
            </div>

            <div className="grid gap-3">
              {services.map((service) => (
                <div key={service.slug} className="surface-subtle p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{service.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {service.outcome}
                      </p>
                    </div>
                    <span className="hidden rounded-full bg-foreground px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-background sm:inline-flex">
                      {service.slug}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6">
          {services.map((service, index) => {
            const Icon = getServiceIcon(service.icon);
            return (
              <motion.div
                key={service.slug}
                {...revealInView}
                transition={{ ...revealInView.transition, delay: 0.1 + index * 0.06 }}
              >
                <Card className="surface-panel overflow-hidden">
                  <CardContent className="grid gap-5 p-6 md:grid-cols-[1fr_0.92fr]">
                    <div>
                      <CardHeader className="p-0">
                        <div className="flex items-start gap-4">
                          <div className="flex size-12 items-center justify-center rounded-[1rem] bg-[linear-gradient(135deg,var(--primary),var(--brand-secondary))] text-primary-foreground">
                            <Icon className="size-5" />
                          </div>
                          <div>
                            <Badge variant="outline" className="mb-3">
                              Offre
                            </Badge>
                            <CardTitle className="text-2xl">{service.title}</CardTitle>
                          </div>
                        </div>
                        <CardDescription className="mt-5 text-base leading-relaxed">
                          {service.description}
                        </CardDescription>
                      </CardHeader>
                    </div>

                    <div className="grid gap-3">
                      <div className="surface-subtle p-4">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                          Livrable clé
                        </p>
                        <p className="mt-2 text-sm font-semibold text-foreground">
                          {service.deliverables[0]}
                        </p>
                      </div>
                      <div className="surface-tint p-4">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-primary">
                          Idéal pour
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-foreground">
                          {service.bestFor}
                        </p>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="border-t border-border/60 px-6 pb-6 pt-4">
                    <Link
                      href={`/services/${service.slug}`}
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "px-0 text-foreground hover:bg-transparent"
                      )}
                    >
                      Voir le détail
                      <ArrowRight className="size-4" />
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
