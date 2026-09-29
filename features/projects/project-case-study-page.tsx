import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import * as motion from 'motion/react-client';

import { StructuredData } from '@/components/structured-data';
import { markdownToHtml } from '@/lib/markdown';
import type { ProjectCaseStudy } from '@/lib/projects';
import { breadcrumbJsonLd, projectJsonLd, type Locale } from '@/lib/seo';

const copy = {
  fr: {
    back: 'Retour aux projets', role: 'Rôle', period: 'Période', product: 'Voir PrismaSec',
    next: 'Votre produit expose une surface similaire ?',
    nextText: 'Décrivez votre application, votre API ou votre environnement pour cadrer une évaluation utile et autorisée.',
    contact: 'Discuter du périmètre', services: 'Voir les services', home: 'Accueil', projects: 'Projets',
  },
  en: {
    back: 'Back to projects', role: 'Role', period: 'Period', product: 'Visit PrismaSec',
    next: 'Does your product expose a similar surface?',
    nextText: 'Describe your application, API, or environment to scope an authorized assessment that your team can act on.',
    contact: 'Discuss the scope', services: 'View services', home: 'Home', projects: 'Projects',
  },
} as const;

export async function ProjectCaseStudyPage({ locale, project }: { locale: Locale; project: ProjectCaseStudy }) {
  const t = copy[locale];
  const prefix = locale === 'en' ? '/en' : '';
  const html = await markdownToHtml(project.content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="reading-frame project-case-study frame-stack py-12 xl:py-16"
    >
      <StructuredData data={projectJsonLd(project, locale)} />
      <StructuredData data={breadcrumbJsonLd(locale, [
        { name: t.home, path: '/' },
        { name: t.projects, path: '/projects' },
        { name: project.title, path: `/projects/${project.slug}` },
      ])} />

      <Link href={`${prefix}/projects`} className="project-back-link">
        <ArrowLeft className="size-4" />{t.back}
      </Link>

      <article>
        <header className="project-detail-hero">
          <div className="project-detail-copy">
            <span className="project-kicker">{'Case study // '}{project.tags[0]}</span>
            <h1>{project.title}</h1>
            <p>{project.summary}</p>
            <dl className="project-facts">
              <div><dt>{t.role}</dt><dd>{project.role}</dd></div>
              <div><dt>{t.period}</dt><dd>{project.period}</dd></div>
            </dl>
            <a href={project.externalUrl} target="_blank" rel="noopener noreferrer" className="cta-secondary inline-flex">
              {t.product}<ExternalLink className="size-4" />
            </a>
          </div>
          <div className="project-detail-cover">
            <Image src={project.coverImage} alt={project.coverAlt} fill priority sizes="(max-width: 1024px) calc(100vw - 3rem), 44vw" className="object-cover" />
          </div>
        </header>

        <div className="reading-column project-reading-column">
          <div className="article-body" dangerouslySetInnerHTML={{ __html: html }} />

          <section className="project-next-step" aria-labelledby="project-next-title">
            <span className="project-kicker">Next step // secure scope</span>
            <h2 id="project-next-title">{t.next}</h2>
            <p>{t.nextText}</p>
            <div>
              <Link href={`${prefix}/contact?source=project_prismasec`} className="cta-primary inline-flex">
                {t.contact}<ArrowRight className="size-4" />
              </Link>
              <Link href={`${prefix}/services`} className="cta-secondary inline-flex">{t.services}</Link>
            </div>
          </section>
        </div>
      </article>
    </motion.div>
  );
}
