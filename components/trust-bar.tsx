"use client";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Award, Bug } from "lucide-react";

export function TrustBar() {
  const items = [
    { icon: ShieldCheck, label: "Divulgation responsable" },
    { icon: Award, label: "Halls of Fame" },
    { icon: Bug, label: "CVEs publiés" },
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(({ icon: Icon, label }) => (
        <Badge key={label} className="bg-primary/10 text-primary border-primary/30">
          <Icon className="h-3.5 w-3.5 mr-1.5" /> {label}
        </Badge>
      ))}
    </div>
  );
}

