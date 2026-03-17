import { Hero } from "@/features/home/components/hero";
import { ProjectsShowcase } from "@/features/home/components/projects-showcase";
import { ServicesSection } from "@/features/home/components/services-section";
import { BackToTopButton } from "@/shared/components/back-to-top-button";

export function HomePageView() {
  return (
    <div className="relative overflow-x-hidden">
      <section
        id="hero"
        className="-mt-[var(--site-navbar-height,6.5rem)] min-h-screen pt-[var(--site-navbar-height,6.5rem)]"
      >
        <Hero />
      </section>

      <section id="projects" className="py-20 lg:py-24">
        <ProjectsShowcase />
      </section>

      <section id="services" className="bg-section-alt/40 py-20 lg:py-24">
        <ServicesSection />
      </section>
      <BackToTopButton />
    </div>
  );
}
