"use client";

import { useMemo } from 'react';

export type PerformanceMode = 'high' | 'medium' | 'low';

type ConnectionInfo = {
  effectiveType?: string;
};

type NavigatorWithPerformanceHints = Navigator & {
  connection?: ConnectionInfo;
  deviceMemory?: number;
};

function detectPerformanceMode(): PerformanceMode {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return 'high';
  }

  const browserNavigator = navigator as NavigatorWithPerformanceHints;
  let mode: PerformanceMode = 'high';

  if (browserNavigator.connection) {
    const effectiveType = browserNavigator.connection.effectiveType;
    if (effectiveType === 'slow-2g' || effectiveType === '2g') {
      mode = 'low';
    } else if (effectiveType === '3g') {
      mode = 'medium';
    }
  }

  if (browserNavigator.deviceMemory && browserNavigator.deviceMemory < 4) {
    mode = mode === 'high' ? 'medium' : 'low';
  }

  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    mode = mode === 'high' ? 'medium' : 'low';
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    mode = 'low';
  }

  return mode;
}

export function usePerformanceMode(): PerformanceMode {
  return useMemo(() => detectPerformanceMode(), []);
}
