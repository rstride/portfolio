"use client";

import { useEffect, useState } from 'react';

export type PerformanceMode = 'high' | 'medium' | 'low';

export function usePerformanceMode(): PerformanceMode {
  const [performanceMode, setPerformanceMode] = useState<PerformanceMode>('high');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check device capabilities and connection
    const checkPerformance = () => {
      let mode: PerformanceMode = 'high';

      // Check if we're in a browser environment
      if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        setPerformanceMode('high');
        return;
      }

      // Check connection speed (if available)
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        if (connection) {
          const effectiveType = connection.effectiveType;
          if (effectiveType === 'slow-2g' || effectiveType === '2g') {
            mode = 'low';
          } else if (effectiveType === '3g') {
            mode = 'medium';
          }
        }
      }

      // Check device memory (if available)
      if ('deviceMemory' in navigator) {
        const deviceMemory = (navigator as any).deviceMemory;
        if (deviceMemory && deviceMemory < 4) {
          mode = mode === 'high' ? 'medium' : 'low';
        }
      }

      // Check hardware concurrency
      if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        mode = mode === 'high' ? 'medium' : 'low';
      }

      // Check if user prefers reduced motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        mode = 'low';
      }

      setPerformanceMode(mode);
    };

    checkPerformance();
  }, []);

  // Return high during SSR to prevent hydration mismatches
  return mounted ? performanceMode : 'high';
}
