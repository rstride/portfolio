import type { Metadata } from "next";

import {
  BlogPostPageView,
  buildBlogPostMetadata,
  getBlogPostStaticParams,
} from "@/features/blog/post-page";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return buildBlogPostMetadata(slug);
}

export async function generateStaticParams() {
  return getBlogPostStaticParams();
}

export default async function Post({ params }: Props) {
  const { slug } = await params;
  return <BlogPostPageView slug={slug} />;
}
