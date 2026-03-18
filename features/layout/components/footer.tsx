"use client";

import Link from "next/link";

import { Shield } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border/70 pt-4">
      <div className="page-shell pb-6">
        <div className="surface-panel overflow-hidden px-5 py-6 sm:px-6">
          <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-end">
            <div className="grid gap-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-[0.95rem] bg-[linear-gradient(135deg,var(--primary),var(--brand-secondary))] text-primary-foreground">
                  <Shield className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{site.name}</p>
                  <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
                    Security Consulting
                  </p>
                </div>
              </div>

              <div>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  Pentest, audit et formation.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span>© {new Date().getFullYear()} {site.name}</span>
                <Separator orientation="vertical" className="hidden h-4 md:block" />
                <span>{site.strings.footerRightsSuffix}</span>
              </div>
            </div>

            <div className="grid gap-4 md:justify-items-end">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 rounded-full bg-[linear-gradient(135deg,var(--primary),var(--brand-secondary))] px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-[0_14px_30px_rgba(22,126,102,0.18)] transition hover:opacity-95"
              >
                Contact
              </Link>

              <div className="flex flex-wrap gap-2 md:justify-end">
                <Link
                  href="/legal/privacy"
                  className="rounded-full border border-border/70 px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-accent/60 hover:text-foreground"
                >
                  {site.strings.footerPrivacyLabel}
                </Link>
                <Link
                  href="/legal/disclosure"
                  className="rounded-full border border-border/70 px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-accent/60 hover:text-foreground"
                >
                  Divulgation
                </Link>
              </div>

              <a
                href="https://prismasec.fr"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 text-sm text-muted-foreground transition hover:text-foreground"
              >
                <span className="size-2.5 rounded-full bg-[linear-gradient(135deg,var(--primary),var(--brand-secondary))]" />
                <span>Sécurisé par PrismaSec</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
