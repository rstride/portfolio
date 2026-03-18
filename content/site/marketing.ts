import type {
  CaseStudy,
  EngagementStep,
  HomeProfile,
  HomeServiceSpotlight,
  PageCTA,
  SectionCopy,
  TrustSignal,
} from "@/content/site/types";

export const hero = {
  eyebrow: "Pentest · Conseil · Formation",
  headlineA: "Pentest, conseil et",
  headlineB: "formation cybersécurité",
  subtext:
    "J’interviens pour les startups, PME/TPE et structures de formation qui ont un besoin concret: tester avant une sortie, sécuriser une décision avant livraison ou former un public.",
  meta: ["Startups avant release", "Équipes techniques", "Écoles et étudiants"],
  ctaPrimary: {
    label: "Parler de votre besoin",
    href: "/contact",
  },
  ctaSecondary: {
    label: "Voir les interventions",
    href: "/services",
  },
  profileTitle: "Un pied dans le produit, la pédagogie et la communauté",
  profileDescription:
    "Je travaille sur des besoins concrets, et je reste actif dans l’écosystème cyber par la pédagogie, l’organisation d’événements et l’accompagnement de startups.",
  profileHighlights: [
    {
      label: "42 alumni",
      text: "Un parcours ancré dans la pratique, l’autonomie et la résolution de problèmes.",
    },
    {
      label: "42 Occitanie CyberDays",
      text: "Organisation d’un événement sécurité mêlant conférences et journée CTF.",
    },
  ],
} as const;

export const trustSignals = [
  {
    value: "Pentest",
    label: "Rapports clairs, failles exploitables, remédiations pertinentes",
    detail:
      "Je teste le périmètre utile et je rends un livrable que l’équipe peut réellement traiter.",
  },
  {
    value: "Conseil",
    label: "Plus de visibilité avant mise en ligne ou livraison",
    detail:
      "Je vous aide à décider quoi sécuriser, quoi tester et quoi prioriser avant une échéance.",
  },
  {
    value: "Formation",
    label: "Sensibilisation, développement sécurisé et initiation cyber",
    detail:
      "J’adapte le niveau au public, de l’employé au profil très technique en passant par l’étudiant.",
  },
] as TrustSignal[];

export const homeSections = {
  proofs: {
    eyebrow: "Repères concrets",
    title: "Des preuves plus utiles que des promesses",
    description:
      "Je préfère montrer ce que j’apporte: des livrables exploitables, un ancrage réel dans l’écosystème cyber et une pratique qui reste connectée au terrain.",
  },
  services: {
    eyebrow: "Interventions",
    title: "Pentest, conseil ou formation",
    description:
      "La page d’accueil sert à vous orienter vite: tester un périmètre avant sa sortie, prendre une meilleure décision sécurité avant livraison, ou former un public concrètement.",
  },
  references: {
    eyebrow: "Écosystème",
    title: "Un profil ancré dans la pratique",
    description:
      "Je ne vends pas une posture abstraite. Je reste au contact du produit, de la pédagogie et de la communauté sécurité.",
  },
  process: {
    eyebrow: "Déroulé",
    title: "Comprendre vite, intervenir juste, livrer clairement",
    description:
      "Je cherche d’abord le besoin réel: ce qu’il faut tester, sécuriser ou transmettre, puis je rends quelque chose d’actionnable.",
  },
} as Record<string, SectionCopy>;

export const homeProofs = [
  {
    title: "Rapports de pentest clairs, priorisés et accompagnés de remédiations pertinentes",
    kpi: "Rapports",
  },
  {
    title: "Alumni 42, avec un parcours construit sur la pratique, l’autonomie et l’exigence technique",
    kpi: "42",
  },
  {
    title: "Organisation des 42 Occitanie CyberDays, entre conférences et journée CTF",
    kpi: "CyberDays",
  },
  {
    title: "Implication continue dans la communauté: Lost in the Shell, événements sécurité et échanges avec des startups",
    kpi: "Terrain",
  },
] as const;

export const homeServiceSpotlights = [
  {
    href: "/services/pentest",
    title: "Pentest",
    description:
      "Je teste un périmètre exposé avant mise en ligne, après une évolution sensible ou quand il faut valider le risque réel.",
    format: "Web, API, LLM, cloud ou infra selon le contexte et l’exposition réelle.",
    bestFor:
      "Startup, PME/TPE ou équipe qui veut un regard externe sur ce qui est réellement exploitable.",
    timeline: "Cadrage, tests ciblés, rapport exploitable, restitution et retest si besoin.",
    deliverables: [
      "Rapport clair avec remédiations pertinentes",
      "Priorisation des vulnérabilités réellement exploitables",
    ],
    outcome:
      "Vous savez ce qui expose réellement votre application et quoi corriger en premier.",
    icon: "shield",
    badge: "Intervention",
  },
  {
    href: "/services/audit",
    title: "Conseil",
    description:
      "Je vous aide à préparer une mise en ligne, clarifier un besoin de sécurité et éviter de prendre une décision à l’aveugle.",
    format:
      "Échange ciblé sur le produit, l’échéance, les points sensibles et le bon niveau d’intervention.",
    bestFor:
      "Startup ou dirigeant de PME/TPE qui doit arbitrer avant une release, une démo client ou une livraison.",
    timeline: "Analyse du contexte, priorités, périmètre recommandé et prochaines actions utiles.",
    deliverables: [
      "Vision plus claire avant livraison",
      "Décision plus sûre sur ce qu’il faut traiter maintenant",
    ],
    outcome: "Vous avancez avec une lecture plus claire du risque et de la bonne prochaine étape.",
    icon: "search",
    badge: "Avant livraison",
  },
  {
    href: "/services/training",
    title: "Formation",
    description:
      "Je construis des formats adaptés au public: sensibilisation employés, développement sécurisé, initiation cyber ou organisation de CTF.",
    format:
      "Intervention pédagogique en entreprise ou en école, du débutant au public très technique.",
    bestFor:
      "Structures qui veulent faire progresser des employés, des équipes techniques ou des étudiants.",
    timeline: "Objectifs, adaptation au niveau, animation, débrief et points à retenir.",
    deliverables: [
      "Contenu adapté au niveau réel du public",
      "Format concret qui fait pratiquer et retenir",
    ],
    outcome:
      "Le public repart avec de meilleurs réflexes, un langage plus juste et des points d’action concrets.",
    icon: "graduation-cap",
    badge: "Pédagogie",
  },
] as HomeServiceSpotlight[];

export const homeProfile = {
  badge: "Crédibilité",
  title: "42, CyberDays et engagement terrain",
  description:
    "Alumni 42, organisateur des 42 Occitanie CyberDays, ancien fondateur de Lost in the Shell et bénévole sur d’autres événements sécurité. Cet ancrage me permet de garder un lien concret avec les pratiques, les publics et les besoins réels.",
  highlights: [
    {
      label: "42 alumni",
      text: "Parcours technique construit sur l’autonomie, la pratique et la résolution de problèmes.",
    },
    {
      label: "42 Occitanie CyberDays",
      text: "Organisation d’un événement sécurité avec une journée de conférences et une journée de CTF.",
    },
    {
      label: "Communauté",
      text: "Lost in the Shell, bénévolat et échanges réguliers pour faire progresser l’écosystème local.",
    },
  ],
} as HomeProfile;

export const caseStudies = [
  {
    title: "Startups avant mise en ligne",
    sector: "Produit / web",
    context:
      "Tests et échanges avant mise en ligne, après une évolution sensible ou avant une échéance produit.",
    intervention:
      "Pentest ciblé, cadrage du périmètre, validation des points sensibles et priorisation.",
    result:
      "Un regard externe pour sortir une application avec une vision plus claire des risques et des priorités.",
    proof:
      "Rapport lisible pour l’équipe technique et décisions plus simples côté produit avant livraison.",
  },
  {
    title: "Pentest terrain et bug bounty",
    sector: "Terrain",
    context:
      "Recherche régulière de vulnérabilités sur des environnements réels, avec une logique d’exploitabilité et de signalement responsable.",
    intervention:
      "Analyse des surfaces d’attaque, validation des scénarios et remontée structurée des failles.",
    result:
      "Une pratique ancrée dans des cas concrets pour distinguer ce qui est réellement exploitable du bruit.",
    proof: "Le terrain sert ici de signal de sérieux, pas d’argument marketing abstrait.",
  },
  {
    title: "Formation et CTF",
    sector: "Pédagogie sécurité",
    context:
      "Conception et animation de formats pour employés, équipes techniques et étudiants selon leur niveau réel.",
    intervention:
      "Sensibilisation, développement sécurisé, initiation cyber, ateliers pratiques et organisation de CTF.",
    result: "Des formats qui impliquent les participants et leur laissent des réflexes concrets.",
    proof: "La pédagogie s’adapte au public, du débutant au très technique.",
  },
] as CaseStudy[];

export const sections = {
  featuredServicesLabel: "Prestations",
  servicesTitle: "Trois offres pour des besoins concrets",
  servicesIntro:
    "Des interventions lisibles, cadrées et orientées résultat, pour traiter un besoin précis sans ambiguïté sur le périmètre ni sur les livrables.",
  projectsTitle: "Parcours et références",
  projectsIntro:
    "Un profil construit entre pentest, produit, recherche offensive, bug bounty et pédagogie.",
  contactTitle: "Parlons de votre sécurité",
  contactIntro:
    "Expliquez votre contexte, votre échéance et votre besoin. Je reviens vers vous avec un cadrage clair et la bonne proposition pour avancer.",
  highlightsTitle: "Points forts",
} as const;

export const proofs = [
  {
    title: "Rapports priorisés et directement exploitables par l’équipe technique",
    kpi: "Livrables",
  },
  {
    title: "Validation de l’impact sur applications, API et parcours critiques",
    kpi: "Exploitabilité",
  },
  {
    title: "Restitution claire, échanges directs et retest après correction",
    kpi: "Suivi",
  },
  {
    title: "Approche responsable, cadrée et orientée décision",
    kpi: "Méthode",
  },
] as const;

export const homeEngagementSteps = [
  {
    title: "Cerner le contexte utile",
    description:
      "Je récupère l’échéance, le périmètre, le niveau technique et le point de blocage pour éviter une intervention floue.",
  },
  {
    title: "Travailler sur le bon sujet",
    description:
      "Je reste focalisé sur ce qui compte pour vous: une mise en ligne, une décision sécurité, un public à former.",
  },
  {
    title: "Donner une suite claire",
    description:
      "Vous repartez avec un rapport, un cadre de décision ou un support pédagogique qui sert immédiatement.",
  },
] as EngagementStep[];

export const engagementSteps = [
  {
    title: "Cadrer le besoin",
    description:
      "Je récupère le contexte, le périmètre, la stack et la contrainte principale pour proposer le bon format d’intervention.",
  },
  {
    title: "Intervenir sans bruit",
    description:
      "La mission reste focalisée sur ce qui est vraiment utile : exposition réelle, priorités concrètes et échanges directs avec l’équipe.",
  },
  {
    title: "Restituer pour décider",
    description:
      "Vous repartez avec un livrable clair, un ordre de correction cohérent et une suite d’action lisible.",
  },
] as EngagementStep[];

export const pageCtas = {
  home: {
    eyebrow: "Parlons-en",
    title: "Vous avez un besoin concret en pentest, conseil ou formation",
    description:
      "Expliquez-moi votre contexte. Je vous réponds directement pour voir ce qui est pertinent, sans vous faire rentrer dans un format inutile.",
    primary: {
      label: "Parler de votre besoin",
      href: "/contact",
    },
    secondary: {
      label: "Voir les interventions",
      href: "/services",
    },
  },
  services: {
    eyebrow: "Décision rapide",
    title: "Un besoin déjà identifié ou une mise en production proche",
    description:
      "Je vous aide à choisir le bon format entre pentest, audit et formation, puis à cadrer la mission proprement.",
    primary: {
      label: "Discuter du besoin",
      href: "/contact",
    },
    secondary: {
      label: "Retour à l’accueil",
      href: "/",
    },
  },
  blog: {
    eyebrow: "Passer de l’analyse à l’action",
    title: "Besoin d’un regard externe sur votre exposition réelle",
    description:
      "Le blog donne des repères. La mission sert à prioriser, tester et corriger sur votre contexte réel.",
    primary: {
      label: "Parler de votre périmètre",
      href: "/contact",
    },
    secondary: {
      label: "Découvrir les services",
      href: "/services",
    },
  },
  contact: {
    eyebrow: "Avant l’envoi",
    title: "Quelques informations suffisent pour cadrer utilement l’échange",
    description:
      "Le plus important reste le contexte, le périmètre et la contrainte principale. Pas besoin d’un brief long ni d’un cahier des charges parfait.",
    primary: {
      label: "Voir les services",
      href: "/services",
    },
    secondary: {
      label: "Lire le blog",
      href: "/blog",
    },
  },
} as Record<string, PageCTA>;

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
