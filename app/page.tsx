import { Hero } from "@/components/hero";
import { ServiceCard } from "@/components/service-card";
import { Highlights } from "@/components/highlights";
import { site } from "@/content/site";
import { AboutSection } from "@/components/section-about";

export default function Home() {
  return (
    <div>
      <Hero />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-xl font-semibold tracking-tight">{site.sections.featuredServicesLabel}</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {site.services.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>
        <Highlights />
      </section>
      <AboutSection />
    </div>
  );
}
