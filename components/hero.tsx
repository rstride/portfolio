"use client";

import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Lock, Shield, Terminal } from "lucide-react";

import { landingCardClass, landingReveal } from "@/components/landing/shared";
import { site } from "@/content/site";
import { useAnalytics } from "@/hooks/useAnalytics";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

export function Hero() {
  const { queue, track } = useAnalytics();

  return (
    <section className="relative flex min-h-[calc(100vh-5rem)] items-center overflow-hidden pt-4">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_35%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(34,197,94,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.025)_1px,transparent_1px)] bg-[size:56px_56px]" />

      <div className="container relative z-10 mx-auto grid gap-10 px-4 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <motion.div {...landingReveal} className="flex flex-col gap-8 text-left">
          <div className="flex flex-col gap-4">
            <Badge variant="outline" className="rounded-full border-primary/30 px-4 py-1 text-sm text-primary">
              {site.hero.eyebrow}
            </Badge>
            <h1 className="pb-2 text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl">
              <span className="block text-foreground">{site.hero.headlineA}</span>
              <span className="block text-gradient-primary">{site.hero.headlineB}</span>
            </h1>
            <p className="max-w-2xl text-xl leading-relaxed text-muted-foreground">
              {site.hero.subtext}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {site.hero.proofStrip.map((item) => (
              <div key={item} className={cn("flex items-start gap-3 rounded-xl px-4 py-3", landingCardClass)}>
                <BadgeCheck className="mt-0.5 size-4 text-primary" />
                <p className="text-sm text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href={site.hero.ctaPrimary.href}
              className={cn(buttonVariants({ variant: "default", size: "lg" }), "group")}
              onClick={() =>
                queue
                  ? queue("cta_primary_click", { location: "hero", href: site.hero.ctaPrimary.href })
                  : track("cta_primary_click", { location: "hero", href: site.hero.ctaPrimary.href })
              }
            >
              <Terminal className="mr-2 size-4" />
              {site.hero.ctaPrimary.label}
              <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href={site.hero.ctaSecondary.href}
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "group")}
              onClick={() =>
                queue
                  ? queue("cta_secondary_click", { location: "hero", href: site.hero.ctaSecondary.href })
                  : track("cta_secondary_click", { location: "hero", href: site.hero.ctaSecondary.href })
              }
            >
              <Shield className="mr-2 size-4" />
              {site.hero.ctaSecondary.label}
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {site.kpis.map((kpi) => (
              <Card key={kpi.label} className={landingCardClass}>
                <CardContent className="p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{kpi.label}</div>
                  <div className="mt-2 text-lg font-semibold text-foreground">{kpi.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        <motion.div
          {...landingReveal}
          transition={{ ...landingReveal.transition, delay: 0.1 }}
          className="relative hidden lg:block"
        >
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-0 rounded-full border border-primary/20" />
            <div className="absolute inset-4 rounded-full border border-blue-500/20" />
            <div className="absolute inset-8 rounded-full border border-cyan-500/20" />

            <div className="absolute inset-12 z-10 overflow-hidden rounded-full border-2 border-primary/30 bg-background/50 shadow-[0_0_50px_rgba(34,197,94,0.12)] backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-blue-500/10" />
              <Image
                src="/romain.png"
                alt={`Portrait de ${site.name}`}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="absolute right-0 top-6 z-20">
              <Card className={cn(landingCardClass, "rounded-xl")}>
                <CardContent className="p-4">
                  <Lock className="mb-2 size-5 text-primary" />
                  <CardDescription className="text-xs font-mono">Statut Sécurité</CardDescription>
                  <CardTitle className="text-sm text-primary">VÉRIFIÉ</CardTitle>
                </CardContent>
              </Card>
            </div>

            <div className="absolute bottom-10 left-0 z-20">
              <Card className={cn(landingCardClass, "rounded-xl")}>
                <CardContent className="p-4">
                  <Terminal className="mb-2 size-5 text-blue-400" />
                  <CardDescription className="text-xs font-mono">Approche</CardDescription>
                  <CardTitle className="text-sm text-blue-400">MANUELLE</CardTitle>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
