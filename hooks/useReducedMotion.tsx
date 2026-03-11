"use client";

import { useSyncExternalStore } from 'react';

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === 'undefined') {
        return () => undefined;
      }

      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const handleChange = () => onStoreChange();

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    },
    () => {
      if (typeof window === 'undefined') {
        return false;
      }

      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },
    () => false
  );
}
