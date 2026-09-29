import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import * as motion from 'motion/react-client';

import type { Locale } from '@/lib/seo';
import { getProjectCaseStudies } from '@/lib/projects';

const copy = {
  fr: {
    kicker: 'Projets // Preuves de conception',
    title: 'DES SYSTÈMES, PAS SEULEMENT DES PROMESSES.',
    intro: 'Des études de cas qui rendent visibles les contraintes, les décisions d’architecture et les contrôles de sécurité derrière le produit.',
    caseStudy: 'Étude de cas',
    role: 'Rôle',
    read: 'Lire l’étude de cas',
    visit: 'Voir le produit',
  },
  en: {
    kicker: 'Projects // Design evidence',
    title: 'SYSTEMS, NOT JUST CLAIMS.',
    intro: 'Case studies that expose the constraints, architecture decisions, and security controls behind the product.',
    caseStudy: 'Case study',
    role: 'Role',
    read: 'Read the case study',
    visit: 'Visit the product',
  },
} as const;

export function ProjectsPage({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const projects = getProjectCaseStudies(locale);
  const prefix = locale === 'en' ? '/en' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="page-frame projects-page py-12 xl:py-16"
    >
      <header className="projects-hero">
        <span className="font-mono text-primary uppercase tracking-[0.3em] text-xs">{t.kicker}</span>
        <h1>{t.title}</h1>
        <p>{t.intro}</p>
      </header>

      <div className="project-index-grid">
        {projects.map((project) => (
          <article key={project.slug} className="project-index-card">
            <div className="project-index-media">
              <Image
                src={project.coverImage}
                alt={project.coverAlt}
                fill
                sizes="(max-width: 1024px) calc(100vw - 3rem), 52vw"
                className="object-cover"
              />
            </div>
            <div className="project-index-content">
              <span className="project-kicker">{t.caseStudy}{' // '}{project.period}</span>
              <h2>{project.title}</h2>
              <p>{project.summary}</p>
              <div className="project-role"><span>{t.role}</span>{project.role}</div>
              <ul className="project-tags" aria-label="Technologies">
                {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
              <div className="project-actions">
                <Link href={`${prefix}/projects/${project.slug}`} className="cta-primary inline-flex">
                  {t.read}<ArrowRight className="size-4" />
                </Link>
                <a href={project.externalUrl} target="_blank" rel="noopener noreferrer" className="cta-secondary inline-flex">
                  {t.visit}<ExternalLink className="size-4" />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </motion.div>
  );
}
