import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceContent } from "@/lib/service-details";
import { site } from "@/content/site";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-gradient-to-r from-green-500/10 to-blue-500/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-10">
          <Badge variant="outline" className="mb-3 uppercase tracking-[0.2em]">Service</Badge>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground">{service.title}</h1>
          <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
            {service.description}
          </p>
          <div className="h-1 w-20 rounded bg-gradient-to-r from-green-500 to-blue-500" />
        </header>

        <Card className="border-primary/15 bg-primary/5">
          <CardContent className="grid gap-4 p-8 md:grid-cols-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Livrable clé</div>
              <div className="mt-2 text-base font-semibold text-foreground">{service.deliverables[0]}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Idéal pour</div>
              <div className="mt-2 text-sm text-muted-foreground">{service.bestFor}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Pas idéal si</div>
              <div className="mt-2 text-sm text-muted-foreground">{service.notFor}</div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_360px]">
          <div className="space-y-8">
            <Card className="border-border/60 bg-card/50">
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

            <Card className="border-border/60 bg-card/50">
              <CardContent className="grid gap-8 p-8 md:grid-cols-[1fr_auto_1fr]">
                <div>
                  <CardHeader className="p-0 pb-4">
                    <CardTitle className="text-lg">Ce que vous recevez</CardTitle>
                  </CardHeader>
                  <ul className="flex flex-col gap-3">
                    {service.deliverables.map((deliverable) => (
                      <li key={deliverable} className="text-sm leading-relaxed text-muted-foreground">
                        {deliverable}
                      </li>
                    ))}
                  </ul>
                </div>
                <Separator orientation="vertical" className="hidden md:block" />
                <div>
                  <CardHeader className="p-0 pb-4">
                    <CardTitle className="text-lg">Ce que cela vous apporte</CardTitle>
                  </CardHeader>
                  <ul className="flex flex-col gap-3">
                    {service.benefits.map((benefit) => (
                      <li key={benefit} className="text-sm leading-relaxed text-muted-foreground">
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {details?.process?.length ? (
              <Card className="border-border/60 bg-card/50">
                <CardHeader>
                  <CardTitle className="text-lg">Déroulé de mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    {details.process.map((step, index) => (
                      <div key={step} className="rounded-xl border border-border/60 bg-background/50 p-4">
                        <div className="text-xs uppercase tracking-[0.2em] text-primary">Étape {index + 1}</div>
                        <p className="mt-2 text-sm text-muted-foreground">{step}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>

          <div className="space-y-6">
            <Card className="border-primary/15 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Résultat attendu</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">{service.outcome}</p>
              </CardContent>
            </Card>

            {details?.audience?.length ? (
              <Card className="border-border/60 bg-card/50">
                <CardHeader>
                  <CardTitle className="text-lg">Pour qui ?</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {details.audience.map((item) => (
                    <Badge key={item} variant="secondary">
                      {item}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            ) : null}

            <Card className="border-border/60 bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg">Quand me contacter</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {site.sales.contactReasons.slice(0, 2).map((reason) => (
                  <div key={reason} className="rounded-xl border border-border/60 bg-background/50 p-4 text-sm text-muted-foreground">
                    {reason}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg">Passer à l’étape suivante</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Décrivez votre contexte, votre périmètre et votre échéance. Je reviens vers vous avec un cadrage clair et le bon format d’intervention.
                </p>
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90">
                  Discuter de ce service
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
