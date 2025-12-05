"use client";

import { site } from "@/content/site";
import { motion, useMotionTemplate, useMotionValue, useInView } from "framer-motion";
import { MouseEvent, useRef } from "react";
import Link from "next/link";
import {
  Shield,
  Code,
  Target,
  Users,
  Zap,
  Search,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BackgroundEffects } from "@/components/background-effects";

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
  delay = 0,
  id
}: {
  children: React.ReactNode,
  className?: string,
  color?: string,
  delay?: number,
  id?: string
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
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className={cn("group relative", className)}
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

export default function ServicesPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <div ref={ref} className="relative min-h-screen overflow-hidden">
      <BackgroundEffects variant="hero" intensity="medium" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-black/10 dark:border-white/10 mb-6"
          >
            <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
          </motion.div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gradient-primary mb-6">
            {site.sections.servicesTitle}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {site.sections.servicesIntro}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid gap-8 md:grid-cols-2">
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
                id={service.slug}
                color={colors.bg}
                delay={index * 0.1}
              >
                <div className="p-8 h-full flex flex-col relative overflow-hidden">
                  {/* Background decorative icon */}
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                    <IconComponent className="w-40 h-40 rotate-12" />
                  </div>

                  <div className="relative z-10 flex flex-col h-full">
                    {/* Header with icon + label + title */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className={cn("w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center border border-black/10 dark:border-white/10", colors.bg)}>
                        <IconComponent className={cn("w-7 h-7", colors.text)} />
                      </div>
                      <div>
                        <div className={cn("text-xs font-mono uppercase tracking-wider mb-1", colors.text)}>Service</div>
                        <h2 className="text-2xl font-bold text-foreground">{service.title}</h2>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed mb-8 text-lg">
                      {service.description}
                    </p>

                    {/* Two columns: Deliverables & Benefits */}
                    <div className="grid sm:grid-cols-2 gap-6 mb-8">
                      {/* Deliverables */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <CheckCircle className={cn("w-5 h-5", colors.text)} />
                          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Livrables</h3>
                        </div>
                        <ul className="space-y-2">
                          {service.deliverables.map((deliverable) => (
                            <li key={deliverable} className="flex items-start gap-3 text-muted-foreground text-sm">
                              <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0", colors.dot)} />
                              <span>{deliverable}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Benefits */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Bénéfices</h3>
                        </div>
                        <ul className="space-y-2">
                          {service.benefits.map((benefit) => (
                            <li key={benefit} className="flex items-start gap-3 text-muted-foreground text-sm">
                              <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-yellow-500" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* CTA */}
                    <Link
                      href={`/services/${service.slug === 'audit-securite' ? 'securite' : service.slug}`}
                      className={cn("inline-flex items-center gap-2 text-sm font-medium transition-colors mt-auto", colors.text)}
                    >
                      <Target className="w-4 h-4" />
                      Voir le détail
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </ServiceBentoCard>
            );
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-20"
        >
          <ServiceBentoCard color="from-green-500/20 to-blue-500/20" className="max-w-2xl mx-auto">
            <div className="p-8 text-center">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Besoin d'un service personnalisé ?
              </h3>
              <p className="text-muted-foreground mb-6">
                Chaque projet est unique. Contactez-moi pour discuter de vos besoins spécifiques.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity"
              >
                Me contacter
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ServiceBentoCard>
        </motion.div>
      </div>
    </div>
  );
}

