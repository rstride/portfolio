import { getSortedPostsData } from "@/lib/posts";
import { Metadata } from "next";
import { BlogShowcase } from "@/components/blog-showcase";

export const metadata: Metadata = {
    title: "Blog | Romain Stride",
    description: "Articles sur la cybersécurité, le pentest et le développement sécurisé.",
};

export default function BlogPage() {
    const allPostsData = getSortedPostsData();

    return (
        <div className="pt-20">
            <BlogShowcase posts={allPostsData} />
        </div>
    );
}
