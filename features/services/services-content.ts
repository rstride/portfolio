import type { ContactLocale, ContactServiceSlug } from '@/features/contact/schema';

export type ServiceTone = 'primary' | 'secondary' | 'tertiary';

export type AuditServiceSlug = Extract<
  ContactServiceSlug,
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
  slug: ContactServiceSlug;
  title: string;
  audience: string;
  format: string;
  outcome: string;
  tone: ServiceTone;
};

type ServicePageContent = {
  kicker: string;
  title: string;
  intro: string;
  primaryCta: string;
  secondaryCta: string;
  heroSignals: readonly string[];
  auditSection: string;
  auditIntro: string;
  fitLabel: string;
  scopeLabel: string;
  deliverablesLabel: string;
  offerCta: string;
  processSection: string;
  processIntro: string;
  process: readonly { title: string; description: string }[];
  evidenceSection: string;
  evidenceIntro: string;
  evidence: readonly { title: string; description: string; href?: string; linkLabel?: string }[];
  trainingSection: string;
  trainingIntro: string;
  audienceLabel: string;
  formatLabel: string;
  outcomeLabel: string;
  trainingCta: string;
  closingTitle: string;
  closingText: string;
  closingChecklist: readonly string[];
  closingCta: string;
  audits: readonly AuditOffer[];
  training: readonly TrainingOffer[];
};

export const servicesContent: Record<ContactLocale, ServicePageContent> = {
  fr: {
    kicker: 'Services // Opérations offensives',
    title: 'DES AUDITS QUI DÉBLOQUENT L’ACTION.',
    intro:
      'Des évaluations offensives cadrées pour confirmer les risques exploitables, prioriser les corrections et donner aux équipes une trajectoire de remédiation claire.',
    primaryCta: 'Demander un échange de cadrage',
    secondaryCta: 'Explorer les audits',
    heroSignals: ['Périmètre autorisé', 'Scénarios réalistes', 'Restitution actionnable'],
    auditSection: '00. Audits de sécurité',
    auditIntro: 'Choisissez la surface à évaluer. Chaque mission est adaptée à votre contexte, avec des règles d’engagement explicites avant tout test.',
    fitLabel: 'Pour qui',
    scopeLabel: 'Ce qui est évalué',
    deliverablesLabel: 'Ce que vous recevez',
    offerCta: 'Cadrer cet audit',
    processSection: '01. Déroulé d’une mission',
    processIntro: 'Un déroulé lisible, de la qualification du besoin à la restitution aux équipes qui corrigent.',
    process: [
      { title: 'Qualification', description: 'Objectifs, contraintes, actifs concernés et interlocuteurs sont clarifiés.' },
      { title: 'Cadrage', description: 'Périmètre, autorisations, fenêtres de test et règles d’engagement sont formalisés.' },
      { title: 'Évaluation', description: 'Tests manuels, scénarios réalistes et validation contrôlée des impacts.' },
      { title: 'Restitution', description: 'Rapport priorisé, recommandations concrètes et échange de débrief avec vos équipes.' },
    ],
    evidenceSection: '02. Une approche vérifiable',
    evidenceIntro: 'La valeur d’un audit ne se limite pas à une liste de vulnérabilités : elle tient à la clarté du raisonnement, des preuves et des prochaines étapes.',
    evidence: [
      { title: 'Méthode orientée risque', description: 'Les tests se concentrent sur les chemins d’attaque plausibles, les contrôles de sécurité et les impacts métier.' },
      { title: 'Livrables utilisables', description: 'Synthèse de direction, constats techniques reproductibles, niveau de priorité et pistes de correction.' },
      { title: 'Recherche publique', description: 'Des write-ups techniques illustrent la démarche d’analyse et de documentation.', href: '/blog', linkLabel: 'Voir les write-ups' },
    ],
    trainingSection: '03. Formations & ateliers',
    trainingIntro: 'Des formats complémentaires pour faire progresser les réflexes sécurité, les pratiques de développement et les équipes techniques.',
    audienceLabel: 'Public',
    formatLabel: 'Format',
    outcomeLabel: 'Résultat attendu',
    trainingCta: 'Préparer ce format',
    closingTitle: 'VOUS AVEZ UNE SURFACE À ÉVALUER ?',
    closingText: 'Un premier échange permet de vérifier l’adéquation de la mission et de préparer un cadrage technique utile.',
    closingChecklist: ['Type d’actif : application, API, cloud ou réseau', 'Ordre de grandeur du périmètre', 'Échéance ou contrainte opérationnelle'],
    closingCta: 'Demander un échange de cadrage',
    audits: [
      {
        slug: 'web-application-pentest', title: 'Pentest applicatif', tone: 'primary',
        summary: 'Évaluez les parcours qui exposent votre application : authentification, gestion de session, logique métier et données sensibles.',
        fit: 'SaaS, portail client, extranet ou application métier avant une mise en production ou une étape critique.',
        scope: ['OWASP Top 10', 'Authentification & session', 'Logique métier', 'Données sensibles'],
        deliverables: ['Synthèse exécutive', 'Constats reproductibles', 'Priorisation & remédiation'],
      },
      {
        slug: 'api-security-assessment', title: 'Audit de sécurité API', tone: 'secondary',
        summary: 'Contrôlez les API REST ou GraphQL qui soutiennent vos produits, intégrations et flux de données.',
        fit: 'API publique, backend mobile, architecture headless ou écosystème d’intégrations partenaires.',
        scope: ['Contrôle d’accès objet', 'Autorisation', 'Abus de flux métier', 'Rate limiting'],
        deliverables: ['Cartographie des risques', 'Preuves techniques', 'Recommandations de durcissement'],
      },
      {
        slug: 'cloud-devsecops', title: 'Audit Cloud & DevSecOps', tone: 'tertiary',
        summary: 'Réduisez les expositions liées aux identités, aux pipelines, aux secrets et à l’isolation des environnements cloud.',
        fit: 'Environnement AWS, Azure ou Kubernetes en évolution, avec une chaîne CI/CD à sécuriser.',
        scope: ['IAM & moindre privilège', 'CI/CD & secrets', 'Exposition cloud', 'Isolation Kubernetes'],
        deliverables: ['Chemins d’attaque', 'Actions priorisées', 'Pistes d’industrialisation'],
      },
      {
        slug: 'internal-infrastructure', title: 'Audit infrastructure interne', tone: 'primary',
        summary: 'Validez ce qu’un attaquant pourrait atteindre après un accès initial dans votre réseau interne.',
        fit: 'Système d’information avec Active Directory, réseau segmenté ou besoin de mesurer le risque post-compromission.',
        scope: ['Active Directory', 'Segmentation réseau', 'Mouvement latéral', 'Élévation de privilèges'],
        deliverables: ['Scénarios post-compromission', 'Points de rupture', 'Plan de réduction du risque'],
      },
    ],
    training: [
      { slug: 'security-awareness', title: 'Programme de sensibilisation', tone: 'secondary', audience: 'Équipes non techniques, métiers exposés, management', format: '1 journée, présentiel ou distanciel', outcome: 'De meilleurs réflexes face au phishing et à la manipulation sociale.' },
      { slug: 'technical-operator-track', title: 'Parcours technique', tone: 'primary', audience: 'Développeurs, DevOps et équipe sécurité', format: '3 à 5 jours, labs guidés', outcome: 'Des pratiques plus solides en secure coding, exploitation et durcissement.' },
      { slug: 'ctf-simulation-cell', title: 'CTF & simulation', tone: 'tertiary', audience: 'Écoles, promotions internes et événements techniques', format: 'Sur mesure, basé sur des challenges', outcome: 'Une expérience pratique qui transforme un objectif de formation en mise en situation.' },
    ],
  },
  en: {
    kicker: 'Services // Offensive security',
    title: 'AUDITS THAT UNBLOCK ACTION.',
    intro: 'Scoped offensive assessments that confirm exploitable risk, prioritize remediation, and give teams a clear path forward.',
    primaryCta: 'Request a scoping call',
    secondaryCta: 'Explore audit options',
    heroSignals: ['Authorized scope', 'Realistic scenarios', 'Actionable debrief'],
    auditSection: '00. Security audits',
    auditIntro: 'Choose the surface to assess. Every engagement is adapted to your context, with explicit rules of engagement before testing begins.',
    fitLabel: 'Best fit',
    scopeLabel: 'What is assessed',
    deliverablesLabel: 'What you receive',
    offerCta: 'Scope this audit',
    processSection: '01. Engagement process',
    processIntro: 'A clear route from initial qualification to a debrief with the teams responsible for remediation.',
    process: [
      { title: 'Qualification', description: 'Objectives, constraints, relevant assets, and stakeholders are clarified.' },
      { title: 'Scoping', description: 'Scope, authorization, testing windows, and rules of engagement are documented.' },
      { title: 'Assessment', description: 'Manual testing, realistic scenarios, and controlled validation of impact.' },
      { title: 'Debrief', description: 'Prioritized reporting, practical recommendations, and a review with your teams.' },
    ],
    evidenceSection: '02. A verifiable approach',
    evidenceIntro: 'An audit is more than a vulnerability list: its value lies in clear reasoning, evidence, and the next steps your team can take.',
    evidence: [
      { title: 'Risk-led methodology', description: 'Testing concentrates on plausible attack paths, security controls, and business impact.' },
      { title: 'Usable deliverables', description: 'Executive summary, reproducible technical findings, prioritization, and remediation direction.' },
      { title: 'Public research', description: 'Technical write-ups demonstrate the analysis and documentation approach.', href: '/en/blog', linkLabel: 'Read the write-ups' },
    ],
    trainingSection: '03. Training & workshops',
    trainingIntro: 'Complementary formats that build stronger security reflexes, development practices, and technical teams.',
    audienceLabel: 'Audience',
    formatLabel: 'Format',
    outcomeLabel: 'Expected outcome',
    trainingCta: 'Plan this format',
    closingTitle: 'HAVE A SURFACE TO ASSESS?',
    closingText: 'A first conversation confirms whether the engagement fits and prepares a useful technical scope.',
    closingChecklist: ['Asset type: application, API, cloud, or network', 'Approximate scope', 'Deadline or operational constraint'],
    closingCta: 'Request a scoping call',
    audits: [
      {
        slug: 'web-application-pentest', title: 'Web application pentest', tone: 'primary',
        summary: 'Assess the journeys that expose your application: authentication, session handling, business logic, and sensitive data.',
        fit: 'SaaS, customer portal, extranet, or business application before launch or a critical milestone.',
        scope: ['OWASP Top 10', 'Authentication & session', 'Business logic', 'Sensitive data'],
        deliverables: ['Executive summary', 'Reproducible findings', 'Priority & remediation'],
      },
      {
        slug: 'api-security-assessment', title: 'API security assessment', tone: 'secondary',
        summary: 'Test the REST or GraphQL APIs that power your products, integrations, and data flows.',
        fit: 'Public API, mobile backend, headless architecture, or partner-integration ecosystem.',
        scope: ['Object-level access', 'Authorization', 'Business-flow abuse', 'Rate limiting'],
        deliverables: ['Risk map', 'Technical evidence', 'Hardening direction'],
      },
      {
        slug: 'cloud-devsecops', title: 'Cloud & DevSecOps assessment', tone: 'tertiary',
        summary: 'Reduce exposure across identities, pipelines, secrets, and cloud-environment isolation.',
        fit: 'An evolving AWS, Azure, or Kubernetes environment with a CI/CD delivery chain to secure.',
        scope: ['IAM & least privilege', 'CI/CD & secrets', 'Cloud exposure', 'Kubernetes isolation'],
        deliverables: ['Attack paths', 'Prioritized actions', 'Automation direction'],
      },
      {
        slug: 'internal-infrastructure', title: 'Internal infrastructure audit', tone: 'primary',
        summary: 'Validate what an attacker could reach after gaining an initial foothold in your internal network.',
        fit: 'An information system with Active Directory, segmented networks, or a need to measure post-compromise risk.',
        scope: ['Active Directory', 'Network segmentation', 'Lateral movement', 'Privilege escalation'],
        deliverables: ['Post-compromise scenarios', 'Break points', 'Risk-reduction plan'],
      },
    ],
    training: [
      { slug: 'security-awareness', title: 'Security awareness program', tone: 'secondary', audience: 'Non-technical teams, exposed business units, leadership', format: '1 day, on-site or remote', outcome: 'Stronger reflexes against phishing and social manipulation.' },
      { slug: 'technical-operator-track', title: 'Technical operator track', tone: 'primary', audience: 'Developers, DevOps, and security teams', format: '3 to 5 days, guided labs', outcome: 'Stronger secure-coding, exploitation, and hardening practices.' },
      { slug: 'ctf-simulation-cell', title: 'CTF & simulation cell', tone: 'tertiary', audience: 'Schools, internal cohorts, and technical events', format: 'Custom, challenge-driven', outcome: 'A practical experience that turns a training objective into a field simulation.' },
    ],
  },
};
