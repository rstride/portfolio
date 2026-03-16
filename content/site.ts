export type SocialLink = {
  label: string;
  href: string;
};

export type Service = {
  slug: string;
  title: string;
  description: string;
  deliverables: string[];
  benefits: string[];
  bestFor: string;
  outcome: string;
  notFor: string;
};

export type KPI = {
  label: string;
  value: string;
};

export const site = {
  name: "Romain Stride",
  role: "Hacker éthique & pentester",
  tagline:
    "Je trouve des failles, j’en prouve l’impact et j’aide à les corriger — dans un cadre de divulgation responsable.",
  company: {
    name: "PrismaSec",
    tagline: "Gestion continue de l’exposition aux menaces (CTEM)",
  },
  nav: [
    { href: "/", label: "Accueil" },
    { href: "/services", label: "Services" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ],
  serviceNavigation: [
    {
      href: "/services/pentest",
      label: "Pentest",
      description: "Pentest web/API professionnel avec preuves d'impact.",
    },
    {
      href: "/services/audit",
      label: "Audit",
      description: "Audit sécurité avec feuille de route priorisée.",
    },
    {
      href: "/services/training",
      label: "Training",
      description: "CTF et sensibilisation pour écoles et entreprises.",
    },
  ],
  hero: {
    eyebrow: "3 offres claires pour vendre une mission de sécurité sans flou",
    headlineA: "Pentest, audit",
    headlineB: "et training sécurité",
    subtext:
      "Je propose trois offres concrètes: pentest web/API professionnel, audit sécurité avec feuille de route priorisée, et CTF ou sensibilisation pour écoles et entreprises. Chaque mission est cadrée avec des livrables clairs, un résultat attendu et un échange direct avec vous.",
    ctaPrimary: {
      label: "Réserver un appel découverte",
      href: "https://cal.com/romainstride/intro",
    },
    ctaSecondary: {
      label: "Voir les offres packagées",
      href: "/services",
    },
    proofStrip: [
      "Livrables définis avant démarrage",
      "Restitution orale incluse",
      "Résultat attendu orienté correction",
    ],
    specialties: [
      "Pentest Web, API & Auth",
      "Audit sécurité priorisé",
      "CTF & sensibilisation",
      "Restitution actionnable",
    ],
  },
  socials: [
    { label: "GitHub", href: "https://github.com/rstride" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/romainstride" },
    { label: "PrismaSec", href: "https://prismasec.fr" },
  ] as SocialLink[],
  kpis: [
    { label: "Réponse initiale", value: "< 24h ouvrées" },
    { label: "Offres packagées", value: "3" },
    { label: "Debrief de restitution", value: "Inclus" },
    { label: "Contact direct", value: "Oui" },
  ] as KPI[],
  services: [
    {
      slug: "pentest",
      title: "Pentest web/API professionnel",
      description:
        "Je teste vos applications web, APIs, auth flows et espaces clients pour identifier les vulnérabilités réellement exploitables avant qu'elles ne deviennent un incident, un point de blocage ou un risque métier.",
      deliverables: ["Rapport priorisé avec preuves d'impact", "Debrief technique avec l'équipe", "Retest après corrections"],
      benefits: ["Visibilité sur le risque réel", "Corrections priorisées", "Confiance avant mise en production"],
      bestFor: "Organisations avec application web, API ou portail exposé qui veulent une validation sérieuse du risque.",
      outcome: "Une liste claire des vulnérabilités exploitables et un plan concret pour corriger vite.",
      notFor: "Les équipes qui veulent uniquement un scan automatique ou un rapport sans échange technique.",
    },
    {
      slug: "audit",
      title: "Audit sécurité",
      description:
        "J'évalue votre posture sécurité de manière pragmatique: exposition, configurations clés, gouvernance, accès, sauvegardes et priorités de remédiation.",
      deliverables: ["État des lieux sécurité", "Feuille de route priorisée", "Restitution orientée décision"],
      benefits: ["Décisions plus claires", "Priorités réalistes", "Réduction du risque sans dispersion"],
      bestFor: "Structures qui veulent savoir quoi traiter en premier sans lancer une mission lourde ou floue.",
      outcome: "Une roadmap sécurité lisible avec quick wins, chantiers prioritaires et ordre d'exécution.",
      notFor: "Les structures qui cherchent une certification clé en main ou un audit purement documentaire.",
    },
    {
      slug: "training",
      title: "CTF / sensibilisation pour écoles et entreprises",
      description:
        "Je construis des formats concrets pour faire monter le niveau sécurité: ateliers de sensibilisation, campagnes ciblées et CTF pédagogiques adaptés au niveau du public.",
      deliverables: ["Programme sur mesure", "Supports ou challenges", "Debrief pédagogique avec points d'action"],
      benefits: ["Engagement des participants", "Réflexes sécurité renforcés", "Format mémorable et concret"],
      bestFor: "Écoles, bootcamps et entreprises qui veulent former sans ennuyer leur audience.",
      outcome: "Des participants qui retiennent les bons réflexes et une session qui a un impact réel après l'événement.",
      notFor: "Les structures qui veulent uniquement une présentation théorique sans interaction.",
    },
  ] as Service[],
  about: {
    bio:
      "Consultant cybersécurité freelance et fondateur de PrismaSec. J’allie sécurité offensive (pentest, bug bounty, recherche d’outils offensifs à visée pédagogique) et conseil pour réduire la surface d’attaque.",
    education: [
      "Alumni — École 42 (spécialisation cybersécurité)",
    ],
    experience: [
      "Fondateur — PrismaSec (plateforme CTEM, 2025)",
      "Président — Lost in the Shell (organisation de CTF)",
      "Bug bounty — principalement YesWeHack",
      "Organisation & animation de CTF",
    ],
    entrepreneurship:
      "Fondateur de PrismaSec (2025) — plateforme CTEM pour aider les TPE/PME à piloter leur exposition aux menaces.",
    community: [
      "Je participe activement à des compétitions CTF",
      "Je contribue à des projets open source sur GitHub",
    ],
    methodologies: [
      "OWASP Web Security Testing Guide",
      "PTES (Penetration Testing Execution Standard)",
      "MITRE ATT&CK",
      "Bonnes pratiques DevSecOps",
    ],
    press: [] as SocialLink[],
    scheduleHref: "https://cal.com/romainstride/intro",
    email: "contact@romainstride.com",
  },
  logos: [
    { alt: "HackerOne", src: "/hackerone-logo.svg" },
    { alt: "YesWeHack", src: "/yeswehack-logo.svg" },
    { alt: "Open-Source", src: "/opensource-logo.svg" },
  ],
  privacy: {
    effectiveDate: "2025-01-01",
    address: "Paris, France",
  },
  sections: {
    featuredServicesLabel: "Prestations",
    servicesTitle: "Offres packagées",
    servicesIntro:
      "Des prestations claires, cadrées et orientées résultat pour acheter une mission de sécurité sans flou sur le livrable.",
    projectsTitle: "Expertise & Réalisations",
    projectsIntro: "Des preuves de crédibilité, mais surtout une approche orientée impact, priorisation et remédiation.",
    aboutTitle: "À propos",
    contactTitle: "Parlons de votre périmètre",
    contactIntro: "Expliquez votre contexte, votre échéance et votre besoin. Je reviens vers vous avec un cadrage, une estimation et la meilleure formule pour avancer.",
    contactLeadPrefix: "Vous préférez échanger ? Prenez rendez-vous sur",
    highlightsTitle: "Points forts",
    methodologiesTitle: "Méthodologies",
    pressTitle: "Presse",
    educationTitle: "Parcours académique",
    experienceTitle: "Expérience",
    entrepreneurshipTitle: "Entrepreneuriat",
    communityTitle: "Engagement communautaire",
  },
  strings: {
    footerPrivacyLabel: "Politique de confidentialité",
    footerRightsSuffix: "Tous droits réservés.",
  },
  privacyContent: {
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
  },
  proofs: [
    { title: "Rapports priorisés pour l'équipe tech", kpi: "Actionnables" },
    { title: "Preuves d'impact sur applications et APIs", kpi: "Concrètes" },
    { title: "Accompagnement à la correction", kpi: "Debrief + retest" },
    { title: "Approche responsable et cadrée", kpi: "Sans flou" },
  ],
  sales: {
    buyerFit: [
      "Vous avez un produit web ou une API à tester avant une release ou une vente.",
      "Vous voulez une vision claire de votre posture sécurité sans mission floue.",
      "Vous cherchez un format de sensibilisation ou de CTF qui marque vraiment les équipes.",
    ],
    process: [
      "Appel de cadrage de 20 min pour comprendre votre contexte et le périmètre.",
      "Proposition claire avec livrables, hypothèses et format d'intervention.",
      "Mission cadrée, restitution orale et suivi de remédiation si nécessaire.",
    ],
    contactReasons: [
      "Vous préparez une mise en production ou un audit client.",
      "Vous avez besoin d'un pentest web/API ou d'un audit sécurité rapide.",
      "Vous voulez organiser un atelier, une sensibilisation ou un CTF.",
    ],
    qualification: [
      "Périmètre identifié ou en cours de cadrage",
      "Besoin concret dans les 30 prochains jours",
      "Décideur ou référent technique impliqué",
    ],
    faqHint: "Le plus simple est de donner le périmètre, la stack, l'échéance et la contrainte principale.",
  },
  servicePages: {
    pentest: {
      intro:
        "Je mène des pentests web/API orientés exploitabilité réelle, avec preuves d'impact sûres, priorisation et restitution directement utile à votre équipe produit, technique ou sécurité.",
      audience: ["Équipes techniques", "Produit / Tech", "Organisations exposées sur le web"],
      process: [
        "Cadrage du périmètre, des comptes et de la fenêtre de test",
        "Tests manuels et outillés sur le scope validé",
        "Rapport, debrief et retest après correction",
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
        "Je conçois des formats de training sécurité concrets: sensibilisation ciblée, atelier interactif ou CTF pédagogique selon votre public et votre niveau technique.",
      audience: ["Écoles / Bootcamps", "Équipes métiers", "Équipes techniques"],
      process: [
        "Objectifs pédagogiques et cadrage du public",
        "Conception du contenu, des exercices ou des challenges",
        "Animation, debrief et recommandations de suivi",
      ],
    },
  } as const,
} as const;

export type SiteContent = typeof site;
