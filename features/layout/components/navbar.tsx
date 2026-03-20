"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { site } from "@/content/site";
import { ModeToggle } from "@/features/layout/components/mode-toggle";
import { ScrollProgress } from "@/features/layout/components/scroll-progress";
import { cn } from "@/shared/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6 lg:px-8">
      <ScrollProgress />
      <div className="page-shell max-w-none px-0">
        <div className="shell-panel grid min-h-13 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-2.5 sm:px-5 md:grid-cols-[auto_1fr_auto]">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="font-headline truncate text-sm font-bold uppercase tracking-[-0.04em] text-primary sm:text-base">
              {site.name} <span className="text-foreground/42">{"//"}</span> Portfolio
            </span>
          </Link>

          <nav className="hidden items-center justify-center gap-7 md:flex">
            {site.primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn("nav-link", isActive(pathname, item.href) && "nav-link-active")}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={site.navPrimaryCta.href}
              className={cn(
                "nav-link",
                isActive(pathname, site.navPrimaryCta.href) && "nav-link-active"
              )}
            >
              {site.navPrimaryCta.label}
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-2 justify-self-end">
            <ModeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-9 border-border/20 bg-card/92 md:hidden"
                  aria-label="Ouvrir le menu"
                >
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="top"
                showCloseButton={false}
                className="border-border/20 bg-background/98 px-0 py-0 backdrop-blur-2xl md:hidden"
              >
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation principale</SheetTitle>
                  <SheetDescription>Accès aux sections principales du portfolio.</SheetDescription>
                </SheetHeader>

                <div className="flex min-h-dvh flex-col px-4 pb-8 pt-5 sm:px-6">
                  <div className="mb-10 flex items-center justify-between gap-4">
                    <span className="font-headline text-lg font-bold uppercase tracking-[-0.04em] text-primary">
                      {site.name}
                    </span>
                    <SheetClose asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-9 border-border/20 bg-card/92"
                        aria-label="Fermer le menu"
                      >
                        <X />
                      </Button>
                    </SheetClose>
                  </div>

                  <div className="flex flex-1 flex-col gap-6">
                    {site.primaryNav.map((item) => (
                      <SheetClose asChild key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "font-headline border-b border-border/16 pb-3 text-3xl font-bold uppercase tracking-[-0.04em] text-foreground/72",
                            isActive(pathname, item.href) && "text-primary"
                          )}
                        >
                          {item.label}
                        </Link>
                      </SheetClose>
                    ))}

                    <SheetClose asChild>
                      <Link
                        href={site.navPrimaryCta.href}
                        className={cn(
                          buttonVariants({ size: "lg" }),
                          "mt-4 w-full justify-center",
                          isActive(pathname, site.navPrimaryCta.href) && "border-primary/50"
                        )}
                      >
                        {site.navPrimaryCta.label}
                      </Link>
                    </SheetClose>
                  </div>

                  <div className="mt-10 flex items-center justify-between gap-3 border-t border-border/16 pt-5 font-label text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    <span>System status: active</span>
                    <span>{site.role}</span>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
