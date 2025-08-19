"use client";
import Link from "next/link";
import Image from "next/image";
import { site } from "@/content/site";
import { TrustBar } from "@/components/trust-bar";
import { useAnalytics } from "@/hooks/useAnalytics";

export function Hero() {
  const { queue, track } = useAnalytics();
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full blur-3xl opacity-40 bg-primary/50 animate-pulse" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full blur-3xl opacity-30 bg-fuchsia-500/40 animate-pulse" style={{ animationDuration: "4s" }} />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 grid gap-12 md:grid-cols-2 items-center">
        <div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-fuchsia-500 to-sky-400">{site.hero.headlineA}</span>
            <span className="block text-muted-foreground text-xl sm:text-2xl mt-3">{site.hero.headlineB}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground">{site.hero.subtext}</p>
          <div className="mt-10 flex items-center gap-4">
            <Link href={site.hero.ctaPrimary.href} className="btn-primary shine" onClick={() => (queue ? queue("cta_primary_click", { location: "hero", href: site.hero.ctaPrimary.href }) : track("cta_primary_click", { location: "hero", href: site.hero.ctaPrimary.href }))}>{site.hero.ctaPrimary.label}</Link>
            <Link href={site.hero.ctaSecondary.href} className="btn-outline" onClick={() => (queue ? queue("cta_secondary_click", { location: "hero", href: site.hero.ctaSecondary.href }) : track("cta_secondary_click", { location: "hero", href: site.hero.ctaSecondary.href }))}>{site.hero.ctaSecondary.label}</Link>
          </div>
          <div className="mt-6"><TrustBar /></div>
        </div>
        <div className="relative mx-auto w-56 h-56 md:w-80 md:h-80 rounded-2xl overflow-hidden border border-border/60 glass">
          <Image src="/romain.png" alt="Portrait de Romain Stride" fill className="object-cover" priority />
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(80%_60%_at_30%_-20%,rgba(255,255,255,0.25),transparent)]" />
        </div>
      </div>
    </section>
  );
}

