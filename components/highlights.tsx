import { site } from "@/content/site";

export function Highlights() {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold tracking-tight">{site.sections.highlightsTitle}</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {site.proofs.map((p) => (
          <div key={p.title} className="card p-4 h-full">
            <div className="text-2xl font-bold font-mono">{p.kpi}</div>
            <p className="mt-2 text-sm text-muted-foreground min-h-10">{p.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

