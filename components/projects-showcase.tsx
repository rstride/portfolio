"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, BriefcaseBusiness, ShieldCheck, Target, Wrench } from "lucide-react";

import { landingCardClass, landingReveal, SectionIntro } from "@/components/landing/shared";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const credibilityBlocks = [
  {
    title: "Approche terrain",
    description:
      "Pentest, bug bounty, recherche offensive et animation de formats pédagogiques : le site montre un parcours aligné avec les missions proposées.",
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

      <motion.div
        {...landingReveal}
        transition={{ ...landingReveal.transition, delay: 0.08 }}
        className="mt-12 grid gap-4 lg:grid-cols-3"
      >
        {credibilityBlocks.map((block) => {
          const Icon = block.icon;
          return (
            <Card key={block.title} className={landingCardClass}>
              <CardContent className="flex items-start gap-4 p-5">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-background/60">
                  <Icon className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{block.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{block.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      <motion.div
        {...landingReveal}
        transition={{ ...landingReveal.transition, delay: 0.12 }}
        className="mt-6"
      >
        <Card className={cn(landingCardClass, "border-primary/15 bg-primary/5")}>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl border border-primary/20 bg-background/60">
                <BriefcaseBusiness className="size-6 text-primary" />
              </div>
              <div>
                <Badge variant="outline">Positionnement</Badge>
                <CardTitle className="mt-2 text-3xl">Ce que j’apporte dans une mission</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <CardDescription className="text-lg leading-relaxed">{site.about.bio}</CardDescription>
            <div className="grid gap-4">
              <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-primary">Entrepreneuriat</p>
                <p className="mt-2 text-sm text-muted-foreground">{site.about.entrepreneurship}</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-primary">Méthodes</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {site.about.methodologies.slice(0, 3).map((methodology) => (
                    <Badge key={methodology} variant="secondary">
                      {methodology}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {site.caseStudies.map((study, index) => (
          <motion.div
            key={study.title}
            {...landingReveal}
            transition={{ ...landingReveal.transition, delay: 0.16 + index * 0.06 }}
          >
            <Card className={cn(landingCardClass, "flex h-full flex-col")}>
              <CardHeader className="gap-3">
                <Badge variant="outline" className="w-fit">
                  {study.sector}
                </Badge>
                <CardTitle className="text-2xl">{study.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {study.context}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-5">
                <div className="rounded-xl border border-border/60 bg-background/50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Intervention</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{study.intervention}</p>
                </div>
                <div className="rounded-xl border border-primary/15 bg-primary/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-primary">Résultat</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{study.result}</p>
                </div>
                <div className="mt-auto flex items-start gap-3 rounded-xl border border-border/60 bg-background/50 p-4">
                  <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-primary" />
                  <p className="text-sm leading-relaxed text-muted-foreground">{study.proof}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        {...landingReveal}
        transition={{ ...landingReveal.transition, delay: 0.28 }}
        className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4"
      >
        {site.proofs.map((proof) => (
          <Card key={proof.title} className={landingCardClass}>
            <CardContent className="p-4">
              <div className="text-[10px] uppercase tracking-[0.2em] text-primary">{proof.kpi}</div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{proof.title}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </div>
  );
}
