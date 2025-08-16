import { site } from "@/content/site";

export function AboutSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="glass p-6 rounded-2xl">
          <h2 className="text-xl font-semibold tracking-tight">À propos</h2>
          <p className="mt-3 text-muted-foreground">{site.about.bio}</p>
          <h3 className="mt-6 text-sm font-medium text-muted-foreground">{site.sections.educationTitle}</h3>
          <ul className="mt-2 grid gap-1 text-sm">
            {site.about.education.map((e) => (
              <li key={e} className="chip">{e}</li>
            ))}
          </ul>
        </div>
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-sm font-medium text-muted-foreground">{site.sections.experienceTitle}</h3>
          <ul className="mt-2 grid gap-1 text-sm">
            {site.about.experience.map((x) => (
              <li key={x} className="chip">{x}</li>
            ))}
          </ul>
          <h3 className="mt-6 text-sm font-medium text-muted-foreground">{site.sections.communityTitle}</h3>
          <ul className="mt-2 grid gap-1 text-sm">
            {site.about.community.map((c) => (
              <li key={c} className="chip">{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}


