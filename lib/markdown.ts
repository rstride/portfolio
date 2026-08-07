import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';

export const contentDirectory = path.join('content', 'blog');

export interface BlogPostMeta {
  id: string;
  title: string;
  excerpt: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  ogImageAlt?: string;
  date: string;
  updated?: string;
  tags: string[];
  category?: string;
  platform?: string;
  target_os?: string;
  severity?: string;
  difficulty?: string;
  icon: string;
  author: string;
  published?: boolean;
  slug: string;
  content?: string;
}

interface LoadedBlogPost extends BlogPostMeta {
  content: string;
}

type BlogPostFrontmatter = Omit<BlogPostMeta, 'slug' | 'content'>;

export function normalizeExcerpt(excerpt: string): string {
  return excerpt
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isPublished(post: Pick<BlogPostFrontmatter, 'published'>): boolean {
  return post.published !== false;
}

export function normalizeBlogPost(
  slug: string,
  content: string,
  frontmatter: BlogPostFrontmatter,
): LoadedBlogPost | null {
  if (!isPublished(frontmatter)) {
    return null;
  }

  return {
    ...frontmatter,
    excerpt: normalizeExcerpt(frontmatter.excerpt),
    slug,
    content,
  };
}

export async function markdownToHtml(markdown: string) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      theme: 'aurora-x',
      keepBackground: true,
    })
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(markdown);
  return result.toString();
}

export function getBlogPosts(locale: 'fr' | 'en'): BlogPostMeta[] {
  const localeDir = path.join(contentDirectory, locale);
  
  if (!fs.existsSync(localeDir)) {
    return [];
  }
  // Recursively find all .md files under the locale directory
  function gatherFiles(dir: string): string[] {
    const results: string[] = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) results.push(...gatherFiles(full));
      else if (entry.isFile() && entry.name.endsWith('.md')) results.push(full);
    }
    return results;
  }

  const files = gatherFiles(localeDir);
  const allPostsData = files.map(fullPath => {
    const fileName = path.basename(fullPath);
    const slug = fileName.replace(/\.md$/, '');
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    return normalizeBlogPost(
      slug,
      matterResult.content,
      matterResult.data as BlogPostFrontmatter,
    );
  });

  const visiblePosts = allPostsData.filter((post): post is LoadedBlogPost => post !== null);

  function parseDateValue(d: any) {
    if (!d) return -Infinity;
    const v = Date.parse(String(d));
    return Number.isFinite(v) ? v : -Infinity;
  }

  return visiblePosts.sort((a, b) => {
    const ta = parseDateValue(a.date);
    const tb = parseDateValue(b.date);
    return tb - ta; // descending
  });
}

export function getBlogPostBySlug(slug: string, locale: 'fr' | 'en') {
  const localeDir = path.join(contentDirectory, locale);
  if (!fs.existsSync(localeDir)) return null;

  // search recursively for the slug file
  function findFile(dir: string): string | null {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const found = findFile(full);
        if (found) return found;
      } else if (entry.isFile() && entry.name === `${slug}.md`) {
        return full;
      }
    }
    return null;
  }

  const fullPath = findFile(localeDir);
  if (!fullPath) return null;

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const post = normalizeBlogPost(
    slug,
    matterResult.content,
    matterResult.data as BlogPostFrontmatter,
  );

  if (!post) return null;

  const { slug: postSlug, content, ...meta } = post;
  return { slug: postSlug, meta, content };
}
