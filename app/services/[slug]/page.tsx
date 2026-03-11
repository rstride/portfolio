import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceContent } from "@/lib/service-details";
import { site } from "@/content/site";

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
    slug: service.slug === "audit-securite" ? "securite" : service.slug,
  }));
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const content = getServiceContent(slug);

  if (!content) {
    notFound();
  }

  const { service, paragraphs } = content;

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-gradient-to-r from-green-500/10 to-blue-500/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-10">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-muted-foreground">Service</p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground">{service.title}</h1>
          <div className="h-1 w-20 rounded bg-gradient-to-r from-green-500 to-blue-500" />
        </header>

        <div className="space-y-6">
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-lg leading-relaxed text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-10 grid gap-8 rounded-2xl border border-border/60 bg-card/50 p-8 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Livrables</h2>
            <ul className="space-y-2">
              {service.deliverables.map((deliverable) => (
                <li key={deliverable} className="text-muted-foreground">
                  {deliverable}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Benefices</h2>
            <ul className="space-y-2">
              {service.benefits.map((benefit) => (
                <li key={benefit} className="text-muted-foreground">
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link href="/contact" className="inline-flex items-center rounded-full bg-blue-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-500">
            Discuter de ce service
          </Link>
          <Link href="/services" className="inline-flex items-center rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent">
            Tous les services
          </Link>
        </div>
      </div>
    </section>
  );
}
