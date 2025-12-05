"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent } from "react";
import { site } from "@/content/site";
import { useLazyAnimation } from "@/hooks/useLazyAnimation";
import Link from "next/link";
import { ArrowRight, Code, Shield, Users, Target, Zap, Search } from "lucide-react";
import { BackgroundEffects } from "@/components/background-effects";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const serviceConfig: { [key: string]: { icon: React.ComponentType<{ className?: string }>, color: { text: string, bg: string, dot: string } } } = {
  "formation-ia": {
    icon: Code,
    color: { text: "text-blue-600 dark:text-blue-400", bg: "from-blue-500/20 to-cyan-500/20", dot: "bg-blue-500" }
  },
  "sensibilisation": {
    icon: Users,
    color: { text: "text-green-600 dark:text-green-400", bg: "from-green-500/20 to-emerald-500/20", dot: "bg-green-500" }
  },
  "ctf": {
    icon: Target,
    color: { text: "text-cyan-600 dark:text-cyan-400", bg: "from-cyan-500/20 to-blue-500/20", dot: "bg-cyan-500" }
  },
  "audit-securite": {
    icon: Search,
    color: { text: "text-emerald-600 dark:text-emerald-400", bg: "from-emerald-500/20 to-green-500/20", dot: "bg-emerald-500" }
  },
  "pentest-web": {
    icon: Zap,
    color: { text: "text-blue-600 dark:text-blue-400", bg: "from-blue-500/20 to-indigo-500/20", dot: "bg-blue-500" }
  },
  "pentest-infra": {
    icon: Shield,
    color: { text: "text-teal-600 dark:text-teal-400", bg: "from-teal-500/20 to-cyan-500/20", dot: "bg-teal-500" }
  },
};

function ServiceBentoCard({
  children,
  className,
  color = "from-green-500/20 to-blue-500/20",
  delay = 0
}: {
  children: React.ReactNode,
  className?: string,
  color?: string,
  delay?: number
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className={cn("group relative h-full", className)}
      onMouseMove={handleMouseMove}
    >
      <div className={cn("absolute -inset-0.5 bg-gradient-to-r rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur-sm", color)} />

      <Card className="relative h-full overflow-hidden bg-white/60 dark:bg-black/40 border-black/5 dark:border-white/10 hover:border-black/10 dark:hover:border-white/20 transition-colors duration-300">
        <motion.div
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-0"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                650px circle at ${mouseX}px ${mouseY}px,
                rgba(255, 255, 255, 0.1),
                transparent 80%
              )
            `,
          }}
        />
        <div className="relative h-full z-10">
          {children}
        </div>
      </Card>
    </motion.div>
  );
}

export function ServicesSection() {
  const { ref, isInView } = useLazyAnimation(0.1);
  const performanceMode = usePerformanceMode();

  return (
    <div ref={ref} className="relative overflow-hidden">
      <BackgroundEffects
        variant="section"
        intensity={performanceMode === 'low' ? 'low' : performanceMode === 'high' ? 'high' : 'medium'}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gradient-primary mb-6 leading-tight pb-2">
            {site.sections.featuredServicesLabel}
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {site.sections.servicesIntro}
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {site.services.map((service, index) => {
            const config = serviceConfig[service.slug] || {
              icon: Shield,
              color: { text: "text-green-600 dark:text-green-400", bg: "from-green-500/20 to-blue-500/20", dot: "bg-green-500" }
            };
            const IconComponent = config.icon;
            const colors = config.color;

            return (
              <ServiceBentoCard
                key={service.slug}
                color={colors.bg}
                delay={index * 0.1}
              >
                <div className="p-8 h-full flex flex-col relative overflow-hidden">
                  {/* Background decorative icon */}
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                    <IconComponent className="w-32 h-32 rotate-12" />
                  </div>

                  <div className="relative z-10 flex flex-col h-full">
                    {/* Header with icon + label + title */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center border border-black/10 dark:border-white/10", colors.bg)}>
                        <IconComponent className={cn("w-6 h-6", colors.text)} />
                      </div>
                      <div>
                        <div className={cn("text-xs font-mono uppercase tracking-wider mb-1", colors.text)}>Service</div>
                        <h3 className="text-xl font-bold text-foreground">{service.title}</h3>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {/* Key benefits as bullet points */}
                    <ul className="space-y-2 mb-6 flex-grow">
                      {service.benefits.slice(0, 3).map((benefit) => (
                        <li key={benefit} className="flex items-start gap-3 text-muted-foreground text-sm">
                          <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0", colors.dot)} />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Link */}
                    <Link
                      href={`/services#${service.slug}`}
                      className={cn("inline-flex items-center gap-2 text-sm font-medium transition-colors mt-auto", colors.text)}
                    >
                      En savoir plus
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </ServiceBentoCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}

