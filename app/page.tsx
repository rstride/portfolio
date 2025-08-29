"use client";
import { Hero } from "@/components/hero";
import { ProjectsShowcase } from "@/components/projects-showcase";
import { ContactSection } from "@/components/contact-section";
import { ServicesSection } from "@/components/services-section";
import { FloatingContact } from "@/components/floating-contact";
import { site } from "@/content/site";
import { AboutSection } from "@/components/section-about";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function Home() {

  useEffect(() => {
    // Smooth scrolling for the entire page
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="relative">


      {/* Main sections with improved spacing */}
      <section id="hero" className="min-h-screen">
        <Hero />
      </section>

      <section id="projects" className="py-32 lg:py-40">
        <ProjectsShowcase />
      </section>

      <section id="services" className="py-32 lg:py-40 bg-muted/20">
        <ServicesSection />
      </section>

      <section id="about" className="py-32 lg:py-40">
        <AboutSection />
      </section>

      <section id="contact" className="py-32 lg:py-40 bg-muted/10">
        <ContactSection />
      </section>

      {/* Floating contact CTA */}
      <FloatingContact />

      {/* Back to top button */}
      <motion.button
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg z-40 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 3 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        <motion.svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
        </motion.svg>
      </motion.button>
    </div>
  );
}
