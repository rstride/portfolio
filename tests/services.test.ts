import test from "node:test";
import assert from "node:assert/strict";

import sitemap from "@/app/sitemap";
import { getContactServiceOption, contactServiceOptions } from "@/features/contact/schema";
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


test("every localized audit and training offer preselects a valid contact option", () => {
  for (const locale of ["fr", "en"] as const) {
    const offers = [...servicesContent[locale].audits, ...servicesContent[locale].training];
    assert.equal(new Set(offers.map((offer) => offer.slug)).size, 7);
    for (const offer of offers) {
      const option = getContactServiceOption(offer.slug, locale);
      assert.ok(option, `${locale}: missing contact mapping for ${offer.slug}`);
      assert.ok(contactServiceOptions[locale].includes(option));
    }
    assert.deepEqual(servicesContent[locale].training.map((offer) => offer.slug), [
      "security-awareness", "technical-operator-track", "ctf-simulation-cell",
    ]);
  }
});
