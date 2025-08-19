import Link from "next/link";
import type { Service } from "@/content/site";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link href={`/services#${service.slug}`} className="group block card p-6 hover:border-primary/60 transition">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold tracking-tight">{service.title}</h3>
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-mono">/{service.slug}</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
      <div className="mt-6"><span className="btn-outline px-3 py-1.5">En savoir plus →</span></div>
    </Link>
  );
}

