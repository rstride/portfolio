"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Bug,
  Code,
  GraduationCap,
  Shield,
  Terminal,
  Users,
} from "lucide-react";

import { landingCardClass, landingReveal, SectionIntro } from "@/components/landing/shared";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const projects = [
  {
    id: 1,
    title: "PrismaSec — Plateforme CTEM",
    category: "Entrepreneuriat / Produit",
    description:
      "Fondateur de PrismaSec. Conception et prototypage d’une plateforme CTEM orientée découverte, priorisation et reporting.",
    tags: ["CTEM", "Produit", "Sécurité"],
    metrics: {
      statut: "MVP",
      approche: "Itérative",
      domaine: "TPE/PME",
    },
    icon: Shield,
    color: "text-blue-600 dark:text-blue-400",
    href: "https://prismasec.com",
  },
  {
    id: 2,
    title: "Offensive tooling (éthique)",
    category: "R&D Offensive",
    description:
      "Développement d’outils à but pédagogique publiés sur GitHub dans un cadre responsable.",
    tags: ["Offensif", "OPSEC", "EDR", "PoC"],
    metrics: {
      repos: "GitHub",
      cadre: "Éthique",
      objectif: "Détection",
    },
    icon: Code,
    color: "text-green-600 dark:text-green-400",
    href: "https://github.com/rstride",
  },
  {
    id: 3,
    title: "École 42 — Parcours sécurité",
    category: "Formation",
    description:
      "Alumni de l’école 42 avec projets système, réseau, algorithmie et sécurité applicative.",
    tags: ["42", "Système", "Réseau", "Sécurité"],
    metrics: {
      campus: "42 Perpignan",
      focus: "Cybersécurité",
      format: "Peer-learning",
    },
    icon: GraduationCap,
    color: "text-cyan-600 dark:text-cyan-400",
    href: "https://42.fr/",
  },
  {
    id: 4,
    title: "Lost in the Shell — CTF",
    category: "Communauté / Organisation",
    description:
      "Président d’une association qui organise des CTF pédagogiques, de la conception d’épreuves à l’animation.",
    tags: ["CTF", "Organisation", "Pédagogie"],
    metrics: {
      rôle: "Président",
      format: "Jeopardy",
      public: "Étudiants/Tech",
    },
    icon: Users,
    color: "text-emerald-600 dark:text-emerald-400",
  },
  {
    id: 5,
    title: "Bug bounty (YesWeHack)",
    category: "Bug Bounty",
    description:
      "Chasse aux bugs sur mon temps libre, principalement sur YesWeHack avec un focus Web/API.",
    tags: ["YesWeHack", "Web", "API", "Logique métier"],
    metrics: {
      rythme: "Temps libre",
      plateforme: "YesWeHack",
      approche: "Responsible disclosure",
    },
    icon: Bug,
    color: "text-cyan-600 dark:text-cyan-400",
    href: "https://www.yeswehack.com/",
  },
];

function ProjectCard({
  project,
  delay = 0,
}: {
  project: (typeof projects)[number];
  delay?: number;
}) {
  const IconComponent = project.icon;

  return (
    <motion.div {...landingReveal} transition={{ ...landingReveal.transition, delay }}>
      <Card className={cn(landingCardClass, "h-full")}>
        <CardHeader className="gap-4">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl border border-border/60 bg-background/60">
              <IconComponent className={cn("size-6", project.color)} />
            </div>
            <div>
              <Badge variant="outline" className={cn("mb-2 border-current/20", project.color)}>
                {project.category}
              </Badge>
              <CardTitle className="text-2xl">{project.title.split("—")[0].trim()}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription className="mb-6 text-base leading-relaxed">
            {project.description}
          </CardDescription>
          <div className="mb-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <ul className="flex flex-col gap-3">
            {Object.entries(project.metrics).map(([key, value]) => (
              <li key={key} className="flex items-start gap-3 text-sm text-muted-foreground">
                <div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                <span>
                  <span className="font-medium capitalize text-foreground">{key}:</span> {value}
                </span>
              </li>
            ))}
          </ul>
          {project.href ? (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn("mt-6 inline-flex items-center gap-2 text-sm font-medium transition-colors", project.color)}
            >
              Voir plus
              <ArrowUpRight className="size-4" />
            </a>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function ProjectsShowcase() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionIntro
        eyebrow="Crédibilité"
        title={site.sections.projectsTitle || "Expertise & Réalisations"}
        description={
          site.sections.projectsIntro ||
          "Retour d'expérience terrain, projets concrets et contributions à la communauté cybersécurité."
        }
      />

      <motion.div
        {...landingReveal}
        transition={{ ...landingReveal.transition, delay: 0.1 }}
        className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4"
      >
        {site.proofs.map((proof) => (
          <Card key={proof.title} className={landingCardClass}>
            <CardContent className="p-4">
              <div className="text-[10px] uppercase tracking-[0.2em] text-primary">{proof.kpi}</div>
              <p className="mt-2 text-sm text-muted-foreground">{proof.title}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div
        {...landingReveal}
        transition={{ ...landingReveal.transition, delay: 0.15 }}
        className="mt-6"
      >
        <Card className={cn(landingCardClass, "mb-6")}>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl border border-border/60 bg-background/60">
                <Terminal className="size-6 text-primary" />
              </div>
              <div>
                <Badge variant="outline">Profil</Badge>
                <CardTitle className="mt-2 text-3xl">Approche et contexte</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <CardDescription className="text-lg leading-relaxed">{site.about.bio}</CardDescription>
            <div className="rounded-xl border border-border/60 bg-background/60 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-primary">Entrepreneuriat</p>
              <p className="mt-2 text-sm text-muted-foreground">{site.about.entrepreneurship}</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/60 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-primary">Méthodologies</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {site.about.methodologies.slice(0, 3).map((methodology) => (
                  <Badge key={methodology} variant="secondary">
                    {methodology}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} delay={0.2 + index * 0.05} />
        ))}
      </div>
    </div>
  );
}
