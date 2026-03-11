"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export function BackToTopButton() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [300, 500], [0, 1]);
  const scale = useTransform(scrollY, [300, 500], [0.8, 1]);

  return (
    <motion.button
      type="button"
      aria-label="Revenir en haut"
      className="fixed bottom-8 right-8 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg"
      style={{ opacity, scale }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <motion.svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
      </motion.svg>
    </motion.button>
  );
}
