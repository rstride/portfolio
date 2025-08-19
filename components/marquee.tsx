"use client";
export function Marquee({ items }: { items: React.ReactNode[] }) {
  return (
    <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
      <div className="flex gap-8 animate-[marquee_20s_linear_infinite] will-change-transform pr-8">
        {items.concat(items).map((child, i) => (
          <div key={i} className="opacity-70 hover:opacity-100 transition">{child}</div>
        ))}
      </div>
      <style jsx global>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
}

