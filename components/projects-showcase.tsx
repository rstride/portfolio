"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent, useState } from "react";
import {
  ExternalLink,
  Shield,
  Bug,
  Users,
  GraduationCap,
  Code,
  ArrowUpRight
} from "lucide-react";
import { useLazyAnimation } from "@/hooks/useLazyAnimation";
import { BackgroundEffects } from "@/components/background-effects";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";

const projects = [
  {
    id: 1,
    title: "PrismaSec — Plateforme CTEM",
    category: "Entrepreneuriat / Produit",
    description:
      "Fondateur de PrismaSec. Conception et prototypage d’une plateforme CTEM (découverte, priorisation, reporting).",
    impact: "Focus client",
    status: "MVP",
    tags: ["CTEM", "Produit", "Sécurité"],
    metrics: {
      statut: "MVP",
      approche: "Itérative",
      domaine: "TPE/PME",
    },
    icon: Shield,
    color: "from-blue-500 to-cyan-400",
    shadow: "shadow-blue-500/20",
    href: "https://prismasec.com",
  },
  {
    id: 2,
    title: "Offensive tooling (éthique)",
    category: "R&D Offensive",
    description:
      "Développement d’outils à but pédagogique (malware research, évasion, OPSEC) publiés sur GitHub dans un cadre responsable.",
    impact: "Apprentissage",
    status: "Actif",
    tags: ["Offensif", "OPSEC", "EDR", "PoC"],
    metrics: {
      repos: "GitHub",
      cadre: "Éthique",
      objectif: "Détection",
    },
    icon: Code,
    color: "from-green-500 to-emerald-400",
    shadow: "shadow-green-500/20",
    href: "https://github.com/rstride",
  },
  {
    id: 3,
    title: "École 42 — Parcours sécurité",
    category: "Formation",
    description:
      "Alumni de l’école 42. Projets système & réseau, algorithmie et modules sécurité applicative.",
    impact: "Fondamentaux",
    status: "Alumni",
    tags: ["42", "Système", "Réseau", "Sécurité"],
    metrics: {
      campus: "42 Perpignan",
      focus: "Cybersécurité",
      format: "Peer-learning",
    },
    icon: GraduationCap,
    color: "from-violet-500 to-purple-400",
    shadow: "shadow-violet-500/20",
    href: "https://42.fr/",
  },
  {
    id: 4,
    title: "Lost in the Shell — CTF",
    category: "Communauté / Organisation",
    description:
      "Président d’une asso qui organise des CTF pédagogiques (conception d’épreuves, plateforme, animation).",
    impact: "Communauté",
    status: "Actif",
    tags: ["CTF", "Organisation", "Pédagogie"],
    metrics: {
      rôle: "Président",
      format: "Jeopardy",
      public: "Étudiants/Tech",
    },
    icon: Users,
    color: "from-pink-500 to-rose-400",
    shadow: "shadow-pink-500/20",
  },
  {
    id: 5,
    title: "Bug bounty (YesWeHack)",
    category: "Bug Bounty",
    description:
      "Chasse aux bugs sur mon temps libre, principalement sur YesWeHack (focus Web/API).",
    impact: "Amélioration continue",
    status: "En cours",
    tags: ["YesWeHack", "Web", "API", "Logique métier"],
    metrics: {
      rythme: "Temps libre",
      plateforme: "YesWeHack",
      approche: "Responsible disclosure",
    },
    icon: Bug,
    color: "from-cyan-500 to-blue-400",
    shadow: "shadow-cyan-500/20",
    href: "https://www.yeswehack.com/",
  },
];

function ProjectCard({ project, index }: { project: typeof projects[0], index: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const IconComponent = project.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative h-full"
      onMouseMove={handleMouseMove}
    >
      <div className={`relative h-full overflow-hidden rounded-2xl border border-border/50 dark:border-white/5 bg-white/50 dark:bg-card/30 backdrop-blur-sm transition-all duration-300 group-hover:border-primary/50 dark:group-hover:border-white/10 group-hover:bg-white/80 dark:group-hover:bg-card/50 ${project.shadow} group-hover:shadow-lg`}>
        {/* Spotlight Effect */}
        <motion.div
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                650px circle at ${mouseX}px ${mouseY}px,
                rgba(34, 197, 94, 0.15),
                transparent 80%
              )
            `,
          }}
        />

        <div className="relative h-full p-6 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${project.color} bg-opacity-20 ring-1 ring-inset ring-black/5 dark:ring-white/10`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            {project.href && (
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors"
              >
                <ArrowUpRight className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Content */}
          <div className="mb-6 flex-1">
            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary dark:group-hover:text-transparent dark:group-hover:bg-clip-text dark:group-hover:bg-gradient-to-r dark:group-hover:from-white dark:group-hover:to-white/80 transition-all">
              {project.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-auto">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-xs font-medium rounded-full bg-black/5 dark:bg-white/5 text-muted-foreground border border-black/5 dark:border-white/5 group-hover:border-black/10 dark:group-hover:border-white/10 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectsShowcase() {
  const { ref } = useLazyAnimation(0.1);
  const performanceMode = usePerformanceMode();

  return (
    <div ref={ref} className="relative py-24 overflow-hidden">
      <BackgroundEffects
        variant="section"
        intensity={performanceMode === 'low' ? 'low' : performanceMode === 'high' ? 'high' : 'medium'}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500 mb-4"
          >
            Projets & Réalisations
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Un aperçu de mes travaux en sécurité offensive, développement d&apos;outils et contributions communautaires.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
