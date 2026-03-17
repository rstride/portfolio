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

import { landingReveal, SectionIntro } from "@/components/landing/shared";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { site } from "@/content/site";
import { type ContactFormData, getContactFieldErrors } from "@/lib/contact-schema";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  prismasec: Globe,
};

const EMPTY_FORM_DATA: ContactFormData = {
  name: "",
  email: "",
  service: "",
  scopeType: "",
  timeline: "",
  message: "",
  company: "",
  phone: "",
  website: "",
};

const fieldClass =
  "border-border/80 bg-background/75 shadow-none focus-visible:ring-ring focus-visible:ring-2";

export function ContactSection() {
  const ref = useRef(null);
  useInView(ref, { once: true, amount: 0.2 });

  const [formData, setFormData] = useState<ContactFormData>(EMPTY_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const nextFormData = { ...formData, [name]: value };
    setFormData(nextFormData);

    if (touched[name]) {
      setErrors(getContactFieldErrors(nextFormData));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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
    <div ref={ref} className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <SectionIntro
        eyebrow="Contact"
        title={site.sections.contactTitle}
        description={site.sections.contactIntro}
      />

      <motion.div
        {...landingReveal}
        transition={{ ...landingReveal.transition, delay: 0.08 }}
        className="section-signal mx-auto mt-8 grid max-w-4xl gap-3 px-5 py-5 sm:grid-cols-3"
      >
        {site.sales.qualification.map((item) => (
          <div key={item} className="surface-subtle px-4 py-3 text-sm text-muted-foreground">
            {item}
          </div>
        ))}
      </motion.div>

      <div className="mx-auto mt-12 grid max-w-6xl items-start gap-8 xl:grid-cols-[minmax(0,1.12fr)_360px]">
        <motion.div {...landingReveal} transition={{ ...landingReveal.transition, delay: 0.12 }}>
          <Card className="surface-panel overflow-hidden">
            <CardHeader className="gap-5 bg-[linear-gradient(135deg,rgba(186,76,255,0.08),rgba(80,220,255,0.09))]">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-[1rem] bg-[linear-gradient(135deg,var(--primary),var(--brand-secondary))] text-primary-foreground">
                  <MessageSquare className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-xl">Décrire votre besoin</CardTitle>
                  <CardDescription className="mt-1">
                    Quelques informations suffisent pour revenir avec un cadrage utile.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name">
                      Nom <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={cn(
                        fieldClass,
                        errors.name && touched.name && "border-destructive/60 focus-visible:ring-destructive/30"
                      )}
                      placeholder="Votre nom"
                      required
                    />
                    {errors.name && touched.name ? (
                      <p className="text-xs text-destructive">{errors.name}</p>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={cn(
                        fieldClass,
                        errors.email && touched.email && "border-destructive/60 focus-visible:ring-destructive/30"
                      )}
                      placeholder="contact@entreprise.com"
                      required
                    />
                    {errors.email && touched.email ? (
                      <p className="text-xs text-destructive">{errors.email}</p>
                    ) : null}
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="company">Entreprise</Label>
                    <Input
                      id="company"
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className={fieldClass}
                      placeholder="Nom de votre entreprise ou produit"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={fieldClass}
                      placeholder="06 XX XX XX XX"
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="service">
                      Besoin principal <span className="text-destructive">*</span>
                    </Label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={cn(
                        "flex h-10 w-full rounded-md border px-3 py-2 text-sm shadow-none transition focus-visible:outline-none focus-visible:ring-2",
                        fieldClass,
                        errors.service && touched.service && "border-destructive/60 focus-visible:ring-destructive/30"
                      )}
                      required
                    >
                      <option value="">Choisir</option>
                      <option value="Pentest">Pentest</option>
                      <option value="Audit sécurité">Audit sécurité</option>
                      <option value="Formation / sensibilisation">Formation / sensibilisation</option>
                      <option value="Autre">Autre</option>
                    </select>
                    {errors.service && touched.service ? (
                      <p className="text-xs text-destructive">{errors.service}</p>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="scopeType">
                      Périmètre <span className="text-destructive">*</span>
                    </Label>
                    <select
                      id="scopeType"
                      name="scopeType"
                      value={formData.scopeType}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={cn(
                        "flex h-10 w-full rounded-md border px-3 py-2 text-sm shadow-none transition focus-visible:outline-none focus-visible:ring-2",
                        fieldClass,
                        errors.scopeType && touched.scopeType && "border-destructive/60 focus-visible:ring-destructive/30"
                      )}
                      required
                    >
                      <option value="">Choisir</option>
                      <option value="Application web">Application web</option>
                      <option value="API">API</option>
                      <option value="Système d’information">Système d’information</option>
                      <option value="Atelier / sensibilisation">Atelier / sensibilisation</option>
                      <option value="À préciser">À préciser</option>
                    </select>
                    {errors.scopeType && touched.scopeType ? (
                      <p className="text-xs text-destructive">{errors.scopeType}</p>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="timeline">
                      Échéance <span className="text-destructive">*</span>
                    </Label>
                    <select
                      id="timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={cn(
                        "flex h-10 w-full rounded-md border px-3 py-2 text-sm shadow-none transition focus-visible:outline-none focus-visible:ring-2",
                        fieldClass,
                        errors.timeline && touched.timeline && "border-destructive/60 focus-visible:ring-destructive/30"
                      )}
                      required
                    >
                      <option value="">Choisir</option>
                      <option value="Immédiat">Immédiat</option>
                      <option value="Sous 2 semaines">Sous 2 semaines</option>
                      <option value="Sous 1 mois">Sous 1 mois</option>
                      <option value="Plus tard / en préparation">Plus tard / en préparation</option>
                    </select>
                    {errors.timeline && touched.timeline ? (
                      <p className="text-xs text-destructive">{errors.timeline}</p>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="message">
                    Message <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    rows={6}
                    className={cn(
                      "resize-none",
                      fieldClass,
                      errors.message && touched.message && "border-destructive/60 focus-visible:ring-destructive/30"
                    )}
                    placeholder="Décrivez le périmètre, la stack, l'échéance et ce que vous attendez de la mission..."
                    required
                  />
                  <div className="flex items-center justify-between">
                    {errors.message && touched.message ? (
                      <p className="text-xs text-destructive">{errors.message}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground">{site.sales.faqHint}</p>
                    )}
                    <p className="ml-auto text-xs text-muted-foreground">
                      {formData.message.length}/500 minimum
                    </p>
                  </div>
                </div>

                {submitStatus === "error" ? (
                  <Alert variant="destructive">
                    <AlertCircle className="size-4" />
                    <AlertDescription>
                      {submitError ||
                        "Une erreur technique s'est produite. Veuillez reessayer ou me contacter directement a contact@rstride.fr."}
                    </AlertDescription>
                  </Alert>
                ) : null}

                {submitStatus === "success" ? (
                  <Alert className="border-primary/20 bg-primary/[0.08] text-foreground">
                    <CheckCircle className="size-4 text-primary" />
                    <AlertDescription>Message envoyé avec succès.</AlertDescription>
                  </Alert>
                ) : null}

                <Button
                  type="submit"
                  disabled={isSubmitting || submitStatus === "success" || Object.keys(errors).length > 0}
                  className={cn(
                    "w-full border-0 bg-[linear-gradient(135deg,var(--primary),var(--brand-secondary))] text-primary-foreground",
                    Object.keys(errors).length > 0 && "cursor-not-allowed opacity-50"
                  )}
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
                      {Object.keys(errors).length > 0 ? "Corrigez les erreurs" : "Recevoir une proposition"}
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
          className="flex flex-col gap-6 lg:self-start"
        >
          <Card className="surface-contrast overflow-hidden">
            <CardHeader>
              <Badge variant="secondary" className="w-fit border-0 bg-white/10 text-white">
                Avant l&apos;échange
              </Badge>
              <CardTitle className="text-lg text-white">Les informations utiles</CardTitle>
              <CardDescription className="text-white/72">
                Le plus important est le contexte, le périmètre et la contrainte principale.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {site.sales.contactReasons.map((reason) => (
                <div
                  key={reason}
                  className="rounded-[1.2rem] border border-white/12 bg-white/7 p-4 text-sm leading-relaxed text-white/78"
                >
                  {reason}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="surface-panel overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg">Présence en ligne</CardTitle>
              <CardDescription>
                Pour vérifier le parcours, les projets et l’écosystème autour de PrismaSec.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {site.socials.map((link) => {
                const key = link.label.toLowerCase();
                const IconComponent = iconMap[key] || Globe;

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="surface-subtle flex items-center gap-3 p-3 transition-colors hover:bg-accent/40"
                  >
                    <div className="flex size-10 items-center justify-center rounded-[1rem] bg-[linear-gradient(135deg,var(--primary),var(--brand-secondary))] text-primary-foreground">
                      {key === "prismasec" ? (
                        <Image
                          src="/PrismaLogo.svg"
                          alt="PrismaSec Logo"
                          width={20}
                          height={20}
                          className="size-5 invert"
                        />
                      ) : (
                        <IconComponent className="size-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{link.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {link.label === "GitHub"
                          ? "Code, outils et expérimentations"
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
