import { Badge } from "@/components/ui/badge";
import { site } from "@/content/site";
import { Hero } from "@/features/home/components/hero";
import { ProjectsShowcase } from "@/features/home/components/projects-showcase";
import { ServicesSection } from "@/features/home/components/services-section";
import { BackToTopButton } from "@/shared/components/back-to-top-button";
import { CtaBand } from "@/shared/components/cta-band";
import { EngagementSteps } from "@/shared/components/engagement-steps";
import { SectionIntro } from "@/shared/components/section-intro";
import { cn } from "@/shared/lib/utils";

export function HomeView() {
  return (
    <div className="relative overflow-x-hidden pb-24">
      <section
        id="hero"
        className="-mt-[var(--site-navbar-height,6rem)] pt-[var(--site-navbar-height,6rem)]"
      >
        <Hero />
      </section>

      <section id="projects" className="py-16 lg:py-24">
        <ProjectsShowcase />
      </section>

      <section id="proofs" className="py-16 lg:py-24">
        <div className="page-shell">
          <SectionIntro
            eyebrow={site.homeSections.proofs.eyebrow}
            title={site.homeSections.proofs.title}
            description={site.homeSections.proofs.description}
            align="left"
            className="mx-0"
          />

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {site.homeProofs.map((proof, index) => (
              <article
                key={proof.title}
                className={cn("proof-card", index % 2 === 1 && "xl:translate-y-8")}
              >
                <Badge variant="secondary" className="w-fit">
                  {proof.kpi}
                </Badge>
                <p className="font-headline mt-6 text-3xl font-bold uppercase leading-[0.96] tracking-[-0.04em] text-foreground">
                  {proof.title}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="py-16 lg:py-24">
        <ServicesSection />
      </section>

      <section id="process" className="page-shell py-16 lg:py-24">
        <EngagementSteps
          eyebrow={site.homeSections.process.eyebrow}
          title={site.homeSections.process.title}
          description={site.homeSections.process.description}
          steps={site.homeEngagementSteps}
        />
      </section>

      <section className="page-shell pt-4">
        <CtaBand cta={site.pageCtas.home} />
      </section>

      <BackToTopButton />
    </div>
  );
}
