"use client";
import { Shield, Bug, Cpu } from "lucide-react";
import { TiltCard } from "./tilt-card";

export function FeatureCards() {
  const items = [
    { icon: Shield, title: "Pentests", text: "Tests d’intrusion axés impact avec preuves d’impact et priorisation." },
    { icon: Bug, title: "Bug bounty", text: "Recherche de failles sur programmes autorisés et divulgation responsable." },
    { icon: Cpu, title: "Automations", text: "Outils internes pour accélérer tests et analyses." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid gap-6 md:grid-cols-3">
        {items.map(({ icon: Icon, title, text }) => (
          <TiltCard key={title}>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-semibold tracking-tight">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </div>
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
