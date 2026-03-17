"use client";

import { useMemo, useRef, useState } from "react";

import { motion, useInView } from "framer-motion";

import { BackgroundEffects } from "@/components/background-effects";
import { BlogCard } from "@/components/blog/blog-card";
import { BlogSearch } from "@/components/blog/blog-search";
import { landingReveal } from "@/components/landing/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PostData } from "@/lib/posts";
import { cn } from "@/lib/utils";

export function BlogShowcase({ posts }: { posts: PostData[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string>("all");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
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
    <div ref={ref} className="relative overflow-hidden">
      <BackgroundEffects variant="section" intensity="medium" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-12 pt-4 sm:px-6 lg:px-8 lg:pb-20 lg:pt-6">
        <section className="section-editorial px-6 pb-10 pt-6 sm:px-8 lg:px-12 lg:pb-14 lg:pt-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.45 }}
            className="relative z-10 mx-auto max-w-3xl text-center"
          >
            <p className="eyebrow">Articles</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
              Blog cybersécurité
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Analyses, retours terrain et guides concrets sur le pentest, l&apos;audit sécurité et la
              sécurisation des applications.
            </p>
            <div className="mt-8">
              <BlogSearch value={searchQuery} onChange={setSearchQuery} />
            </div>
          </motion.div>

          {featuredPost ? (
            <motion.div
              {...landingReveal}
              transition={{ ...landingReveal.transition, delay: 0.08 }}
              className="mt-12"
            >
              <BlogCard post={featuredPost} featured />
            </motion.div>
          ) : null}

          <Card className="surface-panel mt-8 shadow-none">
            <CardContent className="flex flex-col gap-5 p-5">
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
                      className={cn(
                        "capitalize",
                        active
                          ? "border-0 bg-[linear-gradient(135deg,var(--primary),var(--brand-secondary))] text-primary-foreground"
                          : "shadow-none"
                      )}
                    >
                      {tag === "all" ? "Tous les sujets" : tag}
                    </Button>
                  );
                })}
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post, index) => (
                    <BlogCard key={post.slug} post={post} index={index} />
                  ))
                ) : (
                  <div className="col-span-full rounded-[1.5rem] border border-dashed border-border/80 px-6 py-12 text-center text-muted-foreground">
                    Aucun article trouve pour ce filtre.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
