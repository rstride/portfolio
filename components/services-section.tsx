"use client";

import Link from "next/link";

import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Search, Shield } from "lucide-react";

import { landingCardClass, landingReveal, SectionIntro } from "@/components/landing/shared";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const serviceConfig: { [key: string]: { icon: React.ComponentType<{ className?: string }>; color: string } } = {
  pentest: {
    icon: Shield,
    color: "text-blue-600 dark:text-blue-400",
  },
  audit: {
    icon: Search,
    color: "text-emerald-600 dark:text-emerald-400",
  },
  training: {
    icon: GraduationCap,
    color: "text-cyan-600 dark:text-cyan-400",
  },
};

export function ServicesSection() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionIntro
        eyebrow="Offres"
        title={site.sections.featuredServicesLabel}
        description={site.sections.servicesIntro}
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {site.services.map((service, index) => {
          const config = serviceConfig[service.slug] || {
            icon: Shield,
            color: "text-green-600 dark:text-green-400",
          };
          const IconComponent = config.icon;

          return (
            <motion.div
              key={service.slug}
              {...landingReveal}
              transition={{ ...landingReveal.transition, delay: index * 0.08 }}
            >
              <Card className={cn(landingCardClass, "flex h-full flex-col")}>
                <CardHeader className="gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-xl border border-border/60 bg-background/60">
                      <IconComponent className={cn("size-6", config.color)} />
                    </div>
                    <div>
                      <Badge variant="outline" className={cn("mb-2 border-current/20 px-2 py-0.5", config.color)}>
                        Offre
                      </Badge>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col">
                  <CardDescription className="mb-6 text-base leading-relaxed">
                    {service.description}
                  </CardDescription>

                  <div className="mb-6 rounded-xl border border-border/60 bg-background/50 p-3">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      Livrable clé
                    </div>
                    <div className="mt-2 text-sm font-semibold text-foreground">
                      {service.deliverables[0]}
                    </div>
                  </div>

                  <div className="mb-6 rounded-xl border border-primary/15 bg-primary/5 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-primary">Résultat attendu</div>
                    <p className="mt-2 text-sm text-muted-foreground">{service.outcome}</p>
                  </div>

                  <div className="mb-6 rounded-xl border border-border/60 bg-background/50 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Idéal pour</div>
                    <p className="mt-2 text-sm text-muted-foreground">{service.bestFor}</p>
                  </div>
                </CardContent>

                <CardFooter>
                  <Link
                    href="/contact"
                    className={cn(buttonVariants({ variant: "ghost" }), "mt-auto px-0 hover:bg-transparent", config.color)}
                  >
                    Me contacter
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
