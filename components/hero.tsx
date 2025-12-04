"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { site } from "@/content/site";
import { TrustBar } from "@/components/trust-bar";
import { useAnalytics } from "@/hooks/useAnalytics";
import { HeroBackground } from "@/components/hero-background";
import { useEffect, useState, useRef } from "react";
import { Shield, Terminal, ArrowRight, Lock } from "lucide-react";

export function Hero() {
  const { queue, track } = useAnalytics();
  const [mounted, setMounted] = useState(false);
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="relative min-h-screen overflow-hidden flex items-center justify-center bg-background">
        <div className="w-full h-full absolute inset-0 bg-background" />
      </section>
    );
  }

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden flex items-center justify-center pt-20">
      <HeroBackground />

      <motion.div
        className="container px-4 mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center"
        style={{ y, opacity }}
      >
        {/* Text Content */}
        <div className="text-left space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-medium text-primary tracking-wide uppercase">
              Disponible pour missions
            </span>
          </motion.div>

          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl sm:text-7xl font-bold tracking-tight leading-[1.1]"
            >
              <span className="block text-foreground">Sécuriser</span>
              <span className="block text-gradient-primary">l&apos;Innovation</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-lg leading-relaxed"
            >
              Consultant indépendant et fondateur de PrismaSec. J&apos;aide les entreprises à renforcer leur posture de sécurité offensive et défensive.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href={site.hero.ctaPrimary.href}
              className="btn-primary group"
              onClick={() => (queue ? queue("cta_primary_click", { location: "hero", href: site.hero.ctaPrimary.href }) : track("cta_primary_click", { location: "hero", href: site.hero.ctaPrimary.href }))}
            >
              <Terminal className="w-4 h-4 mr-2" />
              {site.hero.ctaPrimary.label}
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href={site.hero.ctaSecondary.href}
              className="btn-outline group"
              onClick={() => (queue ? queue("cta_secondary_click", { location: "hero", href: site.hero.ctaSecondary.href }) : track("cta_secondary_click", { location: "hero", href: site.hero.ctaSecondary.href }))}
            >
              <Shield className="w-4 h-4 mr-2" />
              {site.hero.ctaSecondary.label}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="pt-8 border-t border-border/50"
          >
            <TrustBar />
          </motion.div>
        </div>

        {/* Visual Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="relative w-full aspect-square max-w-md mx-auto">
            {/* Rotating Rings */}
            <div className="absolute inset-0 rounded-full border border-primary/20 animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-4 rounded-full border border-blue-500/20 animate-[spin_15s_linear_infinite_reverse]" />
            <div className="absolute inset-8 rounded-full border border-purple-500/20 animate-[spin_20s_linear_infinite]" />

            {/* Central Image Container */}
            <div className="absolute inset-12 rounded-full overflow-hidden border-2 border-primary/30 shadow-[0_0_50px_rgba(34,197,94,0.2)] bg-background/50 backdrop-blur-sm z-10">
              <Image
                src="/romain.png"
                alt={`Portrait de ${site.name}`}
                fill
                className="object-cover"
                priority
              />

              {/* Glitch Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay" />
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 right-0 glass p-4 rounded-xl z-20"
            >
              <Lock className="w-6 h-6 text-primary mb-2" />
              <div className="text-xs font-mono text-muted-foreground">Security Status</div>
              <div className="text-sm font-bold text-primary">SECURED</div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-10 left-0 glass p-4 rounded-xl z-20"
            >
              <Terminal className="w-6 h-6 text-blue-400 mb-2" />
              <div className="text-xs font-mono text-muted-foreground">System Check</div>
              <div className="text-sm font-bold text-blue-400">OPTIMIZED</div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
