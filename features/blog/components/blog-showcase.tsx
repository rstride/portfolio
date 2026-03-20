"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { BlogCard } from "@/features/blog/components/blog-card";
import { BlogSearch } from "@/features/blog/components/blog-search";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CtaBand } from "@/shared/components/cta-band";
import { PageHeader } from "@/shared/components/page-header";
import type { PostData } from "@/features/blog/server";
import { site } from "@/content/site";
import { cn } from "@/shared/lib/utils";

export function BlogShowcase({ posts }: { posts: PostData[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string>("all");
  const featuredPost = posts[0];
  const remainingPosts = featuredPost ? posts.slice(1) : posts;

  const tags = useMemo(() => {
    const uniqueTags = new Set<string>();
    posts.forEach((post) => {
      post.tags?.forEach((tag) => uniqueTags.add(tag));
    });

    return ["all", ...Array.from(uniqueTags).sort((a, b) => a.localeCompare(b, "fr"))];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return remainingPosts.filter((post) => {
      const titleMatch = post.title.toLowerCase().includes(query);
      const excerptMatch = post.excerpt.toLowerCase().includes(query);
      const tagsMatch = post.tags?.some((tag) => tag.toLowerCase().includes(query));
      const categoryMatch = activeTag === "all" || post.tags?.includes(activeTag);
      return categoryMatch && (titleMatch || excerptMatch || tagsMatch);
    });
  }, [activeTag, remainingPosts, searchQuery]);

  return (
    <div className="relative overflow-hidden pb-20">
      <div className="page-shell flex flex-col gap-8">
        <PageHeader
          eyebrow="Articles"
          title="Blog cybersécurité"
          description="Analyses, retours terrain et guides concrets sur le pentest, l’audit sécurité et la sécurisation des applications."
          meta={["Retours terrain", "Analyse de risque", "AppSec pragmatique"]}
          actions={
            <>
              <Link href={site.pageCtas.blog.primary.href} className={cn(buttonVariants({ size: "lg" }))}>
                {site.pageCtas.blog.primary.label}
                <ArrowRight data-icon="inline-end" />
              </Link>
              <Link href={site.pageCtas.blog.secondary!.href} className={buttonVariants({ variant: "outline", size: "lg" })}>
                {site.pageCtas.blog.secondary?.label}
              </Link>
            </>
          }
          aside={
            <div className="surface-panel p-6 sm:p-7">
              <span className="status-chip w-fit">Blog archive</span>
              <h2 className="font-headline mt-5 text-3xl font-bold uppercase leading-[0.96] tracking-[-0.04em] text-foreground">
                Trouver un sujet utile rapidement
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Filtrer par thème ou rechercher un article précis pour retrouver un retour terrain
                ou un guide.
              </p>
              <div className="mt-6">
                <BlogSearch value={searchQuery} onChange={setSearchQuery} />
              </div>
            </div>
          }
        />

        {featuredPost ? (
          <section className="grid gap-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Article en avant</p>
                <h2 className="font-headline mt-3 text-4xl font-bold uppercase tracking-[-0.04em] text-foreground">
                  Un contenu éditorial au service des missions
                </h2>
              </div>
            </div>
            <BlogCard post={featuredPost} featured />
          </section>
        ) : null}

        <Card className="section-frame shadow-none">
          <CardContent className="flex flex-col gap-6 p-5 sm:p-6">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const active = tag === activeTag;
                return (
                  <Button
                    key={tag}
                    type="button"
                    variant={active ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTag(tag)}
                    className={cn("capitalize", !active && "shadow-none")}
                  >
                    {tag === "all" ? "Tous les sujets" : tag}
                  </Button>
                );
              })}
            </div>

            <div className="grid gap-4">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post, index) => (
                  <BlogCard key={post.slug} post={post} index={index} />
                ))
              ) : (
                <div className="empty-panel col-span-full">Aucun article trouvé pour ce filtre.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <CtaBand cta={site.pageCtas.blog} />
      </div>
    </div>
  );
}
