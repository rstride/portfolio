"use client";

import type { ReactNode } from "react";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, Lock, MessageSquare, Send } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { site } from "@/content/site";
import { cn } from "@/shared/lib/utils";

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

type BaseFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
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

function FieldBlock({ id, label, required, error, hint, children }: BaseFieldProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <Label htmlFor={id}>
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

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
  const invalid = Boolean(error && touched);

  return (
    <FieldBlock id={id} label={label} required error={invalid ? error : undefined}>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={cn(
          "field-surface flex h-11 w-full px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2",
          fieldClass,
          invalid && "border-destructive/60 focus-visible:ring-destructive/30"
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
    </FieldBlock>
  );
}

export function ContactForm({ form }: ContactFormProps) {
  const hasErrors = Object.keys(form.errors).length > 0;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gap-5 border-b border-border/60 bg-[linear-gradient(135deg,rgba(36,184,122,0.06),rgba(80,220,255,0.08))]">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-[1rem] bg-[linear-gradient(135deg,var(--primary),var(--brand-secondary))] text-primary-foreground">
            <MessageSquare />
          </div>
          <div>
            <CardTitle className="text-xl">Décrire votre besoin</CardTitle>
            <CardDescription className="mt-1">
              Une description simple du contexte suffit pour revenir avec un cadrage utile.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 sm:p-7">
        <form onSubmit={form.handleSubmit} className="flex flex-col gap-6">
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

          <div className="grid gap-6 sm:grid-cols-2">
            <FieldBlock
              id="name"
              label="Nom"
              required
              error={form.touched.name ? form.errors.name : undefined}
            >
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
            </FieldBlock>

            <FieldBlock
              id="email"
              label="Email"
              required
              error={form.touched.email ? form.errors.email : undefined}
            >
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
            </FieldBlock>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <FieldBlock id="company" label="Entreprise">
              <Input
                id="company"
                type="text"
                name="company"
                value={form.formData.company}
                onChange={form.handleInputChange}
                className={fieldClass}
                placeholder="Nom de votre entreprise ou produit"
              />
            </FieldBlock>

            <FieldBlock id="phone" label="Téléphone">
              <Input
                id="phone"
                type="tel"
                name="phone"
                value={form.formData.phone}
                onChange={form.handleInputChange}
                className={fieldClass}
                placeholder="06 XX XX XX XX"
              />
            </FieldBlock>
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

          <FieldBlock
            id="message"
            label="Message"
            required
            error={form.touched.message ? form.errors.message : undefined}
            hint={!form.errors.message || !form.touched.message ? site.sales.faqHint : undefined}
          >
            <Textarea
              id="message"
              name="message"
              value={form.formData.message}
              onChange={form.handleInputChange}
              onBlur={form.handleBlur}
              rows={7}
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
            <div className="flex items-center justify-end">
              <p className="text-xs text-muted-foreground">
                {form.formData.message.length}/500 minimum
              </p>
            </div>
          </FieldBlock>

          {form.submitStatus === "error" ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertDescription>
                {form.submitError ||
                  "Une erreur technique s'est produite. Veuillez réessayer ou me contacter directement à contact@rstride.fr."}
              </AlertDescription>
            </Alert>
          ) : null}

          {form.submitStatus === "success" ? (
            <Alert className="border-primary/20 bg-primary/[0.08] text-foreground">
              <CheckCircle className="text-primary" />
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
                <CheckCircle />
                Message envoyé
              </>
            ) : form.isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Lock />
                </motion.div>
                Envoi en cours
              </>
            ) : (
              <>
                <Send />
                {hasErrors ? "Corrigez les erreurs" : "Recevoir une proposition"}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
