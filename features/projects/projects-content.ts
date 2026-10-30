import type { Locale } from '@/lib/seo';

export const projectsContent = {
  fr: {
    kicker: 'Portfolio // Projets', title: 'Du problème au système.',
    intro: 'Des réalisations à explorer à travers mon rôle, l’architecture et les décisions techniques.',
    caseStudy: 'Explorer l’étude de cas', product: 'Voir le projet',
    role: 'Mon rôle', period: 'Période', technologies: 'Technologies & domaines',
    back: 'Tous les projets', contents: 'Dans cette étude',
    contactTitle: 'Construisons la suite.', contactText: 'Parlons d’un poste, d’un projet ou d’une collaboration en développement et sécurité.', contact: 'Me contacter',
    empty: 'Les prochaines réalisations seront présentées ici.',
  },
  en: {
    kicker: 'Portfolio // Projects', title: 'From problem to system.',
    intro: 'Explore my work through my role, the architecture, and the technical decisions.',
    caseStudy: 'Explore the case study', product: 'View project',
    role: 'My role', period: 'Period', technologies: 'Technologies & domains',
    back: 'All projects', contents: 'In this study',
    contactTitle: 'Let’s build what’s next.', contactText: 'Let’s talk about a role, a project, or a collaboration in development and security.', contact: 'Get in touch',
    empty: 'Future projects will be presented here.',
  },
} satisfies Record<Locale, object>;
