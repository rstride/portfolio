"use client";

import { motion } from "framer-motion";

import { revealInView } from "@/shared/motion/reveal";
import { cn } from "@/shared/lib/utils";

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
      {...revealInView}
      className={cn(
        "mx-auto flex max-w-3xl flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="max-w-[14ch] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
        {description}
      </p>
    </motion.div>
  );
}
