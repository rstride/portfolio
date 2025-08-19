"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Code, Shield, Users, Target, Zap, Search } from "lucide-react";
import type { Service } from "@/content/site";

const serviceIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
  "formation-ia": Code,
  "sensibilisation": Users,
  "ctf": Target,
  "audit-securite": Search,
  "pentest-web": Zap,
  "pentest-infra": Shield,
};

const serviceColors: { [key: string]: string } = {
  "formation-ia": "from-blue-500 to-cyan-500",
  "sensibilisation": "from-green-500 to-emerald-500",
  "ctf": "from-purple-500 to-pink-500",
  "audit-securite": "from-orange-500 to-red-500",
  "pentest-web": "from-yellow-500 to-orange-500",
  "pentest-infra": "from-indigo-500 to-purple-500",
};

export function ServiceCard({ service }: { service: Service }) {
  const IconComponent = serviceIcons[service.slug] || Shield;
  const colorClass = serviceColors[service.slug] || "from-green-500 to-blue-500";
  
  return (
    <Link href={`/services#${service.slug}`} className="group block">
      <motion.div 
        className="glass rounded-2xl p-6 h-full relative overflow-hidden"
        whileHover={{ 
          scale: 1.02, 
          y: -5,
          boxShadow: "0 25px 50px -12px rgba(34, 197, 94, 0.25)"
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Background gradient on hover */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
        />
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <motion.div
            className={`w-12 h-12 rounded-xl bg-gradient-to-r ${colorClass} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
            whileHover={{ rotate: 10 }}
          >
            <IconComponent className="w-6 h-6 text-white" />
          </motion.div>
          <motion.span 
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-muted/50 text-muted-foreground font-mono border border-border/50 group-hover:border-green-500/30 transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            /{service.slug}
          </motion.span>
        </div>
        
        {/* Content */}
        <motion.h3 
          className="text-lg font-semibold text-foreground mb-3 group-hover:text-green-400 transition-colors duration-300"
          whileHover={{ x: 2 }}
        >
          {service.title}
        </motion.h3>
        
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          {service.description}
        </p>
        
        {/* CTA Button */}
        <motion.div
          className="flex items-center justify-between"
          whileHover={{ x: 2 }}
        >
          <span className="text-sm font-medium text-green-400 group-hover:text-green-300 transition-colors flex items-center gap-2">
            En savoir plus
            <motion.div
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </span>
        </motion.div>
        
        {/* Hover glow effect */}
        <motion.div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${colorClass} opacity-0 blur-xl -z-10`}
          whileHover={{ opacity: 0.1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </Link>
  );
}

