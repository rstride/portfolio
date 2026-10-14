import { getProjectCaseStudies } from '@/lib/projects';
import type { Locale } from '@/lib/seo';
import { ProjectCard } from './project-card';
import { projectsContent } from './projects-content';

export function ProjectsPage({ locale }: { locale: Locale }) {
  const t = projectsContent[locale];
  const projects = getProjectCaseStudies(locale);
  return <div className="page-frame projects-page">
    <header className="portfolio-page-header"><span className="home-kicker">{t.kicker}</span><h1>{t.title}</h1><p>{t.intro}</p></header>
    <div className="projects-list">{projects.length ? projects.map((project) => <ProjectCard key={project.slug} project={project} locale={locale} headingLevel="h2" />) : <p>{t.empty}</p>}</div>
  </div>;
}
