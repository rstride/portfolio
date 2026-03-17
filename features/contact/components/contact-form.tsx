"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, Lock, MessageSquare, Send } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

import { useContactForm } from "@/features/contact/hooks/use-contact-form";
import {
  fieldClass,
  scopeOptions,
  serviceOptions,
  timelineOptions,
} from "@/features/contact/model";

type ContactFormProps = {
  form: ReturnType<typeof useContactForm>;
};

type SelectFieldProps = {
  id: "service" | "scopeType" | "timeline";
  label: string;
  value: string;
  options: { value: string; label: string }[];
  error?: string;
  touched?: boolean;
  onChange: ContactFormProps["form"]["handleInputChange"];
  onBlur: ContactFormProps["form"]["handleBlur"];
};

function SelectField({
  id,
  label,
  value,
  options,
  error,
  touched,
  onChange,
  onBlur,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>
        {label} <span className="text-destructive">*</span>
      </Label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={cn(
          "flex h-10 w-full rounded-md border px-3 py-2 text-sm shadow-none transition focus-visible:outline-none focus-visible:ring-2",
          fieldClass,
          error && touched && "border-destructive/60 focus-visible:ring-destructive/30"
        )}
        required
      >
        <option value="">Choisir</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && touched ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

export function ContactForm({ form }: ContactFormProps) {
  const hasErrors = Object.keys(form.errors).length > 0;

  return (
    <Card className="surface-panel overflow-hidden">
      <CardHeader className="gap-5 bg-[linear-gradient(135deg,rgba(36,184,122,0.08),rgba(80,220,255,0.09))]">
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
        <form onSubmit={form.handleSubmit} className="flex flex-col gap-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <input
              type="text"
              name="website"
              value={form.formData.website}
              onChange={form.handleInputChange}
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
                value={form.formData.name}
                onChange={form.handleInputChange}
                onBlur={form.handleBlur}
                className={cn(
                  fieldClass,
                  form.errors.name &&
                    form.touched.name &&
                    "border-destructive/60 focus-visible:ring-destructive/30"
                )}
                placeholder="Votre nom"
                required
              />
              {form.errors.name && form.touched.name ? (
                <p className="text-xs text-destructive">{form.errors.name}</p>
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
                value={form.formData.email}
                onChange={form.handleInputChange}
                onBlur={form.handleBlur}
                className={cn(
                  fieldClass,
                  form.errors.email &&
                    form.touched.email &&
                    "border-destructive/60 focus-visible:ring-destructive/30"
                )}
                placeholder="contact@entreprise.com"
                required
              />
              {form.errors.email && form.touched.email ? (
                <p className="text-xs text-destructive">{form.errors.email}</p>
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
                value={form.formData.company}
                onChange={form.handleInputChange}
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
                value={form.formData.phone}
                onChange={form.handleInputChange}
                className={fieldClass}
                placeholder="06 XX XX XX XX"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <SelectField
              id="service"
              label="Besoin principal"
              value={form.formData.service}
              options={serviceOptions}
              error={form.errors.service}
              touched={form.touched.service}
              onChange={form.handleInputChange}
              onBlur={form.handleBlur}
            />
            <SelectField
              id="scopeType"
              label="Périmètre"
              value={form.formData.scopeType}
              options={scopeOptions}
              error={form.errors.scopeType}
              touched={form.touched.scopeType}
              onChange={form.handleInputChange}
              onBlur={form.handleBlur}
            />
            <SelectField
              id="timeline"
              label="Échéance"
              value={form.formData.timeline}
              options={timelineOptions}
              error={form.errors.timeline}
              touched={form.touched.timeline}
              onChange={form.handleInputChange}
              onBlur={form.handleBlur}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="message">
              Message <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="message"
              name="message"
              value={form.formData.message}
              onChange={form.handleInputChange}
              onBlur={form.handleBlur}
              rows={6}
              className={cn(
                "resize-none",
                fieldClass,
                form.errors.message &&
                  form.touched.message &&
                  "border-destructive/60 focus-visible:ring-destructive/30"
              )}
              placeholder="Décrivez le périmètre, la stack, l'échéance et ce que vous attendez de la mission..."
              required
            />
            <div className="flex items-center justify-between">
              {form.errors.message && form.touched.message ? (
                <p className="text-xs text-destructive">{form.errors.message}</p>
              ) : (
                <p className="text-xs text-muted-foreground">{site.sales.faqHint}</p>
              )}
              <p className="ml-auto text-xs text-muted-foreground">
                {form.formData.message.length}/500 minimum
              </p>
            </div>
          </div>

          {form.submitStatus === "error" ? (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>
                {form.submitError ||
                  "Une erreur technique s'est produite. Veuillez reessayer ou me contacter directement a contact@rstride.fr."}
              </AlertDescription>
            </Alert>
          ) : null}

          {form.submitStatus === "success" ? (
            <Alert className="border-primary/20 bg-primary/[0.08] text-foreground">
              <CheckCircle className="size-4 text-primary" />
              <AlertDescription>Message envoyé avec succès.</AlertDescription>
            </Alert>
          ) : null}

          <Button
            type="submit"
            disabled={form.isSubmitting || form.submitStatus === "success" || hasErrors}
            className={cn(
              "w-full border-0 bg-[linear-gradient(135deg,var(--primary),var(--brand-secondary))] text-primary-foreground",
              hasErrors && "cursor-not-allowed opacity-50"
            )}
            size="lg"
          >
            {form.submitStatus === "success" ? (
              <>
                <CheckCircle className="size-4" />
                Message envoyé
              </>
            ) : form.isSubmitting ? (
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
                {hasErrors ? "Corrigez les erreurs" : "Recevoir une proposition"}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
