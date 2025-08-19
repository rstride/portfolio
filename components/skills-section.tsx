"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Shield, 
  Terminal, 
  Globe, 
  Bug, 
  Lock, 
  Search, 
  Code, 
  Network,
  Eye,
  Zap,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

const skills = [
  {
    category: "Sécurité des Applications Web",
    icon: Globe,
    color: "from-blue-500 to-cyan-500",
    skills: [
      { name: "OWASP Top 10", level: 95, description: "SQL Injection, XSS, CSRF, etc." },
      { name: "API Security Testing", level: 90, description: "REST/GraphQL/gRPC security" },
      { name: "Authentication Bypass", level: 85, description: "OAuth, JWT, Session flaws" },
      { name: "Logic Flaws", level: 88, description: "Business logic vulnerabilities" }
    ]
  },
  {
    category: "Réseau & Infrastructure",
    icon: Network,
    color: "from-green-500 to-emerald-500",
    skills: [
      { name: "Network Penetration", level: 92, description: "Internal/External pentesting" },
      { name: "Active Directory", level: 87, description: "Domain escalation & persistence" },
      { name: "Cloud Security", level: 85, description: "AWS/Azure/GCP security" },
      { name: "Lateral Movement", level: 90, description: "Post-exploitation techniques" }
    ]
  },
  {
    category: "Recherche en Sécurité",
    icon: Bug,
    color: "from-purple-500 to-pink-500",
    skills: [
      { name: "0-day Discovery", level: 80, description: "Novel vulnerability research" },
      { name: "Exploit Development", level: 75, description: "PoC creation & chaining" },
      { name: "Responsible Disclosure", level: 95, description: "CVE coordination & reporting" },
      { name: "Threat Modeling", level: 88, description: "Risk assessment & mitigation" }
    ]
  },
  {
    category: "Outils & Méthodologies",
    icon: Terminal,
    color: "from-orange-500 to-red-500",
    skills: [
      { name: "Burp Suite Pro", level: 95, description: "Advanced web app testing" },
      { name: "Metasploit/Cobalt", level: 88, description: "Exploitation frameworks" },
      { name: "Custom Tooling", level: 85, description: "Python/Go automation" },
      { name: "MITRE ATT&CK", level: 90, description: "Tactical analysis framework" }
    ]
  }
];

const certifications = [
  { name: "OSCP", status: "certified", year: "2023", color: "text-green-400" },
  { name: "CISSP", status: "certified", year: "2022", color: "text-blue-400" },
  { name: "CEH", status: "certified", year: "2021", color: "text-purple-400" },
  { name: "OSWE", status: "in-progress", year: "2025", color: "text-orange-400" }
];

export function SkillsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:100px_100px]"
        animate={{ backgroundPosition: ["0px 0px", "100px 100px"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 mb-6"
          >
            <Shield className="w-8 h-8 text-green-400" />
          </motion.div>
          <h2 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 mb-4">
            Expertise Technique
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tests de sécurité complets dans plusieurs domaines avec un historique prouvé de découverte de vulnérabilités et de divulgation responsable.
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {skills.map((category, categoryIndex) => {
            const IconComponent = category.icon;
            return (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, x: categoryIndex % 2 === 0 ? -50 : 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: categoryIndex % 2 === 0 ? -50 : 50 }}
                transition={{ duration: 0.8, delay: categoryIndex * 0.2 }}
                className="glass rounded-2xl p-8 group hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <motion.div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-foreground">{category.category}</h3>
                </div>

                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ duration: 0.6, delay: (categoryIndex * 0.2) + (skillIndex * 0.1) }}
                      className="group/skill"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-foreground group-hover/skill:text-green-400 transition-colors">
                          {skill.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${category.color} rounded-full`}
                          initial={{ width: 0 }}
                          animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                          transition={{ duration: 1, delay: (categoryIndex * 0.2) + (skillIndex * 0.1) + 0.5 }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 opacity-0 group-hover/skill:opacity-100 transition-opacity">
                        {skill.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold mb-8 text-foreground">Certifications & Credentials</h3>
          <div className="flex flex-wrap justify-center gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass rounded-xl p-6 min-w-[120px] group cursor-pointer"
              >
                <motion.div
                  animate={{ 
                    scale: cert.status === "certified" ? [1, 1.1, 1] : [1, 1.05, 1],
                    rotate: cert.status === "certified" ? [0, 5, -5, 0] : [0, 2, -2, 0]
                  }}
                  transition={{ 
                    duration: cert.status === "certified" ? 2 : 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="mb-3"
                >
                  {cert.status === "certified" ? (
                    <CheckCircle className={`w-8 h-8 mx-auto ${cert.color}`} />
                  ) : (
                    <AlertTriangle className={`w-8 h-8 mx-auto ${cert.color}`} />
                  )}
                </motion.div>
                <h4 className="font-semibold text-foreground group-hover:text-green-400 transition-colors">
                  {cert.name}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {cert.status === "certified" ? `Certified ${cert.year}` : `In Progress ${cert.year}`}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}