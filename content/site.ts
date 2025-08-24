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
    { href: "/contact", label: "Contact" },
    { href: "/legal/disclosure", label: "Divulgation" },
  ],
  hero: {
    headlineA: "Je hacke pour mieux protéger.",
    headlineB: "Tests d’intrusion et divulgation responsable.",
    subtext:
      "Freelance, je réalise des tests d’intrusion (web, API, infra), je démontre l’impact des failles et j’accompagne vos équipes avec des recommandations priorisées et des retests.",
    ctaPrimary: {
      label: "Contact",
      href: "/contact",
    },
    ctaSecondary: {
      label: "Voir les services",
      href: "/services",
    },
    specialties: [
      "Pentest Web, API & Auth",
      "Pentest Infra & Cloud",
      "Bug bounty & Halls of Fame",
      "Recherche malware (éthique)",
      "Divulgation responsable",
      "Modélisation des menaces",
      "DevSecOps",
    ],
  },
  socials: [
    { label: "GitHub", href: "https://github.com/rstride" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/romainstride" },
    { label: "X", href: "https://x.com/romainstride" },
    { label: "YesWeHack", href: "https://www.yeswehack.com/" },
    { label: "PrismaSec", href: "https://prismasec.fr" },
  ] as SocialLink[],
  kpis: [
    { label: "Bug bounty (YesWeHack)", value: "Actif" },
    { label: "CTF (orga/part)", value: "Actif" },
    { label: "Outils open-source", value: "En cours" },
    { label: "École 42", value: "Alumni" },
  ] as KPI[],
  services: [
    {
      slug: "sensibilisation",
      title: "Sensibilisation à la cybersécurité",
      description:
        "Sessions concrètes de sensibilisation (phishing, secrets, Shadow IT) adaptées à vos métiers, axées sur les bons réflexes.",
      deliverables: ["Sessions live ou en ligne", "Scénarios de phishing", "Guides pratiques"],
      benefits: ["Réduction du risque humain", "Culture sécurité renforcée", "Mesure de l’efficacité"],
    },
    {
      slug: "ctf",
      title: "Organisation de CTF",
      description:
        "Organisation de CTF pédagogiques (débutant à avancé) pour former, challenger et fédérer vos équipes autour de la sécurité offensive.",
      deliverables: ["Challenges sur mesure", "Plateforme & scoring", "Briefing et debriefing"],
      benefits: ["Apprentissage ludique", "Esprit d’équipe", "Détection de talents"],
    },
    {
      slug: "audit-securite",
      title: "Audit de sécurité",
      description:
        "Évaluation de la posture (politiques, configurations, conformité) avec feuille de route priorisée et actionnable.",
      deliverables: ["Analyse des politiques", "Vérification de configuration", "Feuille de route"],
      benefits: ["Visibilité et priorités", "Conformité renforcée", "Décisions éclairées"],
    },
    {
      slug: "pentest-web",
      title: "Test d’intrusion web",
      description:
        "Tests applicatifs (OWASP, logique métier) avec preuves d’impact, priorisation et recommandations claires.",
      deliverables: ["Rapport détaillé (preuves d’impact)", "Priorisation par risque", "Recommandations concrètes"],
      benefits: ["Détection des risques majeurs", "Clarté des corrections", "Retests inclus"],
    },
    {
      slug: "pentest-infra",
      title: "Test d’intrusion infra",
      description:
        "Pentest réseau, systèmes et cloud (externe/interne) avec restitution claire et actions de mitigation.",
      deliverables: ["Cartographie d’attaque", "Tests internes/externe", "Plan de mitigation"],
      benefits: ["Réduction du périmètre attaquable", "Visibilité complète", "Confiance opérationnelle"],
    },
    {
      slug: "formation-ia",
      title: "Fondamentaux de l’IA pour la sécu",
      description:
        "Bases LLM, prompts, risques et usages maîtrisés côté produit/sécurité (optionnel).",
      deliverables: [
        "Ateliers interactifs",
        "Supports de référence",
        "Checklist de bonnes pratiques",
      ],
      benefits: ["Acculturation rapide", "Usage responsable", "Montée en autonomie"],
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
    featuredServicesLabel: "Services mis en avant",
    servicesTitle: "Services",
    servicesIntro:
      "J’interviens en tests d’intrusion, audits, CTEM et conseil bug bounty — livrables clairs, priorisés par le risque.",
    aboutTitle: "À propos",
    contactTitle: "Contact",
    contactLeadPrefix: "Vous préférez échanger ? Prenez rendez-vous sur",
    highlightsTitle: "Points forts",
    methodologiesTitle: "Méthodologies",
    pressTitle: "Presse",
    educationTitle: "Formation",
    experienceTitle: "Expérience & engagements",
    entrepreneurshipTitle: "Entrepreneuriat",
    communityTitle: "Communauté",
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
    { title: "Participation bug bounty (YesWeHack)", kpi: "Actif" },
    { title: "Organisation & participation CTF", kpi: "Régulier" },
    { title: "Outils offensifs à visée pédagogique", kpi: "Open-source" },
    { title: "Accompagnement à la remédiation", kpi: "Retests" },
  ],
  servicePages: {
    "formation-ia": {
      intro:
        "Je rends vos équipes autonomes sur l’IA générative : comprendre, bien demander, évaluer les risques et intégrer l’IA dans les workflows.",
      audience: ["Équipes métier", "Produit / Tech", "Direction"],
      process: [
        "Cadrage des besoins et cas d’usage",
        "Ateliers interactifs (bases, prompts, risques)",
        "Mise en pratique sur vos cas réels",
      ],
    },
    sensibilisation: {
      intro:
        "Je fais passer les bons réflexes sécurité à l’échelle avec des formats courts, concrets et mesurables.",
      audience: ["Tous collaborateurs", "Managers", "Ambassadeurs sécurité"],
      process: [
        "État des lieux & messages clés",
        "Campagne (sessions + phishing) et QCM",
        "Mesure et actions de suivi",
      ],
    },
    ctf: {
      intro:
        "Je conçois et j’anime des CTF adaptés à votre niveau pour apprendre en s’amusant (web, forensics, réseau, crypto).",
      audience: ["Équipes techniques", "Écoles / Bootcamps", "Communautés internes"],
      process: [
        "Objectifs & thèmes",
        "Conception des épreuves et plateforme",
        "Animation, scoring, debriefing",
      ],
    },
    "audit-securite": {
      intro:
        "Je dresse une vision claire de votre posture sécurité et priorise les actions à fort impact.",
      audience: ["Dirigeants", "DSI / RSSI", "Lead eng"],
      process: [
        "Collecte (politiques, archi, risques)",
        "Analyse de configuration / écarts",
        "Restitution + feuille de route",
      ],
    },
    "pentest-web": {
      intro:
        "Je valide l’exploitabilité des vulnérabilités sur vos applications (OWASP Top 10, logique métier) avec des preuves claires.",
      audience: ["Produit / Tech", "SecOps", "Conformité"],
      process: [
        "Cadrage et périmètre",
        "Tests manuels & outillés",
        "Rapport, priorisation, retest",
      ],
    },
    "pentest-infra": {
      intro:
        "Je simule des attaques réseau (externe/interne) pour révéler les accès, latéralisation et élévations possibles.",
      audience: ["Infra / Cloud", "SecOps", "Direction technique"],
      process: [
        "Définition du périmètre",
        "Tests externes / internes",
        "Restitution et plan d’actions",
      ],
    },
  } as const,
} as const;

export type SiteContent = typeof site;
