import { site } from "@/content/site";

export const metadata = { title: "Audit de sécurité" };

export default function AuditSecuritePage() {
  const data = site.servicePages["audit-securite"];
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Audit de sécurité</h1>
      <p className="mt-4 text-muted-foreground">{data.intro}</p>
      <h2 className="mt-8 text-lg font-semibold">Pour qui ?</h2>
      <ul className="mt-3 grid gap-2 list-disc pl-5 text-sm">
        {data.audience.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
      <h2 className="mt-8 text-lg font-semibold">Comment je procède</h2>
      <ol className="mt-3 grid gap-2 list-decimal pl-5 text-sm">
        {data.process.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ol>
    </div>
  );
}


