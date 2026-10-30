import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { ProjectCaseStudyMeta } from '@/lib/projects';
import { localizedPath, type Locale } from '@/lib/seo';
import { projectsContent } from './projects-content';

export function ProjectCard({ project, locale, headingLevel = 'h3' }: { project: ProjectCaseStudyMeta; locale: Locale; headingLevel?: 'h2' | 'h3' }) {
  const t = projectsContent[locale];
  const href = localizedPath(locale, `/projects/${project.slug}`);
  const Heading = headingLevel;
  return (
    <article className="project-card">
      <Link href={href} className="project-card-image" aria-label={`${t.caseStudy} : ${project.title}`}>
        <Image src={project.coverImage} alt={project.coverAlt} fill sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1439px) 50vw, 680px" className="object-cover" />
        <span className="project-image-label">{project.title}{project.tags[0] && ` // ${project.tags[0]}`}</span>
      </Link>
      <div className="project-card-body">
        <span className="home-kicker">{project.period}</span>
        <Heading><Link href={href}>{project.title}</Link></Heading><p>{project.summary}</p>
        <dl className="project-role"><dt>{t.role}</dt><dd>{project.role}</dd></dl>
        <ul className="project-tags" aria-label={t.technologies}>{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
        <div className="project-card-actions">
          <Link href={href} className="portfolio-evidence">{t.caseStudy}<ArrowRight className="size-4" aria-hidden="true" /></Link>
          <a href={project.externalUrl} target="_blank" rel="noopener noreferrer" className="portfolio-evidence project-product-link">{project.externalLabel ?? t.product}<ArrowUpRight className="size-4" aria-hidden="true" /></a>
        </div>
      </div>
    </article>
  );
}
