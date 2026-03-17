"use client";

import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";
import { ArrowRight, Lock, Shield, Terminal } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { site } from "@/content/site";
import { useAnalytics } from "@/hooks/useAnalytics";
import { cn } from "@/lib/utils";
import { revealInView } from "@/shared/motion/reveal";

export function Hero() {
  const { queue, track } = useAnalytics();

  return (
    <section className="relative flex min-h-[calc(100vh-5rem)] items-start overflow-hidden pt-6 lg:pt-8">
      <div className="hero-grid absolute inset-0 -z-10 opacity-50" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_24%,rgba(36,184,122,0.14),transparent_30%),radial-gradient(circle_at_82%_70%,rgba(80,220,255,0.1),transparent_26%),linear-gradient(180deg,rgba(10,18,18,0.82),rgba(10,16,20,0.96))]" />

      <div className="container relative z-10 mx-auto px-4 pb-10 pt-4 lg:pb-16 lg:pt-6">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1.05fr)_0.95fr] lg:items-center">
          <motion.div {...revealInView} className="flex flex-col gap-8 text-left lg:pr-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-background/45 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground backdrop-blur">
              <span className="size-2 rounded-full bg-[linear-gradient(135deg,var(--primary),var(--brand-secondary))]" />
              Consultant indépendant
            </div>

            <div className="flex flex-col gap-5">
              <h1 className="max-w-[11ch] text-5xl font-semibold leading-[0.92] tracking-tight text-foreground sm:text-7xl">
                <span className="block">{site.hero.headlineA}</span>
                <span className="block text-gradient-primary">{site.hero.headlineB}</span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                {site.hero.subtext}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href={site.hero.ctaPrimary.href}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "group border-0 bg-[linear-gradient(135deg,var(--primary),var(--brand-secondary))] text-primary-foreground shadow-[0_16px_34px_rgba(22,126,102,0.24)]"
                )}
                onClick={() =>
                  queue
                    ? queue("cta_primary_click", { location: "hero", href: site.hero.ctaPrimary.href })
                    : track("cta_primary_click", {
                        location: "hero",
                        href: site.hero.ctaPrimary.href,
                      })
                }
              >
                <Terminal data-icon="inline-start" />
                {site.hero.ctaPrimary.label}
                <ArrowRight
                  data-icon="inline-end"
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>

              <Link
                href={site.hero.ctaSecondary.href}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-border/70 bg-background/42 text-foreground shadow-[0_10px_30px_rgba(10,8,24,0.16)]"
                )}
                onClick={() =>
                  queue
                    ? queue("cta_secondary_click", {
                        location: "hero",
                        href: site.hero.ctaSecondary.href,
                      })
                    : track("cta_secondary_click", {
                        location: "hero",
                        href: site.hero.ctaSecondary.href,
                      })
                }
              >
                <Shield data-icon="inline-start" />
                Voir les offres
              </Link>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <div className="rounded-full border border-border/60 bg-background/35 px-4 py-2 backdrop-blur">
                Pentest web/API
              </div>
              <div className="rounded-full border border-border/60 bg-background/35 px-4 py-2 backdrop-blur">
                Audit sécurité pragmatique
              </div>
              <div className="rounded-full border border-border/60 bg-background/35 px-4 py-2 backdrop-blur">
                Formation offensive
              </div>
            </div>
          </motion.div>

          <motion.div
            {...revealInView}
            transition={{ ...revealInView.transition, delay: 0.08 }}
            className="relative mx-auto hidden w-full max-w-[34rem] lg:block"
          >
            <div className="relative mx-auto aspect-[1.05] w-full max-w-[32rem]">
              <div className="absolute inset-0 rounded-[2.5rem] border border-white/6 bg-[radial-gradient(circle_at_top,rgba(36,184,122,0.12),transparent_42%)]" />
              <div className="absolute right-[8%] top-[15%] size-[22rem] rounded-full border border-primary/20" />
              <div className="absolute right-[8%] top-[15%] size-[22rem] scale-[1.08] rounded-full border border-brand-secondary/14" />
              <div className="absolute right-[8%] top-[15%] size-[22rem] scale-[1.16] rounded-full border border-primary/12" />

              <div className="absolute right-[8%] top-[15%] size-[22rem] overflow-hidden rounded-full border border-white/10 bg-card shadow-[0_28px_80px_rgba(10,8,24,0.34)]">
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(12,11,27,0.08))]" />
                <Image
                  src="/romain.png"
                  alt={`Portrait de ${site.name}`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="absolute right-0 top-[2%] rounded-[1.4rem] border border-white/10 bg-[rgba(12,11,27,0.9)] px-5 py-5 shadow-[0_18px_42px_rgba(10,8,24,0.24)] backdrop-blur">
                <Lock className="text-primary" />
                <div className="mt-4 flex flex-col gap-1">
                  <p className="text-sm tracking-[0.08em] text-muted-foreground">Statut Sécurité</p>
                  <p className="text-[1.35rem] font-semibold text-foreground">Vérifié</p>
                </div>
              </div>

              <div className="absolute bottom-[10%] left-0 rounded-[1.4rem] border border-white/10 bg-[rgba(12,11,27,0.9)] px-5 py-5 shadow-[0_18px_42px_rgba(10,8,24,0.24)] backdrop-blur">
                <Terminal className="text-brand-secondary" />
                <div className="mt-4 flex flex-col gap-1">
                  <p className="text-sm tracking-[0.08em] text-muted-foreground">Analyse</p>
                  <p className="text-[1.35rem] font-semibold text-foreground">En cours</p>
                </div>
              </div>

              <div className="absolute bottom-[4%] right-[20%] rounded-full border border-border/60 bg-background/65 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground backdrop-blur">
                Offensive. Conseil. Pedagogie.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
