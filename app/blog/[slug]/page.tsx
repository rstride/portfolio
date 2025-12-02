import { getAllPostSlugs, getPostData } from "@/lib/posts";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

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
        <article className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <Link
                    href="/blog"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Retour au blog
                </Link>

                <header className="mb-12">
                    <div className="text-sm text-muted-foreground mb-4">
                        {new Date(postData.date).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
                        {postData.title}
                    </h1>
                    {postData.coverImage && (
                        <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted mt-8">
                            {/* In a real app, use next/image here */}
                            <div
                                className="w-full h-full bg-cover bg-center"
                                style={{ backgroundImage: `url(${postData.coverImage})` }}
                            />
                        </div>
                    )}
                </header>

                <div
                    className="prose prose-lg dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: postData.contentHtml || '' }}
                />
            </div>
        </article>
    );
}
