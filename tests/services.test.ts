import test from "node:test";
import assert from "node:assert/strict";

import sitemap from "@/app/sitemap";

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
