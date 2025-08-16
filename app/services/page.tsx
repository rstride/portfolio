import { site } from "@/content/site";
import { ServiceCard } from "@/components/service-card";

export const metadata = { title: site.sections.servicesTitle };

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold tracking-tight">{site.sections.servicesTitle}</h1>
      <p className="mt-2 text-muted-foreground max-w-2xl">{site.sections.servicesIntro}</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {site.services.map((s) => (
          <div id={s.slug} key={s.slug}>
            <ServiceCard service={s} />
          </div>
        ))}
      </div>
    </div>
  );
}


