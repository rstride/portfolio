import { Badge } from "@/components/ui/badge";
import { site } from "@/content/site";
import { Hero } from "@/features/home/components/hero";
import { ProjectsShowcase } from "@/features/home/components/projects-showcase";
import { ServicesSection } from "@/features/home/components/services-section";
import { BackToTopButton } from "@/shared/components/back-to-top-button";
import { CtaBand } from "@/shared/components/cta-band";
import { EngagementSteps } from "@/shared/components/engagement-steps";
import { SectionIntro } from "@/shared/components/section-intro";

export function HomeView() {
  return (
    <div className="relative overflow-x-hidden pb-20">
      <section
        id="hero"
        className="-mt-[var(--site-navbar-height,6.5rem)] pt-[var(--site-navbar-height,6.5rem)]"
      >
        <Hero />
      </section>

      <section id="proofs" className="py-8 lg:py-10">
        <div className="page-shell">
          <SectionIntro
            eyebrow={site.homeSections.proofs.eyebrow}
            title={site.homeSections.proofs.title}
            description={site.homeSections.proofs.description}
            align="left"
            className="mx-0"
          />

          <div className="mt-8 grid gap-4 lg:grid-cols-4">
            {site.homeProofs.map((proof) => (
              <article key={proof.title} className="proof-card">
                <Badge variant="outline" className="w-fit">
                  {proof.kpi}
                </Badge>
                <p className="mt-4 text-lg font-semibold tracking-tight text-foreground">
                  {proof.title}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="py-14 lg:py-18">
        <ServicesSection />
      </section>

      <section id="projects" className="py-14 lg:py-18">
        <ProjectsShowcase />
      </section>

      <section id="process" className="page-shell py-14 lg:py-18">
        <EngagementSteps
          eyebrow={site.homeSections.process.eyebrow}
          title={site.homeSections.process.title}
          description={site.homeSections.process.description}
          steps={site.homeEngagementSteps}
        />
      </section>

      <section className="page-shell pt-6">
        <CtaBand cta={site.pageCtas.home} />
      </section>

      <BackToTopButton />
    </div>
  );
}
