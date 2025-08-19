"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { site } from "@/content/site";
import { GraduationCap, Briefcase, Users, Code, Terminal } from "lucide-react";

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
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
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 mb-6"
        >
          <Terminal className="w-8 h-8 text-indigo-400" />
        </motion.div>
        <h2 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 mb-4">
          À propos
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Parcours, expertise et engagement dans la communauté cybersécurité
        </p>
      </motion.div>
      
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Bio & Education */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          {/* Bio Section */}
          <div className="glass rounded-2xl p-8">
            <motion.div
              className="flex items-center gap-3 mb-6"
              whileHover={{ x: 5 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Profil</h3>
            </motion.div>
            <p className="text-muted-foreground leading-relaxed">{site.about.bio}</p>
            
            {/* Entrepreneurship */}
            <motion.div 
              className="mt-6 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20"
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="text-sm font-medium text-green-400 mb-2">{site.sections.entrepreneurshipTitle}</h4>
              <p className="text-sm text-muted-foreground">{site.about.entrepreneurship}</p>
            </motion.div>
          </div>
          
          {/* Education */}
          <div className="glass rounded-2xl p-8">
            <motion.div
              className="flex items-center gap-3 mb-6"
              whileHover={{ x: 5 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">{site.sections.educationTitle}</h3>
            </motion.div>
            <ul className="space-y-3">
              {site.about.education.map((e, index) => (
                <motion.li
                  key={e}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                    className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"
                  />
                  {e}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
        
        {/* Experience & Community */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-8"
        >
          {/* Experience */}
          <div className="glass rounded-2xl p-8">
            <motion.div
              className="flex items-center gap-3 mb-6"
              whileHover={{ x: 5 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">{site.sections.experienceTitle}</h3>
            </motion.div>
            <ul className="space-y-3">
              {site.about.experience.map((x, index) => (
                <motion.li
                  key={x}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) }}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                    className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"
                  />
                  {x}
                </motion.li>
              ))}
            </ul>
          </div>
          
          {/* Community */}
          <div className="glass rounded-2xl p-8">
            <motion.div
              className="flex items-center gap-3 mb-6"
              whileHover={{ x: 5 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">{site.sections.communityTitle}</h3>
            </motion.div>
            <ul className="space-y-3">
              {site.about.community.map((c, index) => (
                <motion.li
                  key={c}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                    className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0"
                  />
                  {c}
                </motion.li>
              ))}
            </ul>
            
            {/* Methodologies */}
            <motion.div 
              className="mt-6 p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20"
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="text-sm font-medium text-cyan-400 mb-3">{site.sections.methodologiesTitle}</h4>
              <div className="grid grid-cols-2 gap-2">
                {site.about.methodologies.map((methodology, index) => (
                  <motion.span
                    key={methodology}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5, delay: 1 + (index * 0.1) }}
                    whileHover={{ scale: 1.05 }}
                    className="px-2 py-1 text-xs bg-muted/50 text-muted-foreground rounded-md border border-border/50 hover:border-cyan-500/30 transition-colors"
                  >
                    {methodology}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

