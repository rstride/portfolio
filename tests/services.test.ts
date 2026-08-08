import test from "node:test";
import assert from "node:assert/strict";

import sitemap from "@/app/sitemap";
import { servicesContent } from "@/features/services/services-content";

test("sitemap does not include removed about routes", () => {
  const urls = sitemap().map((entry) => entry.url);

  assert.ok(!urls.includes("https://rstride.fr/about"));
  assert.ok(!urls.includes("https://rstride.fr/en/about"));
});

test("sitemap includes current localized static routes", () => {
  const urls = sitemap().map((entry) => entry.url);

  assert.ok(urls.includes("https://rstride.fr"));
  assert.ok(urls.includes("https://rstride.fr/services"));
  assert.ok(urls.includes("https://rstride.fr/contact"));
  assert.ok(urls.includes("https://rstride.fr/blog"));
  assert.ok(urls.includes("https://rstride.fr/en"));
  assert.ok(urls.includes("https://rstride.fr/en/services"));
  assert.ok(urls.includes("https://rstride.fr/en/contact"));
  assert.ok(urls.includes("https://rstride.fr/en/blog"));
});

test("services content has matching localized audit offers and valid contact slugs", () => {
  const frenchSlugs = servicesContent.fr.audits.map((service) => service.slug);
  const englishSlugs = servicesContent.en.audits.map((service) => service.slug);

  assert.deepEqual(frenchSlugs, [
    "web-application-pentest",
    "api-security-assessment",
    "cloud-devsecops",
    "internal-infrastructure",
  ]);
  assert.deepEqual(englishSlugs, frenchSlugs);
  assert.ok(servicesContent.fr.audits.every((service) => service.title.length > 0));
  assert.ok(servicesContent.en.audits.every((service) => service.title.length > 0));
});
