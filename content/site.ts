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
  role: "Consultant en cybersécurité & pentester",
  tagline:
    "J’aide les entreprises à réduire leur surface d’attaque grâce à des audits pointus, des tests d’intrusion rigoureux et des outils de sécurité sur mesure.",
  company: {
    name: "PrismaSec",
    tagline: "Gestion Continue de l’Exposition aux Menaces, propulsée par l’IA",
  },
  nav: [
    { href: "/", label: "Accueil" },
    { href: "/services", label: "Services" },
    { href: "/blog", label: "Blog" },
  ],
  hero: {
    headlineA: "Casser. Mesurer. Sécuriser.",
    headlineB: "L’exposition continue aux menaces, opérationnalisée.",
    subtext:
      "J’aide les entreprises à réduire leur surface d’attaque grâce à des audits pointus, des tests d’intrusion rigoureux et des outils de sécurité sur mesure.",
    ctaPrimary: {
      label: "Contact",
      href: "/contact",
    },
    ctaSecondary: {
      label: "Voir les services",
      href: "/services",
    },
    specialties: [
      "Pentest Web & API",
      "Pentest Infra & Cloud",
      "Bug Bounty",
      "CTEM Advisory",
      "Threat Modeling",
      "DevSecOps",
    ],
  },
  socials: [
    { label: "GitHub", href: "https://github.com/rstride" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/romainstride" },
    { label: "X", href: "https://x.com/romainstride" },
    { label: "PrismaSec", href: "https://prismasec.com" },
  ] as SocialLink[],
  kpis: [
    { label: "CVEs publiés", value: "12+" },
    { label: "Critiques triés", value: "80+" },
    { label: "Programmes attaqués", value: "50+" },
    { label: "Années d’expérience", value: "8" },
  ] as KPI[],
  services: [
    {
      slug: "formation-ia",
      title: "Formation aux fondamentaux de l’IA",
      description:
        "Je forme vos équipes aux bases de l’IA (LLM, prompts, risques, sécurité) pour un usage maîtrisé et productif.",
      deliverables: [
        "Ateliers interactifs (2h à 1 journée)",
        "Supports et templates de prompts",
        "Checklist de bonnes pratiques et risques",
      ],
      benefits: ["Montée en compétences rapide", "Usage responsable de l’IA", "Gain de productivité"],
    },
    {
      slug: "sensibilisation",
      title: "Sensibilisation à la cybersécurité",
      description:
        "Je conçois et j’anime des sessions de sensibilisation (phishing, mots de passe, Shadow IT) adaptées à vos métiers.",
      deliverables: ["Sessions live ou en ligne", "Scénarios de phishing", "Guides pratiques"],
      benefits: ["Réduction du risque humain", "Culture sécurité renforcée", "Mesure de l’efficacité"],
    },
    {
      slug: "ctf",
      title: "Organisation de CTF",
      description:
        "J’organise des CTF pédagogiques (débutant à avancé) pour former, challenger et fédérer vos équipes.",
      deliverables: ["Challenges sur mesure", "Plateforme & scoring", "Briefing et debriefing"],
      benefits: ["Apprentissage ludique", "Esprit d’équipe", "Détection de talents"],
    },
    {
      slug: "audit-securite",
      title: "Audit de sécurité",
      description:
        "J’évalue votre posture (politiques, configuration, conformité) et fournis une feuille de route claire.",
      deliverables: ["Analyse des politiques", "Vérification de configuration", "Feuille de route"],
      benefits: ["Visibilité et priorités", "Conformité renforcée", "Décisions éclairées"],
    },
    {
      slug: "pentest-web",
      title: "Audit de pentest web",
      description:
        "J’identifie et j’exploite de façon contrôlée les vulnérabilités applicatives (OWASP, logique métier).",
      deliverables: ["Rapport détaillé avec PoC", "Priorisation par impact", "Recommandations actionnables"],
      benefits: ["Failles critiques détectées", "Preuves exploitables", "Remédiation accélérée"],
    },
    {
      slug: "pentest-infra",
      title: "Audit de pentest infra",
      description:
        "J’évalue la sécurité réseau, systèmes et cloud (externe/interne) avec un regard attaquant.",
      deliverables: ["Cartographie d’attaque", "Tests internes/externe", "Plan de mitigation"],
      benefits: ["Réduction du périmètre attaquable", "Visibilité complète", "Confiance opérationnelle"],
    },
  ] as Service[],
  about: {
    bio:
      "Je suis consultant en cybersécurité freelance et fondateur de PrismaSec. J’allie expertise offensive et conseil stratégique pour aider les entreprises à réduire leur surface d’attaque.",
    education: [
      "J’ai un Master en droit privé — Université Toulouse 1 Capitole",
      "J’étudie à l’école 42 Perpignan (spécialisation cybersécurité)",
    ],
    experience: [
      "J’ai été président de l’association de cybersécurité de l’école (2022)",
      "J’ai organisé et animé des CTF",
      "Je participe régulièrement à des événements de hacking",
      "Je suis bénévole à la Toulouse Hacking Convention",
    ],
    entrepreneurship:
      "J’ai fondé PrismaSec (2025) — une startup qui vise à démocratiser l’accès à la cybersécurité pour les TPE/PME via une plateforme CTEM propulsée par l’IA.",
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
    { alt: "PrismaSec", src: "/vercel.svg" },
    { alt: "Next.js", src: "/next.svg" },
    { alt: "Cloud", src: "/globe.svg" },
  ],
  privacy: {
    effectiveDate: "2025-01-01",
    address: "Paris, France",
  },
  sections: {
    featuredServicesLabel: "Services mis en avant",
    servicesTitle: "Services",
    servicesIntro:
      "Audits de sécurité, tests d’intrusion, stratégie CTEM et conseil bug bounty — adaptés à votre risque et à votre vitesse.",
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
    { title: "J’ai réduit la surface d’attaque de certains clients de plus de 40% en moins de 2 mois", kpi: "−40%" },
    { title: "J’ai découvert et signalé des vulnérabilités critiques en bug bounty", kpi: "Critique" },
    { title: "J’ai organisé des CTF rassemblant plus de 100 participants", kpi: "100+" },
    { title: "J’ai développé des outils internes pour automatiser la veille CVE", kpi: "Outils" },
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


