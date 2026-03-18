"use client";

import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock3, Tag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PostData } from "@/features/blog/server";
import { cn } from "@/shared/lib/utils";

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
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="h-full"
    >
      <Link href={`/blog/${post.slug}`} className="group block h-full">
        <Card
          className={cn(
            "editorial-card h-full overflow-hidden transition-all duration-200 group-hover:-translate-y-1 group-hover:border-primary/25 group-hover:shadow-[0_24px_50px_rgba(10,28,24,0.08)]",
            featured && "grid gap-0 lg:grid-cols-[1.08fr_0.92fr]"
          )}
        >
          <div
            className={cn(
              "relative aspect-[16/10] overflow-hidden bg-muted",
              featured && "lg:aspect-auto lg:min-h-full"
            )}
          >
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                sizes={featured ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1280px) 30vw, (min-width: 768px) 50vw, 100vw"}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <Tag className="size-12 text-muted-foreground/25" />
              </div>
            )}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(10,28,24,0.12))]" />
          </div>

          <div className="flex h-full flex-col">
            <CardHeader className={cn("p-6 pb-3", featured && "lg:p-8 lg:pb-4")}>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
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
                <Badge variant="outline" className="mt-5 w-fit">
                  Article en avant
                </Badge>
              ) : null}

              <CardTitle
                className={cn(
                  "mt-4 line-clamp-2 text-foreground transition-colors group-hover:text-primary",
                  featured ? "max-w-[13ch] text-3xl lg:text-[2.2rem]" : "text-xl"
                )}
              >
                {post.title}
              </CardTitle>

              <CardDescription
                className={cn(
                  "mt-3 leading-relaxed",
                  featured ? "line-clamp-4 text-base" : "line-clamp-3 text-sm"
                )}
              >
                {post.excerpt}
              </CardDescription>
            </CardHeader>

            <CardContent className={cn("mt-auto p-6 pt-0", featured && "lg:p-8 lg:pt-0")}>
              <div className="mb-5 flex flex-wrap gap-2">
                {post.tags?.slice(0, featured ? 4 : 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="brand-chip border-0 bg-transparent py-0.5 text-[10px]">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                Lire l&apos;article
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </CardContent>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
