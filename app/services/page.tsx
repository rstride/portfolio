import { site } from "@/content/site";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = { title: site.sections.servicesTitle };

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold tracking-tight">{site.sections.servicesTitle}</h1>
      <p className="mt-2 text-muted-foreground max-w-2xl">{site.sections.servicesIntro}</p>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {site.services.map((s) => (
          <Card key={s.slug} className="glass">
            <CardHeader>
              <CardTitle>{s.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{s.description}</p>
              <h4 className="mt-4 text-xs font-medium text-muted-foreground">Livrables</h4>
              <ul className="mt-2 text-sm grid gap-1 list-disc pl-5">
                {s.deliverables.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              <h4 className="mt-4 text-xs font-medium text-muted-foreground">Bénéfices</h4>
              <ul className="mt-2 text-sm grid gap-1 list-disc pl-5">
                {s.benefits.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <div className="mt-6">
                <Link href={`/contact`}><Button>Discuter de ce service</Button></Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

