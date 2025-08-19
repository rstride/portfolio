import { Hero } from "@/components/hero";
import { ServiceCard } from "@/components/service-card";
import { Highlights } from "@/components/highlights";
import { site } from "@/content/site";
import { AboutSection } from "@/components/section-about";
import { FeatureCards } from "@/components/feature-cards";
import { Marquee } from "@/components/marquee";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Hero />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-xl font-semibold tracking-tight">{site.sections.featuredServicesLabel}</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {site.services.map((s) => (
            // @ts-expect-error legacy component import may be missing during refactor
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>
      </section>
      <FeatureCards />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <Marquee
          items={site.logos.map((logo) => (
            <Image key={logo.alt} src={logo.src} alt={logo.alt} width={110} height={28} />
          ))}
        />
      </div>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Highlights />
      </section>
      <AboutSection />
    </div>
  );
}

