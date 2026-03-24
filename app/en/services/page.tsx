import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, Cloud, Code, Flag, Globe, Network } from 'lucide-react';
import * as motion from 'motion/react-client';

const auditServices = [
  {
    title: 'Web Applications',
    tone: 'primary',
    icon: Globe,
    description:
      'Offensive assessment of critical portals, authentication flows, and business logic exposure to confirm realistic exploitation paths.',
    tags: ['OWASP', 'Business Logic', 'Auth Bypass'],
  },
  {
    title: 'Cloud & DevSecOps',
    tone: 'secondary',
    icon: Cloud,
    description:
      'Review of AWS, Azure, and Kubernetes environments with focus on IAM, CI/CD pipelines, secret management, and isolation failures.',
    tags: ['AWS', 'Azure', 'Kubernetes'],
  },
  {
    title: 'Internal Infrastructure',
    tone: 'tertiary',
    icon: Network,
    description:
      'Validation of post-compromise scenarios across Active Directory, network segmentation, lateral movement, and privilege escalation paths.',
    tags: ['Active Directory', 'Pivoting', 'Privilege Escalation'],
  },
] as const;

const trainingPrograms = [
  {
    title: 'Security Awareness Program',
    tone: 'secondary',
    icon: BriefcaseBusiness,
    audience: 'Non-technical teams, exposed business units, leadership',
    format: '1 day / on-site or remote',
    outcome: 'Lower human-layer risk and stronger reflexes against phishing and social manipulation.',
    cta: 'Shape the session',
  },
  {
    title: 'Technical Operator Track',
    tone: 'primary',
    icon: Code,
    audience: 'Developers, DevOps, security team',
    format: '3 to 5 days / guided labs',
    outcome: 'Capability growth on exploitation, secure coding, and infrastructure hardening.',
    cta: 'Request the syllabus',
  },
  {
    title: 'CTF & Simulation Cell',
    tone: 'secondary',
    icon: Flag,
    audience: 'Schools, internal cohorts, technical events',
    format: 'Custom / challenge-driven',
    outcome: 'A competitive, educational format that turns a training objective into practical field experience.',
    cta: 'Prepare an event',
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
            OFFENSIVE AUDITS
            <br />
            AND TRAINING.
          </h1>
          <p className="max-w-3xl text-on-surface-variant text-lg leading-relaxed font-light">
            Targeted offensive engagements and training formats built to produce usable outcomes. The goal: validate what is actually exploitable and transfer
            defensive methods that hold up in the field.
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
                <Link href="/en/contact" className="services-simple-cta">
                  <span>Discuss the engagement</span>
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
          <span className="services-section-index">01. Training Programs</span>
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
                <Link href="/en/contact" className="services-simple-cta">
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
