import type { Metadata } from "next";

import {
  BlogPostDetailView,
  buildBlogPostMetadata,
  getBlogPostStaticParams,
} from "@/features/blog/detail-view";

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
  return <BlogPostDetailView slug={slug} />;
}
