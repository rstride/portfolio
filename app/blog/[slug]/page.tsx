import Image from "next/image";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, Clock3, ShieldCheck, SquareArrowOutUpRight } from "lucide-react";

import { BackgroundEffects } from "@/components/background-effects";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { site } from "@/content/site";
import { getAllPostSlugs, getPostData, getRelatedPosts, getSortedPostsData } from "@/lib/posts";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const postData = await getPostData(slug);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rstride.fr";
  const postUrl = `${baseUrl}/blog/${slug}`;
  const imageUrl = postData?.coverImage ? `${baseUrl}${postData.coverImage}` : `${baseUrl}/romain.png`;

  if (!postData) {
    return {
      title: "Article non trouve",
    };
  }

  return {
    title: postData.title,
    description: postData.excerpt,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: postData.title,
      description: postData.excerpt,
      url: postUrl,
      type: "article",
      publishedTime: postData.date,
      modifiedTime: postData.updatedDate || postData.date,
      tags: postData.tags,
      images: [
        {
          url: imageUrl,
          alt: postData.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: postData.title,
      description: postData.excerpt,
      images: [imageUrl],
    },
  };
}

export async function generateStaticParams() {
  const paths = getAllPostSlugs();
  return paths.map((path) => ({
    slug: path.params.slug,
  }));
}

export default async function Post({ params }: Props) {
  const { slug } = await params;
  const postData = await getPostData(slug);

  if (!postData) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rstride.fr";
  const postUrl = `${baseUrl}/blog/${slug}`;
  const imageUrl = postData.coverImage ? `${baseUrl}${postData.coverImage}` : `${baseUrl}/romain.png`;
  const relatedPosts = getRelatedPosts(slug, 3);
  const fallbackPosts = getSortedPostsData()
    .filter((post) => post.slug !== slug)
    .slice(0, 3);
  const suggestedPosts = relatedPosts.length > 0 ? relatedPosts : fallbackPosts;
  const linkedIn = site.socials.find((social) => social.label === "LinkedIn");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: postData.title,
    description: postData.excerpt,
    image: [imageUrl],
    datePublished: postData.date,
    dateModified: postData.updatedDate || postData.date,
    mainEntityOfPage: postUrl,
    keywords: postData.tags?.join(", "),
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

            <header className="relative z-10 mt-8">
              <div className="mb-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4" />
                  <time dateTime={postData.date}>
                    {new Date(postData.date).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <div className="flex items-center gap-2">
                  <Clock3 className="size-4" />
                  <span>{postData.readingTime} min de lecture</span>
                </div>
                {postData.updatedDate ? (
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4" />
                    <span>
                      Mis a jour le{" "}
                      {new Date(postData.updatedDate).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                ) : null}
              </div>

              <h1 className="max-w-[13ch] text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
                {postData.title}
              </h1>

              <div className="mt-6 flex flex-wrap gap-2">
                {postData.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="brand-chip border-0 bg-transparent">
                    {tag}
                  </Badge>
                ))}
              </div>

              {postData.coverImage ? (
                <div className="surface-panel relative mt-8 aspect-video w-full overflow-hidden shadow-[0_28px_70px_rgba(25,12,45,0.16)]">
                  <Image
                    src={postData.coverImage}
                    alt={postData.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 768px, 100vw"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(25,12,45,0.18))]" />
                </div>
              ) : null}
            </header>

            <div className="prose prose-lg relative z-10 mt-10 max-w-none prose-headings:scroll-mt-20 prose-headings:font-semibold prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: postData.contentHtml || "" }} />
            </div>

            <div className="relative z-10 mt-14">
              <Card className="surface-contrast overflow-hidden">
                <CardHeader>
                  <Badge variant="secondary" className="mb-3 w-fit border-0 bg-white/10 text-white">
                    Auteur
                  </Badge>
                  <div className="flex items-start gap-4">
                    <div className="relative size-16 overflow-hidden rounded-[1.2rem] border border-white/12">
                      <Image src="/romain.png" alt={site.name} fill className="object-cover" sizes="64px" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-white">{site.name}</CardTitle>
                      <CardDescription className="mt-1 text-white/70">{site.role}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <p className="text-sm leading-relaxed text-white/76">{site.about.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {site.proofs.slice(0, 3).map((proof) => (
                      <Badge key={proof.title} variant="secondary" className="border-0 bg-white/10 text-white">
                        {proof.kpi}
                      </Badge>
                    ))}
                  </div>
                  {linkedIn ? (
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={linkedIn.href}
                        target="_blank"
                        rel="noreferrer"
                        className={cnGhostContrast()}
                      >
                        LinkedIn
                        <SquareArrowOutUpRight className="size-4" />
                      </Link>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </div>

            <section className="relative z-10 mt-16 border-t border-border/70 pt-8">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {relatedPosts.length > 0 ? "Articles lies" : "Continuer la lecture"}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {relatedPosts.length > 0
                      ? "Des sujets proches pour approfondir la meme logique de risque ou de remediation."
                      : "Quelques articles utiles pour prolonger la lecture et preparer la suite."}
                  </p>
                </div>
                <Link href="/blog" className={buttonVariants({ variant: "outline", size: "sm" })}>
                  Tous les articles
                </Link>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {suggestedPosts.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                    <Card className="surface-panel h-full overflow-hidden transition-colors group-hover:border-primary/25">
                      <CardHeader>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="size-3.5" />
                          <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString("fr-FR", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </time>
                        </div>
                        <CardTitle className="line-clamp-2 text-base group-hover:text-primary">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-3">
                          {post.excerpt}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {post.tags?.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="brand-chip border-0 bg-transparent px-2 py-0.5 text-[10px]">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground group-hover:text-primary">
                          Lire
                          <ArrowRight className="size-4" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </article>
    </div>
  );
}

function cnGhostContrast() {
  return "inline-flex h-9 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 text-sm font-medium text-white transition hover:bg-white/12";
}
