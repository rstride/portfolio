"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Tag } from "lucide-react";
import { PostData } from "@/lib/posts";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BlogCardProps {
    post: PostData;
    index: number;
}

export function BlogCard({ post, index }: BlogCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <Link href={`/blog/${post.slug}`} className="group block h-full">
                <Card className="h-full overflow-hidden border-0 bg-white/5 dark:bg-black/20 backdrop-blur-sm hover:bg-white/10 dark:hover:bg-black/30 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/5">
                    <div className="relative aspect-video overflow-hidden">
                        {post.coverImage ? (
                            <div
                                className="w-full h-full bg-cover bg-center transform group-hover:scale-105 transition-transform duration-500"
                                style={{ backgroundImage: `url(${post.coverImage})` }}
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                                <Tag className="w-12 h-12 text-muted-foreground/20" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="p-6 flex flex-col h-[calc(100%-aspect-video)]">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                            <Calendar className="w-3.5 h-3.5" />
                            <time dateTime={post.date}>
                                {new Date(post.date).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </time>
                        </div>

                        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                        </h3>

                        <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow">
                            {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between mt-auto">
                            <div className="flex flex-wrap gap-2">
                                {post.tags && post.tags.slice(0, 2).map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0.5">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>

                            <span className="inline-flex items-center text-sm font-medium text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                Lire l'article
                                <ArrowRight className="w-4 h-4 ml-1" />
                            </span>
                        </div>
                    </div>
                </Card>
            </Link>
        </motion.div>
    );
}
