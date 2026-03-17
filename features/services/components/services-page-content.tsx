"use client";

import Link from "next/link";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Target } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { site } from "@/content/site";
import { getServiceIcon, services } from "@/features/services/model";
import { cn } from "@/lib/utils";
import { BackgroundEffects } from "@/shared/components/background-effects";
import { SectionIntro } from "@/shared/components/section-intro";
import { revealInView } from "@/shared/motion/reveal";

export function ServicesPageContent() {
  return (
    <div className="relative overflow-hidden">
      <BackgroundEffects variant="hero" intensity="medium" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-18 pt-6 sm:px-6 lg:px-8 lg:pb-24 lg:pt-10">
        <section className="section-signal px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
          <SectionIntro
            eyebrow="Services"
            title={site.sections.servicesTitle}
            description={site.sections.servicesIntro}
            align="left"
            className="mx-0 max-w-4xl"
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {services.map((service, index) => {
              const Icon = getServiceIcon(service.icon);

              return (
                <motion.div
                  key={service.slug}
                  {...revealInView}
                  transition={{ ...revealInView.transition, delay: index * 0.06 }}
                >
                  <Card className="surface-panel flex h-full flex-col overflow-hidden">
                    <CardHeader className="gap-5">
                      <div className="flex items-center gap-4">
                        <div className="flex size-12 items-center justify-center rounded-[1rem] bg-[linear-gradient(135deg,var(--primary),var(--brand-secondary))] text-primary-foreground">
                          <Icon className="size-5" />
                        </div>
                        <div>
                          <Badge variant="outline" className="mb-2">
                            Offre
                          </Badge>
                          <CardTitle className="text-2xl">{service.title}</CardTitle>
                        </div>
                      </div>
                      <CardDescription className="text-base leading-relaxed">
                        {service.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="flex flex-1 flex-col gap-5">
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
                          Résultat attendu
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-foreground">
                          {service.outcome}
                        </p>
                      </div>

                      <div className="grid gap-3">
                        {service.deliverables.slice(0, 3).map((deliverable) => (
                          <div
                            key={deliverable}
                            className="flex items-start gap-3 text-sm text-muted-foreground"
                          >
                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                            <span>{deliverable}</span>
                          </div>
                        ))}
                      </div>

                      <Link
                        href={`/services/${service.slug}`}
                        className={cn(
                          buttonVariants({ variant: "ghost" }),
                          "mt-auto justify-start px-0 text-foreground hover:bg-transparent"
                        )}
                      >
                        Voir le détail
                        <ArrowRight className="size-4" />
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        <motion.section
          {...revealInView}
          transition={{ ...revealInView.transition, delay: 0.18 }}
          className="mt-8"
        >
          <Card className="surface-contrast overflow-hidden">
            <CardContent className="grid gap-6 p-8 lg:grid-cols-[1fr_20rem] lg:items-center">
              <div className="space-y-4">
                <p className="eyebrow text-white/72">Cadrage rapide</p>
                <h2 className="text-3xl font-semibold tracking-tight text-white">
                  Vous avez déjà un périmètre ou une échéance proche
                </h2>
                <p className="max-w-2xl text-base leading-relaxed text-white/76">
                  Décrivez le contexte, la stack et la contrainte principale. Je reviens avec le bon
                  format d’intervention, sans proposition floue ni surdimensionnée.
                </p>
              </div>
              <div className="rounded-[1.3rem] border border-white/12 bg-white/8 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-[1rem] bg-white/10 text-white">
                    <Target className="size-5" />
                  </div>
                  <p className="text-sm leading-relaxed text-white/76">
                    Cadrage, priorisation et proposition adaptée à votre besoin réel.
                  </p>
                </div>
                <Link
                  href="/contact"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "mt-5 w-full border-0 bg-[linear-gradient(135deg,var(--primary),var(--brand-secondary))] text-primary-foreground"
                  )}
                >
                  Me contacter
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}
