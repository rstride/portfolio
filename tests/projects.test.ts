import assert from 'node:assert/strict';
import test from 'node:test';

import sitemap from '@/app/sitemap';
import { getProjectCaseStudies, getProjectCaseStudyBySlug } from '@/lib/projects';
import { buildProjectMetadata } from '@/lib/seo';

test('project case studies have matching localized slugs', () => {
  const french = getProjectCaseStudies('fr');
  const english = getProjectCaseStudies('en');

  assert.deepEqual(french.map(({ slug }) => slug), ['prismasec']);
  assert.deepEqual(english.map(({ slug }) => slug), ['prismasec']);
  assert.equal(french[0]?.role, 'Fondateur, CEO & Lead Engineer');
  assert.equal(english[0]?.role, 'Founder, CEO & Lead Engineer');
});

test('project lookup rejects missing and unsafe slugs', () => {
  assert.equal(getProjectCaseStudyBySlug('fr', 'missing'), null);
  assert.equal(getProjectCaseStudyBySlug('fr', '../prismasec'), null);
  assert.ok(getProjectCaseStudyBySlug('fr', 'prismasec'));
});

test('project metadata and sitemap expose bilingual canonical routes', () => {
  const project = getProjectCaseStudyBySlug('en', 'prismasec')!;
  const metadata = buildProjectMetadata({ locale: 'en', project });
  const entries = sitemap();
  const french = entries.find(({ url }) => url === 'https://rstride.fr/projects/prismasec');
  const english = entries.find(({ url }) => url === 'https://rstride.fr/en/projects/prismasec');

  assert.equal(metadata.alternates?.canonical, 'https://rstride.fr/en/projects/prismasec');
  assert.equal(metadata.alternates?.languages?.fr, 'https://rstride.fr/projects/prismasec');
  assert.match(JSON.stringify(metadata.openGraph), /\/projects\/prismasec-og\.png/);
  assert.equal(french?.alternates?.languages?.en, 'https://rstride.fr/en/projects/prismasec');
  assert.equal(english?.alternates?.languages?.fr, 'https://rstride.fr/projects/prismasec');
});
