import fs from "fs";
import path from "path";

import matter from "gray-matter";

import type { ParsedPostFile, PostFrontmatter } from "@/features/blog/server/types";

const POSTS_DIRECTORY = path.join(process.cwd(), "content/posts");
const MARKDOWN_EXTENSION = ".md";
const COPIED_DRAFT_MARKER = " copy";

function parsePostFile(filePath: string, slug: string): ParsedPostFile {
  const fileContents = fs.readFileSync(filePath, "utf8");
  const matterResult = matter(fileContents);

  return {
    slug,
    frontmatter: matterResult.data as PostFrontmatter,
    content: matterResult.content,
  };
}

export function isPublishableFile(fileName: string): boolean {
  return fileName.endsWith(MARKDOWN_EXTENSION) && !fileName.includes(COPIED_DRAFT_MARKER);
}

export function fileNameToSlug(fileName: string): string {
  return fileName.replace(/\.md$/, "");
}

export function listPostFiles(): string[] {
  if (!fs.existsSync(POSTS_DIRECTORY)) {
    return [];
  }

  return fs.readdirSync(POSTS_DIRECTORY).filter(isPublishableFile);
}

export function getPostFilePath(slug: string): string {
  return path.join(POSTS_DIRECTORY, `${slug}${MARKDOWN_EXTENSION}`);
}

export function isPublished(frontmatter: PostFrontmatter): boolean {
  if (frontmatter.draft) {
    return false;
  }

  const publishedAt = new Date(frontmatter.date);
  if (Number.isNaN(publishedAt.getTime())) {
    return true;
  }

  return publishedAt <= new Date();
}

export function readPostFile(fileName: string): ParsedPostFile {
  const slug = fileNameToSlug(fileName);
  return parsePostFile(path.join(POSTS_DIRECTORY, fileName), slug);
}

export function readPublishedPostFiles(): ParsedPostFile[] {
  return listPostFiles().map(readPostFile).filter((postFile) => isPublished(postFile.frontmatter));
}

export function readPostBySlug(slug: string): ParsedPostFile | null {
  const fullPath = getPostFilePath(slug);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  return parsePostFile(fullPath, slug);
}
