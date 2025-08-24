"use client";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { site } from "@/content/site";
import { TrustBar } from "@/components/trust-bar";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useEffect, useState, useRef } from "react";
import { Shield, Lock, Zap, Terminal, Code, Bug, Target, AlertCircle } from "lucide-react";

export function Hero() {
  const { queue, track } = useAnalytics();
  const [mounted, setMounted] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const floatingIcons = [Shield, Lock, Zap, Terminal, Code, Bug, Target, AlertCircle];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };


  if (!mounted) return null;

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden flex items-center">
      {/* Enhanced Cybersecurity Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Matrix-style background grid */}
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"
          animate={{ 
            backgroundPosition: ["0px 0px", "50px 50px", "0px 0px"],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />

        {/* Animated gradient orbs with cyber theme */}
        <motion.div 
          className="absolute -top-40 -left-40 h-80 w-80 rounded-full blur-3xl opacity-20 bg-gradient-to-r from-green-500 via-blue-500 to-purple-600"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full blur-3xl opacity-15 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600"
          animate={{
            x: [0, -30, 0],
            y: [0, -40, 0],
            scale: [1, 1.1, 1],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        {/* Floating security icons */}
        {floatingIcons.map((Icon, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{
              left: `${10 + (index * 12)}%`,
              top: `${15 + (index % 3) * 25}%`
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? {
              opacity: [0.1, 0.3, 0.1],
              scale: [0.8, 1.2, 0.8],
              y: [0, -30, 0],
              x: [0, 20, 0],
              rotate: [0, 360, 720]
            } : { opacity: 0 }}
            transition={{
              duration: 8 + (index * 1.5),
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.8
            }}
          >
            <Icon className="w-5 h-5 text-green-400/20" />
          </motion.div>
        ))}

        {/* Scanning lines effect */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: "repeating-linear-gradient(90deg, transparent, transparent 98px, rgba(34, 197, 94, 0.1) 100px)",
          }}
          animate={{
            backgroundPosition: ["0px 0px", "100px 0px"],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Data stream effect */}
        <motion.div
          className="absolute right-10 top-20 w-1 h-32 bg-gradient-to-b from-transparent via-green-400/50 to-transparent"
          animate={{
            y: [0, 300, 600],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute left-20 bottom-32 w-1 h-24 bg-gradient-to-b from-transparent via-blue-400/50 to-transparent"
          animate={{
            y: [0, -200, -400],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

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
              className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {site.name}
              {/* Glitch overlay effect */}
              <motion.span
                className="absolute inset-0 bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-yellow-400 to-green-400"
                animate={{
                  x: [0, 2, -2, 0],
                  opacity: [0, 0.3, 0]
                }}
                transition={{
                  duration: 0.2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut"
                }}
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
            className="mt-10 flex flex-wrap items-center gap-6"
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
                className="btn-primary relative overflow-hidden group"
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
                className="btn-outline relative overflow-hidden group border-green-500/30 hover:border-green-400 transition-colors"
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
                      className="absolute w-0.5 h-4 bg-green-400/30"
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

            {/* Holographic border effect */}
            <motion.div
              className="absolute inset-0 rounded-3xl border-2 border-green-400/30 z-10"
              animate={{
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
            {[...Array(3)].map((_, i) => (
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
