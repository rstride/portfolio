import test from "node:test";
import assert from "node:assert/strict";

import { getBlogPostBySlug, getBlogPosts, markdownToHtml } from "@/lib/markdown";

test("getBlogPosts returns the published article in both locales", () => {
  const frPosts = getBlogPosts("fr");
  const enPosts = getBlogPosts("en");

  assert.ok(frPosts.length > 0);
  assert.ok(enPosts.length > 0);
  assert.equal(frPosts[0]?.slug, "sqli-modern-api");
  assert.equal(enPosts[0]?.slug, "sqli-modern-api");
});

test("getBlogPostBySlug resolves the shared article in both locales", () => {
  const frPost = getBlogPostBySlug("sqli-modern-api", "fr");
  const enPost = getBlogPostBySlug("sqli-modern-api", "en");

  assert.ok(frPost);
  assert.ok(enPost);
  assert.equal(frPost?.slug, "sqli-modern-api");
  assert.equal(enPost?.slug, "sqli-modern-api");
});

test("markdownToHtml renders fenced code blocks", async () => {
  const html = await markdownToHtml("```js\nconst answer = 42;\n```");

  assert.match(html, /<pre/);
  assert.match(html, /answer/);
});
