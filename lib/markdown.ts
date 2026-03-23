import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeStringify from 'rehype-stringify';

const contentDirectory = path.join(process.cwd(), 'content/blog');

export interface BlogPostMeta {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  severity: string;
  icon: string;
  author: string;
  slug: string;
  content?: string;
}

export async function markdownToHtml(markdown: string) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      theme: 'aurora-x',
      keepBackground: true,
    })
    .use(rehypeStringify)
    .process(markdown);
  return result.toString();
}

export function getBlogPosts(locale: 'fr' | 'en'): BlogPostMeta[] {
  const localeDir = path.join(contentDirectory, locale);
  
  if (!fs.existsSync(localeDir)) {
    return [];
  }

  const fileNames = fs.readdirSync(localeDir);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(localeDir, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      return {
        slug,
        content: matterResult.content,
        ...(matterResult.data as Omit<BlogPostMeta, 'slug' | 'content'>)
      };
    });

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getBlogPostBySlug(slug: string, locale: 'fr' | 'en') {
  const fullPath = path.join(contentDirectory, locale, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  return {
    slug,
    meta: matterResult.data as Omit<BlogPostMeta, 'slug'>,
    content: matterResult.content
  };
}
