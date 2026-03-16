"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronRight, Menu } from "lucide-react";

import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { ScrollProgress } from "./scroll-progress";
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
  "inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium transition-colors";

const navShellClass =
  "w-full rounded-2xl border border-border/60 bg-background/90 p-2 shadow-lg backdrop-blur-md";

const submenuSurfaceClass =
  "rounded-2xl border border-border/60 bg-background/90 shadow-lg backdrop-blur-md";

const desktopSubmenuClass =
  "z-[70] min-w-[320px] max-w-[min(92vw,360px)] px-0 py-0 md:absolute md:top-full md:mt-2 md:w-auto";

const desktopLinkClass = (active: boolean) =>
  cn(
    navItemClass,
    active
      ? "bg-foreground text-background"
      : "text-muted-foreground hover:bg-accent/70 hover:text-foreground"
  );

const serviceCardClass = (active: boolean) =>
  cn(
    "block rounded-full p-3 leading-none text-left transition-colors",
    active
      ? "bg-foreground text-background"
      : "text-foreground hover:bg-accent/50"
  );

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const desktopNav = site.nav;
  const mobilePrimaryNav = site.nav.filter(
    (item) => item.href !== "/services" && item.href !== "/contact"
  );
  const servicesActive =
    pathname === "/services" || site.serviceNavigation.some((item) => pathname === item.href);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6 lg:px-8">
      <ScrollProgress />
      <div className="mx-auto max-w-7xl">
        <div className={cn("flex h-16 items-center gap-3", navShellClass)}>
          <Link href="/" className="shrink-0 px-4 font-semibold tracking-tight">
            <span className="text-blue-600 dark:text-blue-400">{site.name}</span>
            <span className="sr-only">Home</span>
          </Link>

          <nav className="hidden flex-1 items-center justify-center md:flex">
            <div className="flex items-center justify-center gap-2">
              {desktopNav.map((item) =>
                item.href === "/services" ? (
                  <NavigationMenu key={item.href} viewport={false} className="flex-none">
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger
                          className={cn(
                            navItemClass,
                            "gap-1 bg-transparent px-4",
                            servicesActive
                              ? "bg-foreground text-background hover:bg-foreground hover:text-background data-[state=open]:bg-foreground data-[state=open]:text-background"
                              : "text-muted-foreground hover:bg-accent/70 hover:text-foreground data-[state=open]:bg-accent/70 data-[state=open]:text-foreground"
                          )}
                        >
                          {item.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent unstyled className={desktopSubmenuClass}>
                          <div className={submenuSurfaceClass}>
                            <div className="flex flex-col gap-1 p-2">
                              {site.serviceNavigation.map((service) => {
                                const active = pathname === service.href;
                                return (
                                  <NavigationMenuLink key={service.href} asChild>
                                    <Link href={service.href} className={serviceCardClass(active)}>
                                      <span
                                        className={cn(
                                          "text-sm font-medium leading-none",
                                          active ? "text-background" : "text-foreground"
                                        )}
                                      >
                                        {service.label}
                                      </span>
                                      <span
                                        className={cn(
                                          "mt-1 line-clamp-2 text-xs leading-snug",
                                          active ? "text-background/75" : "text-muted-foreground"
                                        )}
                                      >
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

          <div className="ml-auto flex items-center gap-3">
            <ModeToggle />

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden" aria-label="Menu">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="top"
                showCloseButton={false}
                className="border-b border-border/40 bg-background/96 px-0 pt-16 backdrop-blur-xl md:hidden"
              >
                <SheetHeader className="sr-only">
                  <SheetTitle>Menu principal</SheetTitle>
                  <SheetDescription>Navigation mobile du portfolio.</SheetDescription>
                </SheetHeader>

                <div className="px-4 pb-6 sm:px-6">
                  <div className={cn("p-3", navShellClass)}>
                    <div className="mb-3 rounded-2xl border border-border/50 bg-background/70 px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{site.name}</p>
                        <p className="text-xs text-muted-foreground">{site.role}</p>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      {mobilePrimaryNav.map((item) => (
                        <SheetClose asChild key={item.href}>
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition-colors",
                              pathname === item.href
                                ? "border-foreground/15 bg-foreground text-background"
                                : "border-border/60 bg-background/70 text-foreground hover:bg-accent/50"
                            )}
                          >
                            <span>{item.label}</span>
                            <ChevronRight className="size-4 opacity-60" />
                          </Link>
                        </SheetClose>
                      ))}
                    </div>

                    <div className="mt-4 rounded-2xl border border-border/60 bg-background/70 p-3">
                      <div className="mb-3 px-1">
                        <p className="text-xs uppercase tracking-[0.22em] text-primary">Services</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Trois offres claires selon votre besoin.
                        </p>
                      </div>
                      <div className="flex flex-col gap-1">
                        {site.serviceNavigation.map((service) => {
                          const active = pathname === service.href;
                          return (
                            <SheetClose asChild key={service.href}>
                              <Link
                                href={service.href}
                                className={cn(
                                  "rounded-xl px-4 py-3 transition-colors",
                                  active
                                    ? "bg-foreground text-background"
                                    : "text-foreground hover:bg-accent/50"
                                )}
                              >
                                <div className="text-sm font-semibold">{service.label}</div>
                                <div className={cn("mt-1 text-sm leading-relaxed", active ? "text-background/75" : "text-muted-foreground")}>
                                  {service.description}
                                </div>
                              </Link>
                            </SheetClose>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-4 grid gap-2">
                      <SheetClose asChild>
                        <Link
                          href="/contact"
                          className={cn(
                            buttonVariants({ size: "sm" }),
                            "h-11 w-full rounded-2xl"
                          )}
                        >
                          Contact
                        </Link>
                      </SheetClose>
                    </div>
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
