"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronRight, Menu, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants, Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { site } from "@/content/site";
import { ModeToggle } from "@/features/layout/components/mode-toggle";
import { ScrollProgress } from "@/features/layout/components/scroll-progress";
import { getServiceIcon } from "@/features/services/model";
import { cn } from "@/shared/lib/utils";

const shellClass =
  "relative grid h-16 grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[1.75rem] border border-border/70 bg-background/92 px-4 shadow-[0_16px_34px_rgba(10,28,24,0.08)] backdrop-blur-xl sm:px-5";

const navLinkClass = (active: boolean) =>
  cn(
    "inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium transition-colors",
    active
      ? "bg-foreground text-background"
      : "text-muted-foreground hover:bg-accent/70 hover:text-foreground"
  );

const serviceItemClass = (active: boolean) =>
  cn(
    "group flex items-start gap-3 rounded-[1.2rem] border border-border/60 bg-background/82 p-3 transition-colors hover:bg-accent/50",
    active && "border-primary/25 bg-accent/50"
  );

function isBlogRoute(pathname: string) {
  return pathname === "/blog" || pathname.startsWith("/blog/");
}

function isServiceRoute(pathname: string) {
  return pathname === "/services" || pathname.startsWith("/services/");
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const servicesActive = isServiceRoute(pathname);
  const blogActive = isBlogRoute(pathname);
  const contactActive = pathname === site.navPrimaryCta.href;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6 lg:px-8">
      <ScrollProgress />
      <div className="mx-auto max-w-[88rem]">
        <div className={shellClass}>
          <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-[linear-gradient(to_right,transparent,color-mix(in_oklab,var(--primary)_22%,transparent),transparent)]" />

          <Link href="/" className="flex min-w-0 items-center gap-3 pr-2">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-[1rem] bg-[linear-gradient(135deg,var(--primary),var(--brand-secondary))] text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground shadow-[0_8px_20px_rgba(22,126,102,0.18)]">
              RS
            </span>
            <span className="flex min-w-0 flex-col leading-none">
              <span className="truncate text-sm font-semibold tracking-tight text-foreground">
                {site.name}
              </span>
              <span className="truncate text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Consultant cybersécurité
              </span>
            </span>
            <span className="sr-only">Home</span>
          </Link>

          <nav className="hidden items-center justify-center md:flex">
            <div className="flex items-center gap-1.5">
              {site.primaryNav.map((item) =>
                item.href === "/services" ? (
                  <NavigationMenu key={item.href} viewport={false} className="flex-none">
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger
                          className={cn(
                            navLinkClass(servicesActive),
                            "gap-1 bg-transparent px-4",
                            servicesActive
                              ? "bg-foreground text-background hover:text-background"
                              : "data-[state=open]:bg-accent/70 data-[state=open]:text-foreground"
                          )}
                        >
                          {item.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent
                          unstyled
                          className="z-[60] min-w-[380px] max-w-[min(92vw,420px)] px-0 py-0 md:absolute md:top-full md:mt-3 md:w-auto"
                        >
                          <Card className="w-full rounded-[1.6rem] border-border/70 bg-background/98 shadow-[0_20px_44px_rgba(10,28,24,0.12)]">
                            <CardHeader className="gap-3 pb-4">
                              <Badge variant="outline" className="w-fit">
                                Services
                              </Badge>
                              <div className="flex flex-col gap-1.5">
                                <CardTitle className="text-lg">
                                  Choisir le bon format d&apos;intervention
                                </CardTitle>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                  Pentest, audit et formation pensés pour des besoins précis, avec
                                  un cadrage lisible dès le départ.
                                </p>
                              </div>
                            </CardHeader>

                            <CardContent className="grid gap-2">
                              {site.serviceNavigation.map((service) => {
                                const Icon = getServiceIcon(service.icon);
                                const active = pathname === service.href;

                                return (
                                  <NavigationMenuLink key={service.href} asChild>
                                    <Link href={service.href} className={serviceItemClass(active)}>
                                      <span className="flex size-10 shrink-0 items-center justify-center rounded-[0.95rem] bg-accent text-foreground">
                                        <Icon className="size-4" />
                                      </span>
                                      <span className="flex min-w-0 flex-1 flex-col gap-1">
                                        <span className="text-sm font-semibold leading-none text-foreground">
                                          {service.label}
                                        </span>
                                        <span className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                                          {service.description}
                                        </span>
                                      </span>
                                      <ChevronRight className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                                    </Link>
                                  </NavigationMenuLink>
                                );
                              })}
                            </CardContent>

                            <CardFooter className="justify-between border-t border-border/70 pt-5">
                              <p className="text-sm text-muted-foreground">
                                Voir les trois formats détaillés et comparer les usages.
                              </p>
                              <Link
                                href="/services"
                                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                              >
                                Vue d&apos;ensemble
                                <ArrowUpRight data-icon="inline-end" />
                              </Link>
                            </CardFooter>
                          </Card>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={navLinkClass(
                      item.href === "/" ? pathname === "/" : item.href === "/blog" && blogActive
                    )}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center gap-2 md:flex">
              <Link
                href={site.navPrimaryCta.href}
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "border-0 bg-[linear-gradient(135deg,var(--primary),var(--brand-secondary))] text-primary-foreground shadow-[0_14px_30px_rgba(22,126,102,0.18)]",
                  contactActive && "ring-2 ring-primary/20 ring-offset-2 ring-offset-background"
                )}
                aria-current={contactActive ? "page" : undefined}
              >
                {site.navPrimaryCta.label}
                <ArrowUpRight data-icon="inline-end" />
              </Link>
              <ModeToggle />
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <ModeToggle />

              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-10 rounded-full border-border/70 bg-background/90 shadow-none hover:bg-accent/70"
                    aria-label="Ouvrir le menu"
                  >
                    <Menu />
                  </Button>
                </SheetTrigger>

                <SheetContent
                  side="top"
                  showCloseButton={false}
                  className="h-dvh border-none bg-background/96 px-0 py-0 backdrop-blur-2xl md:hidden"
                >
                  <SheetHeader className="sr-only">
                    <SheetTitle>Navigation principale</SheetTitle>
                    <SheetDescription>
                      Accès rapide aux pages principales et aux services.
                    </SheetDescription>
                  </SheetHeader>

                  <div className="flex h-full flex-col px-4 pb-6 pt-4 sm:px-6">
                    <div className="flex items-center justify-between gap-3">
                      <SheetClose asChild>
                        <Link href="/" className="flex min-w-0 items-center gap-3">
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-[1rem] bg-[linear-gradient(135deg,var(--primary),var(--brand-secondary))] text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground">
                            RS
                          </span>
                          <span className="flex min-w-0 flex-col leading-none">
                            <span className="truncate text-sm font-semibold tracking-tight text-foreground">
                              {site.name}
                            </span>
                            <span className="truncate text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                              Consultant cybersécurité
                            </span>
                          </span>
                        </Link>
                      </SheetClose>

                      <div className="flex items-center gap-2">
                        <ModeToggle />
                        <SheetClose asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-10 rounded-full border-border/70 bg-background/90 shadow-none hover:bg-accent/70"
                            aria-label="Fermer le menu"
                          >
                            <X />
                          </Button>
                        </SheetClose>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-1 flex-col gap-8 overflow-y-auto pb-2">
                      <section className="flex flex-col gap-3">
                        <Badge variant="outline" className="w-fit">
                          Navigation
                        </Badge>
                        <div className="flex flex-col gap-3">
                          {site.primaryNav
                            .filter((item) => item.href !== "/services")
                            .map((item) => {
                              const active =
                                item.href === "/"
                                  ? pathname === "/"
                                  : item.href === "/blog" && blogActive;

                              return (
                                <SheetClose asChild key={item.href}>
                                  <Link
                                    href={item.href}
                                    className={cn(
                                      "flex items-center justify-between rounded-[1.5rem] border border-border/70 bg-card/95 px-5 py-4 text-base font-medium shadow-[0_12px_30px_rgba(10,28,24,0.08)] transition-colors",
                                      active
                                        ? "border-primary/25 bg-accent/60 text-foreground"
                                        : "text-foreground hover:bg-accent/50"
                                    )}
                                  >
                                    <span>{item.label}</span>
                                    <ChevronRight className="size-4 text-muted-foreground" />
                                  </Link>
                                </SheetClose>
                              );
                            })}
                        </div>
                      </section>

                      <section className="flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-3">
                          <Badge variant="outline" className="w-fit">
                            Services
                          </Badge>
                          <SheetClose asChild>
                            <Link
                              href="/services"
                              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                            >
                              Vue d&apos;ensemble
                              <ArrowUpRight data-icon="inline-end" />
                            </Link>
                          </SheetClose>
                        </div>

                        <div className="flex flex-col gap-3">
                          {site.serviceNavigation.map((service) => {
                            const Icon = getServiceIcon(service.icon);
                            const active = pathname === service.href;

                            return (
                              <SheetClose asChild key={service.href}>
                                <Link href={service.href} className={serviceItemClass(active)}>
                                  <span className="flex size-11 shrink-0 items-center justify-center rounded-[1rem] bg-accent text-foreground">
                                    <Icon className="size-5" />
                                  </span>
                                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                                    <span className="text-sm font-semibold text-foreground">
                                      {service.label}
                                    </span>
                                    <span className="text-sm leading-relaxed text-muted-foreground">
                                      {service.description}
                                    </span>
                                  </span>
                                  <ChevronRight className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                                </Link>
                              </SheetClose>
                            );
                          })}
                        </div>
                      </section>

                      <div className="mt-auto flex flex-col gap-3">
                        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                          Décrivez le contexte, le périmètre et l&apos;échéance. Je reviens avec
                          un cadrage utile, sans proposition floue.
                        </p>
                        <SheetClose asChild>
                          <Link
                            href={site.navPrimaryCta.href}
                            className={cn(
                              buttonVariants({ size: "lg" }),
                              "w-full border-0 bg-[linear-gradient(135deg,var(--primary),var(--brand-secondary))] text-primary-foreground shadow-[0_14px_30px_rgba(22,126,102,0.18)]"
                            )}
                          >
                            {site.navPrimaryCta.label}
                            <ArrowUpRight data-icon="inline-end" />
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
      </div>
    </header>
  );
}
