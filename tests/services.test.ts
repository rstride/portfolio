import test from "node:test";
import assert from "node:assert/strict";

import { getServiceContent, serviceNavigation, services } from "@/features/services/model";

test("service navigation is derived from services", () => {
  assert.equal(serviceNavigation.length, services.length);
  assert.equal(serviceNavigation[0]?.href, `/services/${services[0]?.slug}`);
  assert.equal(serviceNavigation[0]?.icon, services[0]?.icon);
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
