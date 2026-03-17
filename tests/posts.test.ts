import test from "node:test";
import assert from "node:assert/strict";

import { fileNameToSlug, isPublishableFile, isPublished } from "@/lib/posts/repository";
import { getExcerpt, getReadingTime, stripMarkdown } from "@/lib/posts/transform";

test("isPublishableFile filters copied drafts", () => {
  assert.equal(isPublishableFile("hello.md"), true);
  assert.equal(isPublishableFile("hello copy.md"), false);
  assert.equal(isPublishableFile("hello.txt"), false);
});

test("fileNameToSlug removes the markdown extension", () => {
  assert.equal(fileNameToSlug("hello-world.md"), "hello-world");
});

test("isPublished hides draft posts", () => {
  assert.equal(isPublished({ title: "Draft", date: "2024-01-01", draft: true }), false);
  assert.equal(isPublished({ title: "Live", date: "2024-01-01" }), true);
});

test("stripMarkdown removes common formatting noise", () => {
  const input = "# Title\n\n[link](https://example.com) and `code`";
  assert.equal(stripMarkdown(input), "Title link and code");
});

test("getExcerpt prefers explicit excerpt and falls back to stripped content", () => {
  assert.equal(
    getExcerpt({ title: "A", date: "2024-01-01", excerpt: "Explicit summary" }, "ignored"),
    "Explicit summary"
  );
  assert.match(
    getExcerpt({ title: "A", date: "2024-01-01" }, "# Heading\n\nParagraph content"),
    /Heading Paragraph content/
  );
});

test("getReadingTime always returns at least one minute", () => {
  assert.equal(getReadingTime("short text"), 1);
});
