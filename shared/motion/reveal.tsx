"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { useReducedMotion } from "@/shared/hooks/use-reduced-motion";
import { cn } from "@/shared/lib/utils";

export const revealInView = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.28, ease: "easeOut" as const },
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
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      {...(reducedMotion
        ? {
            initial: { opacity: 1, y: 0 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, amount: 0.2 },
            transition: { duration: 0 },
          }
        : revealInView)}
      transition={reducedMotion ? { duration: 0 } : createRevealTransition(delay)}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
