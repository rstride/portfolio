import test from "node:test";
import assert from "node:assert/strict";

import { getBlogPostBySlug, getBlogPosts, markdownToHtml } from "@/lib/markdown";
import { GET as frFeedGet } from "@/app/feed.xml/route";
import { GET as enFeedGet } from "@/app/(en)/en/feed.xml/route";

test("getBlogPosts returns the published article in both locales", () => {
  const frPosts = getBlogPosts("fr");
  const enPosts = getBlogPosts("en");

  assert.ok(frPosts.length > 0);
  assert.ok(enPosts.length > 0);
  assert.equal(frPosts[0]?.slug, "expressway");
  assert.equal(enPosts[0]?.slug, "expressway");
});

test("getBlogPostBySlug resolves the shared article in both locales", () => {
  const frPost = getBlogPostBySlug("expressway", "fr");
  const enPost = getBlogPostBySlug("expressway", "en");

  assert.ok(frPost);
  assert.ok(enPost);
  assert.equal(frPost?.slug, "expressway");
  assert.equal(enPost?.slug, "expressway");
});

test("markdownToHtml renders fenced code blocks", async () => {
  const html = await markdownToHtml("```js\nconst answer = 42;\n```");

  assert.match(html, /<pre/);
  assert.match(html, /answer/);
});

test("RSS feeds return valid response with correct language and links", async () => {
  const frResponse = await frFeedGet();
  const frXml = await frResponse.text();
  assert.match(frXml, /<language>fr<\/language>/);
  assert.match(frXml, /https:\/\/rstride\.fr\/blog\/expressway/);

  const enResponse = await enFeedGet();
  const enXml = await enResponse.text();
  assert.match(enXml, /<language>en<\/language>/);
  assert.match(enXml, /https:\/\/rstride\.fr\/en\/blog\/expressway/);
});
