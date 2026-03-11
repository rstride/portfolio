"use client";

import { site } from "@/content/site";
import { motion, useMotionTemplate, useMotionValue, useInView } from "framer-motion";
import { type MouseEvent, useRef } from "react";
import Link from "next/link";
import { Shield, Code, Target, Users, Zap, Search, CheckCircle, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BackgroundEffects } from "@/components/background-effects";
import { getServiceHref } from "@/lib/service-details";

const serviceConfig: { [key: string]: { icon: React.ComponentType<{ className?: string }>, color: { text: string, bg: string, dot: string } } } = {
  "formation-ia": {
    icon: Code,
    color: { text: "text-blue-600 dark:text-blue-400", bg: "from-blue-500/20 to-cyan-500/20", dot: "bg-blue-500" }
  },
  sensibilisation: {
    icon: Users,
    color: { text: "text-green-600 dark:text-green-400", bg: "from-green-500/20 to-emerald-500/20", dot: "bg-green-500" }
  },
  ctf: {
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
}: {
  children: React.ReactNode,
  className?: string,
  color?: string,
  delay?: number,
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
      className={cn("group relative", className)}
      onMouseMove={handleMouseMove}
    >
      <div className={cn("absolute -inset-0.5 rounded-2xl bg-gradient-to-r opacity-0 blur-sm transition duration-500 group-hover:opacity-100", color)} />

      <Card className="relative h-full overflow-hidden border-black/5 bg-white/60 transition-colors duration-300 hover:border-black/10 dark:border-white/10 dark:bg-black/40 dark:hover:border-white/20">
        <motion.div
          className="pointer-events-none absolute -inset-px z-0 opacity-0 transition duration-300 group-hover:opacity-100"
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
        <div className="relative z-10 h-full">{children}</div>
      </Card>
    </motion.div>
  );
}

export function ServicesPageContent() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <div ref={ref} className="relative min-h-screen overflow-hidden">
      <BackgroundEffects variant="hero" intensity="medium" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full border border-black/10 bg-gradient-to-br from-green-500/20 to-blue-500/20 dark:border-white/10"
          >
            <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
          </motion.div>
          <h1 className="mb-6 text-4xl font-bold text-gradient-primary sm:text-5xl lg:text-6xl">
            {site.sections.servicesTitle}
          </h1>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-muted-foreground">
            {site.sections.servicesIntro}
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {site.services.map((service, index) => {
            const config = serviceConfig[service.slug] || {
              icon: Shield,
              color: { text: "text-green-600 dark:text-green-400", bg: "from-green-500/20 to-blue-500/20", dot: "bg-green-500" }
            };
            const IconComponent = config.icon;
            const colors = config.color;

            return (
              <ServiceBentoCard key={service.slug} color={colors.bg} delay={index * 0.1}>
                <div className="relative flex h-full flex-col overflow-hidden p-8">
                  <div className="absolute right-0 top-0 p-4 opacity-10 transition-opacity duration-500 group-hover:opacity-20">
                    <IconComponent className="h-40 w-40 rotate-12" />
                  </div>

                  <div className="relative z-10 flex h-full flex-col">
                    <div className="mb-6 flex items-center gap-4">
                      <div className={cn("flex h-14 w-14 items-center justify-center rounded-xl border border-black/10 bg-gradient-to-br dark:border-white/10", colors.bg)}>
                        <IconComponent className={cn("h-7 w-7", colors.text)} />
                      </div>
                      <div>
                        <div className={cn("mb-1 text-xs font-mono uppercase tracking-wider", colors.text)}>Service</div>
                        <h2 className="text-2xl font-bold text-foreground">{service.title}</h2>
                      </div>
                    </div>

                    <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>

                    <div className="mb-8 grid gap-6 sm:grid-cols-2">
                      <div>
                        <div className="mb-4 flex items-center gap-2">
                          <CheckCircle className={cn("h-5 w-5", colors.text)} />
                          <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">Livrables</h3>
                        </div>
                        <ul className="space-y-2">
                          {service.deliverables.map((deliverable) => (
                            <li key={deliverable} className="flex items-start gap-3 text-sm text-muted-foreground">
                              <div className={cn("mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full", colors.dot)} />
                              <span>{deliverable}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <div className="mb-4 flex items-center gap-2">
                          <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                          <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">Benefices</h3>
                        </div>
                        <ul className="space-y-2">
                          {service.benefits.map((benefit) => (
                            <li key={benefit} className="flex items-start gap-3 text-sm text-muted-foreground">
                              <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-yellow-500" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <Link href={getServiceHref(service.slug)} className={cn("mt-auto inline-flex items-center gap-2 text-sm font-medium transition-colors", colors.text)}>
                      <Target className="h-4 w-4" />
                      Voir le detail
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </ServiceBentoCard>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <ServiceBentoCard color="from-green-500/20 to-blue-500/20" className="mx-auto max-w-2xl">
            <div className="p-8 text-center">
              <h3 className="mb-4 text-2xl font-bold text-foreground">Besoin d&apos;un service personnalise ?</h3>
              <p className="mb-6 text-muted-foreground">
                Chaque projet est unique. Contactez-moi pour discuter de vos besoins specifiques.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
              >
                Me contacter
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </ServiceBentoCard>
        </motion.div>
      </div>
    </div>
  );
}
