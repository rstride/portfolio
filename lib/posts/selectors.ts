import {
  isPublished,
  readPostBySlug,
  readPublishedPostFiles,
} from "@/lib/posts/repository";
import { renderMarkdownToHtml } from "@/lib/posts/render";
import { toPostData } from "@/lib/posts/transform";
import type { PostData } from "@/lib/posts/types";

function comparePostDatesDesc(left: Pick<PostData, "date">, right: Pick<PostData, "date">): number {
  if (left.date === right.date) {
    return 0;
  }

  return left.date < right.date ? 1 : -1;
}

function getSharedTagCount(currentPost: PostData, candidate: PostData): number {
  return candidate.tags?.filter((tag) => currentPost.tags?.includes(tag)).length ?? 0;
}

export function getSortedPostsData(): PostData[] {
  return readPublishedPostFiles().map(toPostData).sort(comparePostDatesDesc);
}

export function getAllPostSlugs() {
  return readPublishedPostFiles().map((postFile) => ({
    params: {
      slug: postFile.slug,
    },
  }));
}

export function getRelatedPosts(slug: string, limit = 3): PostData[] {
  const posts = getSortedPostsData();
  const currentPost = posts.find((post) => post.slug === slug);

  if (!currentPost) {
    return [];
  }

  return posts
    .filter((post) => post.slug !== slug)
    .map((post) => ({
      post,
      score: getSharedTagCount(currentPost, post),
    }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => {
      if (right.score === left.score) {
        return comparePostDatesDesc(left.post, right.post);
      }

      return right.score - left.score;
    })
    .slice(0, limit)
    .map(({ post }) => post);
}

export async function getPostData(slug: string): Promise<PostData | null> {
  const postFile = readPostBySlug(slug);

  if (!postFile || !isPublished(postFile.frontmatter)) {
    return null;
  }

  return {
    ...toPostData(postFile),
    contentHtml: await renderMarkdownToHtml(postFile.content),
  };
}
