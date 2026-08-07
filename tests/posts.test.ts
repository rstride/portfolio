import fs from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";

import matter from "gray-matter";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { BlogList } from "@/components/blog-list";
import {
  getBlogPostBySlug,
  getBlogPosts,
  markdownToHtml,
  normalizeBlogPost,
  normalizeExcerpt,
} from "@/lib/markdown";
import { GET as frFeedGet } from "@/app/feed.xml/route";
import { GET as enFeedGet } from "@/app/(en)/en/feed.xml/route";

test("getBlogPosts returns the published article in both locales", () => {
  const frPosts = getBlogPosts("fr");
  const enPosts = getBlogPosts("en");

  assert.ok(frPosts.length > 0);
  assert.ok(enPosts.length > 0);
  assert.ok(frPosts.some(p => p.slug === "expressway"));
  assert.ok(enPosts.some(p => p.slug === "expressway"));
});

test("getBlogPostBySlug resolves the shared article in both locales", () => {
  const frPost = getBlogPostBySlug("expressway", "fr");
  const enPost = getBlogPostBySlug("expressway", "en");

  assert.ok(frPost);
  assert.ok(enPost);
  assert.equal(frPost?.slug, "expressway");
  assert.equal(enPost?.slug, "expressway");
});

test("post normalization strips Markdown from excerpts and hides drafts", () => {
  assert.equal(
    normalizeExcerpt("A **bold** `excerpt` with [a link](https://example.test)."),
    "A bold excerpt with a link.",
  );

  assert.equal(
    normalizeBlogPost("draft", "## Draft", {
      id: "DRAFT-001",
      title: "Draft",
      excerpt: "This draft must remain private.",
      date: "2026-01-01",
      tags: ["DRAFT"],
      icon: "FileText",
      author: "0x7CC",
      published: false,
    }),
    null,
  );
});

test("published posts follow the shared content contract", () => {
  const postsByLocale = new Map<string, string[]>();

  for (const locale of ["fr", "en"] as const) {
    const directory = path.join(process.cwd(), "content", "blog", locale);
    const files = fs.readdirSync(directory, { recursive: true })
      .filter((entry): entry is string => typeof entry === "string" && entry.endsWith(".md"));

    const slugs: string[] = [];
    for (const relativeFile of files) {
      const fullPath = path.join(directory, relativeFile);
      const parsed = matter(fs.readFileSync(fullPath, "utf8"));
      const metadata = parsed.data as Record<string, unknown>;
      const slug = path.basename(relativeFile, ".md");

      if (metadata.published === false) continue;
      slugs.push(slug);

      for (const field of ["id", "title", "excerpt", "date", "tags", "difficulty", "icon", "author"]) {
        assert.ok(metadata[field], `${fullPath} is missing ${field}`);
      }

      assert.match(String(metadata.date), /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(Number.isFinite(Date.parse(String(metadata.date))), `${fullPath} has an invalid date`);
      assert.ok(Array.isArray(metadata.tags) && metadata.tags.length > 0, `${fullPath} needs tags`);
      assert.ok(String(metadata.excerpt).length >= 80, `${fullPath} needs a descriptive excerpt`);
      assert.notEqual(metadata.excerpt, "Offensive security write-up.");
      assert.equal(normalizeExcerpt(String(metadata.excerpt)), String(metadata.excerpt));

      let isFencedCode = false;
      for (const line of parsed.content.split("\n")) {
        if (/^\s*(```|~~~)/.test(line)) isFencedCode = !isFencedCode;
        if (!isFencedCode) assert.doesNotMatch(line, /^# /, `${fullPath} must not contain a body H1`);
      }
    }

    postsByLocale.set(locale, slugs.sort());
  }

  assert.deepEqual(postsByLocale.get("fr"), postsByLocale.get("en"));
});

test("the archive search and filter controls expose accessible state", () => {
  const markup = renderToStaticMarkup(createElement(BlogList, {
    posts: getBlogPosts("fr"),
    locale: "fr",
  }));

  assert.match(markup, /<label[^>]*for="blog-search-fr"/);
  assert.match(markup, /id="blog-search-fr"/);
  assert.match(markup, /type="button"/);
  assert.match(markup, /aria-pressed="false"/);
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
  assert.doesNotMatch(frXml, /\*\*/);

  const enResponse = await enFeedGet();
  const enXml = await enResponse.text();
  assert.match(enXml, /<language>en<\/language>/);
  assert.match(enXml, /https:\/\/rstride\.fr\/en\/blog\/expressway/);
  assert.doesNotMatch(enXml, /Offensive security write-up\./);
});
