import { getAllPostSlugs, getPostData } from "@/lib/posts";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Share2, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BackgroundEffects } from "@/components/background-effects";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const postData = await getPostData(slug);

    if (!postData) {
        return {
            title: 'Article non trouvé | Romain Stride',
        };
    }

    return {
        title: `${postData.title} | Romain Stride`,
        description: postData.excerpt,
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

    return (
        <div className="min-h-screen relative overflow-hidden">
            <BackgroundEffects variant="section" intensity="low" />

            <article className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Retour au blog
                    </Link>

                    <header className="mb-12">
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <time dateTime={postData.date}>
                                    {new Date(postData.date).toLocaleDateString('fr-FR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </time>
                            </div>
                            {/* Placeholder for reading time if available in future */}
                            {/* <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>5 min de lecture</span>
                            </div> */}
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
                            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-muted shadow-2xl shadow-primary/5 relative group">
                                <div
                                    className="w-full h-full bg-cover bg-center transform transition-transform duration-700 group-hover:scale-105"
                                    style={{ backgroundImage: `url(${postData.coverImage})` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
                            </div>
                        )}
                    </header>

                    <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
                        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml || '' }} />
                    </div>

                    <div className="mt-16 pt-8 border-t border-border flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                            Partager cet article
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-colors">
                                <Share2 className="w-4 h-4" />
                            </Button>
                            {/* Add more share buttons as needed */}
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
}
