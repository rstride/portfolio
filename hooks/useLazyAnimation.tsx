"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";

export function useLazyAnimation(threshold = 0.1) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: threshold,
    margin: "0px 0px -100px 0px" // Start animation 100px before element enters viewport
  });

  return { ref, isInView };
}

