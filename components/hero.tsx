"use client";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { site } from "@/content/site";
import { TrustBar } from "@/components/trust-bar";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";
import { useAnimationConfig } from "@/lib/animation-config";
import { BackgroundEffects } from "@/components/background-effects";
import { useEffect, useState, useRef } from "react";
import { Shield, Terminal } from "lucide-react";

export function Hero() {
  const { queue, track } = useAnalytics();
  const prefersReducedMotion = useReducedMotion();
  const performanceMode = usePerformanceMode();
  const animationConfig = useAnimationConfig(performanceMode);
  const [mounted, setMounted] = useState(false);
  const ref = useRef(null);

  // Always call hooks in the same order - never conditionally

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading state during SSR to prevent hydration mismatches
  if (!mounted) {
    return (
      <section className="relative min-h-screen overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-blue-500 animate-pulse mx-auto mb-8" />
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded w-64 mx-auto animate-pulse" />
            <div className="h-4 bg-muted rounded w-48 mx-auto animate-pulse" />
          </div>
        </div>
      </section>
    );
  }



  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : performanceMode === 'low' ? 0.05 : 0.1,
        duration: animationConfig.duration.medium,
        ease: animationConfig.easing.smooth,
      }
    }
  };

  const itemVariants = {
    hidden: {
      y: prefersReducedMotion ? 0 : performanceMode === 'low' ? 15 : 30,
      opacity: 1
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: animationConfig.duration.slow,
        ease: animationConfig.easing.smooth
      }
    }
  };


  if (!mounted) return null;

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* Harmonious Background Effects */}
      <BackgroundEffects
        variant="hero"
        intensity={performanceMode === 'low' ? 'low' : performanceMode === 'high' ? 'high' : 'medium'}
      />

      <motion.div
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-16 grid gap-16 lg:grid-cols-2 items-center relative z-10"
        style={{ y }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          {/* Glitch effect for the name */}
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight relative"
            variants={itemVariants}
          >
            <motion.span
              className="inline-block text-blue-600 dark:text-blue-400 relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {site.name}
              {/* Subtle shadow effect */}
              <motion.span
                className="absolute inset-0 text-blue-900/20 dark:text-blue-300/20 -translate-x-0.5 translate-y-0.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                {site.name}
              </motion.span>
            </motion.span>
          </motion.h1>

          <motion.p
            className="mt-6 text-xl sm:text-2xl text-muted-foreground leading-relaxed max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Consultant indépendant, alumni 42 et fondateur de PrismaSec.
          </motion.p>

          <motion.p
            className="mt-4 text-lg text-muted-foreground leading-relaxed max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {site.hero.subtext}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <motion.div
              className="relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={site.hero.ctaPrimary.href}
                className="relative overflow-hidden group inline-flex items-center justify-center rounded-full text-sm font-medium px-5 py-3 bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-sm"
                onClick={() => (queue ? queue("cta_primary_click", { location: "hero", href: site.hero.ctaPrimary.href }) : track("cta_primary_click", { location: "hero", href: site.hero.ctaPrimary.href }))}
              >
                <motion.span className="relative z-10 flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  {site.hero.ctaPrimary.label}
                </motion.span>
                {/* Scanning line effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </Link>
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 opacity-0 group-hover:opacity-20 blur-lg -z-10"
                animate={{ opacity: [0, 0.2, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            <motion.div
              className="relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={site.hero.ctaSecondary.href}
                className="btn-outline relative overflow-hidden group border-blue-500/30 hover:border-blue-400 transition-colors"
                onClick={() => (queue ? queue("cta_secondary_click", { location: "hero", href: site.hero.ctaSecondary.href }) : track("cta_secondary_click", { location: "hero", href: site.hero.ctaSecondary.href }))}
              >
                <motion.span className="relative z-10 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  {site.hero.ctaSecondary.label}
                </motion.span>
                {/* Matrix rain effect on hover */}
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-0.5 h-4 bg-blue-400/30"
                      style={{ left: `${i * 12.5}%`, top: "-16px" }}
                      animate={{
                        y: [0, 80],
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: "linear"
                      }}
                    />
                  ))}
                </motion.div>
              </Link>
            </motion.div>


          </motion.div>

          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <TrustBar />
          </motion.div>
        </motion.div>

        <motion.div
          className="relative mx-auto"
          variants={itemVariants}
        >
          <motion.div
            className="relative w-80 h-80 md:w-96 md:h-96 mx-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Scanning lines overlay */}
            {!prefersReducedMotion && (
              <motion.div
                className="absolute inset-0 z-20 pointer-events-none"
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/20 to-transparent"
                  style={{
                    background: "repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(34, 197, 94, 0.1) 9px, rgba(34, 197, 94, 0.1) 10px)"
                  }}
                />
              </motion.div>
            )}

            {/* Holographic border effect */}
            <motion.div
              className="absolute inset-0 rounded-3xl border-2 border-green-400/30 z-10"
              animate={prefersReducedMotion ? {} : {
                borderColor: ["rgba(34, 197, 94, 0.3)", "rgba(59, 130, 246, 0.5)", "rgba(147, 51, 234, 0.4)", "rgba(34, 197, 94, 0.3)"],
                boxShadow: [
                  "0 0 20px rgba(34, 197, 94, 0.2)",
                  "0 0 30px rgba(59, 130, 246, 0.3)",
                  "0 0 25px rgba(147, 51, 234, 0.2)",
                  "0 0 20px rgba(34, 197, 94, 0.2)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            {/* Corner brackets */}
            {[
              { top: "-2px", left: "-2px", rotate: "0deg" },
              { top: "-2px", right: "-2px", rotate: "90deg" },
              { bottom: "-2px", right: "-2px", rotate: "180deg" },
              { bottom: "-2px", left: "-2px", rotate: "270deg" }
            ].map((corner, index) => (
              <motion.div
                key={index}
                className="absolute w-8 h-8 border-t-2 border-l-2 border-green-400 z-10"
                style={{ ...corner, transform: `rotate(${corner.rotate})` }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
              />
            ))}

            <div className="w-full h-full rounded-3xl overflow-hidden border border-green-500/20 bg-card shadow-2xl relative">
              <Image
                src="/romain.png"
                alt={`Portrait de ${site.name}`}
                fill
                className="object-cover"
                priority
              />

              {/* Digital noise overlay */}
              <motion.div
                className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
                animate={{
                  backgroundImage: [
                    "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)",
                    "radial-gradient(circle at 80% 50%, white 1px, transparent 1px)",
                    "radial-gradient(circle at 40% 20%, white 1px, transparent 1px)",
                    "radial-gradient(circle at 60% 80%, white 1px, transparent 1px)"
                  ]
                }}
                transition={{ duration: 0.1, repeat: Infinity }}
                style={{ backgroundSize: "4px 4px" }}
              />
            </div>

            {/* Data visualization circles */}
            {!prefersReducedMotion && [...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute border border-green-400/30 rounded-full pointer-events-none`}
                style={{
                  width: `${120 + i * 60}%`,
                  height: `${120 + i * 60}%`,
                  top: `${-10 - i * 30}%`,
                  left: `${-10 - i * 30}%`
                }}
                animate={{
                  rotate: i % 2 === 0 ? [0, 360] : [360, 0],
                  opacity: [0.2, 0.5, 0.2]
                }}
                transition={{
                  duration: 15 + i * 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
