"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

export const revealInView = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.4, ease: "easeOut" as const },
};

export function createRevealTransition(delay = 0) {
  return {
    ...revealInView.transition,
    delay,
  };
}

type MotionRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function MotionReveal({ children, className, delay = 0 }: MotionRevealProps) {
  return (
    <motion.div
      {...revealInView}
      transition={createRevealTransition(delay)}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
