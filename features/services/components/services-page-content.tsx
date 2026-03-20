"use client";

import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/content/site";
import { getServiceIcon, services } from "@/features/services/model";
import { CtaBand } from "@/shared/components/cta-band";
import { EngagementSteps } from "@/shared/components/engagement-steps";
import { PageHeader } from "@/shared/components/page-header";
import { cn } from "@/shared/lib/utils";

export function ServicesPageContent() {
  return (
    <div className="relative overflow-hidden pb-20 pt-4 lg:pb-24 lg:pt-6">
      <div className="page-shell flex flex-col gap-8">
        <PageHeader
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
              <Link href="/contact" className={cn(buttonVariants({ size: "lg" }))}>
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
              <span className="status-chip w-fit">Comment choisir</span>
              <h2 className="font-headline mt-5 text-3xl font-bold uppercase leading-[0.96] tracking-[-0.04em] text-foreground">
                Le bon format dépend surtout de votre question de départ
              </h2>
              <div className="mt-6 grid gap-3">
                <div className="surface-subtle p-4">
                  <p className="font-headline text-xl font-bold uppercase text-foreground">Pentest</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Pour valider l’exposition réelle d’une application, d’une API ou d’un parcours
                    sensible.
                  </p>
                </div>
                <div className="surface-subtle p-4">
                  <p className="font-headline text-xl font-bold uppercase text-foreground">Audit</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Pour savoir quoi traiter en premier quand le risque est diffus ou mal cadré.
                  </p>
                </div>
                <div className="surface-subtle p-4">
                  <p className="font-headline text-xl font-bold uppercase text-foreground">
                    Formation
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Pour faire progresser un public avec un format vivant, concret et adapté.
                  </p>
                </div>
              </div>
            </div>
          }
        />

        <section className="grid gap-4 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = getServiceIcon(service.icon);

            return (
              <article
                key={service.slug}
                className={cn("comparison-card flex h-full flex-col", index % 2 === 1 && "lg:translate-y-8")}
              >
                <div className="flex items-start gap-4">
                  <div className="flex size-12 items-center justify-center border border-primary/20 bg-primary/10 text-primary">
                    <Icon />
                  </div>
                  <div>
                    <Badge variant="secondary" className="mb-3">
                      Offre
                    </Badge>
                    <h2 className="font-headline text-3xl font-bold uppercase tracking-[-0.04em] text-foreground">
                      {service.title}
                    </h2>
                  </div>
                </div>

                <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                  {service.description}
                </p>

                <div className="mt-6 grid gap-3">
                  <div className="surface-tint p-4">
                    <p className="font-label text-[11px] uppercase tracking-[0.18em] text-primary">
                      Idéal pour
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-foreground">
                      {service.bestFor}
                    </p>
                  </div>
                  <div className="surface-subtle p-4">
                    <p className="font-label text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      Pas idéal si
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {service.notFor}
                    </p>
                  </div>
                  <div className="surface-subtle p-4">
                    <p className="font-label text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      Format
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-foreground">{service.format}</p>
                  </div>
                </div>

                <div className="mt-6 border-t border-border/16 pt-5">
                  <p className="font-label text-[11px] uppercase tracking-[0.18em] text-secondary">
                    Résultat attendu
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {service.outcome}
                  </p>

                  <div className="mt-4 flex flex-col gap-2">
                    {service.deliverables.slice(0, 3).map((deliverable) => (
                      <div key={deliverable} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <span className="mt-2 size-1.5 bg-primary" />
                        <span>{deliverable}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={`/services/${service.slug}`}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "mt-5 px-0 text-foreground hover:border-transparent hover:bg-transparent"
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
