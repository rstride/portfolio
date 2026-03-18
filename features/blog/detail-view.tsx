import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArrowLeft } from "lucide-react";

import { site } from "@/content/site";
import {
  getAllPostSlugs,
  getPostData,
  getRelatedPosts,
  getSortedPostsData,
} from "@/features/blog/server";
import { PostAuthorCard } from "@/features/blog/components/post-author-card";
import { PostHeader } from "@/features/blog/components/post-header";
import { RelatedPosts } from "@/features/blog/components/related-posts";
import { BackgroundEffects } from "@/shared/components/background-effects";
import { CtaBand } from "@/shared/components/cta-band";

type BlogPostDetailViewProps = {
  slug: string;
};

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://rstride.fr";
}

function getPostImageUrl(coverImage?: string) {
  const baseUrl = getBaseUrl();
  return coverImage ? `${baseUrl}${coverImage}` : `${baseUrl}/romain.png`;
}

export async function buildBlogPostMetadata(slug: string): Promise<Metadata> {
  const post = await getPostData(slug);

  if (!post) {
    return { title: "Article non trouve" };
  }

  const baseUrl = getBaseUrl();
  const postUrl = `${baseUrl}/blog/${slug}`;
  const imageUrl = getPostImageUrl(post.coverImage);

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: postUrl,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updatedDate || post.date,
      tags: post.tags,
      images: [{ url: imageUrl, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    },
  };
}

export function getBlogPostStaticParams() {
  return getAllPostSlugs().map((path) => ({
    slug: path.params.slug,
  }));
}

export async function BlogPostDetailView({ slug }: BlogPostDetailViewProps) {
  const post = await getPostData(slug);

  if (!post) {
    notFound();
  }

  const baseUrl = getBaseUrl();
  const postUrl = `${baseUrl}/blog/${slug}`;
  const imageUrl = getPostImageUrl(post.coverImage);
  const relatedPosts = getRelatedPosts(slug, 3);
  const fallbackPosts = getSortedPostsData().filter((entry) => entry.slug !== slug).slice(0, 3);
  const suggestedPosts = relatedPosts.length > 0 ? relatedPosts : fallbackPosts;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: [imageUrl],
    datePublished: post.date,
    dateModified: post.updatedDate || post.date,
    mainEntityOfPage: postUrl,
    keywords: post.tags?.join(", "),
    author: {
      "@type": "Person",
      name: site.name,
      jobTitle: site.role,
      url: baseUrl,
      image: `${baseUrl}/romain.png`,
    },
    publisher: {
      "@type": "Organization",
      name: site.company.name,
      url: "https://prismasec.fr",
    },
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundEffects variant="section" intensity="medium" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="relative z-10 px-4 pb-20 pt-6 sm:px-6 md:pt-10 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="section-editorial px-6 py-8 sm:px-8 lg:px-12 lg:py-12">
            <Link
              href="/blog"
              className="relative z-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Retour au blog
            </Link>

            <PostHeader post={post} />

            <div className="prose prose-lg relative z-10 mt-10 max-w-none prose-headings:scroll-mt-20 prose-headings:font-semibold prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: post.contentHtml || "" }} />
            </div>

            <div className="relative z-10 mt-14">
              <CtaBand cta={site.pageCtas.blog} />
            </div>

            <PostAuthorCard />
            <RelatedPosts posts={suggestedPosts} hasRelatedPosts={relatedPosts.length > 0} />
          </div>
        </div>
      </article>
    </div>
  );
}
