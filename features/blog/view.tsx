import { BlogShowcase } from "@/features/blog/components/blog-showcase";
import type { PostData } from "@/features/blog/server";

export function BlogView({ posts }: { posts: PostData[] }) {
  return (
    <div className="pt-6 md:pt-8">
      <BlogShowcase posts={posts} />
    </div>
  );
}
