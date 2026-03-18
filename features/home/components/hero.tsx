"use client";

import Image from "next/image";
import Link from "next/link";

import { ArrowRight, Shield, Terminal } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { site } from "@/content/site";
import { useAnalytics } from "@/shared/providers/analytics-provider";
import { cn } from "@/shared/lib/utils";
import { PageHero } from "@/shared/components/page-hero";
import { TrustStrip } from "@/shared/components/trust-strip";

export function Hero() {
  const { queue, track } = useAnalytics();

  return (
    <div className="page-shell flex flex-col gap-6 pb-10 pt-6 lg:pb-14 lg:pt-8">
      <PageHero
        eyebrow={site.hero.eyebrow}
        title={`${site.hero.headlineA} ${site.hero.headlineB}`}
        titleClassName="max-w-[10ch]"
        description={site.hero.subtext}
        meta={site.hero.meta}
        actions={
          <>
            <Link
              href={site.hero.ctaPrimary.href}
              className={cn(
                buttonVariants({ size: "lg" }),
                "group border-0 bg-[linear-gradient(135deg,var(--primary),var(--brand-secondary))] text-primary-foreground shadow-[0_16px_34px_rgba(22,126,102,0.24)]"
              )}
              onClick={() =>
                queue
                  ? queue("cta_primary_click", {
                      location: "hero",
                      href: site.hero.ctaPrimary.href,
                    })
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
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "shadow-none")}
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
              {site.hero.ctaSecondary.label}
            </Link>
          </>
        }
        aside={
          <div className="surface-contrast overflow-hidden p-6 sm:p-7">
            <div className="grid gap-6">
              <div className="grid gap-4 sm:grid-cols-[8.5rem_1fr] sm:items-center">
                <div className="relative mx-auto aspect-square w-full max-w-[8.5rem] overflow-hidden rounded-[1.6rem] border border-white/12">
                  <Image
                    src="/romain.png"
                    alt={`Portrait de ${site.name}`}
                    fill
                    className="object-cover"
                    priority
                    sizes="160px"
                  />
                </div>

                <div>
                  <p className="eyebrow text-white/70">Profil</p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                    {site.hero.profileTitle}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-white/74">
                    {site.hero.profileDescription}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {site.hero.profileHighlights.map((highlight) => (
                  <div
                    key={highlight.label}
                    className="rounded-[1.2rem] border border-white/12 bg-white/8 p-4"
                  >
                    <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-white/62">
                      {highlight.label}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-white/78">
                      {highlight.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
      />

      <TrustStrip items={site.trustSignals} />
    </div>
  );
}
