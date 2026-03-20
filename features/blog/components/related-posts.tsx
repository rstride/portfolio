import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PostData } from "@/features/blog/server";

type RelatedPostsProps = {
  posts: PostData[];
  hasRelatedPosts: boolean;
};

function formatCompactDate(date: string) {
  return new Date(date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function RelatedPosts({ posts, hasRelatedPosts }: RelatedPostsProps) {
  return (
    <section className="relative z-10 mt-16 border-t border-border/16 pt-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-headline text-3xl font-bold uppercase tracking-[-0.04em]">
            {hasRelatedPosts ? "Articles liés" : "Continuer la lecture"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {hasRelatedPosts
              ? "Des sujets proches pour approfondir la même logique de risque ou de remédiation."
              : "Quelques articles utiles pour prolonger la lecture et préparer la suite."}
          </p>
        </div>
        <Link href="/blog" className={buttonVariants({ variant: "outline", size: "sm" })}>
          Tous les articles
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
            <Card className="archive-row h-full overflow-hidden transition-colors group-hover:border-primary/25">
              <CardHeader>
                <div className="font-label flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  <Calendar className="size-3.5" />
                  <time dateTime={post.date}>{formatCompactDate(post.date)}</time>
                </div>
                <CardTitle className="line-clamp-2 text-xl uppercase group-hover:text-primary">
                  {post.title}
                </CardTitle>
                <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {post.tags?.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="px-2 py-0.5 text-[10px]">
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
  );
}
