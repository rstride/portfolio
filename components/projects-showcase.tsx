"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, BriefcaseBusiness, ShieldCheck, Target, Wrench } from "lucide-react";

import { landingReveal, SectionIntro } from "@/components/landing/shared";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { site } from "@/content/site";

const credibilityBlocks = [
  {
    title: "Approche terrain",
    description:
      "Pentest, bug bounty, recherche offensive et animation de formats pédagogiques : le parcours est aligné avec les missions proposées.",
    icon: ShieldCheck,
  },
  {
    title: "Vision utile au client",
    description:
      "L’objectif n’est pas d’accumuler des livrables, mais d’aider à décider, corriger et progresser rapidement.",
    icon: Target,
  },
  {
    title: "Exécution pragmatique",
    description:
      "Chaque intervention est cadrée, documentée et pensée pour aboutir à des actions concrètes côté client.",
    icon: Wrench,
  },
];

export function ProjectsShowcase() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionIntro
        eyebrow="Références"
        title={site.sections.projectsTitle}
        description={site.sections.projectsIntro}
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-[0.96fr_1.04fr]">
        <motion.div
          {...landingReveal}
          transition={{ ...landingReveal.transition, delay: 0.06 }}
          className="section-editorial px-6 py-8 sm:px-8"
        >
          <div className="relative z-10 space-y-6">
            <div>
              <p className="eyebrow">Crédibilité</p>
              <h3 className="mt-3 max-w-[12ch] text-3xl font-semibold tracking-tight text-foreground">
                Un profil conçu pour créer de la confiance rapidement
              </h3>
            </div>
            <div className="grid gap-4">
              {credibilityBlocks.map((block) => {
                const Icon = block.icon;
                return (
                  <div key={block.title} className="surface-subtle p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-[1rem] bg-[linear-gradient(135deg,var(--primary),var(--brand-secondary))] text-primary-foreground">
                        <Icon className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{block.title}</p>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{block.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div
          {...landingReveal}
          transition={{ ...landingReveal.transition, delay: 0.1 }}
          className="surface-contrast px-6 py-8 sm:px-8"
        >
          <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-[1rem] border border-white/12 bg-white/8 text-white">
                  <BriefcaseBusiness className="size-5" />
                </div>
                <div>
                  <Badge variant="secondary" className="border-0 bg-white/10 text-white">
                    Positionnement
                  </Badge>
                  <CardTitle className="mt-3 text-3xl text-white">Ce que j’apporte dans une mission</CardTitle>
                </div>
              </div>
              <CardDescription className="text-base leading-relaxed text-white/74">
                {site.about.bio}
              </CardDescription>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[1.2rem] border border-white/12 bg-white/7 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/66">Entrepreneuriat</p>
                <p className="mt-2 text-sm leading-relaxed text-white/78">{site.about.entrepreneurship}</p>
              </div>
              <div className="rounded-[1.2rem] border border-white/12 bg-white/7 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/66">Méthodes</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {site.about.methodologies.slice(0, 3).map((methodology) => (
                    <Badge key={methodology} variant="secondary" className="border-0 bg-white/10 text-white">
                      {methodology}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
        <div className="grid gap-6">
          {site.caseStudies.slice(0, 2).map((study, index) => (
            <motion.div
              key={study.title}
              {...landingReveal}
              transition={{ ...landingReveal.transition, delay: 0.14 + index * 0.06 }}
            >
              <Card className="surface-panel overflow-hidden">
                <CardContent className="grid gap-5 p-6 md:grid-cols-[1fr_0.88fr]">
                  <div className="space-y-4">
                    <Badge variant="outline" className="w-fit">
                      {study.sector}
                    </Badge>
                    <CardTitle className="text-2xl">{study.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">{study.context}</CardDescription>
                  </div>
                  <div className="grid gap-3">
                    <div className="surface-subtle p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Intervention</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{study.intervention}</p>
                    </div>
                    <div className="surface-tint p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-primary">Résultat</p>
                      <p className="mt-2 text-sm leading-relaxed text-foreground">{study.result}</p>
                    </div>
                    <div className="flex items-start gap-3 rounded-[1.2rem] border border-border/60 bg-background/62 p-4">
                      <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-primary" />
                      <p className="text-sm leading-relaxed text-muted-foreground">{study.proof}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          {...landingReveal}
          transition={{ ...landingReveal.transition, delay: 0.24 }}
          className="section-signal px-6 py-6"
        >
          <div className="space-y-5">
            <div>
              <p className="eyebrow">Preuves</p>
              <h3 className="mt-3 max-w-[12ch] text-3xl font-semibold tracking-tight text-foreground">
                Les signaux qui rassurent un décideur
              </h3>
            </div>
            <div className="grid gap-3">
              {site.proofs.map((proof) => (
                <div key={proof.title} className="surface-subtle p-4">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-primary">{proof.kpi}</div>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">{proof.title}</p>
                </div>
              ))}
            </div>

            {site.caseStudies[2] ? (
              <Card className="surface-panel overflow-hidden shadow-none">
                <CardHeader className="gap-3">
                  <Badge variant="outline" className="w-fit">
                    {site.caseStudies[2].sector}
                  </Badge>
                  <CardTitle className="text-2xl">{site.caseStudies[2].title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {site.caseStudies[2].context}
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3">
                  <div className="surface-subtle p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Intervention</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{site.caseStudies[2].intervention}</p>
                  </div>
                  <div className="surface-tint p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-primary">Résultat</p>
                    <p className="mt-2 text-sm leading-relaxed text-foreground">{site.caseStudies[2].result}</p>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
