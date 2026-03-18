import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@/content/site";
import { ServiceDetailView } from "@/features/services/detail-view";
import { getServiceContent } from "@/features/services/model";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const content = getServiceContent(slug);

  if (!content) {
    return {
      title: "Service introuvable",
    };
  }

  return {
    title: `${content.service.title} | ${site.name}`,
    description: content.service.description,
  };
}

export function generateStaticParams() {
  return site.services.map((service) => ({
    slug: service.slug,
  }));
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const content = getServiceContent(slug);

  if (!content) {
    notFound();
  }

  return <ServiceDetailView slug={slug} />;
}
