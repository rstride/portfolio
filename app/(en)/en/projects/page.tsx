import { ProjectsPage } from '@/features/projects/projects-page';
import { buildPageMetadata, pageSeo } from '@/lib/seo';

export const metadata = buildPageMetadata({ locale: 'en', ...pageSeo.projects.en });

export default function EnglishProjectsPage() {
  return <ProjectsPage locale="en" />;
}
