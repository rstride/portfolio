import type { Locale } from '@/lib/seo';

export const homeContent = {
  fr: {
    kicker: 'Portfolio // Développement & sécurité', title: 'Romain Stride', specialty: 'Développement & cybersécurité',
    intro: 'Je conçois des applications et j’en explore les failles. Fondateur de PrismaSec, je relie développement logiciel, sécurité offensive et compréhension des systèmes.',
    primaryCta: 'Voir mes projets', portraitAlt: 'Portrait de Romain Stride',
    foundations: ['Web / API', 'Ingénierie logicielle', 'Sécurité offensive'],
    previewLabel: 'Projet en production', previewText: 'De la surface d’attaque à la remédiation.',
    projectKicker: '01 // Réalisation', projectTitle: 'Du code au produit. La sécurité à chaque étape.', allProjects: 'Tous les projets',
    skillsKicker: '02 // Compétences', skillsTitle: 'Construire. Tester. Automatiser.',
    skills: [
      { title: 'Développement applicatif', description: 'Concevoir un produit complet, de l’interface aux services et aux données. Définir des frontières claires entre les responsabilités.', tags: ['Next.js', 'PostgreSQL', 'Rust', 'SurrealDB'], evidence: 'Voir l’architecture de PrismaSec', path: '/projects/prismasec#architecture-cloisonnée' },
      { title: 'Sécurité offensive', description: 'Analyser les accès, la logique métier et les failles web/API. Transformer le raisonnement technique en preuves reproductibles.', tags: ['Web & API', 'Autorisation', 'Isolation multi-tenant'], evidence: 'Lire ma recherche sur les API', path: '/blog/autorisation-api-multitenant' },
      { title: 'Infrastructure & automatisation', description: 'Orchestrer les opérations, sécuriser la livraison et rendre les changements vérifiables et réversibles.', tags: ['Kubernetes', 'GitOps', 'CI/CD', 'Automatisation'], evidence: 'Explorer la livraison de PrismaSec', path: '/projects/prismasec#traiter-la-livraison-comme-un-contrôle-de-sécurité' },
    ],
    aboutKicker: '03 // Parcours', aboutTitle: 'Comprendre les systèmes pour mieux les construire.',
    journey: [
      { label: 'Fondations', title: 'École 42', text: 'Une formation centrée sur la programmation et la compréhension des systèmes : C, assembleur, résolution de problèmes et autonomie technique.' },
      { label: '2025 — aujourd’hui', title: 'Fondateur de PrismaSec', text: 'Direction produit, architecture applicative et ingénierie sécurité. Un projet qui réunit le développement, les opérations et la recherche offensive.' },
    ],
    articlesKicker: '04 // Recherche & partage', articlesTitle: 'Le raisonnement derrière la technique.',
    articlesText: 'Recherche applicative, guides et write-ups : des problèmes expliqués, des méthodes documentées et des preuves à examiner.',
    readArticle: 'Lire l’article', allArticles: 'Explorer les articles',
    finalKicker: '05 // Contact', finalTitle: 'Parlons développement et sécurité.',
    finalText: 'Un poste, un projet ou une collaboration technique ? Échangeons sur ce que nous pouvons construire ensemble.', finalCta: 'Me contacter',
  },
  en: {
    kicker: 'Portfolio // Development & security', title: 'Romain Stride', specialty: 'Development & cybersecurity',
    intro: 'I build applications and explore their weaknesses. As the founder of PrismaSec, I connect software development, offensive security, and systems knowledge.',
    primaryCta: 'Explore my projects', portraitAlt: 'Portrait of Romain Stride',
    foundations: ['Web / API', 'Software engineering', 'Offensive security'],
    previewLabel: 'Project in production', previewText: 'From attack surface to remediation.',
    projectKicker: '01 // Selected work', projectTitle: 'From code to product. Security at every step.', allProjects: 'All projects',
    skillsKicker: '02 // Skills', skillsTitle: 'Build. Test. Automate.',
    skills: [
      { title: 'Application development', description: 'Build a complete product, from the interface to services and data. Define clear boundaries between responsibilities.', tags: ['Next.js', 'PostgreSQL', 'Rust', 'SurrealDB'], evidence: 'See the PrismaSec architecture', path: '/projects/prismasec#separated-architecture' },
      { title: 'Offensive security', description: 'Analyze access controls, business logic, and web/API vulnerabilities. Turn technical reasoning into reproducible evidence.', tags: ['Web & API', 'Authorization', 'Tenant isolation'], evidence: 'Read my API research', path: '/blog/autorisation-api-multitenant' },
      { title: 'Infrastructure & automation', description: 'Orchestrate operations, secure delivery, and make changes reviewable and reversible.', tags: ['Kubernetes', 'GitOps', 'CI/CD', 'Automation'], evidence: 'Explore PrismaSec delivery', path: '/projects/prismasec#treat-delivery-as-a-security-control' },
    ],
    aboutKicker: '03 // Background', aboutTitle: 'Understand systems. Build better software.',
    journey: [
      { label: 'Foundations', title: 'École 42', text: 'Training focused on programming and systems knowledge: C, assembly, problem solving, and technical autonomy.' },
      { label: '2025 — present', title: 'PrismaSec founder', text: 'Product direction, application architecture, and security engineering. A project connecting development, operations, and offensive research.' },
    ],
    articlesKicker: '04 // Research & writing', articlesTitle: 'The reasoning behind the technology.',
    articlesText: 'Application-security research, guides, and write-ups: problems explained, methods documented, and evidence you can examine.',
    readArticle: 'Read the article', allArticles: 'Explore the articles',
    finalKicker: '05 // Contact', finalTitle: 'Let’s talk development and security.',
    finalText: 'A role, a project, or a technical collaboration? Let’s discuss what we can build together.', finalCta: 'Get in touch',
  },
} satisfies Record<Locale, object>;
