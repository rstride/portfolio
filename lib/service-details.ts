import { site, type Service } from "@/content/site";

type ServiceDetail = {
  intro: string;
  audience: ReadonlyArray<string>;
  process: ReadonlyArray<string>;
};

const serviceDetails = site.servicePages as Record<string, ServiceDetail>;

const customParagraphs: Record<string, string[]> = {
  "pentest-web": [
    "Je realise des tests d'intrusion applicatifs pour vos sites, APIs et back-offices. Je combine tests manuels et outillage pour couvrir a la fois l'OWASP et la logique metier propre a votre produit.",
    "Mon approche privilegie la demonstration de l'impact avec des preuves d'impact sures et des chemins d'attaque documentes de bout en bout pour faciliter la remediation.",
    "Avant l'intervention, nous cadrons le perimetre, les objectifs et les conditions d'execution pour rester efficace sans perturber l'exploitation.",
    "Je restitue un rapport clair et priorise par le risque, avec recommandations pragmatiques et retest pour valider les corrections.",
    "Je m'inscris dans un cadre strictement autorise et responsable, avec scope valide et journalisation de mes actions.",
  ],
  "pentest-infra": [
    "Je mene des tests d'intrusion sur vos systemes et reseaux pour reveler les surfaces exposees, les faiblesses de configuration et les risques d'escalade.",
    "Le travail commence par une reconnaissance methodique puis des verifications ciblees des services exposes, du durcissement et de la segmentation.",
    "Nous cadrons ensemble les plages d'intervention et les actifs sensibles afin d'eviter tout impact operationnel.",
    "La restitution propose une feuille de route actionnable classee par priorite et effort, suivie d'un retest pour valider les corrections.",
  ],
  "audit-securite": [
    "J'evalue votre posture de securite de maniere concrete: gouvernance, configurations cles, gestion des acces, sauvegardes, detection et exposition.",
    "L'objectif est de fournir une vision claire de vos forces et angles morts, puis de prioriser les actions a fort impact.",
    "Le livrable central est une feuille de route realiste avec quick wins, chantiers structurants et indicateurs de suivi.",
    "Je peux ensuite accompagner vos equipes pour mettre en place les mesures retenues et suivre la reduction du risque dans le temps.",
  ],
  ctf: [
    "J'organise des CTF pedagogiques pour former et federer vos equipes autour de la securite offensive, du niveau debutant a avance.",
    "Nous fixons ensemble les objectifs, le format et la difficulte. Je concois des epreuves adaptees avec une progression claire et un debrief utile.",
    "Je fournis la plateforme, le support d'animation, le scoreboard et les explications pour prolonger l'apprentissage.",
  ],
  "formation-ia": [
    "Je propose une formation pratique aux fondamentaux de l'IA generative pour des usages maitrises en securite et cote produit.",
    "Au programme: fonctionnement des LLM, bonnes pratiques de prompt, limites et risques, puis integration responsable dans les workflows.",
    "La formation est adaptee a votre contexte et illustree par des exercices concrets avec supports et checklist reutilisables.",
  ],
  sensibilisation: [
    "Je concois des sessions de sensibilisation concretes et adaptees a vos metiers: phishing, gestion des secrets, mots de passe, Shadow IT et mobilite.",
    "Les formats sont courts, interactifs et actionnables avec exemples reels, mises en situation et mesures de progression.",
    "Je peux piloter une campagne de phishing simule pour objectiver les reflexes et ajuster le dispositif de sensibilisation.",
  ],
};

export function getServiceHref(slug: string) {
  return `/services/${slug === "audit-securite" ? "securite" : slug}`;
}

export function getServiceBySlug(slug: string): Service | undefined {
  const contentSlug = slug === "securite" ? "audit-securite" : slug;
  return site.services.find((service) => service.slug === contentSlug);
}

export function getServiceContent(slug: string) {
  const contentSlug = slug === "securite" ? "audit-securite" : slug;
  const service = getServiceBySlug(slug);

  if (!service) {
    return null;
  }

  const details = serviceDetails[contentSlug];
  const paragraphs = [...(customParagraphs[contentSlug] || [])];

  if (paragraphs.length === 0) {
    if (service.description) paragraphs.push(service.description);
    if (details?.intro) paragraphs.push(details.intro);
    if (details?.audience?.length) paragraphs.push(`Pour: ${details.audience.join(", ")}.`);
    if (details?.process?.length) paragraphs.push(`Demarche: ${details.process.join(" -> ")}.`);
    if (service.deliverables.length) paragraphs.push(`Livrables: ${service.deliverables.join(" · ")}.`);
    if (service.benefits.length) paragraphs.push(`Benefices: ${service.benefits.join(" · ")}.`);
  }

  return {
    slug: contentSlug,
    service,
    details,
    paragraphs,
  };
}
