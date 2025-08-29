// Configuration d'animation harmonieuse pour tout le site
export const animationConfig = {
  // Timings harmonisés
  duration: {
    fast: 0.3,
    medium: 0.6,
    slow: 0.8,
    extraSlow: 1.2,
  },

  // Delays échelonnés
  delay: {
    immediate: 0,
    quick: 0.1,
    medium: 0.2,
    slow: 0.4,
    extraSlow: 0.6,
  },

  // Easing cohérent
  easing: {
    smooth: "easeOut",
    bounce: "easeInOut",
    linear: "linear",
  },

  // Variants d'animation réutilisables
  variants: {
    // Animation d'entrée harmonisée
    slideUp: {
      initial: { opacity: 1, y: 0 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.8, ease: "easeOut" },
    },

    // Animation d'échelle harmonisée
    scaleIn: {
      initial: { scale: 1, rotate: 0 },
      animate: { scale: 1, rotate: 0 },
      transition: { duration: 0.8, ease: "easeOut" },
    },

    // Animation stagger harmonisée
    staggerContainer: {
      animate: {
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2,
        },
      },
    },

    staggerItem: {
      initial: { opacity: 1, y: 0 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6, ease: "easeOut" },
    },
  },

  // Configuration des seuils d'intersection
  intersection: {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  },
};

// Hook pour obtenir la configuration d'animation adaptée
export function useAnimationConfig(intensity: "low" | "medium" | "high" = "medium") {
  const multipliers = {
    low: 0.7,
    medium: 1,
    high: 1.3,
  };

  const multiplier = multipliers[intensity];

  return {
    duration: {
      fast: animationConfig.duration.fast * multiplier,
      medium: animationConfig.duration.medium * multiplier,
      slow: animationConfig.duration.slow * multiplier,
      extraSlow: animationConfig.duration.extraSlow * multiplier,
    },
    delay: animationConfig.delay,
    easing: animationConfig.easing,
    variants: animationConfig.variants,
    intersection: animationConfig.intersection,
  };
}
