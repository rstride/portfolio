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

const contentDirectory = path.join(process.cwd(), 'content/blog');

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
  severity: string;
  difficulty?: string;
  icon: string;
  author: string;
  slug: string;
  content?: string;
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

    return {
      slug,
      content: matterResult.content,
      ...(matterResult.data as Omit<BlogPostMeta, 'slug' | 'content'>),
      // preserve raw published flag if present
      published: (matterResult.data as any).published
    };
  });

  // Exclude drafts explicitly marked as unpublished
  const visiblePosts = allPostsData.filter(p => (p as any).published !== false);

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

  return {
    slug,
    meta: matterResult.data as Omit<BlogPostMeta, 'slug'>,
    content: matterResult.content
  };
}
