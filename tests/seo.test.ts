import test from "node:test";
import assert from "node:assert/strict";

import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { metadata as frPrivacyMetadata } from "@/app/(fr)/privacy/page";
import { getBlogPosts } from "@/lib/markdown";
import { absoluteUrl, defaultOgImage, getPostSeo } from "@/lib/seo";

test("sitemap excludes low-value privacy pages", () => {
  const urls = sitemap().map((entry) => entry.url);

  assert.ok(!urls.includes("https://rstride.fr/privacy"));
  assert.ok(!urls.includes("https://rstride.fr/en/privacy"));
});

test("sitemap entries include bilingual hreflang alternates", () => {
  const entries = sitemap();
  const frServices = entries.find((entry) => entry.url === "https://rstride.fr/services");
  const enServices = entries.find((entry) => entry.url === "https://rstride.fr/en/services");
  const frPost = entries.find((entry) => entry.url === "https://rstride.fr/blog/expressway");

  assert.equal(frServices?.alternates?.languages?.fr, "https://rstride.fr/services");
  assert.equal(frServices?.alternates?.languages?.en, "https://rstride.fr/en/services");
  assert.equal(frServices?.alternates?.languages?.["x-default"], "https://rstride.fr/services");
  assert.equal(enServices?.alternates?.languages?.fr, "https://rstride.fr/services");
  assert.equal(enServices?.alternates?.languages?.en, "https://rstride.fr/en/services");
  assert.equal(frPost?.alternates?.languages?.en, "https://rstride.fr/en/blog/expressway");
});

test("robots exposes canonical host and sitemap while blocking API routes", () => {
  const config = robots();

  assert.equal(config.host, "https://rstride.fr");
  assert.equal(config.sitemap, "https://rstride.fr/sitemap.xml");
  assert.deepEqual(config.rules, {
    userAgent: "*",
    allow: "/",
    disallow: ["/api/"],
  });
});

test("privacy metadata is noindex follow", () => {
  assert.deepEqual(frPrivacyMetadata.robots, {
    index: false,
    follow: true,
  });
});

test("blog SEO falls back to title excerpt and default OG image", () => {
  const [post] = getBlogPosts("en");
  const seo = getPostSeo(post);

  assert.equal(seo.title, post.title);
  assert.equal(seo.description, post.excerpt);
  assert.equal(seo.image, defaultOgImage);
  assert.equal(absoluteUrl("en", `/blog/${post.slug}`), "https://rstride.fr/en/blog/expressway");
});
