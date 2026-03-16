"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { motion, useInView } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  Github,
  Globe,
  Linkedin,
  Lock,
  MessageSquare,
  Send,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { landingCardClass, landingReveal, SectionIntro } from "@/components/landing/shared";
import { site } from "@/content/site";
import { type ContactFormData, getContactFieldErrors } from "@/lib/contact-schema";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const iconMap: Record<string, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  prismasec: Globe,
};

const EMPTY_FORM_DATA: ContactFormData = {
  name: "",
  email: "",
  message: "",
  company: "",
  phone: "",
  website: "",
};

export function ContactSection() {
  const ref = useRef(null);
  useInView(ref, { once: true, amount: 0.2 });

  const [formData, setFormData] = useState<ContactFormData>(EMPTY_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const nextFormData = { ...formData, [name]: value };
    setFormData(nextFormData);

    if (touched[name]) {
      setErrors(getContactFieldErrors(nextFormData));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    const nextFormData = { ...formData, [name]: e.target.value };
    setFormData(nextFormData);
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(getContactFieldErrors(nextFormData));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);
    setSubmitError(null);

    const validationErrors = getContactFieldErrors(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi");
      }

      setSubmitStatus("success");
      setSubmitError(null);

      setTimeout(() => {
        setFormData(EMPTY_FORM_DATA);
        setSubmitStatus("idle");
        setErrors({});
        setTouched({});
      }, 4000);
    } catch (error) {
      setSubmitStatus("error");
      if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError("Une erreur technique s'est produite.");
      }

      setTimeout(() => {
        setSubmitStatus("idle");
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionIntro
        eyebrow="Contact"
        title={site.sections.contactTitle}
        description={site.sections.contactIntro}
      />

      <motion.div
        {...landingReveal}
        transition={{ ...landingReveal.transition, delay: 0.08 }}
        className="mx-auto mt-8 grid max-w-5xl gap-3 sm:grid-cols-3"
      >
        {site.sales.qualification.map((item) => (
          <div key={item} className={cn("rounded-xl px-4 py-3 text-sm text-muted-foreground", landingCardClass)}>
            {item}
          </div>
        ))}
      </motion.div>

      <div className="mt-12 grid items-start gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <motion.div {...landingReveal} transition={{ ...landingReveal.transition, delay: 0.12 }}>
          <Card className={cn(landingCardClass, "rounded-2xl")}>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <MessageSquare className="size-5" />
              </div>
              <CardHeader className="p-0">
                <CardTitle className="text-xl">Formulaire de contact</CardTitle>
              </CardHeader>
            </div>

            <CardContent className="p-0 pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="hidden"
                  />

                  <div>
                    <Label className="mb-2 block">
                      Nom <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={cn(
                        "border-black/5 bg-white/50 dark:border-white/10 dark:bg-black/20",
                        errors.name && touched.name
                          ? "border-red-500/50 focus-visible:ring-red-500/20"
                          : "focus-visible:ring-green-500/20"
                      )}
                      placeholder="Votre nom"
                      required
                    />
                    {errors.name && touched.name ? (
                      <p className="mt-1 text-xs text-red-400">{errors.name}</p>
                    ) : null}
                  </div>

                  <div>
                    <Label className="mb-2 block">
                      Email <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={cn(
                        "border-black/5 bg-white/50 dark:border-white/10 dark:bg-black/20",
                        errors.email && touched.email
                          ? "border-red-500/50 focus-visible:ring-red-500/20"
                          : "focus-visible:ring-green-500/20"
                      )}
                      placeholder="contact@entreprise.com"
                      required
                    />
                    {errors.email && touched.email ? (
                      <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                    ) : null}
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <Label className="mb-2 block">Entreprise</Label>
                    <Input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="border-black/5 bg-white/50 dark:border-white/10 dark:bg-black/20 focus-visible:ring-green-500/20"
                      placeholder="Nom de votre entreprise ou produit"
                    />
                  </div>

                  <div>
                    <Label className="mb-2 block">Téléphone</Label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="border-black/5 bg-white/50 dark:border-white/10 dark:bg-black/20 focus-visible:ring-green-500/20"
                      placeholder="06 XX XX XX XX"
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">
                    Message <span className="text-red-400">*</span>
                  </Label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    rows={6}
                    className={cn(
                      "resize-none border-black/5 bg-white/50 dark:border-white/10 dark:bg-black/20",
                      errors.message && touched.message
                        ? "border-red-500/50 focus-visible:ring-red-500/20"
                        : "focus-visible:ring-green-500/20"
                    )}
                    placeholder="Décrivez le périmètre, la stack, l'échéance et ce que vous attendez de la mission..."
                    required
                  />
                  <div className="mt-1 flex items-center justify-between">
                    {errors.message && touched.message ? (
                      <p className="text-xs text-red-400">{errors.message}</p>
                    ) : <span />}
                    <p
                      className={cn(
                        "ml-auto text-xs",
                        formData.message.length < 10 ? "text-muted-foreground" : "text-green-400"
                      )}
                    >
                      {formData.message.length}/500 caractères minimum
                    </p>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{site.sales.faqHint}</p>
                </div>

                {submitStatus === "error" ? (
                  <Alert variant="destructive">
                    <AlertCircle className="size-4" />
                    <AlertDescription>
                      {submitError ||
                        "Une erreur technique s'est produite. Veuillez reessayer ou me contacter directement a contact@romainstride.com."}
                    </AlertDescription>
                  </Alert>
                ) : null}

                {submitStatus === "success" ? (
                  <Alert className="border-green-500/20 bg-green-500/10 text-green-500 dark:text-green-400">
                    <CheckCircle className="size-4" />
                    <AlertDescription className="text-green-500 dark:text-green-400">
                      Message envoyé avec succès ! Je vous répondrai dans les 24h ouvrées.
                    </AlertDescription>
                  </Alert>
                ) : null}

                <Button
                  type="submit"
                  disabled={isSubmitting || submitStatus === "success" || Object.keys(errors).length > 0}
                  className={cn("w-full", Object.keys(errors).length > 0 ? "cursor-not-allowed opacity-50" : "")}
                  size="lg"
                >
                  {submitStatus === "success" ? (
                    <>
                      <CheckCircle className="size-4" />
                      Message envoyé
                    </>
                  ) : isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Lock className="size-4" />
                      </motion.div>
                      Envoi en cours
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      {Object.keys(errors).length > 0 ? "Corrigez les erreurs" : "Recevoir un cadrage"}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          {...landingReveal}
          transition={{ ...landingReveal.transition, delay: 0.16 }}
          className="space-y-6 lg:self-start"
        >
          <Card className={cn(landingCardClass, "rounded-2xl")}>
            <CardHeader>
              <CardTitle className="text-lg">Quand me contacter</CardTitle>
              <CardDescription>
                Les demandes qui avancent le plus vite ressemblent souvent à ça.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {site.sales.contactReasons.map((reason) => (
                <div key={reason} className="rounded-xl border border-border/60 bg-background/60 p-4">
                  <p className="text-sm text-muted-foreground">{reason}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className={cn(landingCardClass, "rounded-2xl")}>
            <CardHeader>
              <CardTitle className="text-lg">Comment ça se passe</CardTitle>
              <CardDescription>
                Un processus simple pour cadrer vite et éviter les allers-retours inutiles.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {site.sales.process.map((step, index) => (
                <div key={step} className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/60 p-4">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {index + 1}
                  </div>
                  <p className="text-sm text-muted-foreground">{step}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className={cn(landingCardClass, "rounded-2xl")}>
            <CardHeader>
              <CardTitle className="text-lg">Réseaux sociaux</CardTitle>
              <CardDescription>
                Pour vérifier le parcours, les projets et l&apos;écosystème autour de PrismaSec.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {site.socials.map((link) => {
                const key = link.label.toLowerCase();
                const IconComponent = iconMap[key] || Globe;
                const color =
                  key === "github"
                    ? "from-gray-600 to-gray-800"
                    : key === "linkedin"
                      ? "from-blue-600 to-blue-800"
                      : "from-green-600 to-green-800";

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/60 p-3 transition-colors hover:bg-accent/40"
                  >
                    <div className={`flex size-8 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r ${color}`}>
                      {key === "prismasec" ? (
                        <Image
                          src="/PrismaLogo.svg"
                          alt="PrismaSec Logo"
                          width={20}
                          height={20}
                          className="size-5 invert brightness-0"
                        />
                      ) : (
                        <IconComponent className="size-4 text-white" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{link.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {link.label === "GitHub"
                          ? "Code source & outils de sécurité"
                          : link.label === "LinkedIn"
                            ? "Profil professionnel"
                            : "Entreprise de cybersécurité"}
                      </div>
                    </div>
                  </a>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
