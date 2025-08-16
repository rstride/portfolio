import { site } from "@/content/site";
import { ContactForm } from "@/components/contact-form";

export const metadata = { title: site.sections.contactTitle };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold tracking-tight">{site.sections.contactTitle}</h1>
      <p className="mt-2 text-muted-foreground max-w-2xl">
        Je préfère échanger de vive voix ? {""}
        <a href={site.about.scheduleHref} className="underline underline-offset-4 decoration-border hover:decoration-foreground">Réserver un call</a>
        {" ou par email : "}
        <a href={`mailto:${site.about.email}`} className="underline underline-offset-4 decoration-border hover:decoration-foreground">{site.about.email}</a>
      </p>
      <div className="mt-8 max-w-xl rounded-2xl border border-border/50 bg-background/40 p-6">
        <ContactForm />
      </div>
    </div>
  );
}


