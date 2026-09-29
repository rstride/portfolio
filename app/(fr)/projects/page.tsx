import { ProjectsPage } from '@/features/projects/projects-page';
import { buildPageMetadata, pageSeo } from '@/lib/seo';

export const metadata = buildPageMetadata({ locale: 'fr', ...pageSeo.projects.fr });

export default function FrenchProjectsPage() {
  return <ProjectsPage locale="fr" />;
}
