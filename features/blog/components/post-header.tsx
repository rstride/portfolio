import Image from "next/image";
import { Calendar, Clock3, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { PostData } from "@/lib/posts";

type PostHeaderProps = {
  post: PostData;
};

function formatPostDate(date: string) {
  return new Date(date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function PostHeader({ post }: PostHeaderProps) {
  return (
    <header className="relative z-10 mt-8">
      <div className="mb-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="size-4" />
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
        </div>
        <div className="flex items-center gap-2">
          <Clock3 className="size-4" />
          <span>{post.readingTime} min de lecture</span>
        </div>
        {post.updatedDate ? (
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4" />
            <span>Mis a jour le {formatPostDate(post.updatedDate)}</span>
          </div>
        ) : null}
      </div>

      <h1 className="max-w-[13ch] text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
        {post.title}
      </h1>

      <div className="mt-6 flex flex-wrap gap-2">
        {post.tags?.map((tag) => (
          <Badge key={tag} variant="secondary" className="brand-chip border-0 bg-transparent">
            {tag}
          </Badge>
        ))}
      </div>

      {post.coverImage ? (
        <div className="surface-panel relative mt-8 aspect-video w-full overflow-hidden shadow-[0_28px_70px_rgba(25,12,45,0.16)]">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 768px, 100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(25,12,45,0.18))]" />
        </div>
      ) : null}
    </header>
  );
}
