"use client";

import { useState, useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PostData } from "@/lib/posts";
import { BlogCard } from "@/components/blog/blog-card";
import { BlogSearch } from "@/components/blog/blog-search";
import { BackgroundEffects } from "@/components/background-effects";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function BlogShowcase({ posts }: { posts: PostData[] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTag, setActiveTag] = useState<string>("all");
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });
    const performanceMode = usePerformanceMode();
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
        <div ref={ref} className="relative min-h-screen overflow-hidden">
            <BackgroundEffects
                variant="section"
                intensity={performanceMode === 'low' ? 'low' : performanceMode === 'high' ? 'high' : 'medium'}
            />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.8 }}
                    className="mb-12 text-center"
                >
                    <h1 className="text-4xl sm:text-5xl font-bold text-gradient-primary mb-4 pb-2">
                        Blog
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        Analyses, retours terrain et guides concrets sur le pentest, l&apos;audit sécurité et la sécurisation des applications.
                    </p>

                    <BlogSearch value={searchQuery} onChange={setSearchQuery} />
                </motion.div>

                {featuredPost ? (
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="mb-10"
                    >
                        <BlogCard post={featuredPost} featured />
                    </motion.div>
                ) : null}

                <div className="mb-8 flex flex-wrap gap-2">
                    {tags.map((tag) => {
                        const active = tag === activeTag;
                        return (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => setActiveTag(tag)}
                                className={cn(
                                    buttonVariants({ variant: active ? "default" : "outline", size: "sm" }),
                                    "capitalize"
                                )}
                            >
                                {tag === "all" ? "Tous les sujets" : tag}
                            </button>
                        );
                    })}
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map((post, index) => (
                            <BlogCard key={post.slug} post={post} index={index} />
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full text-center py-12 text-muted-foreground"
                        >
                            Aucun article trouve pour ce filtre.
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
