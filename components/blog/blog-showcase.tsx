"use client";

import { useState, useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Shield, Lock, Target, Bug } from "lucide-react";
import { PostData } from "@/lib/posts";
import { BlogCard } from "@/components/blog/blog-card";
import { BlogSearch } from "@/components/blog/blog-search";
import { BackgroundEffects } from "@/components/background-effects";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";

export function BlogShowcase({ posts }: { posts: PostData[] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });
    const performanceMode = usePerformanceMode();

    const filteredPosts = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return posts.filter((post) => {
            const titleMatch = post.title.toLowerCase().includes(query);
            const tagsMatch = post.tags?.some((tag) => tag.toLowerCase().includes(query));
            return titleMatch || tagsMatch;
        });
    }, [posts, searchQuery]);

    return (
        <div ref={ref} className="relative min-h-screen overflow-hidden">
            <BackgroundEffects
                variant="section"
                intensity={performanceMode === 'low' ? 'low' : performanceMode === 'high' ? 'high' : 'medium'}
            />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl sm:text-5xl font-bold text-gradient-primary mb-4 pb-2">
                        Blog
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        Retours d&apos;expérience, tutoriels et analyses sur la sécurité offensive et défensive.
                    </p>

                    <BlogSearch value={searchQuery} onChange={setSearchQuery} />
                </motion.div>

                {/* Blog Posts Grid */}
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
                            Aucun article trouvé pour "{searchQuery}".
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
