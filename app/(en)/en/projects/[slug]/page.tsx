import { notFound } from 'next/navigation';
import { ProjectPage } from '@/features/projects/project-page';
import { getProjectCaseStudies, getProjectCaseStudyBySlug } from '@/lib/projects';
import { buildProjectMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return getProjectCaseStudies('en').map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectCaseStudyBySlug('en', slug);
  if (!project) notFound();
  return buildProjectMetadata('en', project);
}

export default async function EnglishProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProjectPage locale="en" slug={slug} />;
}
