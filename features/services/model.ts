import { GraduationCap, Search, Shield } from "lucide-react";

import {
  getServiceBySlug,
  getServiceHref,
  servicePages,
  serviceNavigation,
  services,
} from "@/content/site/services";
import type { ServiceIconKey } from "@/content/site";
import type { ServicePageDetail } from "@/content/site/types";

type ServiceContent = {
  slug: string;
  service: NonNullable<ReturnType<typeof getServiceBySlug>>;
  details?: ServicePageDetail;
  paragraphs: string[];
};

const serviceDetails = servicePages as Record<string, ServicePageDetail>;

const serviceIconMap = {
  "graduation-cap": GraduationCap,
  search: Search,
  shield: Shield,
} as const;

const customParagraphs: Record<string, string[]> = {
  pentest: [
    "Je realise des pentests pour des applications et services exposes a de vrais utilisateurs: espaces clients, administrations, parcours d'authentification, back-offices et APIs metier.",
    "L'objectif n'est pas de produire un PDF de plus, mais de vous montrer les vulnerabilites vraiment exploitables, leur impact metier et l'ordre de correction le plus pertinent.",
    "La mission comprend un cadrage de scope, des tests manuels et outilles, un rapport priorise, un debrief technique et un retest pour valider les correctifs.",
    "Ce format est pense pour les organisations qui ont besoin d'un interlocuteur technique direct, rapide et actionnable.",
  ],
  audit: [
    "J'audite la posture securite d'une organisation pour transformer une impression diffuse de risque en liste de priorites claire et pilotable.",
    "Je regarde ce qui compte vraiment pour une structure qui veut progresser: exposition, acces, hygiene de base, configurations critiques, sauvegardes et mesures de reduction du risque.",
    "Le coeur du livrable est une feuille de route priorisee avec quick wins, chantiers structurants et niveau d'effort estime.",
    "L'objectif est d'aider le dirigeant ou le referent technique a prendre des decisions sans lancer un programme trop lourd ni trop theorique.",
  ],
  training: [
    "Je construis des formats de training securite adaptes au public: sensibilisation concrete pour collaborateurs, atelier interactif pour equipes techniques ou CTF pedagogique pour ecoles et entreprises.",
    "Le but est de faire retenir des reflexes utiles, pas de derouler une presentation oubliee le lendemain.",
    "Chaque intervention est pensee avec un objectif pedagogique clair, un support ou des challenges adaptes, puis un debrief qui transforme l'experience en actions concretes.",
  ],
};

export function getServiceIcon(icon: ServiceIconKey) {
  return serviceIconMap[icon];
}

export function getServiceContent(slug: string): ServiceContent | null {
  const service = getServiceBySlug(slug);

  if (!service) {
    return null;
  }

  const details = serviceDetails[slug];
  const paragraphs = [...(customParagraphs[slug] || [])];

  if (paragraphs.length === 0) {
    if (service.description) paragraphs.push(service.description);
    if (details?.intro) paragraphs.push(details.intro);
    if (details?.audience?.length) paragraphs.push(`Pour: ${details.audience.join(", ")}.`);
    if (details?.process?.length) paragraphs.push(`Demarche: ${details.process.join(" -> ")}.`);
    if (service.deliverables.length) paragraphs.push(`Livrables: ${service.deliverables.join(" · ")}.`);
    if (service.benefits.length) paragraphs.push(`Benefices: ${service.benefits.join(" · ")}.`);
  }

  return {
    slug,
    service,
    details,
    paragraphs,
  };
}

export { getServiceBySlug, getServiceHref, serviceNavigation, services };
