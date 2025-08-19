"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { 
  ExternalLink, 
  Github, 
  Shield, 
  Bug, 
  Target, 
  Zap, 
  Lock, 
  AlertCircle,
  TrendingUp,
  Award,
  Eye,
  Code
} from "lucide-react";

const projects = [
  {
    id: 1,
    title: "Découverte CVE-2024-XXXX",
    category: "Recherche de Vulnérabilités",
    description: "Contournement d'authentification critique dans un logiciel d'entreprise populaire affectant 50K+ installations",
    impact: "Critical",
    status: "Divulgué",
    tags: ["CVE", "Authentication", "0-day", "Enterprise"],
    metrics: {
      severity: "9.8 CVSS",
      affected: "50K+ installs",
      timeline: "90 jours"
    },
    icon: Bug,
    color: "from-red-500 to-orange-500",
    bgPattern: "bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent)]"
  },
  {
    id: 2,
    title: "Exercice Red Team Fortune 500",
    category: "Tests de Pénétration",
    description: "Mission red team complète simulant un acteur de menace persistante avancée",
    impact: "High",
    status: "Terminé",
    tags: ["Red Team", "APT", "AD", "Lateral Movement"],
    metrics: {
      duration: "4 semaines",
      findings: "23 critiques",
      coverage: "100% périmètre"
    },
    icon: Target,
    color: "from-purple-500 to-pink-500",
    bgPattern: "bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.1),transparent)]"
  },
  {
    id: 3,
    title: "Bug Bounty Hall of Fame",
    category: "Bug Bounty",
    description: "Multiples découvertes critiques sur les plateformes et services de grandes entreprises tech",
    impact: "High",
    status: "En cours",
    tags: ["Bug Bounty", "Web App", "Logic Flaws", "RCE"],
    metrics: {
      platforms: "15+",
      bounties: "$25K+",
      rank: "Top 1%"
    },
    icon: Award,
    color: "from-yellow-500 to-orange-500",
    bgPattern: "bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.1),transparent)]"
  },
  {
    id: 4,
    title: "Cloud Security Automation",
    category: "Security Tools",
    description: "Outil open-source pour la surveillance continue et l'alerte de la posture de sécurité cloud",
    impact: "Medium",
    status: "Actif",
    tags: ["Cloud", "Automation", "Python", "AWS"],
    metrics: {
      stars: "500+",
      users: "2K+",
      coverage: "3 clouds"
    },
    icon: Shield,
    color: "from-blue-500 to-cyan-500",
    bgPattern: "bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent)]"
  },
  {
    id: 5,
    title: "API Security Framework",
    category: "Recherche Sécurité",
    description: "Méthodologie complète de test pour les évaluations de sécurité d'API GraphQL et REST",
    impact: "Medium",
    status: "Publié",
    tags: ["API", "GraphQL", "Methodology", "Framework"],
    metrics: {
      downloads: "10K+",
      citations: "50+",
      adoption: "Industry"
    },
    icon: Code,
    color: "from-green-500 to-teal-500",
    bgPattern: "bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent)]"
  },
  {
    id: 6,
    title: "Recherche d'Attaques Supply Chain",
    category: "Threat Intelligence",
    description: "Analyse d'attaques supply chain sophistiquées et développement de mécanismes de détection",
    impact: "High",
    status: "Recherche",
    tags: ["Supply Chain", "APT", "Detection", "IoCs"],
    metrics: {
      threats: "50+",
      accuracy: "95%",
      coverage: "Global"
    },
    icon: AlertCircle,
    color: "from-indigo-500 to-purple-500",
    bgPattern: "bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent)]"
  }
];

export function ProjectsShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
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
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.02)_2px,transparent_2px),linear-gradient(90deg,rgba(34,197,94,0.02)_2px,transparent_2px)] bg-[size:60px_60px]"
          animate={{ 
            backgroundPosition: ["0px 0px", "60px 60px"],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "linear",
            staggerChildren: 0.1
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-6"
          >
            <Target className="w-8 h-8 text-purple-400" />
          </motion.div>
          <h2 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-4">
            Projets & Recherches en Sécurité
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Présentation de recherches en vulnérabilités, missions de tests d'intrusion et développement d'outils de sécurité avec impact concret.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {projects.map((project, index) => {
            const IconComponent = project.icon;
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                onHoverStart={() => setHoveredProject(project.id)}
                onHoverEnd={() => setHoveredProject(null)}
                className="group relative"
              >
                {/* Project card */}\n                <motion.div
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
                  <motion.div
                    className="absolute bottom-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                  >
                    <motion.button
                      className="w-8 h-8 rounded-full bg-foreground/10 backdrop-blur-sm border border-border/50 flex items-center justify-center text-muted-foreground hover:text-green-400 hover:border-green-500/50 transition-colors"
                      whileHover={{ scale: 1.1, rotate: 15 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      className="w-8 h-8 rounded-full bg-foreground/10 backdrop-blur-sm border border-border/50 flex items-center justify-center text-muted-foreground hover:text-blue-400 hover:border-blue-500/50 transition-colors"
                      whileHover={{ scale: 1.1, rotate: 15 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
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

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <motion.button
            className="btn-primary shine group relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              className="relative z-10 flex items-center gap-2"
              whileHover={{ x: 2 }}
            >
              Voir tous les projets
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ExternalLink className="w-4 h-4" />
              </motion.div>
            </motion.span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
              initial={{ x: "-100%" }}
              whileHover={{ x: "0%" }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}