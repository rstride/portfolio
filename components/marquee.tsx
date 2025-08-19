"use client";
import { motion } from "framer-motion";

export function Marquee({ items }: { items: React.ReactNode[] }) {
  return (
    <div className="relative overflow-hidden py-8">
      {/* Cyber-themed background */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/5 to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:30px_30px]" />
      
      {/* Title */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h3 className="text-xl font-semibold text-foreground mb-2">Plateformes de confiance</h3>
        <p className="text-sm text-muted-foreground">Reconnaissance et collaborations</p>
      </motion.div>
      
      {/* Enhanced marquee with mask */}
      <div className="relative [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <motion.div 
          className="flex gap-12 will-change-transform"
          animate={{ x: ["-50%", "0%"] }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {items.concat(items).map((child, i) => (
            <motion.div 
              key={i} 
              className="flex-shrink-0 relative group"
              whileHover={{ scale: 1.1, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="opacity-60 group-hover:opacity-100 transition-opacity duration-300 filter grayscale group-hover:grayscale-0"
                whileHover={{ 
                  filter: "drop-shadow(0 0 8px rgba(34, 197, 94, 0.3))" 
                }}
              >
                {child}
              </motion.div>
              
              {/* Glow effect on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 -z-10"
                whileHover={{ scale: 1.2 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Cyber accent lines */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </div>
  );
}

