import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { site } from "@/content/site";
import { getServiceContent } from "@/lib/service-details";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const content = getServiceContent(slug);

  if (!content) {
    return {
      title: "Service introuvable",
    };
  }

  return {
    title: `${content.service.title} | ${site.name}`,
    description: content.service.description,
  };
}

export function generateStaticParams() {
  return site.services.map((service) => ({
    slug: service.slug,
  }));
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const content = getServiceContent(slug);

  if (!content) {
    notFound();
  }

  const { service, details, paragraphs } = content;

  return (
    <section className="relative overflow-hidden">
      <div className="hero-grid absolute inset-x-0 top-0 -z-10 h-80 opacity-45" />

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-10">
        <div className="section-signal px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
          <header className="max-w-3xl">
            <Badge variant="outline" className="mb-4 uppercase tracking-[0.2em]">
              Service
            </Badge>
            <h1 className="max-w-[12ch] text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {service.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              {service.description}
            </p>
          </header>

          <Card className="surface-tint mt-10 overflow-hidden">
            <CardContent className="grid gap-5 p-6 md:grid-cols-3">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Livrable clé</div>
                <div className="mt-2 text-base font-semibold text-foreground">{service.deliverables[0]}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Idéal pour</div>
                <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.bestFor}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Pas idéal si</div>
                <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.notFor}</div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_350px]">
            <div className="space-y-8">
              <Card className="surface-panel shadow-none">
                <CardHeader>
                  <CardTitle className="text-xl">Ce que la mission permet de traiter</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-5">
                  {paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-base leading-relaxed text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                </CardContent>
              </Card>

              <Card className="surface-panel shadow-none">
                <CardContent className="grid gap-8 p-8 md:grid-cols-[1fr_auto_1fr]">
                  <div>
                    <CardHeader className="p-0 pb-4">
                      <CardTitle className="text-lg">Ce que vous recevez</CardTitle>
                    </CardHeader>
                    <div className="flex flex-col gap-3">
                      {service.deliverables.map((deliverable) => (
                        <div key={deliverable} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                          <span>{deliverable}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator orientation="vertical" className="hidden md:block" />
                  <div>
                    <CardHeader className="p-0 pb-4">
                      <CardTitle className="text-lg">Ce que cela vous apporte</CardTitle>
                    </CardHeader>
                    <div className="flex flex-col gap-3">
                      {service.benefits.map((benefit) => (
                        <div key={benefit} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {details?.process?.length ? (
                <Card className="surface-contrast overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Déroulé de mission</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      {details.process.map((step, index) => (
                        <div key={step} className="rounded-[1.25rem] border border-white/12 bg-white/8 p-4">
                          <div className="text-xs uppercase tracking-[0.2em] text-white/68">Étape {index + 1}</div>
                          <p className="mt-2 text-sm leading-relaxed text-white/78">{step}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </div>

            <div className="space-y-6">
              <Card className="surface-panel shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg">Résultat attendu</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">{service.outcome}</p>
                </CardContent>
              </Card>

              {details?.audience?.length ? (
                <Card className="surface-tint shadow-none">
                  <CardHeader>
                    <CardTitle className="text-lg">Pour qui ?</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {details.audience.map((item) => (
                      <Badge key={item} variant="secondary" className="brand-chip border-0 bg-transparent">
                        {item}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>
              ) : null}

              <Card className="surface-panel shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg">Quand me contacter</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {site.sales.contactReasons.slice(0, 2).map((reason) => (
                    <div key={reason} className="surface-subtle p-4 text-sm leading-relaxed text-muted-foreground">
                      {reason}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="surface-contrast overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Passer à l’étape suivante</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <p className="text-sm leading-relaxed text-white/74">
                    Décrivez votre contexte, votre périmètre et votre échéance. Je reviens avec un
                    cadrage clair et le bon format d’intervention.
                  </p>
                  <Link
                    href="/contact"
                    className={cnContactButton()}
                  >
                    Discuter de ce service
                    <ArrowRight className="size-4" />
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function cnContactButton() {
  return "inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--primary),var(--brand-secondary))] px-6 text-sm font-medium text-primary-foreground shadow-[0_14px_30px_rgba(110,92,255,0.24)] transition hover:opacity-95";
}
