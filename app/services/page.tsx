"use client";
import { site } from "@/content/site";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { 
  Shield, 
  Bug, 
  Target, 
  Globe, 
  Lock, 
  Zap,
  CheckCircle,
  ExternalLink,
  ArrowRight
} from "lucide-react";

const serviceIcons = {
  "penetration-testing": Target,
  "vulnerability-assessment": Bug,
  "security-audit": Shield,
  "consulting": Globe,
  "formation": Zap,
  "incident-response": Lock
};

export default function ServicesPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <div ref={ref} className="relative min-h-screen overflow-hidden">
      {/* Cybersecurity Background Effects */}
      <div className="absolute inset-0 -z-10">
        {/* Matrix-style grid */}
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"
          animate={{ 
            backgroundPosition: ["0px 0px", "60px 60px", "0px 0px"],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />

        {/* Gradient orbs */}
        <motion.div 
          className="absolute -top-40 -left-40 h-80 w-80 rounded-full blur-3xl opacity-15 bg-gradient-to-r from-green-500 via-blue-500 to-purple-600"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full blur-3xl opacity-10 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600"
          animate={{
            x: [0, -30, 0],
            y: [0, -40, 0],
            scale: [1, 1.1, 1],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        {/* Floating security icons */}
        {[Shield, Lock, Target, Bug].map((Icon, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{
              left: `${15 + (index * 20)}%`,
              top: `${20 + (index % 2) * 30}%`
            }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [0.8, 1.2, 0.8],
              y: [0, -20, 0],
              x: [0, 15, 0],
              rotate: [0, 360, 720]
            }}
            transition={{
              duration: 8 + (index * 1.5),
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 1
            }}
          >
            <Icon className="w-5 h-5 text-green-400/20" />
          </motion.div>
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header Section */}
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
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 mb-6"
          >
            <Shield className="w-8 h-8 text-blue-400" />
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-500 mb-4">
            {site.sections.servicesTitle}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {site.sections.servicesIntro}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {site.services.map((service, index) => {
            const IconComponent = serviceIcons[service.slug as keyof typeof serviceIcons] || Shield;
            
            return (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group relative"
              >
                <motion.div
                  className="glass rounded-2xl p-8 h-full cursor-pointer relative overflow-hidden"
                  whileHover={{ 
                    scale: 1.02, 
                    y: -5,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Hover overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.1 }}
                  />

                  {/* Service Icon */}
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 mb-6 group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ 
                      rotate: [0, -10, 10, 0],
                      scale: 1.2
                    }}
                    transition={{ duration: 0.6 }}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Service Title */}
                  <motion.h3 
                    className="text-xl font-semibold text-foreground mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-500 transition-all duration-300"
                    whileHover={{ x: 2 }}
                  >
                    {service.title}
                  </motion.h3>

                  {/* Service Description */}
                  <motion.p 
                    className="text-sm text-muted-foreground mb-6 leading-relaxed"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                  >
                    {service.description}
                  </motion.p>

                  {/* Deliverables */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Livrables
                    </h4>
                    <ul className="space-y-2">
                      {service.deliverables.map((deliverable, i) => (
                        <motion.li
                          key={deliverable}
                          initial={{ opacity: 0, x: -10 }}
                          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                          transition={{ duration: 0.5, delay: (index * 0.1) + (i * 0.05) }}
                          className="text-xs text-muted-foreground flex items-start gap-2"
                        >
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                            className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"
                          />
                          {deliverable}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div className="mb-8">
                    <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      Bénéfices
                    </h4>
                    <ul className="space-y-2">
                      {service.benefits.map((benefit, i) => (
                        <motion.li
                          key={benefit}
                          initial={{ opacity: 0, x: -10 }}
                          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                          transition={{ duration: 0.5, delay: (index * 0.1) + (i * 0.05) + 0.3 }}
                          className="text-xs text-muted-foreground flex items-start gap-2"
                        >
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 + 1 }}
                            className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-1.5 flex-shrink-0"
                          />
                          {benefit}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link 
                      href={`/services/${service.slug === 'audit-securite' ? 'securite' : service.slug}`}
                      className="btn-primary w-full relative overflow-hidden group/btn"
                    >
                      <motion.span className="relative z-10 flex items-center justify-center gap-2">
                        <Target className="w-4 h-4" />
                        Voir le détail
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </motion.span>
                      {/* Scanning line effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6 }}
                      />
                    </Link>
                  </motion.div>
                </motion.div>

                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 blur-xl -z-10"
                  animate={{ opacity: [0, 0.1, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href="/contact" 
              className="btn-outline relative overflow-hidden group border-blue-500/30 hover:border-blue-400 transition-colors"
            >
              <motion.span className="relative z-10 flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Besoin d’un service personnalisé ? Contactez-moi
              </motion.span>
              {/* Matrix rain effect on hover */}
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-0.5 h-4 bg-blue-400/30"
                    style={{ left: `${i * 8.33}%`, top: "-16px" }}
                    animate={{
                      y: [0, 80],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "linear"
                    }}
                  />
                ))}
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
