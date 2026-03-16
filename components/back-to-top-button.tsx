"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackToTopButton() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [300, 500], [0, 1]);
  const scale = useTransform(scrollY, [300, 500], [0.8, 1]);

  return (
    <motion.div
      className="fixed bottom-8 right-8 z-40"
      style={{ opacity, scale }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Button
        type="button"
        size="icon"
        aria-label="Revenir en haut"
        className="size-12 shadow-lg"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowUp className="size-5" />
        </motion.div>
      </Button>
    </motion.div>
  );
}
