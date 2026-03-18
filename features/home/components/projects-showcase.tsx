"use client";

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
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="surface-contrast p-6 sm:p-8">
          <div className="grid gap-6">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-[1rem] border border-white/12 bg-white/8 text-white">
                <BriefcaseBusiness />
              </div>
              <div>
                <Badge variant="secondary" className="border-0 bg-white/10 text-white">
                  {site.homeProfile.badge}
                </Badge>
                <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                  {site.homeProfile.title}
                </h3>
              </div>
            </div>

            <p className="text-base leading-relaxed text-white/76">{site.homeProfile.description}</p>

            <div className="grid gap-3">
              {site.homeProfile.highlights.map((highlight) => (
                <div
                  key={highlight.label}
                  className="rounded-[1.2rem] border border-white/12 bg-white/8 p-4"
                >
                  <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-white/62">
                    {highlight.label}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-white/78">{highlight.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4">
          {site.caseStudies.map((study) => (
            <article key={study.title} className="proof-card">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline">{study.sector}</Badge>
                <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-primary">
                  Cas concret
                </span>
              </div>

              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
                {study.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-foreground">{study.result}</p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="surface-subtle p-4">
                  <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
                    Contexte
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {study.context}
                  </p>
                </div>
                <div className="surface-tint p-4">
                  <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-primary">
                    Intervention
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    {study.intervention}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-3 rounded-[1.1rem] border border-border/60 bg-background/78 p-4">
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
