import { Hero } from "@/components/hero";
import { ProjectsShowcase } from "@/components/projects-showcase";
import { ServicesSection } from "@/components/services-section";
import { BackToTopButton } from "@/components/back-to-top-button";

export default function Home() {
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
