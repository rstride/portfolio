import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

import type { Locale } from '@/lib/seo';

export const projectsDirectory = path.join('content', 'projects');

export interface ProjectCaseStudyMeta {
  slug: string;
  title: string;
  summary: string;
  role: string;
  period: string;
  tags: string[];
  externalUrl: string;
  coverImage: string;
  coverAlt: string;
  ogImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  updated: string;
  featured?: boolean;
  published?: boolean;
}

type ProjectFrontmatter = Omit<ProjectCaseStudyMeta, 'slug'>;

export interface ProjectCaseStudy extends ProjectCaseStudyMeta {
  content: string;
}

function loadProjectFile(filePath: string, slug: string): ProjectCaseStudy | null {
  const parsed = matter(fs.readFileSync(filePath, 'utf8'));
  const frontmatter = parsed.data as ProjectFrontmatter;

  if (frontmatter.published === false) {
    return null;
  }

  return {
    ...frontmatter,
    slug,
    content: parsed.content,
  };
}

export function getProjectCaseStudies(locale: Locale): ProjectCaseStudyMeta[] {
  const localeDirectory = path.join(projectsDirectory, locale);

  if (!fs.existsSync(localeDirectory)) {
    return [];
  }

  return fs.readdirSync(localeDirectory)
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      return loadProjectFile(path.join(localeDirectory, fileName), slug);
    })
    .filter((project): project is ProjectCaseStudy => project !== null)
    .map(({ content: _content, ...meta }) => meta)
    .sort((a, b) => Date.parse(b.updated) - Date.parse(a.updated));
}

export function getProjectCaseStudyBySlug(locale: Locale, slug: string): ProjectCaseStudy | null {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return null;
  }

  const filePath = path.join(projectsDirectory, locale, `${slug}.md`);
  return fs.existsSync(filePath) ? loadProjectFile(filePath, slug) : null;
}
