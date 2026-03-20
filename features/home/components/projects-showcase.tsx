"use client";

import Image from "next/image";

import { ArrowUpRight, BriefcaseBusiness } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { site } from "@/content/site";
import { SectionIntro } from "@/shared/components/section-intro";

export function ProjectsShowcase() {
  return (
    <div className="page-shell">
      <SectionIntro
        eyebrow={site.homeSections.references.eyebrow}
        title={site.homeSections.references.title}
        description={site.homeSections.references.description}
        align="left"
        className="mx-0"
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <section className="surface-contrast p-6 sm:p-8">
          <div className="grid gap-6">
            <div className="grid gap-6 sm:grid-cols-[8.5rem_1fr] sm:items-start">
              <div className="relative aspect-[3/4] overflow-hidden border border-white/12">
                <Image
                  src="/romain.png"
                  alt={`Portrait de ${site.name}`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 640px) 136px, 100vw"
                />
              </div>

              <div className="grid gap-5">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center border border-white/12 bg-white/8 text-white">
                    <BriefcaseBusiness />
                  </div>
                  <div>
                    <Badge variant="secondary" className="border-white/12 bg-white/8 text-white">
                      {site.homeProfile.badge}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="font-label text-[11px] uppercase tracking-[0.18em] text-secondary">
                    À propos
                  </p>
                  <h3 className="font-headline mt-4 text-4xl font-bold uppercase leading-[0.94] tracking-[-0.05em] text-white">
                    {site.hero.profileTitle}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-white/76">
                    {site.hero.profileDescription}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {site.hero.profileHighlights.map((highlight) => (
                    <div key={highlight.label} className="border border-white/12 bg-white/8 p-4">
                      <p className="font-label text-[11px] uppercase tracking-[0.18em] text-white/62">
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

            <div className="border-t border-white/10 pt-6">
              <Badge variant="secondary" className="border-white/12 bg-white/8 text-white">
                {site.homeProfile.badge}
              </Badge>
              <h3 className="font-headline mt-4 text-3xl font-bold uppercase leading-[0.94] tracking-[-0.05em] text-white">
                {site.homeProfile.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-white/76">
                {site.homeProfile.description}
              </p>
            </div>

            <div className="grid gap-3">
              {site.homeProfile.highlights.map((highlight) => (
                <div
                  key={highlight.label}
                  className="border border-white/12 bg-white/8 p-4"
                >
                  <p className="font-label text-[11px] uppercase tracking-[0.18em] text-white/62">
                    {highlight.label}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-white/78">{highlight.text}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-3">
              <div>
                <p className="font-label text-[10px] uppercase tracking-[0.18em] text-white/46">
                  Focus
                </p>
                <p className="mt-2 text-sm text-white/76">Web, API, audit et formation.</p>
              </div>
              <div>
                <p className="font-label text-[10px] uppercase tracking-[0.18em] text-white/46">
                  Langage
                </p>
                <p className="mt-2 text-sm text-white/76">Rapports clairs, décisions lisibles.</p>
              </div>
              <div>
                <p className="font-label text-[10px] uppercase tracking-[0.18em] text-white/46">
                  Cadre
                </p>
                <p className="mt-2 text-sm text-white/76">Intervention courte, utile, cadrée.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4">
          {site.caseStudies.map((study) => (
            <article key={study.title} className="archive-row">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline">{study.sector}</Badge>
                <span className="font-label text-[11px] uppercase tracking-[0.18em] text-primary">
                  Cas concret
                </span>
              </div>

              <h3 className="font-headline mt-5 text-3xl font-bold uppercase leading-none tracking-[-0.04em] text-foreground">
                {study.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-foreground">{study.result}</p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="surface-subtle p-4">
                  <p className="font-label text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Contexte
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {study.context}
                  </p>
                </div>
                <div className="surface-tint p-4">
                  <p className="font-label text-[11px] uppercase tracking-[0.18em] text-primary">
                    Intervention
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    {study.intervention}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-3 border border-border/16 bg-background/70 p-4">
                <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-primary" />
                <p className="text-sm leading-relaxed text-muted-foreground">{study.proof}</p>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
