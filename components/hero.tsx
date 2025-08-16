"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { site } from "@/content/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_50%_-20%,oklch(0.35_0.15_264.38)_0%,transparent_60%)]/30" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 grid gap-10 md:grid-cols-2 items-center">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight"
        >
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
            {site.hero.headlineA}
          </span>
          <span className="block text-muted-foreground">{site.hero.headlineB}</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground"
        >
          {site.hero.subtext}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-8 flex items-center gap-4"
        >
          <Link href={site.hero.ctaPrimary.href} className="inline-flex items-center rounded-full bg-primary text-primary-foreground px-5 py-3 text-sm font-medium hover:opacity-90 transition shadow-sm">
            {site.hero.ctaPrimary.label}
          </Link>
          <Link href={site.hero.ctaSecondary.href} className="inline-flex items-center rounded-full border border-border/60 px-5 py-3 text-sm font-medium hover:bg-muted/50 transition">
            {site.hero.ctaSecondary.label}
          </Link>
        </motion.div>

        <div className="relative mx-auto w-56 h-56 md:w-80 md:h-80 rounded-full overflow-hidden border border-border/50 bg-background/50">
          <Image src="/romain.png" alt="Portrait de Romain Stride" fill className="object-cover" priority />
        </div>

        <div className="md:col-span-2 mt-12 relative rounded-2xl border border-border/40 bg-background/40 backdrop-blur p-3 overflow-hidden">
          <div className="flex whitespace-nowrap [mask-image:linear-gradient(90deg,transparent,black_20%,black_80%,transparent)]">
            <div className="animate-[marquee_20s_linear_infinite] flex gap-6 pr-6">
              {site.hero.specialties.concat(site.hero.specialties).map((s, i) => (
                <span key={i} className="text-sm text-muted-foreground">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
    </section>
  );
}


