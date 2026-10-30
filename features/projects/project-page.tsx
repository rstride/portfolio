import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { StructuredData } from '@/components/structured-data';
import { markdownToHtml } from '@/lib/markdown';
import { getProjectCaseStudyBySlug } from '@/lib/projects';
import { breadcrumbJsonLd, localizedPath, type Locale } from '@/lib/seo';
import { projectsContent } from './projects-content';

export async function ProjectPage({ locale, slug }: { locale: Locale; slug: string }) {
  const project = getProjectCaseStudyBySlug(locale, slug);
  if (!project) notFound();
  const t = projectsContent[locale];
  const html = await markdownToHtml(project.content);
  const headings = Array.from(html.matchAll(/<h2 id="([^"]+)">([^<]+)<\/h2>/g), ([, id, title]) => ({ id, title }));
  return <div className="page-frame project-page">
    <StructuredData data={breadcrumbJsonLd(locale, [
      { name: locale === 'fr' ? 'Accueil' : 'Home', path: '/' },
      { name: locale === 'fr' ? 'Projets' : 'Projects', path: '/projects' },
      { name: project.title, path: `/projects/${project.slug}` },
    ])} />
    <Link href={localizedPath(locale, '/projects')} className="portfolio-evidence project-back"><ArrowLeft className="size-4" aria-hidden="true" />{t.back}</Link>
    <article>
      <header className="portfolio-page-header project-header">
        <span className="home-kicker">{t.kicker}{' // '}{project.period}</span><h1>{project.title}</h1><p>{project.summary}</p>
        <dl className="project-facts"><div><dt>{t.role}</dt><dd>{project.role}</dd></div><div><dt>{t.period}</dt><dd>{project.period}</dd></div></dl>
        <ul className="project-tags" aria-label={t.technologies}>{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
        {project.externalUrl && <a href={project.externalUrl} target="_blank" rel="noopener noreferrer" className="cta-primary inline-flex mt-6">{project.externalLabel ?? t.product}<ArrowUpRight className="size-4" aria-hidden="true" /></a>}
      </header>
      <div className="project-cover"><Image src={project.coverImage} alt={project.coverAlt} fill sizes="(max-width: 1439px) calc(100vw - 48px), 1280px" loading="eager" className={project.coverFit === 'contain' ? 'object-contain' : 'object-cover'} /></div>
      <div className="project-reading-grid">
        <nav className="project-contents" aria-label={t.contents}><span className="home-kicker">{t.contents}</span><ol>{headings.map((heading) => <li key={heading.id}><a href={`#${heading.id}`}>{heading.title}</a></li>)}</ol></nav>
        <div className="article-body project-prose" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </article>
    <section className="project-closing"><div><h2>{t.contactTitle}</h2><p>{t.contactText}</p></div><Link href={localizedPath(locale, '/contact')} className="cta-primary inline-flex">{t.contact}<ArrowUpRight className="size-4" aria-hidden="true" /></Link></section>
  </div>;
}
