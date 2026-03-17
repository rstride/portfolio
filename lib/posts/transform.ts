import type { ParsedPostFile, PostData, PostFrontmatter } from "@/lib/posts/types";

const WORDS_PER_MINUTE = 220;
const EXCERPT_MAX_LENGTH = 180;
const DEFAULT_EXCERPT =
  "Article sur la cybersécurité, le pentest et la sécurisation des applications.";

export function stripMarkdown(source: string): string {
  return source
    .replace(/^---[\s\S]*?---/, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/[>*_~]/g, " ")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateExcerpt(content: string): string {
  const excerpt = content.slice(0, EXCERPT_MAX_LENGTH).trimEnd();
  return `${excerpt}${content.length > EXCERPT_MAX_LENGTH ? "..." : ""}`;
}

export function getExcerpt(frontmatter: PostFrontmatter, rawContent: string): string {
  const explicitExcerpt = frontmatter.excerpt?.trim();
  if (explicitExcerpt) {
    return explicitExcerpt;
  }

  const cleanedContent = stripMarkdown(rawContent);
  if (!cleanedContent) {
    return DEFAULT_EXCERPT;
  }

  return truncateExcerpt(cleanedContent);
}

export function getReadingTime(rawContent: string): number {
  const wordCount = stripMarkdown(rawContent).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

export function toPostData({ slug, frontmatter, content }: ParsedPostFile): PostData {
  return {
    slug,
    title: frontmatter.title,
    date: frontmatter.date,
    excerpt: getExcerpt(frontmatter, content),
    coverImage: frontmatter.coverImage,
    tags: frontmatter.tags || [],
    updatedDate: frontmatter.updatedDate,
    category: frontmatter.category,
    readingTime: getReadingTime(content),
  };
}
