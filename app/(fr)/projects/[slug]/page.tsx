import { notFound } from 'next/navigation';
import { ProjectPage } from '@/features/projects/project-page';
import { getProjectCaseStudies, getProjectCaseStudyBySlug } from '@/lib/projects';
import { buildProjectMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return getProjectCaseStudies('fr').map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectCaseStudyBySlug('fr', slug);
  if (!project) notFound();
  return buildProjectMetadata('fr', project);
}

export default async function FrenchProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProjectPage locale="fr" slug={slug} />;
}
