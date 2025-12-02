"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  ExternalLink,
  Shield,
  Bug,
  Users,
  GraduationCap,
  Code,
  Target
} from "lucide-react";
import { useLazyAnimation } from "@/hooks/useLazyAnimation";

import { BackgroundEffects } from "@/components/background-effects";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";

const projects = [
  {
    id: 1,
    title: "PrismaSec — Plateforme CTEM (MVP)",
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
    color: "from-blue-500 to-cyan-500",
    bgPattern:
      "bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent)]",
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
    color: "from-emerald-500 to-teal-500",
    bgPattern:
      "bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent)]",
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
    color: "from-indigo-500 to-purple-500",
    bgPattern:
      "bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent)]",
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
    color: "from-yellow-500 to-orange-500",
    bgPattern:
      "bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.1),transparent)]",
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
    color: "from-sky-500 to-cyan-500",
    bgPattern:
      "bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.1),transparent)]",
    href: "https://www.yeswehack.com/",
  },
];

export function ProjectsShowcase() {
  const { ref, isInView } = useLazyAnimation(0.1);
  const performanceMode = usePerformanceMode();

  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "Critical": return "text-red-400 bg-red-500/10 border-red-500/20";
      case "High": return "text-orange-400 bg-orange-500/10 border-orange-500/20";
      case "Medium": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      default: return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Divulgué": return "text-green-400 bg-green-500/10";
      case "Terminé": return "text-blue-400 bg-blue-500/10";
      case "Actif": return "text-purple-400 bg-purple-500/10";
      case "Publié": return "text-cyan-400 bg-cyan-500/10";
      case "Recherche": return "text-orange-400 bg-orange-500/10";
      case "En cours": return "text-purple-400 bg-purple-500/10";
      default: return "text-gray-400 bg-gray-500/10";
    }
  };

  return (
    <div ref={ref} className="relative overflow-hidden">
      {/* Harmonious Background Effects */}
      <BackgroundEffects
        variant="section"
        intensity={performanceMode === 'low' ? 'low' : performanceMode === 'high' ? 'high' : 'medium'}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-8"
          >
            <Target className="w-10 h-10 text-purple-400" />
          </motion.div>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-6 leading-tight">
            Projets & Parcours
            <br />
            <span className="text-3xl sm:text-4xl lg:text-5xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-400">
              en Sécurité
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Présentation de recherches en vulnérabilités, missions de tests d&apos;intrusion et développement d&apos;outils de sécurité avec impact concret.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-10 lg:gap-12">
          {projects.map((project, index) => {
            const IconComponent = project.icon;
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 1, y: 0, scale: 1 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                onHoverStart={() => setHoveredProject(project.id)}
                onHoverEnd={() => setHoveredProject(null)}
                className="group relative"
              >
                {/* Project card */}
                <motion.div
                  className={`relative glass rounded-2xl p-6 h-full cursor-pointer overflow-hidden ${project.bgPattern}`}
                  whileHover={{
                    scale: 1.02,
                    y: -5,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Hover overlay */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.1 }}
                  />

                  {/* Animated corner decoration */}
                  <motion.div
                    className="absolute top-0 right-0 w-16 h-16 overflow-hidden"
                    whileHover={{ scale: 1.2 }}
                  >
                    <motion.div
                      className={`absolute top-0 right-0 w-8 h-8 bg-gradient-to-br ${project.color} opacity-20 rotate-45 translate-x-4 -translate-y-4`}
                      animate={hoveredProject === project.id ? {
                        rotate: [45, 405],
                        scale: [1, 1.2, 1]
                      } : { rotate: 45 }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>

                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <motion.div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-r ${project.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </motion.div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getImpactColor(project.impact)}`}>
                        {project.impact}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-6">
                    <motion.h3
                      className="text-xl font-semibold text-foreground mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-green-400 group-hover:to-blue-500 transition-all duration-300"
                      whileHover={{ x: 2 }}
                    >
                      {project.title}
                    </motion.h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {project.category}
                    </p>
                    <motion.p
                      className="text-sm text-muted-foreground leading-relaxed"
                      initial={{ opacity: 0.8 }}
                      whileHover={{ opacity: 1 }}
                    >
                      {project.description}
                    </motion.p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag, tagIndex) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 + tagIndex * 0.05 }}
                        whileHover={{ scale: 1.1 }}
                        className="px-2 py-1 text-xs bg-muted/50 text-muted-foreground rounded-md border border-border/50 group-hover:border-green-500/30 transition-colors"
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    {Object.entries(project.metrics).map(([key, value], metricIndex) => (
                      <motion.div
                        key={key}
                        className="group/metric"
                        whileHover={{ scale: 1.05 }}
                      >
                        <motion.div
                          className="text-sm font-semibold text-foreground group-hover:text-green-400 transition-colors"
                          animate={hoveredProject === project.id ? {
                            scale: [1, 1.1, 1]
                          } : { scale: 1 }}
                          transition={{
                            duration: 1,
                            repeat: hoveredProject === project.id ? Infinity : 0,
                            delay: metricIndex * 0.2
                          }}
                        >
                          {value}
                        </motion.div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {key}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Action buttons (appear on hover) */}
                  {"href" in project && project.href && (
                    <motion.div
                      className="absolute bottom-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ y: 20, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                    >
                      <motion.a
                        href={project.href as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-foreground/10 backdrop-blur-sm border border-border/50 flex items-center justify-center text-muted-foreground hover:text-blue-400 hover:border-blue-500/50 transition-colors"
                        whileHover={{ scale: 1.1, rotate: 15 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Ouvrir le lien du projet"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </motion.a>
                    </motion.div>
                  )}
                </motion.div>

                {/* Glow effect on hover */}
                <motion.div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${project.color} opacity-0 blur-xl -z-10`}
                  animate={hoveredProject === project.id ? { opacity: 0.1 } : { opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
