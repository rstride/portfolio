import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "content/posts");
const WORDS_PER_MINUTE = 220;

type PostFrontmatter = {
    title: string;
    date: string;
    excerpt?: string;
    coverImage?: string;
    tags?: string[];
    draft?: boolean;
    updatedDate?: string;
    category?: string;
};

export type PostData = {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    coverImage?: string;
    tags?: string[];
    updatedDate?: string;
    category?: string;
    readingTime: number;
    contentHtml?: string;
};

function isPublishableFile(fileName: string) {
    return fileName.endsWith(".md") && !fileName.includes(" copy");
}

function listPostFiles() {
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

    return fs.readdirSync(postsDirectory).filter(isPublishableFile);
}

function isPublished(frontmatter: PostFrontmatter) {
    if (frontmatter.draft) {
        return false;
    }

    const publishedAt = new Date(frontmatter.date);
    if (Number.isNaN(publishedAt.getTime())) {
        return true;
    }

    return publishedAt <= new Date();
}

function stripMarkdown(source: string) {
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

function getExcerpt(frontmatter: PostFrontmatter, rawContent: string) {
    const explicitExcerpt = frontmatter.excerpt?.trim();
    if (explicitExcerpt) {
        return explicitExcerpt;
    }

    const cleanedContent = stripMarkdown(rawContent);
    if (!cleanedContent) {
        return "Article sur la cybersécurité, le pentest et la sécurisation des applications.";
    }

    return cleanedContent.slice(0, 180).trimEnd() + (cleanedContent.length > 180 ? "..." : "");
}

function getReadingTime(rawContent: string) {
    const wordCount = stripMarkdown(rawContent).split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

function readPostFile(fileName: string) {
    const slug = fileName.replace(/\.md$/, "");
    const fileContents = fs.readFileSync(path.join(postsDirectory, fileName), "utf8");
    const matterResult = matter(fileContents);
    const frontmatter = matterResult.data as PostFrontmatter;

    return {
        slug,
        frontmatter,
        content: matterResult.content,
    };
}

function toPostData({
    slug,
    frontmatter,
    content,
}: {
    slug: string;
    frontmatter: PostFrontmatter;
    content: string;
}): PostData {
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

export function getSortedPostsData(): PostData[] {
    const allPostsData = listPostFiles().flatMap((fileName) => {
        const { slug, frontmatter, content } = readPostFile(fileName);

        if (!isPublished(frontmatter)) {
            return [];
        }

        return [toPostData({ slug, frontmatter, content })];
    });

    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        }

        return -1;
    });
}

export function getAllPostSlugs() {
    return listPostFiles().flatMap((fileName) => {
        const { frontmatter } = readPostFile(fileName);
        if (!isPublished(frontmatter)) {
            return [];
        }

        return {
            params: {
                slug: fileName.replace(/\.md$/, ""),
            },
        };
    });
}

export function getRelatedPosts(slug: string, limit = 3): PostData[] {
    const currentPost = getSortedPostsData().find((post) => post.slug === slug);
    if (!currentPost) {
        return [];
    }

    return getSortedPostsData()
        .filter((post) => post.slug !== slug)
        .map((post) => ({
            post,
            score: post.tags?.filter((tag) => currentPost.tags?.includes(tag)).length ?? 0,
        }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => {
            if (b.score === a.score) {
                return a.post.date < b.post.date ? 1 : -1;
            }

            return b.score - a.score;
        })
        .slice(0, limit)
        .map(({ post }) => post);
}

export async function getPostData(slug: string): Promise<PostData | null> {
    const fullPath = path.join(postsDirectory, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");

    const matterResult = matter(fileContents);
    const frontmatter = matterResult.data as PostFrontmatter;
    if (!isPublished(frontmatter)) {
        return null;
    }

    const processedContent = await remark().use(html).process(matterResult.content);
    const contentHtml = processedContent.toString();

    return {
        ...toPostData({ slug, frontmatter, content: matterResult.content }),
        contentHtml,
    };
}
