import type { TrustSignal } from "@/content/site";
import { cn } from "@/shared/lib/utils";

type TrustStripProps = {
  items: readonly TrustSignal[];
  className?: string;
};

export function TrustStrip({ items, className }: TrustStripProps) {
  return (
    <section className={cn("grid gap-4 md:grid-cols-3", className)}>
      {items.map((item) => (
        <div key={`${item.value}-${item.label}`} className="metric-card">
          <div className="text-sm font-semibold text-primary">{item.value}</div>
          <p className="mt-2 text-base font-semibold text-foreground">{item.label}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
        </div>
      ))}
    </section>
  );
}
