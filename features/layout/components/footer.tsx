"use client";

import Link from "next/link";

import { site } from "@/content/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/16">
      <div className="page-shell py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="font-label text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            © {year} {site.name}. {site.strings.footerRightsSuffix}
          </div>

          <div className="flex flex-wrap items-center gap-5 font-label text-[10px] uppercase tracking-[0.16em]">
            {site.socials
              .filter((social) => social.label !== "PrismaSec")
              .map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                {social.label}
              </a>
            ))}
            <Link href="/legal/privacy" className="text-muted-foreground hover:text-primary">
              {site.strings.footerPrivacyLabel}
            </Link>
            <Link href="/legal/disclosure" className="text-muted-foreground hover:text-primary">
              Divulgation
            </Link>
            <a
              href="https://prismasec.fr"
              target="_blank"
              rel="noreferrer"
              className="text-secondary hover:text-primary"
            >
              Secured by PrismaSec
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
