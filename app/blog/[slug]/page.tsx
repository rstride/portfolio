import Image from "next/image";
import { getAllPostSlugs, getPostData, getRelatedPosts, getSortedPostsData } from "@/lib/posts";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock3, ShieldCheck, SquareArrowOutUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BackgroundEffects } from "@/components/background-effects";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { site } from "@/content/site";

type Props = {
    params: Promise<{ slug: string }>;
};

const secondaryButtonClass =
    "inline-flex h-9 items-center justify-center gap-2 rounded-full border border-border/60 bg-background px-4 text-sm font-medium transition hover:bg-muted/50";

const ghostButtonClass =
    "inline-flex h-9 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium transition hover:bg-muted/50";

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
        <div className="min-h-screen relative overflow-hidden">
            <BackgroundEffects variant="section" intensity="low" />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <article className="relative z-10 px-4 pb-20 pt-10 sm:px-6 md:pt-32 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors group"
                    >
                        <ArrowLeft className="mr-2 size-4 transition-transform group-hover:-translate-x-1" />
                        Retour au blog
                    </Link>

                    <header className="mb-12">
                        <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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

                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            {postData.title}
                        </h1>

                        <div className="flex flex-wrap gap-2 mb-8">
                            {postData.tags && postData.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="px-3 py-1 text-xs">
                                    {tag}
                                </Badge>
                            ))}
                        </div>

                        {postData.coverImage && (
                            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-muted shadow-2xl shadow-primary/5 group">
                                <Image
                                    src={postData.coverImage}
                                    alt={postData.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(min-width: 1024px) 768px, 100vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
                            </div>
                        )}
                    </header>

                    <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
                        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml || "" }} />
                    </div>

                    <div className="mt-16">
                        <Card className="border border-border/60 bg-background/80 backdrop-blur-sm">
                            <CardHeader>
                                <Badge variant="secondary" className="mb-3 w-fit">
                                    Auteur
                                </Badge>
                                <div className="flex items-start gap-4">
                                    <div className="relative size-16 overflow-hidden rounded-2xl border border-border/60">
                                        <Image src="/romain.png" alt={site.name} fill className="object-cover" sizes="64px" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{site.name}</CardTitle>
                                        <CardDescription className="mt-1">{site.role}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <p className="text-sm text-muted-foreground">
                                    {site.about.bio}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {site.proofs.slice(0, 3).map((proof) => (
                                        <Badge key={proof.title} variant="secondary">
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
                                            className={ghostButtonClass}
                                        >
                                            LinkedIn
                                            <SquareArrowOutUpRight className="size-4" />
                                        </Link>
                                    </div>
                                ) : null}
                            </CardContent>
                        </Card>
                    </div>

                    <section className="mt-16 border-t border-border pt-8">
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
                            <Link href="/blog" className={secondaryButtonClass}>
                                Tous les articles
                            </Link>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            {suggestedPosts.map((post) => (
                                <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                                    <Card className="h-full border border-border/60 bg-background/70 transition-colors group-hover:border-primary/30">
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
                                                    <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0.5">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <span className="text-sm font-medium text-primary">Lire</span>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            </article>
        </div>
    );
}
