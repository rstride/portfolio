import type { TrustSignal } from "@/content/site";
import { cn } from "@/shared/lib/utils";

type TrustStripProps = {
  items: readonly TrustSignal[];
  className?: string;
};

export function TrustStrip({ items, className }: TrustStripProps) {
  return (
    <section className={cn("grid gap-4 md:grid-cols-3", className)}>
      {items.map((item, index) => (
        <div
          key={`${item.value}-${item.label}`}
          className={cn("metric-card", index % 2 === 1 && "lg:translate-y-8")}
        >
          <div className="font-label text-xs uppercase tracking-[0.18em] text-primary">
            {item.value}
          </div>
          <p className="font-headline mt-5 text-2xl font-bold uppercase leading-tight tracking-[-0.03em] text-foreground">
            {item.label}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
        </div>
      ))}
    </section>
  );
}
