"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock3, Tag } from "lucide-react";
import { PostData } from "@/lib/posts";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BlogCardProps {
    post: PostData;
    index?: number;
    featured?: boolean;
}

export function BlogCard({ post, index = 0, featured = false }: BlogCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <Link href={`/blog/${post.slug}`} className="group block h-full">
                <Card
                    className={cn(
                        "h-full overflow-hidden border border-border/60 bg-background/70 backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-primary/5",
                        featured && "grid gap-0 lg:grid-cols-[1.2fr_0.8fr]"
                    )}
                >
                    <div className={cn("relative aspect-video overflow-hidden", featured && "lg:aspect-auto lg:min-h-full")}>
                        {post.coverImage ? (
                            <Image
                                src={post.coverImage}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes={featured ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-muted">
                                <Tag className="size-12 text-muted-foreground/20" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="flex h-full flex-col">
                        <CardHeader className={cn("p-6 pb-3", featured && "lg:p-8 lg:pb-4")}>
                            <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Calendar className="size-3.5" />
                                    <time dateTime={post.date}>
                                        {new Date(post.date).toLocaleDateString("fr-FR", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </time>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock3 className="size-3.5" />
                                    <span>{post.readingTime} min de lecture</span>
                                </div>
                            </div>

                            {featured ? (
                                <Badge variant="secondary" className="mb-4 w-fit">
                                    Article a la une
                                </Badge>
                            ) : null}

                            <CardTitle
                                className={cn(
                                    "group-hover:text-primary transition-colors line-clamp-2",
                                    featured ? "text-2xl sm:text-3xl" : "text-xl"
                                )}
                            >
                                {post.title}
                            </CardTitle>

                            <CardDescription className={cn("mt-3 text-sm", featured ? "line-clamp-4 text-base" : "line-clamp-3")}>
                                {post.excerpt}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className={cn("flex flex-1 flex-col justify-end p-6 pt-0", featured && "lg:p-8 lg:pt-0")}>
                            <div className="mb-5 flex flex-wrap gap-2">
                                {post.tags && post.tags.slice(0, featured ? 4 : 2).map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0.5">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>

                            <span
                                className={cn(
                                    buttonVariants({ variant: "ghost", size: "sm" }),
                                    "pointer-events-none w-fit px-0 text-primary opacity-70 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                                )}
                            >
                                Lire l&apos;article
                                <ArrowRight className="size-4" />
                            </span>
                        </CardContent>
                    </div>
                </Card>
            </Link>
        </motion.div>
    );
}
