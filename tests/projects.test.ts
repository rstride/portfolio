import assert from 'node:assert/strict';
import test from 'node:test';

import nextConfig from '../next.config';
import sitemap from '@/app/sitemap';
import { getProjectCaseStudies, getProjectCaseStudyBySlug } from '@/lib/projects';

test('archived project content still has matching localized slugs', () => {
  const french = getProjectCaseStudies('fr');
  const english = getProjectCaseStudies('en');

  assert.deepEqual(french.map(({ slug }) => slug), ['prismasec']);
  assert.deepEqual(english.map(({ slug }) => slug), ['prismasec']);
  assert.equal(french[0]?.role, 'Fondateur, CEO & Lead Engineer');
  assert.equal(english[0]?.role, 'Founder, CEO & Lead Engineer');
});

test('archived project lookup rejects missing and unsafe slugs', () => {
  assert.equal(getProjectCaseStudyBySlug('fr', 'missing'), null);
  assert.equal(getProjectCaseStudyBySlug('fr', '../prismasec'), null);
  assert.ok(getProjectCaseStudyBySlug('fr', 'prismasec'));
});

test('retired project routes redirect permanently to the localized blog', async () => {
  const redirects = await nextConfig.redirects!();

  assert.deepEqual(redirects, [
    { source: '/projects/:path*', destination: '/blog', permanent: true },
    { source: '/en/projects/:path*', destination: '/en/blog', permanent: true },
  ]);
});

test('sitemap excludes all retired project pages and alternates', () => {
  const entries = sitemap();

  assert.ok(entries.every((entry) => !new URL(entry.url).pathname.split('/').includes('projects')));
  assert.ok(entries.every((entry) => Object.values(entry.alternates?.languages ?? {})
    .every((url) => !new URL(url).pathname.split('/').includes('projects'))));
});
