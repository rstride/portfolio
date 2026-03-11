import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'content/posts');

type PostFrontmatter = {
    title: string;
    date: string;
    excerpt: string;
    coverImage?: string;
    tags?: string[];
    draft?: boolean;
};

export type PostData = {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    coverImage?: string;
    tags?: string[];
    contentHtml?: string;
};

function isPublishableFile(fileName: string) {
    return fileName.endsWith('.md') && !fileName.includes(' copy');
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

export function getSortedPostsData(): PostData[] {
    const allPostsData = listPostFiles().flatMap((fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);
        const frontmatter = matterResult.data as PostFrontmatter;

        if (!isPublished(frontmatter)) {
            return [];
        }

        return [{
            slug,
            tags: frontmatter.tags || [],
            ...frontmatter,
        }];
    });

    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

export function getAllPostSlugs() {
    return listPostFiles().flatMap((fileName) => {
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);
        const frontmatter = matterResult.data as PostFrontmatter;
        if (!isPublished(frontmatter)) {
            return [];
        }

        return {
            params: {
                slug: fileName.replace(/\.md$/, ''),
            },
        };
    });
}

export async function getPostData(slug: string): Promise<PostData | null> {
    const fullPath = path.join(postsDirectory, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const matterResult = matter(fileContents);
    const frontmatter = matterResult.data as PostFrontmatter;
    if (!isPublished(frontmatter)) {
        return null;
    }

    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
    const contentHtml = processedContent.toString();

    return {
        slug,
        contentHtml,
        tags: frontmatter.tags || [],
        ...frontmatter,
    };
}
