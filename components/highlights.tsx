"use client";
import { site } from "@/content/site";
import { motion } from "framer-motion";

export function Highlights() {
  return (
    <section className="mt-16">
      <h2 className="text-xl font-semibold tracking-tight">{site.sections.highlightsTitle}</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {site.proofs.map((p, idx) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="rounded-2xl glass p-4"
          >
            <div className="text-2xl font-bold">{p.kpi}</div>
            <p className="mt-2 text-sm text-muted-foreground">{p.title}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}


