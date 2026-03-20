import type { EngagementStep } from "@/content/site";

type EngagementStepsProps = {
  eyebrow?: string;
  title: string;
  description: string;
  steps: readonly EngagementStep[];
};

export function EngagementSteps({
  eyebrow,
  title,
  description,
  steps,
}: EngagementStepsProps) {
  return (
    <section className="section-signal px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
      <div className="relative z-10 flex flex-col gap-8">
        <div className="max-w-3xl">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h2 className="font-headline mt-3 text-4xl font-bold uppercase leading-[0.96] tracking-[-0.05em] text-foreground sm:text-5xl">
            {title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="process-card">
              <div className="font-label text-[11px] uppercase tracking-[0.2em] text-primary">
                Step_{index + 1}
              </div>
              <p className="font-headline mt-4 text-2xl font-bold uppercase tracking-[-0.03em] text-foreground">
                {step.title}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
