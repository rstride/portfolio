import { Github, Globe, Linkedin } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { ContactFormData } from "@/features/contact/schema";

export const iconMap: Record<string, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  prismasec: Globe,
};

export const EMPTY_FORM_DATA: ContactFormData = {
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

export const fieldClass =
  "field-surface text-foreground shadow-none focus-visible:ring-0";

export const serviceOptions = [
  { value: "Pentest", label: "Pentest" },
  { value: "Audit sécurité", label: "Audit sécurité" },
  { value: "Formation / sensibilisation", label: "Formation / sensibilisation" },
  { value: "Autre", label: "Autre" },
];

export const scopeOptions = [
  { value: "Application web", label: "Application web" },
  { value: "API", label: "API" },
  { value: "Système d’information", label: "Système d’information" },
  { value: "Atelier / sensibilisation", label: "Atelier / sensibilisation" },
  { value: "À préciser", label: "À préciser" },
];

export const timelineOptions = [
  { value: "Immédiat", label: "Immédiat" },
  { value: "Sous 2 semaines", label: "Sous 2 semaines" },
  { value: "Sous 1 mois", label: "Sous 1 mois" },
  { value: "Plus tard / en préparation", label: "Plus tard / en préparation" },
];

export function getSocialDescription(label: string): string {
  if (label === "GitHub") {
    return "Code, outils et expérimentations";
  }

  if (label === "LinkedIn") {
    return "Profil professionnel";
  }

  return "Entreprise de cybersécurité";
}
