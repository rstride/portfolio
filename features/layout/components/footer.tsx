"use client";

import Link from "next/link";

import { motion } from "framer-motion";
import { ArrowUpRight, Shield } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border/70 pt-6">
      <div className="hero-grid absolute inset-x-0 top-0 h-32 opacity-42" />
      <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(80,220,255,0.1),transparent_58%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          className="surface-contrast overflow-hidden px-6 py-8 md:px-8"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-end">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-[1rem] bg-[linear-gradient(135deg,var(--primary),var(--brand-secondary))] text-primary-foreground">
                  <Shield className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{site.name}</p>
                  <p className="text-xs uppercase tracking-[0.22em] text-white/64">
                    Security Consulting
                  </p>
                </div>
              </div>
              <h2 className="max-w-[12ch] text-3xl font-semibold tracking-tight text-white">
                Des missions sécurité claires, utiles et assumées
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-white/74">
                Pentest, audit et formation.
              </p>
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/64">
                <span>© {new Date().getFullYear()} {site.name}</span>
                <Separator orientation="vertical" className="hidden h-4 bg-white/12 md:block" />
                <span>{site.strings.footerRightsSuffix}</span>
              </div>
            </div>

            <div className="flex flex-col gap-5 md:items-end">
              <div className="flex flex-wrap gap-2 md:justify-end">
                <Link
                  href="/legal/privacy"
                  className="rounded-full border border-white/12 px-3 py-2 text-sm text-white/74 transition hover:bg-white/8 hover:text-white"
                >
                  {site.strings.footerPrivacyLabel}
                </Link>
                <Link
                  href="/legal/disclosure"
                  className="rounded-full border border-white/12 px-3 py-2 text-sm text-white/74 transition hover:bg-white/8 hover:text-white"
                >
                  Divulgation
                </Link>
              </div>

              <a
                href="https://prismasec.fr"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/8 px-3 py-2 text-sm text-white transition hover:bg-white/12"
              >
                <Badge variant="secondary" className="border-0 bg-white/10 text-white">
                  PrismaSec
                </Badge>
                <span>Plateforme CTEM</span>
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
