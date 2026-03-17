"use client";

import Image from "next/image";

import { Globe } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { site } from "@/content/site";

import { getSocialDescription, iconMap } from "@/features/contact/model";

export function ContactSidebar() {
  return (
    <div className="flex flex-col gap-6 lg:self-start">
      <Card className="surface-contrast overflow-hidden">
        <CardHeader>
          <Badge variant="secondary" className="w-fit border-0 bg-white/10 text-white">
            Avant l&apos;échange
          </Badge>
          <CardTitle className="text-lg text-white">Les informations utiles</CardTitle>
          <CardDescription className="text-white/72">
            Le plus important est le contexte, le périmètre et la contrainte principale.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {site.sales.contactReasons.map((reason) => (
            <div
              key={reason}
              className="rounded-[1.2rem] border border-white/12 bg-white/7 p-4 text-sm leading-relaxed text-white/78"
            >
              {reason}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="surface-panel overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg">Présence en ligne</CardTitle>
          <CardDescription>
            Pour vérifier le parcours, les projets et l’écosystème autour de PrismaSec.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {site.socials.map((link) => {
            const key = link.label.toLowerCase();
            const IconComponent = iconMap[key] || Globe;

            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="surface-subtle flex items-center gap-3 p-3 transition-colors hover:bg-accent/40"
              >
                <div className="flex size-10 items-center justify-center rounded-[1rem] bg-[linear-gradient(135deg,var(--primary),var(--brand-secondary))] text-primary-foreground">
                  {key === "prismasec" ? (
                    <Image
                      src="/PrismaLogo.svg"
                      alt="PrismaSec Logo"
                      width={20}
                      height={20}
                      className="size-5 invert"
                    />
                  ) : (
                    <IconComponent className="size-4" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-foreground">{link.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {getSocialDescription(link.label)}
                  </div>
                </div>
              </a>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
