import Link from "next/link";
import type { Service } from "@/content/site";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="group rounded-2xl border border-border/50 bg-background/40 backdrop-blur p-6 hover:border-foreground/40 transition">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold tracking-tight">{service.title}</h3>
        <span className="text-xs text-muted-foreground">{service.slug}</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
      <div className="mt-4">
        <h4 className="text-xs font-medium text-muted-foreground">Livrables</h4>
        <ul className="mt-2 text-sm grid gap-1 list-disc pl-5">
          {service.deliverables.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <h4 className="text-xs font-medium text-muted-foreground">Bénéfices</h4>
        <ul className="mt-2 text-sm grid gap-1 list-disc pl-5">
          {service.benefits.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>
      <div className="mt-6">
        <Link href={`/services/${service.slug}`} className="text-sm text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground">En savoir plus →</Link>
      </div>
    </div>
  );
}


