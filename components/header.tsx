"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { site } from "@/content/site";
import { ScrollProgress } from "./scroll-progress";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-background/70 backdrop-blur border-b border-border/40">
      <ScrollProgress />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-fuchsia-500">{site.name}</span>
          <span className="sr-only">Home</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {site.nav.map((n) => (
            <Link key={n.href} href={n.href} className={pathname === n.href ? "text-foreground" : "text-muted-foreground hover:text-foreground transition-colors"}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/contact" className="btn-primary px-4 py-2">Contact</Link>
          <button ref={buttonRef} type="button" className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/50" aria-label="Menu" onClick={() => setOpen((v) => !v)}>
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>
      {open && (
        <div>
          <div className="fixed inset-0 top-16 z-30 bg-transparent" onClick={() => setOpen(false)} />
          <div ref={drawerRef} className="md:hidden absolute inset-x-0 top-16 z-40 border-b border-border/40 bg-background/95 backdrop-blur-sm">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 grid gap-3 text-sm">
              {site.nav.map((n) => (
                <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className={pathname === n.href ? "text-foreground" : "text-muted-foreground hover:text-foreground transition-colors"}>
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

