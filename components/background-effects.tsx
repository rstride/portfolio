"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface BackgroundEffectsProps {
  variant?: "hero" | "section" | "contact";
  intensity?: "low" | "medium" | "high";
}

export function BackgroundEffects({
  variant = "section",
  intensity = "medium"
}: BackgroundEffectsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Configuration harmonisée pour tous les effets
  const config = {
    duration: intensity === "low" ? 20 : intensity === "medium" ? 15 : 10,
    opacity: intensity === "low" ? [0.3, 0.6, 0.3] : [0.5, 0.8, 0.5],
    delay: variant === "hero" ? 0 : variant === "section" ? 2 : 4,
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Grille de base harmonisée */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px"
        }}
        animate={{
          backgroundPosition: ["0px 0px", "60px 60px"],
          opacity: config.opacity
        }}
        transition={{
          duration: config.duration,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Particules flottantes harmonisées */}
      {variant !== "hero" && (
        <div className="absolute inset-0">
          {[...Array(intensity === "low" ? 3 : intensity === "medium" ? 5 : 8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-green-400/30 rounded-full"
              style={{
                left: `${15 + (i * 20)}%`,
                top: `${20 + (i * 15)}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                duration: 8 + (i * 2),
                repeat: Infinity,
                ease: "easeInOut",
                delay: config.delay + (i * 0.5),
              }}
            />
          ))}
        </div>
      )}

      {/* Effets spécifiques au variant */}
      {variant === "hero" && (
        <>
          {/* Orbe supérieure harmonisée */}
          <motion.div
            className="absolute -top-40 -left-40 h-80 w-80 rounded-full blur-3xl"
            style={{
              background: "radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)"
            }}
            animate={{
              x: [0, 30, 0],
              y: [0, 20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: config.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Orbe inférieure harmonisée */}
          <motion.div
            className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full blur-3xl"
            style={{
              background: "radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)"
            }}
            animate={{
              x: [0, -25, 0],
              y: [0, -30, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: config.duration + 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </>
      )}

      {variant === "contact" && (
        <>
          {/* Ligne de scanning harmonisée pour contact */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(34, 197, 94, 0.05) 4px)",
              backgroundSize: "100% 30px"
            }}
            animate={{
              backgroundPosition: ["0% 0%", "0% 100%"],
            }}
            transition={{
              duration: config.duration * 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Flux de données subtil */}
          <motion.div
            className="absolute right-20 top-20 w-0.5 h-32 bg-gradient-to-b from-transparent via-green-400/20 to-transparent"
            animate={{
              y: [0, 50, 100],
              opacity: [0, 0.5, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </>
      )}
    </div>
  );
}
