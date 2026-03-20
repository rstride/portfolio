"use client";

import Link from "next/link";

import { ArrowRight, Shield, Terminal } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { site } from "@/content/site";
import { useAnalytics } from "@/shared/providers/analytics-provider";
import { cn } from "@/shared/lib/utils";
import { PageHero } from "@/shared/components/page-hero";

export function Hero() {
  const { queue, track } = useAnalytics();

  return (
    <div className="page-shell flex flex-col pb-10 pt-4 lg:pb-14 lg:pt-6">
      <PageHero
        eyebrow={site.hero.eyebrow}
        title={`${site.hero.headlineA} ${site.hero.headlineB}`}
        titleClassName="max-w-[9.5ch]"
        description={site.hero.subtext}
        meta={site.hero.meta}
        actions={
          <>
            <Link
              href={site.hero.ctaPrimary.href}
              className={cn(buttonVariants({ size: "lg" }), "group")}
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
              className={buttonVariants({ variant: "outline", size: "lg" })}
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
      />
    </div>
  );
}
