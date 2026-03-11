import { Hero } from "@/components/hero";
import { ProjectsShowcase } from "@/components/projects-showcase";
import { ContactSection } from "@/components/contact-section";
import { ServicesSection } from "@/components/services-section";
import { BackToTopButton } from "@/components/back-to-top-button";

export default function Home() {
  return (
    <div className="relative">
      <section id="hero" className="min-h-screen">
        <Hero />
      </section>

      <section id="projects" className="py-24 lg:py-32 bg-section-alt">
        <ProjectsShowcase />
      </section>

      <section id="services" className="py-24 lg:py-32">
        <ServicesSection />
      </section>

      <section id="contact" className="py-24 lg:py-32 bg-section-alt">
        <ContactSection />
      </section>

      <BackToTopButton />
    </div>
  );
}
