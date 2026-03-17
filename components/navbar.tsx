"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronRight, Menu } from "lucide-react";

import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { ScrollProgress } from "./scroll-progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItemClass =
  "inline-flex h-9 items-center justify-center rounded-full px-3.5 text-sm font-medium transition-colors";

const navShellClass =
  "relative w-full rounded-[1.35rem] border border-white/10 bg-[rgba(14,12,28,0.86)] px-3 py-2 shadow-[0_14px_34px_rgba(7,5,18,0.22)] backdrop-blur-xl";

const submenuSurfaceClass =
  "overflow-hidden rounded-[1rem] border border-white/10 bg-[rgba(14,12,28,0.96)] shadow-[0_18px_40px_rgba(7,5,18,0.28)] backdrop-blur-xl";

const desktopSubmenuClass =
  "z-[70] min-w-[320px] max-w-[min(92vw,360px)] px-0 py-0 md:absolute md:top-full md:mt-2 md:w-auto";

const desktopLinkClass = (active: boolean) =>
  cn(
    navItemClass,
    active
      ? "bg-white/8 text-foreground"
      : "text-muted-foreground hover:bg-white/6 hover:text-foreground"
  );

const serviceCardClass = (active: boolean) =>
  cn(
    "block rounded-[0.9rem] px-3 py-3 leading-none text-left transition-colors",
    active
      ? "bg-white/8 text-foreground"
      : "text-foreground hover:bg-white/6"
  );

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const desktopNav = site.nav;
  const mobilePrimaryNav = site.nav.filter(
    (item) => item.href !== "/services" && item.href !== "/contact"
  );
  const servicesActive =
    pathname === "/services" || site.serviceNavigation.some((item) => pathname === item.href);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-2 sm:px-6 sm:pt-3 lg:px-8">
      <ScrollProgress />
      <div className="mx-auto max-w-7xl">
        <div className={navShellClass}>
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
          <div className="pointer-events-none absolute right-5 top-0 h-10 w-20 bg-[radial-gradient(circle_at_top,rgba(80,220,255,0.12),transparent_72%)]" />

          <div className="relative flex h-14 items-center gap-3">
            <Link href="/" className="flex shrink-0 items-center gap-3 pr-4">
              <span className="flex size-9 items-center justify-center rounded-[0.9rem] bg-[linear-gradient(135deg,var(--primary),var(--brand-secondary))] text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground shadow-[0_8px_20px_rgba(110,92,255,0.2)]">
                RS
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-sm font-semibold tracking-tight text-foreground">{site.name}</span>
                <span className="text-[11px] uppercase tracking-[0.2em] text-foreground/60">
                  Security Research
                </span>
              </span>
              <span className="sr-only">Home</span>
            </Link>

            <nav className="hidden flex-1 items-center justify-center md:flex">
              <div className="flex items-center justify-center gap-1.5">
                {desktopNav.map((item) =>
                  item.href === "/services" ? (
                    <NavigationMenu key={item.href} viewport={false} className="flex-none">
                      <NavigationMenuList>
                        <NavigationMenuItem>
                          <NavigationMenuTrigger
                            className={cn(
                              navItemClass,
                              "gap-1 bg-transparent px-3.5",
                              servicesActive
                                ? "bg-white/8 text-foreground hover:text-foreground"
                                : "text-muted-foreground hover:bg-white/6 hover:text-foreground data-[state=open]:bg-white/6 data-[state=open]:text-foreground"
                            )}
                          >
                            {item.label}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent unstyled className={desktopSubmenuClass}>
                            <div className={submenuSurfaceClass}>
                              <div className="grid gap-1 p-2">
                                {site.serviceNavigation.map((service) => {
                                  const active = pathname === service.href;
                                  return (
                                    <NavigationMenuLink key={service.href} asChild>
                                      <Link href={service.href} className={serviceCardClass(active)}>
                                        <span className="text-sm font-medium leading-none">{service.label}</span>
                                        <span className="mt-1 line-clamp-2 text-xs leading-snug text-muted-foreground">
                                          {service.description}
                                        </span>
                                      </Link>
                                    </NavigationMenuLink>
                                  );
                                })}
                              </div>
                            </div>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      </NavigationMenuList>
                    </NavigationMenu>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={desktopLinkClass(pathname === item.href)}
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </div>
            </nav>

            <div className="ml-auto flex items-center gap-3 pr-2">
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "hidden h-9 rounded-full border border-white/10 bg-[linear-gradient(135deg,rgba(186,76,255,0.86),rgba(80,220,255,0.86))] px-4 text-primary-foreground shadow-[0_10px_22px_rgba(110,92,255,0.18)] md:inline-flex"
                )}
              >
                Contact
              </Link>
              <div className="hidden md:block">
                <ModeToggle />
              </div>

              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <div className="ml-auto flex items-center gap-2 md:hidden">
                    <ModeToggle />
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-white/10 bg-white/5 shadow-none hover:bg-white/10"
                      aria-label="Menu"
                    >
                      <Menu className="size-4" />
                    </Button>
                  </div>
                </SheetTrigger>
                <SheetContent
                  side="top"
                  showCloseButton={false}
                  className="border-b border-white/10 bg-[rgba(10,9,22,0.96)] px-0 pt-16 backdrop-blur-xl md:hidden"
                >
                  <SheetHeader className="sr-only">
                    <SheetTitle>Menu principal</SheetTitle>
                    <SheetDescription>Navigation mobile du portfolio.</SheetDescription>
                  </SheetHeader>

                  <div className="px-4 pb-6 sm:px-6">
                    <div className="rounded-[1.4rem] border border-white/10 bg-[rgba(14,12,28,0.9)] p-4 shadow-[0_18px_40px_rgba(7,5,18,0.28)]">
                      <div className="mb-4 flex items-center gap-3 border-b border-white/8 pb-4">
                        <span className="flex size-9 items-center justify-center rounded-[0.9rem] bg-[linear-gradient(135deg,var(--primary),var(--brand-secondary))] text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground">
                          RS
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">{site.name}</p>
                          <p className="truncate text-[11px] uppercase tracking-[0.18em] text-foreground/60">
                            Security Research
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        {mobilePrimaryNav.map((item) => (
                          <SheetClose asChild key={item.href}>
                            <Link
                              href={item.href}
                              className={cn(
                                "flex items-center justify-between rounded-[1rem] px-4 py-3 text-sm font-medium transition-colors",
                                pathname === item.href
                                  ? "bg-white/8 text-foreground"
                                  : "text-muted-foreground hover:bg-white/6 hover:text-foreground"
                              )}
                            >
                              <span>{item.label}</span>
                              <ChevronRight className="size-4 opacity-60" />
                            </Link>
                          </SheetClose>
                        ))}
                      </div>

                      <Accordion type="single" collapsible className="mt-3">
                        <AccordionItem
                          value="services"
                          className="overflow-hidden rounded-[1rem] border border-white/8 bg-white/4 last:border-b"
                        >
                          <AccordionTrigger className="px-4 py-3 text-sm font-medium text-foreground hover:no-underline">
                            <div className="flex flex-col items-start gap-1 text-left">
                              <span>Services</span>
                              <span className="text-sm font-normal text-muted-foreground">
                                Pentest, audit et formation.
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-2 pb-2">
                            <div className="flex flex-col gap-1">
                              {site.serviceNavigation.map((service) => {
                                const active = pathname === service.href;
                                return (
                                  <SheetClose asChild key={service.href}>
                                    <Link
                                      href={service.href}
                                      className={cn(
                                        "rounded-[0.95rem] px-4 py-3 transition-colors",
                                        active
                                          ? "bg-white/8 text-foreground"
                                          : "text-foreground hover:bg-white/6"
                                      )}
                                    >
                                      <div className="text-sm font-semibold">{service.label}</div>
                                      <div className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                        {service.description}
                                      </div>
                                    </Link>
                                  </SheetClose>
                                );
                              })}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
