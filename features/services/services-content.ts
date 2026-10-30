import type { ContactLocale, ContactServiceSlug } from '@/features/contact/schema';

export type ServiceTone = 'primary' | 'secondary' | 'tertiary';
export type AuditServiceSlug = Extract<ContactServiceSlug,
  'web-application-pentest' | 'api-security-assessment' | 'cloud-devsecops' | 'internal-infrastructure'
>;
export type AuditOffer = {
  slug: AuditServiceSlug;
  title: string;
  summary: string;
  fit: string;
  scope: readonly string[];
  deliverables: readonly string[];
  tone: ServiceTone;
};
export type TrainingOffer = {
  slug: Extract<ContactServiceSlug, 'security-awareness' | 'technical-operator-track' | 'ctf-simulation-cell'>;
  title: string;
  summary: string;
  audience: string;
  format: string;
  outcome: string;
  tone: ServiceTone;
};
export type ServiceCategory = {
  id: 'audit-offers' | 'training-offers';
  title: string;
  description: string;
  linkLabel: string;
};
type ServicePageContent = {
  kicker: string;
  title: string;
  intro: string;
  primaryCta: string;
  categoriesLabel: string;
  categories: readonly ServiceCategory[];
  auditSection: string;
  auditIntro: string;
  fitLabel: string;
  scopeLabel: string;
  deliverablesLabel: string;
  offerCta: string;
  trainingSection: string;
  trainingIntro: string;
  formatLabel: string;
  outcomeLabel: string;
  trainingCta: string;
  processSection: string;
  processIntro: string;
  process: readonly { title: string; description: string }[];
  blogTitle: string;
  blogText: string;
  blogCta: string;
  closingTitle: string;
  closingText: string;
  closingChecklist: readonly string[];
  closingCta: string;
  audits: readonly AuditOffer[];
  training: readonly TrainingOffer[];
};

export const servicesContent: Record<ContactLocale, ServicePageContent> = {
  fr: {
    kicker: 'Prestations freelance',
    title: 'Audits de sécurité et formations pour votre entreprise.',
    intro: 'Pentests web et API, audits cloud et réseau, sensibilisation et ateliers techniques. Chaque prestation part d’un périmètre et d’objectifs convenus ensemble.',
    primaryCta: 'Me contacter',
    categoriesLabel: 'Choisir un accompagnement',
    categories: [
      { id: 'audit-offers', title: 'Audits de sécurité', description: 'Applications, API, cloud et réseaux : des constats reproductibles et des corrections à prioriser.', linkLabel: 'Découvrir les audits' },
      { id: 'training-offers', title: 'Formations & ateliers', description: 'Sensibilisation et exercices pratiques adaptés au niveau de vos équipes.', linkLabel: 'Découvrir les formations' },
    ],
    auditSection: 'Audits de sécurité',
    auditIntro: 'Avant un lancement ou après une évolution, les tests évaluent un périmètre défini et autorisé avec vous.',
    fitLabel: 'Pour qui',
    scopeLabel: 'Périmètre technique',
    deliverablesLabel: 'Ce que vous recevez',
    offerCta: 'Discuter de cet audit',
    trainingSection: 'Formations & ateliers',
    trainingIntro: 'Des formats de sensibilisation et de pratique technique pour différents publics.',
    formatLabel: 'Format',
    outcomeLabel: 'Ce que vos équipes en retirent',
    trainingCta: 'Discuter de cette formation',
    processSection: 'Comment se déroule une mission ?',
    processIntro: 'Audit ou formation : nous définissons ensemble les objectifs, le contenu et les prochaines étapes.',
    process: [
      { title: 'Premier échange', description: 'Vous présentez l’objectif, les systèmes ou le public concernés et vos contraintes.' },
      { title: 'Préparation', description: 'Nous convenons du périmètre ou du programme, des accès et du calendrier.' },
      { title: 'Intervention', description: 'Je réalise les tests autorisés ou anime les exercices prévus.' },
      { title: 'Bilan', description: 'Nous examinons les constats ou les apprentissages et les prochaines actions.' },
    ],
    blogTitle: 'Découvrez mon approche dans les articles.',
    blogText: 'Mes guides et analyses détaillent les méthodes de test, les constats et les pistes de correction.',
    blogCta: 'Lire les articles',
    closingTitle: 'Quel est votre besoin ?',
    closingText: 'Présentez l’objectif de l’audit ou de la formation et les contraintes à prendre en compte.',
    closingChecklist: ['Votre objectif : évaluer un système ou former une équipe', 'Les systèmes concernés ou le public à accompagner', 'Votre échéance et vos contraintes'],
    closingCta: 'Me contacter',
    audits: [
      {
        slug: 'web-application-pentest', title: 'Pentest d’application web', tone: 'primary',
        summary: 'Je teste votre application pour identifier les failles qui pourraient permettre un accès non autorisé ou exposer les données de vos clients.',
        fit: 'Entreprises avec un SaaS, un portail client ou une application métier, avant un lancement ou une étape importante.',
        scope: ['OWASP Top 10', 'Authentification & session', 'Logique métier', 'Données sensibles'],
        deliverables: ['Une synthèse pour les décideurs', 'Des constats que votre équipe peut reproduire', 'Des corrections classées par priorité'],
      },
      {
        slug: 'api-security-assessment', title: 'Audit de sécurité des API', tone: 'secondary',
        summary: 'Je vérifie les échanges entre vos applications et services, pour repérer les accès abusifs et les données insuffisamment protégées.',
        fit: 'Entreprises avec une application mobile, une API publique ou des connexions à des services partenaires.',
        scope: ['REST & GraphQL', 'Contrôle d’accès objet', 'Autorisation', 'Abus de flux métier', 'Rate limiting'],
        deliverables: ['Une vue des risques identifiés', 'Des preuves techniques des failles', 'Des recommandations pour renforcer les protections'],
      },
      {
        slug: 'cloud-devsecops', title: 'Audit cloud et déploiement', tone: 'tertiary',
        summary: 'J’examine les accès, les configurations et la mise en ligne de vos applications pour identifier ce qui expose vos environnements cloud.',
        fit: 'Entreprises utilisant AWS, Azure ou Kubernetes et souhaitant sécuriser leur infrastructure et leurs déploiements.',
        scope: ['IAM & moindre privilège', 'CI/CD & secrets', 'Exposition cloud', 'Isolation Kubernetes'],
        deliverables: ['Les chemins d’accès possibles pour un attaquant', 'Les actions à mener en priorité', 'Des pistes pour automatiser les protections'],
      },
      {
        slug: 'internal-infrastructure', title: 'Audit du réseau interne', tone: 'primary',
        summary: 'Je vérifie jusqu’où un attaquant pourrait aller après un premier accès à votre réseau, et quelles protections limitent sa progression.',
        fit: 'Organisations souhaitant évaluer la sécurité de leur réseau interne, de leurs comptes et de leurs serveurs.',
        scope: ['Active Directory', 'Segmentation réseau', 'Mouvement latéral', 'Élévation de privilèges'],
        deliverables: ['Des scénarios d’attaque après un premier accès', 'Les points faibles qui permettent de progresser', 'Un plan pour réduire ces risques'],
      },
    ],
    training: [
      {
        slug: 'security-awareness', title: 'Sensibilisation à la cybersécurité', tone: 'secondary',
        summary: 'Une journée pour comprendre les menaces courantes et adopter les bons réflexes face aux messages et demandes suspects.',
        audience: 'Équipes non techniques, métiers exposés et management.', format: '1 journée, présentiel ou distanciel',
        outcome: 'De meilleurs réflexes face au phishing et à la manipulation sociale.',
      },
      {
        slug: 'technical-operator-track', title: 'Formation des équipes techniques', tone: 'primary',
        summary: 'Des exercices guidés pour comprendre les failles, améliorer le développement sécurisé et renforcer les systèmes.',
        audience: 'Développeurs, DevOps et équipes sécurité.', format: '3 à 5 jours, labs guidés',
        outcome: 'Des pratiques plus solides en développement sécurisé, analyse des failles et protection des systèmes.',
      },
      {
        slug: 'ctf-simulation-cell', title: 'Challenges et simulations de sécurité', tone: 'tertiary',
        summary: 'Des défis pratiques de type CTF (Capture the Flag) pour apprendre en résolvant des problèmes de sécurité.',
        audience: 'Écoles, groupes internes et événements techniques.', format: 'Sur mesure, basé sur des challenges',
        outcome: 'Une mise en situation pratique pour appliquer les connaissances et travailler la résolution de problèmes.',
      },
    ],
  },
  en: {
    kicker: 'Freelance services',
    title: 'Security audits and training for your business.',
    intro: 'Web and API pentests, cloud and network audits, security awareness, and technical workshops. Each engagement starts with an agreed scope and objectives.',
    primaryCta: 'Contact me',
    categoriesLabel: 'Choose the support you need',
    categories: [
      { id: 'audit-offers', title: 'Security audits', description: 'Applications, APIs, cloud, and networks: reproducible findings and fixes ranked by priority.', linkLabel: 'Explore security audits' },
      { id: 'training-offers', title: 'Training & workshops', description: 'Security awareness and practical exercises suited to your team’s experience.', linkLabel: 'Explore training options' },
    ],
    auditSection: 'Security audits',
    auditIntro: 'Before a launch or after a change, testing covers a scope defined and authorized with you.',
    fitLabel: 'Who it helps',
    scopeLabel: 'Technical scope',
    deliverablesLabel: 'What you receive',
    offerCta: 'Discuss this audit',
    trainingSection: 'Training & workshops',
    trainingIntro: 'Security awareness and hands-on technical sessions for different audiences.',
    formatLabel: 'Format',
    outcomeLabel: 'What your team takes away',
    trainingCta: 'Discuss this training',
    processSection: 'How does an engagement work?',
    processIntro: 'For an audit or training, we agree on the objectives, content, and next steps together.',
    process: [
      { title: 'First conversation', description: 'You describe the objective, the systems or audience involved, and your constraints.' },
      { title: 'Preparation', description: 'We agree on the scope or program, access requirements, and schedule.' },
      { title: 'Delivery', description: 'I carry out the authorized tests or run the planned exercises.' },
      { title: 'Review', description: 'We review findings or learning outcomes and the next actions.' },
    ],
    blogTitle: 'Explore my approach through my articles.',
    blogText: 'My guides and analysis explain testing methods, findings, and approaches to remediation.',
    blogCta: 'Read the articles',
    closingTitle: 'What do you need help with?',
    closingText: 'Describe the audit or training objective and the constraints to account for.',
    closingChecklist: ['Your goal: assess a system or train a team', 'The systems involved or the people to support', 'Your deadline and constraints'],
    closingCta: 'Contact me',
    audits: [
      {
        slug: 'web-application-pentest', title: 'Web application pentest', tone: 'primary',
        summary: 'I test your application for weaknesses that could allow unauthorized access or expose your customers’ data.',
        fit: 'Businesses with a SaaS product, customer portal, or business application before launch or an important milestone.',
        scope: ['OWASP Top 10', 'Authentication & session', 'Business logic', 'Sensitive data'],
        deliverables: ['A summary for decision makers', 'Findings your team can reproduce', 'Fixes ranked by priority'],
      },
      {
        slug: 'api-security-assessment', title: 'API security audit', tone: 'secondary',
        summary: 'I check the connections between your applications and services to identify misuse of access and insufficiently protected data.',
        fit: 'Businesses with mobile applications, public APIs, or connections to partner services.',
        scope: ['REST & GraphQL', 'Object-level access', 'Authorization', 'Business-flow abuse', 'Rate limiting'],
        deliverables: ['An overview of identified risks', 'Technical evidence of weaknesses', 'Recommendations to strengthen protections'],
      },
      {
        slug: 'cloud-devsecops', title: 'Cloud & deployment audit', tone: 'tertiary',
        summary: 'I review access, configuration, and application deployment to identify what leaves your cloud environments exposed.',
        fit: 'Businesses using AWS, Azure, or Kubernetes that want to secure their infrastructure and deployments.',
        scope: ['IAM & least privilege', 'CI/CD & secrets', 'Cloud exposure', 'Kubernetes isolation'],
        deliverables: ['Possible access paths for an attacker', 'Actions to take first', 'Ways to automate security protections'],
      },
      {
        slug: 'internal-infrastructure', title: 'Internal network audit', tone: 'primary',
        summary: 'I check how far an attacker could get after gaining initial access to your network, and which protections limit their progress.',
        fit: 'Organizations looking to assess the security of their internal network, accounts, and servers.',
        scope: ['Active Directory', 'Network segmentation', 'Lateral movement', 'Privilege escalation'],
        deliverables: ['Attack scenarios after initial access', 'Weak points that allow further access', 'A plan to reduce these risks'],
      },
    ],
    training: [
      {
        slug: 'security-awareness', title: 'Cybersecurity awareness', tone: 'secondary',
        summary: 'A day to understand common threats and learn how to respond to suspicious messages and requests.',
        audience: 'Non-technical teams, exposed business units, and leadership.', format: '1 day, on-site or remote',
        outcome: 'Stronger reflexes against phishing and social manipulation.',
      },
      {
        slug: 'technical-operator-track', title: 'Training for technical teams', tone: 'primary',
        summary: 'Guided exercises to understand vulnerabilities, improve secure development, and strengthen systems.',
        audience: 'Developers, DevOps, and security teams.', format: '3 to 5 days, guided labs',
        outcome: 'Stronger practices in secure development, vulnerability analysis, and system protection.',
      },
      {
        slug: 'ctf-simulation-cell', title: 'Security challenges & simulations', tone: 'tertiary',
        summary: 'Practical CTF (Capture the Flag) challenges that teach participants by solving security problems.',
        audience: 'Schools, internal groups, and technical events.', format: 'Custom, challenge-driven',
        outcome: 'Hands-on scenarios to apply knowledge and practice problem solving.',
      },
    ],
  },
};
