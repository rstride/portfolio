"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { site } from "@/content/site";
import { Shield, Lock, Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-green-500/20 mt-16 bg-background/80 backdrop-blur-xl relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-blue-500/5" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* Floating security icons */}
      <div className="absolute inset-0 pointer-events-none">
        {[Shield, Lock, Terminal].map((Icon, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{
              left: `${10 + index * 35}%`,
              top: `${20 + index * 15}%`
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.1, 0.3, 0.1],
              rotate: [0, 90, 180, 270, 360]
            }}
            transition={{
              duration: 6 + index * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 1
            }}
          >
            <Icon className="w-4 h-4 text-green-400/20" />
          </motion.div>
        ))}
      </div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <motion.div 
          className="flex flex-col md:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Left side - Copyright */}
          <motion.div
            className="text-center md:text-left"
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} 
              <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500 mx-1">
                {site.name}
              </span>
              {site.strings.footerRightsSuffix}
            </p>
            <motion.p 
              className="text-xs text-green-400/60 mt-1"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🔒 Hacker éthique & chercheur en sécurité
            </motion.p>
          </motion.div>
          
          {/* Right side - Links + Security badge inline */}
          <motion.div 
            className="flex items-center gap-6 text-sm"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.div whileHover={{ scale: 1.05, y: -1 }}>
              <Link 
                href="/legal/privacy" 
                className="text-muted-foreground hover:text-green-400 transition-colors duration-300 relative group"
              >
                {site.strings.footerPrivacyLabel}
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-px bg-green-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                />
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05, y: -1 }}>
              <Link 
                href="/legal/disclosure" 
                className="text-muted-foreground hover:text-blue-400 transition-colors duration-300 relative group"
              >
                Divulgation
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-px bg-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                />
              </Link>
            </motion.div>
            
            {/* "Sécurisé par PrismaSec" replaces the button and links to prismasec.fr */}
            <a
              href="https://prismasec.fr"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-emerald-400 transition-colors"
            >
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span>Sécurisé par PrismaSec</span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
