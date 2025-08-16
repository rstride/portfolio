import Link from "next/link";
import type { Service } from "@/content/site";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="group rounded-2xl glass p-6 hover:border-primary/50 transition">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold tracking-tight">{service.title}</h3>
        <span className="text-xs text-muted-foreground">{service.slug}</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
      <div className="mt-4">
        <h4 className="text-xs font-medium text-muted-foreground">Livrables</h4>
        <ul className="mt-2 text-sm grid gap-1">
          {service.deliverables.map((d) => (
            <li key={d} className="chip">{d}</li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <h4 className="text-xs font-medium text-muted-foreground">Bénéfices</h4>
        <ul className="mt-2 text-sm grid gap-1">
          {service.benefits.map((b) => (
            <li key={b} className="chip">{b}</li>
          ))}
        </ul>
      </div>
      <div className="mt-6">
        <Link href={`/services/${service.slug}`} className="inline-flex items-center rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition">
          En savoir plus →
        </Link>
      </div>
    </div>
  );
}


