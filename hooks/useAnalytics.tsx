"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type Payload = Record<string, unknown> | undefined;

export function track(event: string, payload?: Payload) {
  try {
    const w = window as unknown as {
      gtag?: (...args: any[]) => void;
      dataLayer?: any[];
    };
    if (typeof w.gtag === "function") {
      w.gtag("event", event, payload ?? {});
    } else if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push({ event, ...(payload ?? {}) });
    }
  } catch {}
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.info(`[analytics] ${event}`, payload || {});
  }
}

type QueuedEvent = { event: string; payload?: Payload };

const AnalyticsCtx = createContext<null | ((event: string, payload?: Payload) => void)>(null);

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<QueuedEvent[]>([]);
  const flushing = useRef(false);

  const flush = useCallback(() => {
    if (flushing.current || queue.length === 0) return;
    flushing.current = true;
    try {
      for (const item of queue) track(item.event, item.payload);
      setQueue([]);
    } finally {
      flushing.current = false;
    }
  }, [queue]);

  useEffect(() => {
    const id = setInterval(flush, 1500);
    const onVis = () => {
      if (document.visibilityState === "hidden") flush();
    };
    window.addEventListener("visibilitychange", onVis);
    window.addEventListener("beforeunload", flush);
    return () => {
      clearInterval(id);
      window.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("beforeunload", flush);
    };
  }, [flush]);

  const enqueue = useCallback((event: string, payload?: Payload) => {
    setQueue((q) => [...q, { event, payload }]);
  }, []);

  return <AnalyticsCtx.Provider value={enqueue}>{children}</AnalyticsCtx.Provider>;
}

export function useAnalytics() {
  const enqueue = useContext(AnalyticsCtx);
  return {
    queue: enqueue,
    track,
  } as const;
}

