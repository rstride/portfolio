import Image from "next/image";
import Link from "next/link";
import { SquareArrowOutUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { site } from "@/content/site";

const ghostContrastClass =
  "inline-flex h-9 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 text-sm font-medium text-white transition hover:bg-white/12";

export function PostAuthorCard() {
  const linkedIn = site.socials.find((social) => social.label === "LinkedIn");

  return (
    <div className="relative z-10 mt-14">
      <Card className="surface-contrast overflow-hidden">
        <CardHeader>
          <Badge variant="secondary" className="mb-3 w-fit border-white/12 bg-white/8 text-white">
            Auteur
          </Badge>
          <div className="flex items-start gap-4">
            <div className="relative size-16 overflow-hidden border border-white/12">
              <Image src="/romain.png" alt={site.name} fill className="object-cover" sizes="64px" />
            </div>
            <div>
              <CardTitle className="text-2xl uppercase text-white">{site.name}</CardTitle>
              <CardDescription className="mt-1 text-white/70">{site.role}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm leading-relaxed text-white/76">{site.about.bio}</p>
          <div className="flex flex-wrap gap-2">
            {site.proofs.slice(0, 3).map((proof) => (
              <Badge key={proof.title} variant="secondary" className="border-white/12 bg-white/8 text-white">
                {proof.kpi}
              </Badge>
            ))}
          </div>
          {linkedIn ? (
            <div className="flex flex-wrap gap-3">
              <Link href={linkedIn.href} target="_blank" rel="noreferrer" className={ghostContrastClass}>
                LinkedIn
                <SquareArrowOutUpRight className="size-4" />
              </Link>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
