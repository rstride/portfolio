import { getSortedPostsData } from "@/lib/posts";
import { Metadata } from "next";
import { BlogShowcase } from "@/components/blog/blog-showcase";

export const metadata: Metadata = {
    title: "Blog",
    description: "Articles de cybersécurité sur le pentest web/API, l'audit sécurité, la remédiation et la sécurisation des applications.",
    alternates: {
        canonical: "/blog",
    },
    openGraph: {
        title: "Blog cybersécurité | Romain Stride",
        description: "Guides concrets, retours terrain et analyses sur le pentest, l'audit sécurité et la sécurisation des applications.",
        url: "/blog",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Blog cybersécurité | Romain Stride",
        description: "Guides concrets, retours terrain et analyses sur le pentest, l'audit sécurité et la sécurisation des applications.",
    },
};

export default function BlogPage() {
    const allPostsData = getSortedPostsData();

    return (
        <div className="pt-6 md:pt-8">
            <BlogShowcase posts={allPostsData} />
        </div>
    );
}
