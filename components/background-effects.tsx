"use client";

import { motion } from "framer-motion";

import { useReducedMotion } from "@/hooks/useReducedMotion";

interface BackgroundEffectsProps {
  variant?: "hero" | "section" | "contact";
  intensity?: "low" | "medium" | "high";
}

export function BackgroundEffects({
  variant = "section",
  intensity = "medium",
}: BackgroundEffectsProps) {
  const reducedMotion = useReducedMotion();
  const opacity =
    intensity === "low" ? "opacity-30" : intensity === "high" ? "opacity-65" : "opacity-50";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className={`technical-grid absolute inset-0 ${opacity}`} />

      <motion.div
        className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(188,56,247,0.2),transparent_62%)]"
        animate={reducedMotion ? undefined : { opacity: [0.45, 0.7, 0.45] }}
        transition={reducedMotion ? undefined : { duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute right-[-10rem] top-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(80,220,255,0.18),transparent_68%)] blur-3xl"
        animate={reducedMotion ? undefined : { x: [0, 18, 0], y: [0, -12, 0] }}
        transition={reducedMotion ? undefined : { duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {variant !== "section" ? (
        <motion.div
          className="absolute left-[-8rem] bottom-[-2rem] h-60 w-60 rounded-full bg-[radial-gradient(circle,rgba(188,56,247,0.16),transparent_68%)] blur-3xl"
          animate={reducedMotion ? undefined : { x: [0, -10, 0], y: [0, 16, 0] }}
          transition={reducedMotion ? undefined : { duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : null}

      {variant === "contact" ? (
        <div className="absolute inset-x-0 bottom-0 h-36 bg-[linear-gradient(180deg,transparent,rgba(80,220,255,0.08))]" />
      ) : null}
    </div>
  );
}
