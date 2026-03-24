import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, Cloud, Code, Flag, Globe, Network } from 'lucide-react';
import * as motion from 'motion/react-client';

const auditServices = [
  {
    title: 'Applications Web',
    tone: 'primary',
    icon: Globe,
    description:
      "Évaluation offensive des portails critiques, parcours d'authentification et logiques métier exposées pour confirmer des scénarios d'exploitation réalistes.",
    tags: ['OWASP', 'Business Logic', 'Auth Bypass'],
  },
  {
    title: 'Cloud & DevSecOps',
    tone: 'secondary',
    icon: Cloud,
    description:
      "Audit des environnements AWS, Azure et Kubernetes avec focus sur IAM, pipelines CI/CD, gestion des secrets et erreurs d'isolation.",
    tags: ['AWS', 'Azure', 'Kubernetes'],
  },
  {
    title: 'Infrastructure Interne',
    tone: 'tertiary',
    icon: Network,
    description:
      "Validation des scénarios post-compromission: Active Directory, segmentation réseau, pivots internes et chemins d'escalade de privilèges.",
    tags: ['Active Directory', 'Pivoting', 'Privilege Escalation'],
  },
] as const;

const trainingPrograms = [
  {
    title: 'Security Awareness Program',
    tone: 'secondary',
    icon: BriefcaseBusiness,
    audience: 'Équipes non techniques, métiers exposés, management',
    format: '1 journée / présentiel ou distanciel',
    outcome: 'Réduction du risque humain, meilleurs réflexes face au phishing et à la manipulation sociale.',
    cta: 'Structurer la session',
  },
  {
    title: 'Technical Operator Track',
    tone: 'primary',
    icon: Code,
    audience: 'Développeurs, DevOps, équipe sécurité',
    format: '3 à 5 jours / labs guidés',
    outcome: "Montée en compétence sur l'exploitation, le secure coding et le durcissement d'infrastructure.",
    cta: 'Recevoir le programme',
  },
  {
    title: 'CTF & Simulation Cell',
    tone: 'secondary',
    icon: Flag,
    audience: 'Écoles, promotions internes, événements techniques',
    format: 'Sur mesure / challenge-driven',
    outcome: "Format compétitif et pédagogique pour transformer un objectif de formation en expérience terrain.",
    cta: 'Préparer un événement',
  },
] as const;

export default function ServicesPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="page-frame py-12 xl:py-16"
    >
      <header className="mb-20 xl:mb-24">
        <div className="max-w-4xl">
          <span className="font-mono text-primary uppercase tracking-[0.3em] text-xs mb-6 block">Operational Capabilities // Services</span>
          <h1 className="text-5xl md:text-7xl font-headline font-bold text-on-surface tracking-tighter leading-none mb-8">
            AUDITS OFFENSIFS
            <br />
            ET FORMATIONS.
          </h1>
          <p className="max-w-3xl text-on-surface-variant text-lg leading-relaxed font-light">
            Missions offensives ciblées et formats de formation conçus pour produire des résultats utilisables. L&apos;objectif: valider les surfaces
            réellement exploitables et transmettre des méthodes défensives qui tiennent au terrain.
          </p>
        </div>
      </header>

      <section className="mb-24 xl:mb-28">
        <div className="services-section-header mb-8">
          <span className="services-section-line services-section-line-primary"></span>
          <span className="services-section-index">00. Audits & Pentests</span>
        </div>

        <div className="services-simple-grid">
          {auditServices.map((service) => {
            const Icon = service.icon;
            return (
              <article
                key={service.title}
                className={`services-simple-card ${
                  service.tone === 'secondary'
                    ? 'services-simple-card-secondary'
                    : service.tone === 'tertiary'
                      ? 'services-simple-card-tertiary'
                      : 'services-simple-card-primary'
                }`}
              >
                <div className="services-card-scan"></div>
                <div className="services-card-beam"></div>
                <div className="capability-card-head">
                  <div className="capability-card-icon">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="services-simple-card-body">
                  <h2>{service.title}</h2>
                  <p>{service.description}</p>
                </div>
                <div className="capability-card-tags">
                  {service.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <Link href="/contact" className="services-simple-cta">
                  <span>Discuter de la mission</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section>
        <div className="services-section-header mb-8">
          <span className="services-section-line services-section-line-secondary"></span>
          <span className="services-section-index">01. Programmes de Formation</span>
        </div>

        <div className="services-simple-grid">
          {trainingPrograms.map((program) => {
            const Icon = program.icon;
            return (
              <article
                key={program.title}
                className={`services-simple-card ${
                  program.tone === 'secondary' ? 'services-simple-card-secondary' : 'services-simple-card-primary'
                }`}
              >
                <div className="services-card-scan"></div>
                <div className="services-card-beam"></div>
                <div className="capability-card-head">
                  <div className="capability-card-icon">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="services-simple-card-body">
                  <h2>{program.title}</h2>
                  <div className="services-detail-block">
                    <span className="services-detail-label">Audience</span>
                    <p>{program.audience}</p>
                  </div>
                  <div className="services-detail-block">
                    <span className="services-detail-label">Format</span>
                    <p>{program.format}</p>
                  </div>
                  <div className="services-detail-block">
                    <span className="services-detail-label">Outcome</span>
                    <p>{program.outcome}</p>
                  </div>
                </div>
                <Link href="/contact" className="services-simple-cta">
                  <span>{program.cta}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            );
          })}
        </div>
      </section>
    </motion.div>
  );
}
