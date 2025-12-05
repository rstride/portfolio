"use client";
// Force refresh
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
  Globe,
  AlertCircle
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { site } from "@/content/site";
import { useAnimationConfig } from "@/lib/animation-config";
import { BackgroundEffects } from "@/components/background-effects";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  prismasec: Globe, // Sera remplacé par un logo personnalisé
};


export function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const performanceMode = usePerformanceMode();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    company: "",
    phone: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Le nom est requis';
        } else if (value.trim().length < 2) {
          newErrors.name = 'Le nom doit contenir au moins 2 caractères';
        } else {
          delete newErrors.name;
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          newErrors.email = 'L\'email est requis';
        } else if (!emailRegex.test(value)) {
          newErrors.email = 'Veuillez entrer un email valide';
        } else {
          delete newErrors.email;
        }
        break;
      case 'message':
        if (!value.trim()) {
          newErrors.message = 'Le message est requis';
        } else if (value.trim().length < 10) {
          newErrors.message = 'Le message doit contenir au moins 10 caractères';
        } else {
          delete newErrors.message;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);

    // Validate all fields
    Object.entries(formData).forEach(([name, value]) => {
      validateField(name, value);
    });

    // Check if there are any errors
    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Envoi réel du formulaire via l'API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi');
      }

      setSubmitStatus("success");

      // Reset form after success
      setTimeout(() => {
        setFormData({ name: "", email: "", message: "", company: "", phone: "" });
        setSubmitStatus("idle");
        setErrors({});
        setTouched({});
      }, 4000);

    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      setSubmitStatus("error");

      // Afficher un message d'erreur plus spécifique
      if (error instanceof Error) {
        console.error('Message d\'erreur:', error.message);
      }

      setTimeout(() => {
        setSubmitStatus("idle");
      }, 5000);
    }

    setIsSubmitting(false);
  };

  return (
    <div ref={ref} className="relative overflow-hidden">
      {/* Harmonious Background Effects */}
      <BackgroundEffects
        variant="section"
        intensity={performanceMode === 'low' ? 'low' : performanceMode === 'high' ? 'high' : 'medium'}
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gradient-primary mb-6 leading-tight pb-2">
            {site.sections.contactTitle}
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {site.sections.contactIntro}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-16 lg:gap-20 items-start">
          {/* Contact form */}
          <motion.div
            initial={{ opacity: 1, x: 0 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
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
                <h3 className="text-xl font-semibold text-foreground">Formulaire de contact</h3>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileFocus={{ scale: 1.02 }}
                  >
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Nom <span className="text-red-400">*</span>
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={cn(
                        "bg-white/50 dark:bg-black/20 border-black/5 dark:border-white/10",
                        errors.name && touched.name ? "border-red-500/50 focus-visible:ring-red-500/20" : "focus-visible:ring-green-500/20"
                      )}
                      placeholder="Votre nom"
                      required
                    />
                    {errors.name && touched.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-xs mt-1"
                      >
                        {errors.name}
                      </motion.p>
                    )}
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileFocus={{ scale: 1.02 }}
                  >
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={cn(
                        "bg-white/50 dark:bg-black/20 border-black/5 dark:border-white/10",
                        errors.email && touched.email ? "border-red-500/50 focus-visible:ring-red-500/20" : "focus-visible:ring-green-500/20"
                      )}
                      placeholder="contact@entreprise.com"
                      required
                    />
                    {errors.email && touched.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-xs mt-1"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </motion.div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileFocus={{ scale: 1.02 }}
                  >
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Entreprise
                    </label>
                    <Input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="bg-white/50 dark:bg-black/20 border-black/5 dark:border-white/10 focus-visible:ring-green-500/20"
                      placeholder="Nom de votre entreprise"
                    />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileFocus={{ scale: 1.02 }}
                  >
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Téléphone
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="bg-white/50 dark:bg-black/20 border-black/5 dark:border-white/10 focus-visible:ring-green-500/20"
                      placeholder="06 XX XX XX XX"
                    />
                  </motion.div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileFocus={{ scale: 1.01 }}
                >
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    rows={6}
                    className={cn(
                      "bg-white/50 dark:bg-black/20 border-black/5 dark:border-white/10 resize-none",
                      errors.message && touched.message ? "border-red-500/50 focus-visible:ring-red-500/20" : "focus-visible:ring-green-500/20"
                    )}
                    placeholder="Décrivez votre projet, vos défis de sécurité ou la vulnérabilité que vous souhaitez signaler..."
                    required
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.message && touched.message && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-xs"
                      >
                        {errors.message}
                      </motion.p>
                    )}
                    <p className={`text-xs ml-auto ${formData.message.length < 10 ? 'text-muted-foreground' : 'text-green-400'}`}>
                      {formData.message.length}/500 caractères minimum
                    </p>
                  </div>
                </motion.div>

                {/* Status messages */}
                {submitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <p className="text-sm">
                      Une erreur technique s&apos;est produite. Veuillez réessayer ou me contacter directement à contact@romainstride.com.
                    </p>
                  </motion.div>
                )}

                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400"
                  >
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <p className="text-sm">
                      Message envoyé avec succès ! Je vous répondrai dans les 24h ouvrées.
                    </p>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting || submitStatus === "success" || Object.keys(errors).length > 0}
                  className={cn(
                    "w-full relative overflow-hidden transition-all duration-300",
                    Object.keys(errors).length > 0 ? "opacity-50 cursor-not-allowed" : ""
                  )}
                  size="lg"
                >
                  <motion.span
                    className="relative z-10 flex items-center justify-center gap-2"
                    animate={isSubmitting ? { x: [0, 2, 0] } : {}}
                    transition={{ duration: 0.5, repeat: isSubmitting ? Infinity : 0 }}
                  >
                    {submitStatus === "success" ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Message envoyé
                      </>
                    ) : isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Lock className="w-4 h-4" />
                        </motion.div>
                        Envoi en cours
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        {Object.keys(errors).length > 0 ? 'Corrigez les erreurs' : 'Envoyer le message'}
                      </>
                    )}
                  </motion.span>
                  {Object.keys(errors).length === 0 && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "0%" }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Button>
              </form>

            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 1, x: 0 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8 lg:self-center"
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
                        key === "prismasec" ? "from-green-600 to-green-800" :
                          "from-green-500 to-green-700";
                  return (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 1, x: 0 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-black/5 dark:border-white/10 hover:border-green-500/50 transition-colors group"
                    >
                      <motion.div
                        className={`w-8 h-8 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden`}
                        whileHover={{ rotate: 10 }}
                      >
                        {key === "prismasec" ? (
                          <img
                            src="/PrismaLogo.svg"
                            alt="PrismaSec Logo"
                            className="w-5 h-5 invert brightness-0"
                          />
                        ) : (
                          <IconComponent className="w-4 h-4 text-white" />
                        )}
                      </motion.div>
                      <div>
                        <div className="font-medium text-foreground group-hover:text-green-400 transition-colors">
                          {link.label}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {link.label === "GitHub" ? "Code source & outils de sécurité" :
                            link.label === "LinkedIn" ? "Profil professionnel" :
                              link.label === "PrismaSec" ? "Entreprise de cybersécurité" :
                                link.label}
                        </div>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </div>


          </motion.div>
        </div>
      </section>
    </div>
  );
}
