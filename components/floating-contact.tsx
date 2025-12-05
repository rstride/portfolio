"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import { MessageSquare, X, Mail } from "lucide-react";
import { site } from "@/content/site";

export function FloatingContact() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Always call hooks in the same order - never conditionally
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [300, 500], [0, 1]);
  const scale = useTransform(scrollY, [300, 500], [0.8, 1]);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsVisible(latest > 400);
    });

    return unsubscribe;
  }, [scrollY]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed bottom-24 right-6 z-50"
      style={{ opacity, scale }}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
    >
      <div className="relative">
        {/* Expanded contact options */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 mb-2 flex flex-col gap-2"
          >


            {/* Email */}
            <motion.a
              href={`mailto:${site.about.email}`}
              className="flex items-center gap-3 px-4 py-3 bg-green-500/90 backdrop-blur-sm border border-green-400/30 rounded-xl text-white shadow-lg hover:bg-green-500 transition-colors"
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mail className="w-4 h-4" />
              <span className="text-sm font-medium">Envoyer un email</span>
            </motion.a>

            {/* Scroll to contact form */}
            <motion.button
              onClick={() => {
                const contactSection = document.getElementById('contact');
                contactSection?.scrollIntoView({ behavior: 'smooth' });
                setIsExpanded(false);
              }}
              className="flex items-center gap-3 px-4 py-3 bg-blue-500/90 backdrop-blur-sm border border-blue-400/30 rounded-xl text-white shadow-lg hover:bg-blue-500 transition-colors"
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-medium">Formulaire de contact</span>
            </motion.button>
          </motion.div>
        )}

        {/* Main floating button */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-14 h-14 bg-gradient-to-r from-green-500 to-blue-500 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-shadow"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={isExpanded ? { rotate: 45 } : { rotate: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            animate={isExpanded ? { rotate: -45 } : { rotate: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isExpanded ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
          </motion.div>
        </motion.button>

        {/* Pulse animation */}
        <motion.div
          className="absolute inset-0 rounded-full bg-green-500/30"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </motion.div>
  );
}
