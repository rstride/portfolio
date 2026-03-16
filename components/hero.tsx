"use client";

import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";
import { ArrowRight, Shield, Terminal } from "lucide-react";

import { landingReveal } from "@/components/landing/shared";
import { site } from "@/content/site";
import { useAnalytics } from "@/hooks/useAnalytics";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function Hero() {
  const { queue, track } = useAnalytics();

  return (
    <section className="relative flex min-h-[calc(100vh-5rem)] items-center overflow-hidden pt-4">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_35%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(34,197,94,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.025)_1px,transparent_1px)] bg-[size:56px_56px]" />

      <div className="container relative z-10 mx-auto grid gap-10 px-4 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <motion.div {...landingReveal} className="flex flex-col gap-8 text-left">
          <div className="flex flex-col gap-4">
            <h1 className="max-w-[11ch] pb-2 text-5xl font-bold leading-[0.98] tracking-tight sm:text-7xl">
              <span className="block text-foreground">{site.hero.headlineA}</span>
              <span className="block text-gradient-primary">{site.hero.headlineB}</span>
            </h1>
            <p className="max-w-2xl text-xl leading-relaxed text-muted-foreground">
              {site.hero.subtext}
            </p>
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
        </motion.div>

        <motion.div
          {...landingReveal}
          transition={{ ...landingReveal.transition, delay: 0.1 }}
          className="relative hidden lg:block"
        >
          <div className="relative mx-auto aspect-square w-full max-w-lg">
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

          </div>
        </motion.div>
      </div>
    </section>
  );
}
