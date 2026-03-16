"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import { MessageSquare, X, Mail } from "lucide-react";
import { site } from "@/content/site";
import { Button } from "@/components/ui/button";

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
              className="inline-flex items-center gap-3 rounded-xl border border-border/60 bg-background/90 px-4 py-3 text-sm font-medium text-foreground shadow-lg backdrop-blur-sm transition-colors hover:bg-muted/80"
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mail className="size-4" />
              <span>Envoyer un email</span>
            </motion.a>

            {/* Scroll to contact form */}
            <motion.div
              onClick={() => {
                const contactSection = document.getElementById('contact');
                contactSection?.scrollIntoView({ behavior: 'smooth' });
                setIsExpanded(false);
              }}
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                type="button"
                variant="outline"
                className="h-auto justify-start gap-3 rounded-xl bg-background/90 px-4 py-3 text-sm shadow-lg backdrop-blur-sm"
                onClick={() => {
                  const contactSection = document.getElementById('contact');
                  contactSection?.scrollIntoView({ behavior: 'smooth' });
                  setIsExpanded(false);
                }}
              >
                <MessageSquare className="size-4" />
                <span>Formulaire de contact</span>
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* Main floating button */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={isExpanded ? { rotate: 45 } : { rotate: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            type="button"
            size="icon"
            className="size-14 rounded-full shadow-lg"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <motion.div
              animate={isExpanded ? { rotate: -45 } : { rotate: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isExpanded ? <X className="size-6" /> : <MessageSquare className="size-6" />}
            </motion.div>
          </Button>
        </motion.div>

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
