import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PostData } from "@/lib/posts";

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
    <section className="relative z-10 mt-16 border-t border-border/70 pt-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {hasRelatedPosts ? "Articles lies" : "Continuer la lecture"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {hasRelatedPosts
              ? "Des sujets proches pour approfondir la meme logique de risque ou de remediation."
              : "Quelques articles utiles pour prolonger la lecture et preparer la suite."}
          </p>
        </div>
        <Link href="/blog" className={buttonVariants({ variant: "outline", size: "sm" })}>
          Tous les articles
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
            <Card className="surface-panel h-full overflow-hidden transition-colors group-hover:border-primary/25">
              <CardHeader>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="size-3.5" />
                  <time dateTime={post.date}>{formatCompactDate(post.date)}</time>
                </div>
                <CardTitle className="line-clamp-2 text-base group-hover:text-primary">
                  {post.title}
                </CardTitle>
                <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {post.tags?.slice(0, 2).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="brand-chip border-0 bg-transparent px-2 py-0.5 text-[10px]"
                    >
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
