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

export type CaseStudy = {
  title: string;
  sector: string;
  context: string;
  intervention: string;
  result: string;
  proof: string;
};

export const site = {
  name: "Romain Stride",
  role: "Consultant en cybersécurité, pentester et formateur",
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
      description: "Tests d’intrusion sur vos systèmes d'information.",
    },
    {
      href: "/services/audit",
      label: "Audit",
      description: "État des lieux de vos processus de sécurité.",
    },
    {
      href: "/services/training",
      label: "Formation",
      description: "Sensibilisation, ateliers et CTF pédagogiques.",
    },
  ],
  hero: {
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
  },
  socials: [
    { label: "GitHub", href: "https://github.com/rstride" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/romainstride" },
    { label: "PrismaSec", href: "https://prismasec.fr" },
  ] as SocialLink[],
  caseStudies: [
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
  ] as CaseStudy[],
  services: [
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
    },
  ] as Service[],
  about: {
    bio:
      "Consultant cybersécurité freelance et fondateur de PrismaSec. J’allie sécurité offensive (pentest, bug bounty, recherche d’outils offensifs à visée pédagogique) et conseil pour réduire la surface d’attaque.",
    entrepreneurship:
      "Fondateur de PrismaSec (2025) — plateforme CTEM pour aider les TPE/PME à piloter leur exposition aux menaces.",
    methodologies: [
      "OWASP Web Security Testing Guide",
      "MITRE ATT&CK"
    ],
    email: "contact@rstride.fr",
  },
  sections: {
    featuredServicesLabel: "Prestations",
    servicesTitle: "Trois offres pour des besoins concrets",
    servicesIntro:
      "Des interventions lisibles, cadrées et orientées résultat, pour traiter un besoin précis sans ambiguïté sur le périmètre ni sur les livrables.",
    projectsTitle: "Parcours et références",
    projectsIntro: "Un profil construit entre pentest, produit, recherche offensive, bug bounty et pédagogie.",
    contactTitle: "Parlons de votre sécurité",
    contactIntro: "Expliquez votre contexte, votre échéance et votre besoin. Je reviens vers vous avec un cadrage clair et la bonne proposition pour avancer.",
    highlightsTitle: "Points forts",
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
    { title: "Rapports priorisés et exploitables par l’équipe technique", kpi: "Actionnables" },
    { title: "Validation de l’impact sur applications, API et parcours critiques", kpi: "Concrète" },
    { title: "Restitution claire et accompagnement jusqu’à la correction", kpi: "Suivi" },
    { title: "Approche responsable, cadrée et orientée résultat", kpi: "Méthode" },
  ],
  sales: {
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
  },
  servicePages: {
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
  } as const,
} as const;

export type SiteContent = typeof site;
