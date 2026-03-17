import test from "node:test";
import assert from "node:assert/strict";

import { serviceNavigation, services } from "@/content/site/services";
import { getServiceContent } from "@/lib/service-details";

test("service navigation is derived from services", () => {
  assert.equal(serviceNavigation.length, services.length);
  assert.equal(serviceNavigation[0]?.href, `/services/${services[0]?.slug}`);
});

test("getServiceContent returns service details for known slugs", () => {
  const content = getServiceContent("pentest");
  assert.ok(content);
  assert.equal(content?.service.slug, "pentest");
  assert.ok(content?.paragraphs.length);
});

test("getServiceContent returns null for unknown slugs", () => {
  assert.equal(getServiceContent("unknown"), null);
});
