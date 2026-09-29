import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ProjectCaseStudyPage } from '@/features/projects/project-case-study-page';
import { getProjectCaseStudies, getProjectCaseStudyBySlug } from '@/lib/projects';
import { buildProjectMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return getProjectCaseStudies('fr').map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectCaseStudyBySlug('fr', slug);
  return project ? buildProjectMetadata({ locale: 'fr', project }) : { title: 'Projet introuvable' };
}

export default async function FrenchProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectCaseStudyBySlug('fr', slug);
  if (!project) notFound();
  return <ProjectCaseStudyPage locale="fr" project={project} />;
}
