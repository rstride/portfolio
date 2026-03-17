import type { Service, ServiceNavigationItem, ServicePageDetail } from "@/content/site/types";

export const services = [
  {
    slug: "pentest",
    title: "Pentest web/API",
    description:
      "Je teste vos applications web, vos API et vos parcours sensibles pour mettre en évidence les vulnérabilités réellement exploitables et leur impact.",
    deliverables: ["Rapport priorisé avec preuves d’impact", "Restitution technique avec l’équipe", "Retest après correction"],
    benefits: ["Vision claire du risque réel", "Priorisation des correctifs", "Décisions plus sereines avant mise en production"],
    bestFor: "Les organisations qui exposent une application, une API ou un espace client et veulent une évaluation sérieuse du risque.",
    outcome: "Une liste claire des vulnérabilités exploitables, avec un ordre de correction cohérent.",
    notFor: "Les équipes qui cherchent uniquement un scan automatique ou un rapport sans échange technique.",
    navigationDescription: "Tests d’intrusion sur vos systèmes d'information.",
    icon: "shield",
  },
  {
    slug: "audit",
    title: "Audit sécurité",
    description:
      "J’évalue votre posture de sécurité de manière pragmatique : exposition, accès, configurations critiques, sauvegardes et priorités de remédiation.",
    deliverables: ["État des lieux structuré", "Feuille de route priorisée", "Restitution orientée décision"],
    benefits: ["Priorités réalistes", "Décisions plus simples", "Réduction du risque sans dispersion"],
    bestFor: "Les structures qui veulent savoir quoi traiter en premier sans lancer une mission lourde ou floue.",
    outcome: "Une feuille de route lisible, avec quick wins, chantiers prioritaires et ordre d’exécution.",
    notFor: "Les structures qui cherchent uniquement un audit documentaire ou une certification clé en main.",
    navigationDescription: "État des lieux de vos processus de sécurité.",
    icon: "search",
  },
  {
    slug: "training",
    title: "Formation, sensibilisation et CTF",
    description:
      "Je conçois des formats pédagogiques concrets pour faire progresser les équipes : sensibilisation, ateliers interactifs et CTF adaptés au niveau du public.",
    deliverables: ["Programme sur mesure", "Supports ou challenges", "Débrief avec pistes d’action"],
    benefits: ["Participants engagés", "Réflexes de sécurité renforcés", "Format concret et mémorable"],
    bestFor: "Les écoles, organismes de formation et entreprises qui veulent une intervention utile et vivante.",
    outcome: "Des participants qui comprennent mieux les risques et retiennent les bons réflexes.",
    notFor: "Les structures qui veulent uniquement une présentation théorique sans interaction.",
    navigationDescription: "Sensibilisation, ateliers et CTF pédagogiques.",
    icon: "graduation-cap",
  },
] as Service[];

export const servicePages = {
  pentest: {
    intro:
      "Je mène des pentests web/API orientés exploitabilité réelle, avec validation de l’impact, priorisation des correctifs et restitution utile à votre équipe.",
    audience: ["Équipes techniques", "Produit / Tech", "Organisations exposées sur le web"],
    process: [
      "Cadrage du périmètre, des comptes et de la fenêtre de test",
      "Tests manuels et outillés sur le scope validé",
      "Rapport, restitution orale et retest après correction",
    ],
  },
  audit: {
    intro:
      "Je transforme une situation floue en plan d'action priorisé: exposition, configurations critiques, accès, sauvegardes, gouvernance et quick wins.",
    audience: ["Dirigeants", "DSI / RSSI", "Référents techniques"],
    process: [
      "Collecte des éléments clés et cadrage des enjeux",
      "Analyse du risque et identification des priorités",
      "Restitution claire avec feuille de route réaliste",
    ],
  },
  training: {
    intro:
      "Je conçois des formats de formation sécurité concrets : sensibilisation ciblée, atelier interactif ou CTF pédagogique selon votre public et votre niveau technique.",
    audience: ["Écoles / Bootcamps", "Équipes métiers", "Équipes techniques"],
    process: [
      "Objectifs pédagogiques et cadrage du public",
      "Conception du contenu, des exercices ou des challenges",
      "Animation, debrief et recommandations de suivi",
    ],
  },
} as const satisfies Record<string, ServicePageDetail>;

export const serviceNavigation: ServiceNavigationItem[] = services.map((service) => ({
  href: getServiceHref(service.slug),
  label: service.title.replace(", sensibilisation et CTF", "").replace(" web/API", ""),
  description: service.navigationDescription,
}));

export function getServiceHref(slug: string) {
  return `/services/${slug}`;
}

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}
