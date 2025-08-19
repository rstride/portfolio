import Link from "next/link";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-border/40 mt-16 bg-background/70 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} {site.name}. {site.strings.footerRightsSuffix}</p>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/legal/privacy" className="text-muted-foreground hover:text-foreground">{site.strings.footerPrivacyLabel}</Link>
          <Link href="/legal/disclosure" className="text-muted-foreground hover:text-foreground">Divulgation</Link>
          <a href={site.socials.find(s => s.label === 'PrismaSec')?.href} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">PrismaSec</a>
        </div>
      </div>
    </footer>
  );
}

