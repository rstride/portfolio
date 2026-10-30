import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import test from 'node:test';

import nextConfig from '../next.config';
import sitemap from '@/app/sitemap';
import { getProjectCaseStudies, getProjectCaseStudyBySlug, projectsDirectory } from '@/lib/projects';
import { buildProjectMetadata, defaultOgImage } from '@/lib/seo';
import { generateMetadata as frenchMetadata, generateStaticParams as frenchParams } from '@/app/(fr)/projects/[slug]/page';
import { generateMetadata as englishMetadata, generateStaticParams as englishParams } from '@/app/(en)/en/projects/[slug]/page';
import { ProjectPage } from '@/features/projects/project-page';

const isNotFound = (error: unknown) => error instanceof Error && 'digest' in error && error.digest === 'NEXT_HTTP_ERROR_FALLBACK;404';
const publishedSlugs = ['journees-cybersecurite-42-perpignan', 'prismasec'];

test('published projects have matching localized slugs and static pages', () => {
  const french = getProjectCaseStudies('fr');
  const english = getProjectCaseStudies('en');
  assert.deepEqual(french.map(({ slug }) => slug), publishedSlugs);
  assert.deepEqual(english.map(({ slug }) => slug), publishedSlugs);
  assert.equal(french.find(({ slug }) => slug === 'prismasec')?.role, 'Fondateur, CEO & Lead Engineer');
  assert.equal(english.find(({ slug }) => slug === 'prismasec')?.role, 'Founder, CEO & Lead Engineer');
  assert.deepEqual(frenchParams(), publishedSlugs.map((slug) => ({ slug })));
  assert.deepEqual(englishParams(), publishedSlugs.map((slug) => ({ slug })));
});

test('project lookup rejects missing and unsafe slugs', () => {
  assert.equal(getProjectCaseStudyBySlug('fr', 'missing'), null);
  assert.equal(getProjectCaseStudyBySlug('fr', '../prismasec'), null);
  assert.ok(getProjectCaseStudyBySlug('fr', 'prismasec'));
});

test('unknown projects resolve to 404 in both locales', async () => {
  await assert.rejects(frenchMetadata({ params: Promise.resolve({ slug: 'missing' }) }), isNotFound);
  await assert.rejects(englishMetadata({ params: Promise.resolve({ slug: 'missing' }) }), isNotFound);
  await assert.rejects(ProjectPage({ locale: 'fr', slug: 'missing' }), isNotFound);
  await assert.rejects(ProjectPage({ locale: 'en', slug: 'missing' }), isNotFound);
});

test('unpublished projects are excluded from listing, generation, sitemap, and direct access', async () => {
  const slug = `unpublished-test-${randomUUID()}`;
  const file = path.join(projectsDirectory, 'fr', `${slug}.md`);
  fs.writeFileSync(file, '---\ntitle: Draft\npublished: false\n---\nPrivate draft.\n', { flag: 'wx' });
  try {
    assert.equal(getProjectCaseStudyBySlug('fr', slug), null);
    assert.ok(getProjectCaseStudies('fr').every((project) => project.slug !== slug));
    assert.ok(frenchParams().every((params) => params.slug !== slug));
    assert.ok(sitemap().every((entry) => !entry.url.includes(slug)));
    await assert.rejects(frenchMetadata({ params: Promise.resolve({ slug }) }), isNotFound);
    await assert.rejects(ProjectPage({ locale: 'fr', slug }), isNotFound);
  } finally {
    fs.unlinkSync(file);
  }
});

test('restored project routes are not redirected and their content is packaged', async () => {
  const redirects = nextConfig.redirects ? await nextConfig.redirects() : [];
  assert.ok(redirects.every((redirect) => !redirect.source.includes('/projects')));
  assert.ok(nextConfig.outputFileTracingIncludes?.['/*']?.includes('./content/projects/**/*'));
});

test('sitemap includes project index and case study with bilingual alternates', () => {
  const entries = sitemap();
  for (const prefix of ['', '/en']) {
    assert.ok(entries.some((entry) => entry.url === `https://rstride.fr${prefix}/projects`));
    for (const [slug, updated] of [['journees-cybersecurite-42-perpignan', '2026-10-30'], ['prismasec', '2026-09-29']]) {
      const entry = entries.find((item) => item.url === `https://rstride.fr${prefix}/projects/${slug}`);
      assert.ok(entry);
      assert.equal(entry.alternates?.languages?.fr, `https://rstride.fr/projects/${slug}`);
      assert.equal(entry.alternates?.languages?.en, `https://rstride.fr/en/projects/${slug}`);
      assert.equal(entry.alternates?.languages?.['x-default'], `https://rstride.fr/projects/${slug}`);
      assert.equal(entry.lastModified instanceof Date && entry.lastModified.toISOString().slice(0, 10), updated);
    }
  }
});

test('project metadata uses localized canonical URLs and the project share image', async () => {
  for (const [locale, generate] of [['fr', frenchMetadata], ['en', englishMetadata]] as const) {
    for (const slug of publishedSlugs) {
      const project = getProjectCaseStudyBySlug(locale, slug)!;
      const meta = await generate({ params: Promise.resolve({ slug }) });
      assert.equal(meta.alternates?.canonical, `https://rstride.fr${locale === 'en' ? '/en' : ''}/projects/${slug}`);
      assert.equal(meta.alternates?.languages?.en, `https://rstride.fr/en/projects/${slug}`);
      assert.ok(Array.isArray(meta.openGraph?.images));
      const image = meta.openGraph.images[0];
      assert.ok(typeof image === 'object' && 'url' in image);
      assert.equal(image.url, project.ogImage ?? defaultOgImage);
      assert.equal(meta.title, project.seoTitle);
    }
  }
});

test('project metadata falls back to the available title, summary, and default image', () => {
  const project = getProjectCaseStudyBySlug('en', 'prismasec')!;
  const meta = buildProjectMetadata('en', { ...project, seoTitle: undefined, seoDescription: undefined, ogImage: undefined });
  assert.equal(meta.title, 'PrismaSec | Romain Stride');
  assert.equal(meta.description, project.summary);
  assert.ok(Array.isArray(meta.openGraph?.images));
  assert.deepEqual(meta.openGraph.images[0], { url: defaultOgImage, width: 1200, height: 630, alt: project.coverAlt });
});
