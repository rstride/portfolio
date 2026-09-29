import type { Locale } from '@/lib/seo';

export const homeContent = {
  fr: {
    kicker: 'Audits & formations cybersécurité // France et remote',
    titleLead: 'RENFORCEZ VOTRE',
    titleAccent: 'SÉCURITÉ ET VOS ÉQUIPES.',
    intro: 'J’évalue la sécurité de vos applications, de votre cloud et de vos réseaux. Je forme aussi vos équipes, de la sensibilisation aux exercices techniques.',
    primaryCta: 'Parlons de vos besoins', secondaryCta: 'Découvrir mes services', proofLabel: 'Signaux vérifiables',
    servicesKicker: 'Mes services', servicesTitle: 'Évaluez vos systèmes. Formez vos équipes.',
    servicesText: 'Deux façons de renforcer votre sécurité : identifier les failles de vos systèmes ou développer les compétences de vos équipes.',
    allServices: 'Voir tous les services', processKicker: 'Mon accompagnement', processTitle: 'Des objectifs clairs, du premier échange au bilan.',
    articlesKicker: 'Guides & recherche // Partage public', articlesTitle: 'DES MÉTHODES QUE VOUS POUVEZ ÉVALUER.',
    articlesText: 'Guides opérationnels, recherche applicative et write-ups pour rendre le raisonnement technique vérifiable.', readArticle: 'Lire', allArticles: 'Explorer les articles',
    aboutKicker: 'À propos // Opérateur', aboutTitle: 'OFFENSIF DANS LA MÉTHODE. PRAGMATIQUE DANS LA RESTITUTION.',
    aboutParagraphs: ['Pentester freelance et fondateur de PrismaSec, je travaille à l’intersection de la sécurité applicative, des API et de l’ingénierie bas niveau.', 'Formé à l’École 42, j’utilise la compréhension des systèmes, l’automatisation offensive et la documentation pour transformer une preuve technique en action compréhensible par les équipes qui corrigent.'],
    foundations: 'Fondations techniques', foundationItems: ['Sécurité web, API et logique métier', 'C, assembleur et compréhension système', 'Outillage offensif et automatisation'],
    finalTitle: 'Un système à évaluer ? Une équipe à former ?', finalText: 'Décrivez votre besoin, vos objectifs et vos contraintes. Nous choisirons ensemble l’accompagnement adapté.', finalCta: 'Parlons de vos besoins',
  },
  en: {
    kicker: 'Security audits & training // France and remote', titleLead: 'STRENGTHEN YOUR', titleAccent: 'SECURITY AND YOUR TEAM.',
    intro: 'I assess the security of your applications, cloud, and networks. I also train your teams, from security awareness to hands-on technical exercises.',
    primaryCta: 'Discuss your needs', secondaryCta: 'Explore my services', proofLabel: 'Verifiable signals',
    servicesKicker: 'My services', servicesTitle: 'Assess your systems. Train your teams.',
    servicesText: 'Two ways to strengthen your security: identify weaknesses in your systems or build your team’s skills.',
    allServices: 'View all services', processKicker: 'Working together', processTitle: 'Clear objectives, from first conversation to review.',
    articlesKicker: 'Guides & research // Public work', articlesTitle: 'METHODS YOU CAN EVALUATE.', articlesText: 'Operational guides, application-security research, and write-ups that make the technical reasoning visible.', readArticle: 'Read', allArticles: 'Explore the articles',
    aboutKicker: 'About // Operator', aboutTitle: 'OFFENSIVE IN METHOD. PRAGMATIC IN DELIVERY.',
    aboutParagraphs: ['I am a freelance pentester and PrismaSec founder working across application security, APIs, and low-level engineering.', 'Trained at École 42, I use systems knowledge, offensive automation, and clear documentation to turn technical evidence into action for the teams responsible for fixing it.'],
    foundations: 'Technical foundations', foundationItems: ['Web, API, and business-logic security', 'C, assembly, and systems knowledge', 'Offensive tooling and automation'],
    finalTitle: 'A system to assess? A team to train?', finalText: 'Tell me about your needs, objectives, and constraints. We’ll choose the right support together.', finalCta: 'Discuss your needs',
  },
} satisfies Record<Locale, Record<string, string | readonly string[]>>;
