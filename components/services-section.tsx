"use client";
import { motion } from "framer-motion";
import { ServiceCard } from "@/components/service-card";
import { site } from "@/content/site";
import { useLazyAnimation } from "@/hooks/useLazyAnimation";
import { useAnimationConfig } from "@/lib/animation-config";
import { BackgroundEffects } from "@/components/background-effects";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";

export function ServicesSection() {
  const { ref, isInView } = useLazyAnimation(0.1);
  const performanceMode = usePerformanceMode();
  const animationConfig = useAnimationConfig(performanceMode);

  return (
    <div className="relative overflow-hidden">
      {/* Harmonious Background Effects */}
      <BackgroundEffects
        variant="section"
        intensity={performanceMode === 'low' ? 'low' : performanceMode === 'high' ? 'high' : 'medium'}
      />
      <motion.section
        ref={ref}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 mb-8"
          >
            <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6m8 0H8" />
            </svg>
          </motion.div>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-500 mb-6 leading-tight">
            {site.sections.featuredServicesLabel}
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {site.sections.servicesIntro}
          </p>
        </motion.div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {site.services.map((service, index) => (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="h-full"
            >
              <ServiceCard service={service} />
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
