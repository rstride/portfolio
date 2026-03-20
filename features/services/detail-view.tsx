import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/content/site";
import { getServiceContent } from "@/features/services/model";
import { CtaBand } from "@/shared/components/cta-band";
import { PageHeader } from "@/shared/components/page-header";
import { cn } from "@/shared/lib/utils";

export function ServiceDetailView({ slug }: { slug: string }) {
  const content = getServiceContent(slug);

  if (!content) {
    return null;
  }

  const { service, details, paragraphs } = content;

  return (
    <section className="relative overflow-hidden pb-20 pt-4 lg:pb-24 lg:pt-6">
      <div className="page-shell flex flex-col gap-8">
        <PageHeader
          eyebrow="Service"
          title={service.title}
          description={service.description}
          meta={[service.format, service.timeline]}
          actions={
            <>
              <Link href="/contact" className={cn(buttonVariants({ size: "lg" }))}>
                Discuter de ce service
                <ArrowRight data-icon="inline-end" />
              </Link>
              <Link href="/services" className={buttonVariants({ variant: "outline", size: "lg" })}>
                Voir toutes les offres
              </Link>
            </>
          }
          aside={
            <div className="surface-panel p-6 sm:p-7">
              <span className="status-chip w-fit">Résultat attendu</span>
              <h2 className="font-headline mt-5 text-3xl font-bold uppercase leading-[0.96] tracking-[-0.04em] text-foreground">
                {service.outcome}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{service.proof}</p>
              <div className="mt-6 grid gap-3">
                <div className="surface-subtle p-4">
                  <p className="font-label text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Idéal pour
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">{service.bestFor}</p>
                </div>
                <div className="surface-subtle p-4">
                  <p className="font-label text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Pas idéal si
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {service.notFor}
                  </p>
                </div>
              </div>
            </div>
          }
        />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="metric-card">
            <p className="font-label text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Livrable clé
            </p>
            <p className="mt-3 text-base font-semibold text-foreground">{service.deliverables[0]}</p>
          </article>
          <article className="metric-card">
            <p className="font-label text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Format
            </p>
            <p className="mt-3 text-sm leading-relaxed text-foreground">{service.format}</p>
          </article>
          <article className="metric-card">
            <p className="font-label text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Temporalité
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{service.timeline}</p>
          </article>
          <article className="metric-card">
            <p className="font-label text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Public
            </p>
            <p className="mt-3 text-sm leading-relaxed text-foreground">
              {details?.audience.join(" · ")}
            </p>
          </article>
        </section>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="grid gap-6">
            <article className="surface-panel p-6 sm:p-8">
              <Badge variant="secondary" className="w-fit">
                Ce que la mission traite
              </Badge>
              <div className="mt-5 grid gap-5">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-relaxed text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>

            <article className="comparison-card">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h2 className="font-headline text-2xl font-bold uppercase tracking-[-0.03em] text-foreground">
                    Ce que vous recevez
                  </h2>
                  <div className="mt-5 flex flex-col gap-3">
                    {service.deliverables.map((deliverable) => (
                      <div key={deliverable} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <span className="mt-2 size-1.5 bg-primary" />
                        <span>{deliverable}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="font-headline text-2xl font-bold uppercase tracking-[-0.03em] text-foreground">
                    Ce que cela vous apporte
                  </h2>
                  <div className="mt-5 flex flex-col gap-3">
                    {service.benefits.map((benefit) => (
                      <div key={benefit} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <span className="mt-2 size-1.5 bg-primary" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            <article className="section-signal px-6 py-8 sm:px-8">
              <div className="relative z-10">
                <p className="eyebrow">Déroulé</p>
                <h2 className="font-headline mt-3 text-3xl font-bold uppercase leading-[0.96] tracking-[-0.04em] text-foreground">
                  Une mission courte, directe et cadrée
                </h2>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {details?.process.map((step, index) => (
                    <div key={step} className="process-card">
                      <div className="font-label text-[11px] uppercase tracking-[0.18em] text-primary">
                        Step_{index + 1}
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>

          <aside className="grid gap-6 lg:content-start">
            <article className="surface-panel p-6">
              <p className="font-label text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Introduction
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{details?.intro}</p>
            </article>

            <article className="surface-tint p-6">
              <p className="font-label text-[11px] uppercase tracking-[0.18em] text-primary">
                Question fréquente
              </p>
              <h2 className="font-headline mt-3 text-2xl font-bold uppercase leading-none tracking-[-0.03em] text-foreground">
                {details?.faqTitle}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-foreground">{details?.faqAnswer}</p>
            </article>

            <article className="surface-panel p-6">
              <p className="font-label text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Quand me contacter
              </p>
              <div className="mt-4 grid gap-3">
                {site.sales.contactReasons.slice(0, 2).map((reason) => (
                  <div key={reason} className="surface-subtle p-4 text-sm leading-relaxed text-muted-foreground">
                    {reason}
                  </div>
                ))}
              </div>
            </article>
          </aside>
        </section>

        <CtaBand
          cta={{
            eyebrow: "Prochaine étape",
            title: `Besoin de cadrer ${service.title.toLowerCase()} ?`,
            description:
              "Décrivez le périmètre, la stack et l’échéance. Je reviens avec un cadrage clair et la bonne proposition pour avancer.",
            primary: {
              label: "Me contacter",
              href: "/contact",
            },
            secondary: {
              label: "Comparer les services",
              href: "/services",
            },
          }}
        />
      </div>
    </section>
  );
}
