"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent } from "react";
import {
  Shield,
  Bug,
  Users,
  GraduationCap,
  Code,
  ArrowUpRight,
  Terminal,
  Briefcase,
  Cpu,
  Globe,
  Database
} from "lucide-react";
import { site } from "@/content/site";
import { useLazyAnimation } from "@/hooks/useLazyAnimation";
import { BackgroundEffects } from "@/components/background-effects";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
    featured: true,
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
    color: "from-cyan-500 to-blue-400",
    shadow: "shadow-cyan-500/20",
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
    color: "from-emerald-500 to-green-400",
    shadow: "shadow-emerald-500/20",
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

function BentoCard({ children, className, color = "from-green-500 to-blue-500", delay = 0 }: { children: React.ReactNode, className?: string, color?: string, delay?: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className={cn("group relative h-full", className)}
      onMouseMove={handleMouseMove}
    >
      <div className={cn("absolute -inset-0.5 bg-gradient-to-r rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur-sm", color)} />

      <Card className="relative h-full overflow-hidden bg-white/60 dark:bg-black/40 border-black/5 dark:border-white/10 hover:border-black/10 dark:hover:border-white/20 transition-colors duration-300">
        <motion.div
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-0"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                650px circle at ${mouseX}px ${mouseY}px,
                rgba(255, 255, 255, 0.1),
                transparent 80%
              )
            `,
          }}
        />
        <div className="relative h-full z-10">
          {children}
        </div>
      </Card>
    </motion.div>
  );
}

function ProjectContent({ project }: { project: typeof projects[0] }) {
  const IconComponent = project.icon;
  // Extract color classes for icon styling
  const colorMap: Record<string, { text: string; bg: string }> = {
    "from-blue-500 to-cyan-400": { text: "text-blue-600 dark:text-blue-400", bg: "from-blue-500/20 to-cyan-500/20" },
    "from-green-500 to-emerald-400": { text: "text-green-600 dark:text-green-400", bg: "from-green-500/20 to-emerald-500/20" },
    "from-cyan-500 to-blue-400": { text: "text-cyan-600 dark:text-cyan-400", bg: "from-cyan-500/20 to-blue-500/20" },
    "from-emerald-500 to-green-400": { text: "text-emerald-600 dark:text-emerald-400", bg: "from-emerald-500/20 to-green-500/20" },
  };
  const colors = colorMap[project.color] || { text: "text-green-600 dark:text-green-400", bg: "from-green-500/20 to-blue-500/20" };

  return (
    <div className="p-8 h-full flex flex-col relative overflow-hidden">
      {/* Background decorative icon */}
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
        <IconComponent className="w-32 h-32 text-current rotate-12" style={{ color: 'inherit' }} />
      </div>

      <div className="relative z-10">
        {/* Header with icon + label + title */}
        <div className="flex items-center gap-4 mb-6">
          <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center border border-black/10 dark:border-white/10", colors.bg)}>
            <IconComponent className={cn("w-6 h-6", colors.text)} />
          </div>
          <div>
            <div className={cn("text-xs font-mono uppercase tracking-wider mb-1", colors.text)}>{project.category}</div>
            <h3 className="text-2xl font-bold text-foreground">{project.title.split('—')[0].trim()}</h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground leading-relaxed mb-6">
          {project.description}
        </p>

        {/* Key info as bullet points */}
        <ul className="space-y-3">
          {Object.entries(project.metrics).map(([key, value]) => (
            <li key={key} className="flex items-start gap-3 text-muted-foreground text-sm">
              <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0", colors.text.includes('blue') ? 'bg-blue-500' : colors.text.includes('cyan') ? 'bg-cyan-500' : colors.text.includes('emerald') ? 'bg-emerald-500' : 'bg-green-500')} />
              <span><span className="capitalize font-medium">{key}:</span> {value}</span>
            </li>
          ))}
        </ul>

        {/* Optional link */}
        {project.href && (
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn("inline-flex items-center gap-2 mt-6 text-sm font-medium transition-colors", colors.text)}
          >
            Voir plus
            <ArrowUpRight className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}

export function ProjectsShowcase() {
  const { ref } = useLazyAnimation(0.1);
  const performanceMode = usePerformanceMode();

  return (
    <div ref={ref} className="relative overflow-hidden">
      <BackgroundEffects
        variant="section"
        intensity={performanceMode === 'low' ? 'low' : performanceMode === 'high' ? 'high' : 'medium'}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gradient-primary mb-6 pb-2"
          >
            {site.sections.projectsTitle || "Expertise & Réalisations"}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            {site.sections.projectsIntro || "Retour d'expérience terrain, projets concrets et contributions à la communauté cybersécurité."}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">

          {/* 1. Profile / Bio (Large - 2x2 on Desktop) */}
          <BentoCard className="md:col-span-2 lg:col-span-2 row-span-1" color="from-green-500/20 to-blue-500/20">
            <div className="p-8 h-full flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                <Terminal className="w-64 h-64 text-green-500 -rotate-12" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center border border-black/10 dark:border-white/10">
                    <Code className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-green-600 dark:text-green-400 uppercase tracking-wider mb-1">À propos</div>
                    <h3 className="text-3xl font-bold text-foreground">PROFIL</h3>
                  </div>
                </div>
                <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl">{site.about.bio}</p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-green-600 dark:text-green-400 uppercase tracking-wide">Entrepreneuriat</h4>
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    </div>
                    <p className="text-sm text-muted-foreground">{site.about.entrepreneurship}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Méthodologies</h4>
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {site.about.methodologies.slice(0, 3).map((m) => (
                        <span key={m} className="text-xs text-muted-foreground bg-black/10 dark:bg-black/20 px-2 py-1 rounded">{m}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </BentoCard>

          {/* 2. Education (Vertical) */}
          <BentoCard className="md:col-span-1 lg:col-span-1 row-span-1" color="from-blue-500/20 to-cyan-500/20" delay={0.1}>
            <div className="p-8 h-full flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                <GraduationCap className="w-32 h-32 text-blue-500 rotate-12" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-black/10 dark:border-white/10">
                    <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Parcours académique</div>
                    <h3 className="text-2xl font-bold text-foreground">FORMATION</h3>
                  </div>
                </div>
                <ul className="space-y-4">
                  {site.about.education.map((e) => (
                    <li key={e} className="flex items-start gap-3 text-muted-foreground text-sm">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </BentoCard>

          {/* 3. Featured Project (PrismaSec) - Large */}
          <BentoCard className="md:col-span-2 lg:col-span-2 row-span-1" color="from-blue-500/20 to-cyan-400/20" delay={0.2}>
            <ProjectContent project={projects[0]} />
          </BentoCard>

          {/* 4. Experience (Vertical) */}
          <BentoCard className="md:col-span-1 lg:col-span-1 row-span-1" color="from-emerald-500/20 to-green-500/20" delay={0.3}>
            <div className="p-8 h-full flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                <Briefcase className="w-32 h-32 text-emerald-500 -rotate-6" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center border border-black/10 dark:border-white/10">
                    <Briefcase className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Expérience</div>
                    <h3 className="text-2xl font-bold text-foreground">PARCOURS</h3>
                  </div>
                </div>
                <ul className="space-y-4">
                  {site.about.experience.map((x) => (
                    <li key={x} className="flex items-start gap-3 text-muted-foreground text-sm">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </BentoCard>

          {/* 5. Project 2 (Offensive Tooling) */}
          <BentoCard className="md:col-span-1 lg:col-span-1" color="from-green-500/20 to-emerald-400/20" delay={0.4}>
            <ProjectContent project={projects[1]} />
          </BentoCard>

          {/* 6. Project 3 (42) */}
          <BentoCard className="md:col-span-1 lg:col-span-1" color="from-cyan-500/20 to-blue-400/20" delay={0.5}>
            <ProjectContent project={projects[2]} />
          </BentoCard>

          {/* 7. Community */}
          <BentoCard className="md:col-span-1 lg:col-span-1" color="from-cyan-500/20 to-blue-500/20" delay={0.6}>
            <div className="p-8 h-full flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                <Users className="w-32 h-32 text-cyan-500 rotate-6" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-black/10 dark:border-white/10">
                    <Users className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-1">Engagement</div>
                    <h3 className="text-2xl font-bold text-foreground">COMMUNAUTÉ</h3>
                  </div>
                </div>
                <ul className="space-y-4">
                  {site.about.community.map((c) => (
                    <li key={c} className="flex items-start gap-3 text-muted-foreground text-sm">
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-1.5 flex-shrink-0" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </BentoCard>

          {/* 8. Project 4 (Lost in the Shell) */}
          <BentoCard className="md:col-span-1 lg:col-span-1" color="from-emerald-500/20 to-green-400/20" delay={0.7}>
            <ProjectContent project={projects[3]} />
          </BentoCard>

          {/* 9. Project 5 (Bug Bounty) */}
          <BentoCard className="md:col-span-1 lg:col-span-1" color="from-cyan-500/20 to-blue-400/20" delay={0.8}>
            <ProjectContent project={projects[4]} />
          </BentoCard>

        </div>
      </div>
    </div>
  );
}
