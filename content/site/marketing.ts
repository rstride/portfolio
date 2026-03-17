import type { CaseStudy } from "@/content/site/types";

export const hero = {
  headlineA: "Consultant en",
  headlineB: "cybersécurité",
  subtext:
    "J’interviens sur trois volets complémentaires : le pentest pour identifier les failles exploitables, l’audit pour prioriser les chantiers de sécurité, et la formation pour faire progresser durablement les équipes.",
  ctaPrimary: {
    label: "Contactez-moi",
    href: "/contact",
  },
  ctaSecondary: {
    label: "Découvrir mes services",
    href: "/services",
  },
} as const;

export const caseStudies = [
  {
    title: "PrismaSec",
    sector: "Produit cybersécurité",
    context: "Conception d’une plateforme CTEM pour aider des structures à suivre leur exposition aux menaces.",
    intervention: "Définition du positionnement, prototypage produit et structuration de l’expérience autour de la priorisation et du reporting.",
    result: "Un socle crédible pour transformer une expertise sécurité en offre produit lisible.",
    proof: "Approche orientée priorisation, visibilité du risque et aide à la décision.",
  },
  {
    title: "Bug bounty et recherche terrain",
    sector: "Web / API",
    context: "Recherche régulière de vulnérabilités sur des environnements réels, avec une logique d’exploitabilité et de signalement responsable.",
    intervention: "Analyse des surfaces d’attaque, validation des scénarios et remontée structurée des failles.",
    result: "Une pratique ancrée dans des cas concrets, utile pour identifier ce qui est réellement exploitable.",
    proof: "Focus sur la validation de l’impact, pas seulement sur la détection.",
  },
  {
    title: "CTF et formation",
    sector: "Pédagogie sécurité",
    context: "Conception et animation de formats pédagogiques pour faire progresser des publics techniques et non techniques.",
    intervention: "Création de challenges, déroulé des sessions et restitution des points clés à retenir.",
    result: "Des formats qui impliquent les participants et ancrent les bons réflexes.",
    proof: "Expérience pratique en animation, en organisation et en transmission.",
  },
] as CaseStudy[];

export const sections = {
  featuredServicesLabel: "Prestations",
  servicesTitle: "Trois offres pour des besoins concrets",
  servicesIntro:
    "Des interventions lisibles, cadrées et orientées résultat, pour traiter un besoin précis sans ambiguïté sur le périmètre ni sur les livrables.",
  projectsTitle: "Parcours et références",
  projectsIntro: "Un profil construit entre pentest, produit, recherche offensive, bug bounty et pédagogie.",
  contactTitle: "Parlons de votre sécurité",
  contactIntro: "Expliquez votre contexte, votre échéance et votre besoin. Je reviens vers vous avec un cadrage clair et la bonne proposition pour avancer.",
  highlightsTitle: "Points forts",
} as const;

export const proofs = [
  { title: "Rapports priorisés et exploitables par l’équipe technique", kpi: "Actionnables" },
  { title: "Validation de l’impact sur applications, API et parcours critiques", kpi: "Concrète" },
  { title: "Restitution claire et accompagnement jusqu’à la correction", kpi: "Suivi" },
  { title: "Approche responsable, cadrée et orientée résultat", kpi: "Méthode" },
] as const;

export const sales = {
  contactReasons: [
    "Vous préparez une mise en production ou un audit client.",
    "Vous avez besoin d'un pentest web/API ou d'un audit sécurité rapide.",
    "Vous voulez organiser un atelier, une sensibilisation ou un CTF pédagogique.",
  ],
  qualification: [
    "Périmètre identifié ou en cours de cadrage",
    "Besoin concret dans les 30 prochains jours",
    "Décideur ou référent technique impliqué",
  ],
  faqHint: "Le plus simple est de donner le périmètre, la stack, l'échéance et la contrainte principale.",
} as const;

export const privacyContent = {
  title: "Politique de confidentialité",
  intro: "Je respecte votre vie privée. Ce site collecte le minimum de données nécessaires à son fonctionnement, comme les journaux serveur pour la sécurité et le suivi des erreurs. Lorsque vous soumettez le formulaire de contact, je traite les informations fournies afin de répondre à votre demande.",
  controllerLabel: "Responsable de traitement",
  legalBasisLabel: "Base légale",
  retentionLabel: "Durée de conservation",
  rightsLabel: "Vos droits",
  cookiesLabel: "Cookies",
  transfersLabel: "Transferts internationaux",
  legalBasisText: "Je m’appuie sur l’intérêt légitime pour maintenir la sécurité et répondre aux demandes légitimes.",
  retentionText: "Les soumissions du formulaire de contact peuvent être conservées jusqu’à 12 mois pour le suivi et l’archivage.",
  rightsText: "Vous pouvez exercer vos droits d’accès, de rectification ou d’effacement en me contactant à l’adresse indiquée.",
  cookiesText: "Ce site utilise uniquement des cookies essentiels et le stockage local pour la préférence de thème.",
  transfersText: "Les données peuvent être traitées dans l’UE. Je ne vends pas de données personnelles.",
} as const;
