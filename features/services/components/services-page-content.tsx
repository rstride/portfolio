"use client";

import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/content/site";
import { getServiceIcon, services } from "@/features/services/model";
import { CtaBand } from "@/shared/components/cta-band";
import { EngagementSteps } from "@/shared/components/engagement-steps";
import { PageHero } from "@/shared/components/page-hero";
import { cn } from "@/shared/lib/utils";

export function ServicesPageContent() {
  return (
    <div className="relative overflow-hidden pb-20 pt-6 lg:pb-24 lg:pt-10">
      <div className="page-shell flex flex-col gap-8">
        <PageHero
          eyebrow="Services"
          title={site.sections.servicesTitle}
          description={site.sections.servicesIntro}
          meta={[
            "Choisir le bon format",
            "Périmètre clair",
            "Livrables orientés décision",
          ]}
          actions={
            <>
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "border-0 bg-[linear-gradient(135deg,var(--primary),var(--brand-secondary))] text-primary-foreground shadow-[0_16px_34px_rgba(22,126,102,0.24)]"
                )}
              >
                Prendre contact
                <ArrowRight data-icon="inline-end" />
              </Link>
              <Link href="/" className={buttonVariants({ variant: "outline", size: "lg" })}>
                Retour à l’accueil
              </Link>
            </>
          }
          aside={
            <div className="surface-panel p-6 sm:p-7">
              <p className="eyebrow">Comment choisir</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                Le bon format dépend surtout de votre question de départ
              </h2>
              <div className="mt-6 grid gap-3">
                <div className="surface-subtle p-4">
                  <p className="text-sm font-semibold text-foreground">Pentest</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Pour valider l’exposition réelle d’une application, d’une API ou d’un parcours
                    sensible.
                  </p>
                </div>
                <div className="surface-subtle p-4">
                  <p className="text-sm font-semibold text-foreground">Audit</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Pour savoir quoi traiter en premier quand le risque est diffus ou mal cadré.
                  </p>
                </div>
                <div className="surface-subtle p-4">
                  <p className="text-sm font-semibold text-foreground">Formation</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Pour faire progresser un public avec un format vivant, concret et adapté.
                  </p>
                </div>
              </div>
            </div>
          }
        />

        <section className="grid gap-6 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = getServiceIcon(service.icon);

            return (
              <article key={service.slug} className="comparison-card flex h-full flex-col">
                <div className="flex items-start gap-4">
                  <div className="flex size-12 items-center justify-center rounded-[1rem] bg-[linear-gradient(135deg,var(--primary),var(--brand-secondary))] text-primary-foreground">
                    <Icon />
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-3">
                      Offre
                    </Badge>
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                      {service.title}
                    </h2>
                  </div>
                </div>

                <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                  {service.description}
                </p>

                <div className="mt-6 grid gap-3">
                  <div className="surface-tint p-4">
                    <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-primary">
                      Idéal pour
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-foreground">
                      {service.bestFor}
                    </p>
                  </div>
                  <div className="surface-subtle p-4">
                    <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
                      Pas idéal si
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {service.notFor}
                    </p>
                  </div>
                  <div className="surface-subtle p-4">
                    <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
                      Format
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-foreground">{service.format}</p>
                  </div>
                </div>

                <div className="mt-6 border-t border-border/60 pt-5">
                  <p className="text-sm font-semibold text-foreground">Résultat attendu</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {service.outcome}
                  </p>

                  <div className="mt-4 flex flex-col gap-2">
                    {service.deliverables.slice(0, 3).map((deliverable) => (
                      <div key={deliverable} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <span className="mt-2 size-1.5 rounded-full bg-primary" />
                        <span>{deliverable}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={`/services/${service.slug}`}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "mt-5 px-0 text-foreground hover:bg-transparent"
                    )}
                  >
                    Voir le détail
                    <ArrowRight data-icon="inline-end" />
                  </Link>
                </div>
              </article>
            );
          })}
        </section>

        <EngagementSteps
          eyebrow="Mission type"
          title="Une intervention courte, lisible et cadrée"
          description="Le but n’est pas d’ajouter une couche de complexité. Le bon format doit aider à agir, corriger et décider rapidement."
          steps={site.engagementSteps}
        />

        <CtaBand cta={site.pageCtas.services} />
      </div>
    </div>
  );
}
