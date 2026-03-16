"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export const landingReveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.45, ease: "easeOut" as const },
};

export const landingCardClass =
  "border-border/60 bg-background/72 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg";

type SectionIntroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionIntro({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionIntroProps) {
  return (
    <motion.div
      {...landingReveal}
      className={cn(
        "mx-auto flex max-w-3xl flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow ? (
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-primary">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        {title}
      </h2>
      <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
        {description}
      </p>
    </motion.div>
  );
}
