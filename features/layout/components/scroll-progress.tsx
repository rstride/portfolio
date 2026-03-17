"use client";

import { useEffect, useRef } from "react";

export function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frameId = 0;

    const updateProgress = () => {
      const html = document.documentElement;
      const maxScroll = html.scrollHeight - html.clientHeight;
      const scrolled = maxScroll > 0 ? html.scrollTop / maxScroll : 0;
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
    <div className="fixed left-0 right-0 top-0 z-50 h-1">
      <div
        ref={progressRef}
        className="h-full origin-left scale-x-0 bg-gradient-to-r from-[var(--primary)] via-[var(--brand-secondary)] to-[var(--brand-secondary)] shadow-lg shadow-primary/20 will-change-transform"
      />
    </div>
  );
}
