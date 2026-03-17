"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export const landingReveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.4, ease: "easeOut" as const },
};

export const landingCardClass =
  "surface-panel transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(25,12,45,0.14)]";

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
        "mx-auto flex max-w-3xl flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow ? (
        <p className="eyebrow">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="max-w-[14ch] text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        {title}
      </h2>
      <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-[1.15rem]">
        {description}
      </p>
    </motion.div>
  );
}
