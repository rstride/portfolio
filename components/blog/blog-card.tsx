"use client";

import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock3, Tag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PostData } from "@/lib/posts";
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
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Link href={`/blog/${post.slug}`} className="group block h-full">
        <Card
          className={cn(
            "overflow-hidden transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_30px_70px_rgba(25,12,45,0.16)]",
            featured
              ? "section-editorial grid gap-0 lg:grid-cols-[1.12fr_0.88fr]"
              : "surface-panel h-full"
          )}
        >
          <div className={cn("relative aspect-[16/10] overflow-hidden bg-muted", featured && "lg:aspect-auto lg:min-h-full")}>
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                sizes={featured ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <Tag className="size-12 text-muted-foreground/25" />
              </div>
            )}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(25,12,45,0.28))]" />
          </div>

          <div className="relative z-10 flex h-full flex-col">
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
                <Badge variant="outline" className="mb-4 w-fit bg-background/70 backdrop-blur">
                  Article a la une
                </Badge>
              ) : null}

              <CardTitle
                className={cn(
                  "line-clamp-2 text-foreground transition-colors group-hover:text-primary",
                  featured ? "max-w-[12ch] text-3xl" : "text-xl"
                )}
              >
                {post.title}
              </CardTitle>

              <CardDescription className={cn("mt-3 text-sm leading-relaxed", featured ? "line-clamp-4 text-base" : "line-clamp-3")}>
                {post.excerpt}
              </CardDescription>
            </CardHeader>

            <CardContent className={cn("flex flex-1 flex-col justify-end p-6 pt-0", featured && "lg:p-8 lg:pt-0")}>
              <div className="mb-5 flex flex-wrap gap-2">
                {post.tags && post.tags.slice(0, featured ? 4 : 2).map((tag) => (
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
