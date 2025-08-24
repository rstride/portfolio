"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { 
  Mail, 
  MessageSquare, 
  Send, 
  Lock, 
  CheckCircle, 
  Github, 
  Linkedin, 
  Twitter,
  Globe
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { site } from "@/content/site";

const iconMap: Record<string, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  x: Twitter,
  website: Globe,
  yeswehack: Globe,
};


export function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSubmitStatus("success");
    setIsSubmitting(false);
    
    // Reset form after success
    setTimeout(() => {
      setFormData({ name: "", email: "", message: "" });
      setSubmitStatus("idle");
    }, 3000);
  };

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        {/* Matrix-style rain effect */}
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34, 197, 94, 0.1) 2px, rgba(34, 197, 94, 0.1) 4px)",
            backgroundSize: "100% 20px"
          }}
          animate={{ 
            backgroundPosition: ["0% 0%", "0% 100%", "0% 0%"] 
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
        
        {/* Cyber grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
        
        {/* Floating icons */}
        {[Mail, MessageSquare, Globe].map((Icon, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{
              left: `${20 + index * 30}%`,
              top: `${10 + index * 25}%`
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              rotate: [0, 180, 360],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 8 + index * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 2
            }}
          >
            <Icon className="w-6 h-6 text-primary/20" />
          </motion.div>
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
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
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 mb-6"
          >
            <Mail className="w-8 h-8 text-green-400" />
          </motion.div>
          <h2 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 mb-4">
            Contact
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Besoin d’un test d’intrusion, d’un audit ou d’un échange sur votre posture de sécurité ? Parlons-en.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="glass rounded-2xl p-8">
              <motion.div
                className="flex items-center gap-3 mb-6"
                whileHover={{ x: 5 }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Envoyer un message</h3>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileFocus={{ scale: 1.02 }}
                  >
                    <label className="block text-sm font-medium text-foreground mb-2">Nom</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/60 text-foreground placeholder-muted-foreground focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                      placeholder="Votre nom"
                      required
                    />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileFocus={{ scale: 1.02 }}
                  >
                    <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/60 text-foreground placeholder-muted-foreground focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                      placeholder="votre@email.fr"
                      required
                    />
                  </motion.div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileFocus={{ scale: 1.01 }}
                >
                  <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/60 text-foreground placeholder-muted-foreground focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all duration-300 resize-none"
                    placeholder="Parlez-moi de vos besoins en sécurité, divulgation de vulnérabilités ou idées de collaboration..."
                    required
                  />
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting || submitStatus === "success"}
                  className="w-full btn-primary shine group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.span
                    className="relative z-10 flex items-center justify-center gap-2"
                    animate={isSubmitting ? { x: [0, 2, 0] } : {}}
                    transition={{ duration: 0.5, repeat: isSubmitting ? Infinity : 0 }}
                  >
                    {submitStatus === "success" ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Message envoyé !
                      </>
                    ) : isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Lock className="w-4 h-4" />
                        </motion.div>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        Envoyer le message
                      </>
                    )}
                  </motion.span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </form>

            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >

            {/* Social links */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Réseaux sociaux</h3>
              <div className="space-y-4">
                {site.socials.map((link, index) => {
                  const key = link.label.toLowerCase();
                  const IconComponent = iconMap[key] || Globe;
                  const color =
                    key === "github" ? "from-gray-600 to-gray-800" :
                    key === "linkedin" ? "from-blue-600 to-blue-800" :
                    key === "x" ? "from-blue-400 to-blue-600" :
                    key === "yeswehack" ? "from-emerald-600 to-emerald-800" :
                    "from-green-500 to-green-700";
                  return (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: 20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                      transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50 hover:border-green-500/50 transition-colors group"
                    >
                      <motion.div
                        className={`w-8 h-8 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                        whileHover={{ rotate: 10 }}
                      >
                        <IconComponent className="w-4 h-4 text-white" />
                      </motion.div>
                      <div>
                        <div className="font-medium text-foreground group-hover:text-green-400 transition-colors">
                          {link.label}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {link.label === "GitHub" ? "Outils & recherche sécurité" : link.label}
                        </div>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Contact info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="glass rounded-2xl p-6 text-center"
            >
              <motion.div
                animate={{ 
                  boxShadow: [
                    "0 0 0 0 rgba(34, 197, 94, 0.4)",
                    "0 0 0 10px rgba(34, 197, 94, 0)",
                    "0 0 0 0 rgba(34, 197, 94, 0)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-blue-500 mb-4"
              >
                <Lock className="w-6 h-6 text-white" />
              </motion.div>
              <h3 className="font-semibold text-foreground mb-2">Contact Direct</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Pour toute demande ou discussion professionnelle
              </p>
              <motion.a
                href={`mailto:${site.about.email}`}
                className="text-sm font-medium text-green-400 hover:text-green-300 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                {site.about.email}
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
