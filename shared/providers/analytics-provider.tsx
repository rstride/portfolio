"use client";

import { createContext, useCallback, useContext, useEffect, useRef } from "react";

type Payload = Record<string, unknown> | undefined;
type Gtag = (command: "event", event: string, payload: Record<string, unknown>) => void;
type AnalyticsWindow = Window & {
  gtag?: Gtag;
  dataLayer?: Array<Record<string, unknown>>;
};

export function track(event: string, payload?: Payload) {
  try {
    const currentWindow = window as AnalyticsWindow;
    if (typeof currentWindow.gtag === "function") {
      currentWindow.gtag("event", event, payload ?? {});
    } else if (Array.isArray(currentWindow.dataLayer)) {
      currentWindow.dataLayer.push({ event, ...(payload ?? {}) });
    }
  } catch {}

  if (process.env.NODE_ENV !== "production") {
    console.info(`[analytics] ${event}`, payload || {});
  }
}

type QueuedEvent = { event: string; payload?: Payload };

const AnalyticsContext = createContext<null | ((event: string, payload?: Payload) => void)>(null);

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const queueRef = useRef<QueuedEvent[]>([]);
  const flushingRef = useRef(false);

  const flush = useCallback(() => {
    if (flushingRef.current || queueRef.current.length === 0) {
      return;
    }

    flushingRef.current = true;
    try {
      for (const item of queueRef.current) {
        track(item.event, item.payload);
      }
      queueRef.current = [];
    } finally {
      flushingRef.current = false;
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(flush, 1500);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        flush();
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", flush);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", flush);
    };
  }, [flush]);

  const enqueue = useCallback((event: string, payload?: Payload) => {
    queueRef.current.push({ event, payload });
  }, []);

  return <AnalyticsContext.Provider value={enqueue}>{children}</AnalyticsContext.Provider>;
}

export function useAnalytics() {
  const enqueue = useContext(AnalyticsContext);

  return {
    queue: enqueue,
    track,
  } as const;
}
