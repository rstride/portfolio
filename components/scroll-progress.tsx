"use client";
import { useEffect, useRef } from "react";

export function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frameId = 0;

    const updateProgress = () => {
      const h = document.documentElement;
      const maxScroll = h.scrollHeight - h.clientHeight;
      const scrolled = maxScroll > 0 ? h.scrollTop / maxScroll : 0;
      const progress = Number.isFinite(scrolled) ? Math.min(1, Math.max(0, scrolled)) : 0;

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }
      frameId = 0;
    };

    const onScroll = () => {
      if (frameId === 0) {
        frameId = window.requestAnimationFrame(updateProgress);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1">
      <div
        ref={progressRef}
        className="h-full origin-left scale-x-0 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 shadow-lg shadow-green-500/20 will-change-transform"
      />
    </div>
  );
}
