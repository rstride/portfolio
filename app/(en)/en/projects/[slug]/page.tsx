import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ProjectCaseStudyPage } from '@/features/projects/project-case-study-page';
import { getProjectCaseStudies, getProjectCaseStudyBySlug } from '@/lib/projects';
import { buildProjectMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return getProjectCaseStudies('en').map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectCaseStudyBySlug('en', slug);
  return project ? buildProjectMetadata({ locale: 'en', project }) : { title: 'Project not found' };
}

export default async function EnglishProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectCaseStudyBySlug('en', slug);
  if (!project) notFound();
  return <ProjectCaseStudyPage locale="en" project={project} />;
}
