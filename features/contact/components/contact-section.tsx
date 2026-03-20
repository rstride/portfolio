"use client";

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { site } from "@/content/site";
import { ContactForm } from "@/features/contact/components/contact-form";
import { ContactSidebar } from "@/features/contact/components/contact-sidebar";
import { useContactForm } from "@/features/contact/hooks/use-contact-form";
import { PageHeader } from "@/shared/components/page-header";

export function ContactSection() {
  const form = useContactForm();

  return (
    <div className="page-shell flex flex-col gap-8">
      <PageHeader
        eyebrow="Contact"
        title={site.sections.contactTitle}
        description={site.sections.contactIntro}
        meta={["Contexte", "Périmètre", "Échéance"]}
        actions={
          <>
            <Link href="/services" className={buttonVariants({ variant: "outline", size: "lg" })}>
              {site.pageCtas.contact.primary.label}
            </Link>
            <Link href="/blog" className={buttonVariants({ variant: "ghost", size: "lg" })}>
              {site.pageCtas.contact.secondary?.label}
            </Link>
          </>
        }
        aside={
          <div className="surface-panel p-6 sm:p-7">
            <span className="status-chip w-fit">{site.pageCtas.contact.eyebrow}</span>
            <h2 className="font-headline mt-5 text-3xl font-bold uppercase leading-[0.96] tracking-[-0.04em] text-foreground">
              {site.pageCtas.contact.title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {site.pageCtas.contact.description}
            </p>
          </div>
        }
      />

      <section className="section-signal px-5 py-5 sm:px-6">
        <div className="relative z-10 grid gap-3 sm:grid-cols-3">
          {site.sales.qualification.map((item) => (
            <div key={item} className="surface-subtle px-4 py-4 text-sm text-muted-foreground">
              {item}
            </div>
          ))}
        </div>
      </section>

      <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <ContactForm form={form} />
        <ContactSidebar />
      </div>
    </div>
  );
}
